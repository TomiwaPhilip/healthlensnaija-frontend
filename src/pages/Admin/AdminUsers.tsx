import { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ShieldCheck,
  ShieldBan,
  ShieldOff,
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ROLES = ["Admin", "Verified", "Guest", "Editor", "Analyst", "Moderator"];
const PAGE_SIZE = 10;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  suspended: boolean;
  banned: boolean;
  createdAt: string;
  lastLogin?: string;
}

function roleBadgeVariant(role: string) {
  switch (role) {
    case "Admin":
      return "default";
    case "Verified":
      return "secondary";
    case "Guest":
      return "outline";
    default:
      return "secondary";
  }
}

function UsersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-32" />
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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Dialog state
  const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: User | null; newRole: string }>({
    open: false,
    user: null,
    newRole: "",
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
    action: "suspend" | "unsuspend" | "ban" | "unban" | "delete";
  }>({ open: false, user: null, action: "suspend" });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin-dashboard/users");
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter + paginate
  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Actions
  const handleRoleChange = async () => {
    if (!roleDialog.user || !roleDialog.newRole) return;
    setActionLoading(true);
    try {
      const res = await axios.patch(
        `/admin-dashboard/users/${roleDialog.user._id}/role`,
        { role: roleDialog.newRole }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === roleDialog.user!._id ? { ...u, ...res.data } : u))
      );
      setRoleDialog({ open: false, user: null, newRole: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.user) return;
    setActionLoading(true);
    const { user, action } = confirmDialog;

    try {
      if (action === "delete") {
        await axios.delete(`/admin-dashboard/users/${user._id}`);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      } else if (action === "suspend" || action === "unsuspend") {
        const res = await axios.patch(`/admin-dashboard/users/${user._id}/suspend`, {
          suspended: action === "suspend",
        });
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...res.data } : u)));
      } else if (action === "ban" || action === "unban") {
        const res = await axios.patch(`/admin-dashboard/users/${user._id}/ban`, {
          banned: action === "ban",
        });
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...res.data } : u)));
      }
      setConfirmDialog({ open: false, user: null, action: "suspend" });
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabel: Record<string, string> = {
    suspend: "Suspend",
    unsuspend: "Unsuspend",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
  };

  if (loading) return <UsersSkeleton />;

  if (error && users.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden truncate max-w-[150px]">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate max-w-[200px] block">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-1.5">
                          {user.suspended && (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700">
                              Suspended
                            </Badge>
                          )}
                          {user.banned && (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                          {!user.suspended && !user.banned && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                              Active
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                setRoleDialog({ open: true, user, newRole: user.role })
                              }
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.suspended ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({ open: true, user, action: "unsuspend" })
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Unsuspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({ open: true, user, action: "suspend" })
                                }
                              >
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {user.banned ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({ open: true, user, action: "unban" })
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Unban
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({ open: true, user, action: "ban" })
                                }
                              >
                                <ShieldBan className="h-4 w-4 mr-2" />
                                Ban
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setConfirmDialog({ open: true, user, action: "delete" })
                              }
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialog.open}
        onOpenChange={(open) => {
          if (!open) setRoleDialog({ open: false, user: null, newRole: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for{" "}
              <span className="font-medium">
                {roleDialog.user?.firstName} {roleDialog.user?.lastName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Select
            value={roleDialog.newRole}
            onValueChange={(v) => setRoleDialog((prev) => ({ ...prev, newRole: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleRoleChange} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({ open: false, user: null, action: "suspend" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionLabel[confirmDialog.action]} User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action}{" "}
              <span className="font-medium">
                {confirmDialog.user?.firstName} {confirmDialog.user?.lastName}
              </span>
              ?
              {confirmDialog.action === "delete" &&
                " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={confirmDialog.action === "delete" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : actionLabel[confirmDialog.action]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
