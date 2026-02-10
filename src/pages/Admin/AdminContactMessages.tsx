import { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Search,
  MoreHorizontal,
  Mail,
  MailOpen,
  Trash2,
  Reply,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MailCheck,
  Clock,
} from "lucide-react";

const PAGE_SIZE = 10;

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  replies: Array<{ adminName: string; text: string; createdAt: string }>;
  createdAt: string;
}

function ContactSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-1 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // View/reply dialog
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Confirm delete
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; msg: ContactMessage | null }>({
    open: false,
    msg: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/contact");
      setMessages(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark as read when viewing
  const openMessage = async (msg: ContactMessage) => {
    setViewMsg(msg);
    setReplyText("");
    if (!msg.read) {
      try {
        await axios.patch(`/contact/${msg._id}/read`);
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m)));
      } catch {}
    }
  };

  const handleReply = async () => {
    if (!viewMsg || !replyText.trim()) return;
    setReplyLoading(true);
    try {
      await axios.post(`/contact/${viewMsg._id}/reply`, { text: replyText.trim() });
      setMessages((prev) =>
        prev.map((m) =>
          m._id === viewMsg._id
            ? {
                ...m,
                replied: true,
                read: true,
                replies: [
                  ...m.replies,
                  { adminName: "Admin", text: replyText.trim(), createdAt: new Date().toISOString() },
                ],
              }
            : m
        )
      );
      setReplyText("");
      setViewMsg((prev) =>
        prev
          ? {
              ...prev,
              replied: true,
              read: true,
              replies: [
                ...prev.replies,
                { adminName: "Admin", text: replyText.trim(), createdAt: new Date().toISOString() },
              ],
            }
          : null
      );
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.msg) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/contact/${deleteDialog.msg._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleteDialog.msg!._id));
      if (viewMsg?._id === deleteDialog.msg._id) setViewMsg(null);
      setDeleteDialog({ open: false, msg: null });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete message");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Stats
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.read).length;
  const repliedCount = messages.filter((m) => m.replied).length;

  // Filter + paginate
  const filtered = messages.filter((m) => {
    if (!search) return true;
    return `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(search.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <ContactSkeleton />;

  if (error && messages.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Inbox className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <MailCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{repliedCount}</p>
              <p className="text-xs text-muted-foreground">Replied</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((msg) => (
                    <TableRow
                      key={msg._id}
                      className={`cursor-pointer ${!msg.read ? "bg-primary/5" : ""}`}
                      onClick={() => openMessage(msg)}
                    >
                      <TableCell>
                        {msg.read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`${!msg.read ? "font-semibold" : "font-medium"}`}>
                          {msg.name}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden truncate max-w-[120px]">
                          {msg.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate max-w-[180px] block text-sm">{msg.email}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="truncate max-w-[250px] block text-sm text-muted-foreground">
                          {msg.message}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {msg.replied ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                            Replied
                          </Badge>
                        ) : msg.read ? (
                          <Badge variant="outline">Read</Badge>
                        ) : (
                          <Badge>New</Badge>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openMessage(msg)}>
                              <Reply className="h-4 w-4 mr-2" />
                              View & Reply
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteDialog({ open: true, msg })}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View/Reply Dialog */}
      <Dialog open={!!viewMsg} onOpenChange={(open) => { if (!open) setViewMsg(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message from {viewMsg?.name}</DialogTitle>
            <DialogDescription>{viewMsg?.email}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Original message */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm whitespace-pre-wrap">{viewMsg?.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {viewMsg?.createdAt && new Date(viewMsg.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Previous replies */}
            {viewMsg?.replies && viewMsg.replies.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Replies</p>
                {viewMsg.replies.map((r, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <p className="text-sm whitespace-pre-wrap">{r.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.adminName} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply} disabled={replyLoading || !replyText.trim()}>
                  {replyLoading ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => { if (!open) setDeleteDialog({ open: false, msg: null }); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the message from{" "}
              <span className="font-medium">{deleteDialog.msg?.name}</span>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
