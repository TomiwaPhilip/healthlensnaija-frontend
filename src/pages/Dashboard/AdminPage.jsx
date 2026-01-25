// src/pages/Dashboard/AdminPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Routes, Route, Navigate } from "react-router-dom"; // ADD THESE IMPORTS
import axios from "../../utils/axiosInstance";
import { makeSocket } from "../../utils/socket";
import SupportChatDetail from "../../components/admin/SupportChatDetail";
import notifySound from "../../assets/notify.mp3";
import { toast } from "react-toastify";

// Components (existing)
import StatsGrid from "../../components/admin/StatsGrid";
import UsersTable from "../../components/admin/UsersTable";
import StoriesTable from "../../components/admin/StoriesTable";
import AITraining from "../../components/admin/AITraining";
import ChatsList from "../../components/admin/ChatsList";
import ScrapeTools from "../../components/admin/ScrapeTools";
import TopQuestions from "../../components/admin/TopQuestions";
import Analytics from "../../components/admin/Analytics";
import { useTranslation } from "react-i18next";
import ContactAdmin from "../../components/admin/ContactAdmin";
import TestimonialsAdmin from "../../components/admin/TestimonialsAdmin";

// ---------------- FAQ Manager ----------------
function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
 

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/support/faq/admin");
      setFaqs(res.data);
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const addFaq = async () => {
    if (!question.trim() || !answer.trim()) return;
    await axios.post("/support/faq/admin", { question, answer });
    setQuestion("");
    setAnswer("");
    loadFaqs();
  };

  const deleteFaq = async (id) => {
    await axios.delete(`/support/faq/admin/${id}`);
    loadFaqs();
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h2 className="text-lg font-bold mb-3 text-[#30B349]">Manage FAQs</h2>

      <div className="flex flex-col gap-2 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="FAQ Question"
          className="border rounded p-2"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="FAQ Answer"
          className="border rounded p-2"
        />
        <button
          onClick={addFaq}
          className="bg-[#30B349] text-white px-4 py-2 rounded"
        >
          Add FAQ
        </button>
      </div>

      {loading ? (
        <p>Loading FAQs...</p>
      ) : (
        <ul className="space-y-2">
          {faqs.map((f) => (
            <li
              key={f._id}
              className="border p-2 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{f.question}</p>
                <p className="text-sm text-gray-600">{f.answer}</p>
              </div>
              <button
                onClick={() => deleteFaq(f._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
          {faqs.length === 0 && (
            <p className="text-sm text-gray-500">No FAQs added yet.</p>
          )}
        </ul>
      )}
    </div>
  );
}

// ---------------- Support Table ----------------
const SupportChatsTable = ({ items, unreadMap, onSelect }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-3 py-2 sm:px-4 sm:py-3 border-b font-semibold text-[#30B349] text-sm sm:text-base">
        Support Inbox
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2">User</th>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2 hidden xs:table-cell">Subject</th>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2 hidden sm:table-cell">Status</th>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">Priority</th>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2">Last Message</th>
              <th className="text-left px-2 py-1 sm:px-3 sm:py-2">Unread</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const u = c.userId;
              const last = c.messages?.[c.messages.length - 1];
              const unread = unreadMap[c._id] || 0;
              return (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelect(c._id)}
                >
                  <td className="px-2 py-1 sm:px-3 sm:py-2">
                    <div className="font-medium truncate max-w-[80px] sm:max-w-none">
                      {u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "—"}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-[120px]">
                      {u?.email}
                    </div>
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 hidden xs:table-cell truncate max-w-[100px] sm:max-w-none">
                    {c.subject || "General inquiry"}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 hidden sm:table-cell">
                    <span className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs ${
                      c.status === "open" ? "bg-green-100 text-green-700" :
                      c.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      c.status === "resolved" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">
                    <span className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs ${
                      c.priority === "high" ? "bg-red-100 text-red-700" :
                      c.priority === "normal" ? "bg-gray-100 text-gray-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {c.priority || "normal"}
                    </span>
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2">
                    <div className="max-w-[80px] xs:max-w-[120px] sm:max-w-[160px] md:max-w-[240px] truncate text-xs sm:text-sm">
                      {last?.user ? `[${last.user}] ` : ""}{last?.text || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ""}
                    </div>
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2">
                    {unread > 0 ? (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 py-0.5 rounded-full text-xs bg-[#30B349] text-white">
                        {unread}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  No support conversations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ================================
// INDIVIDUAL ADMIN COMPONENTS
// ================================

// Overview Component
const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [topQuestions, setTopQuestions] = useState([]);
  const [analytics, setAnalytics] = useState({
    activeData: null,
    retentionData: null,
    byHour: [],
    byRegion: [],
    userGrowth: [],
    byAction: [],
    retentionTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [
          statsRes,
          topQRes,
          activeRes,
          retentionRes,
          hourRes,
          regionRes,
          growthRes,
          actionRes,
          retentionTrendRes,
        ] = await Promise.all([
          axios.get("/admin-dashboard/stats"),
          axios.get("/admin-dashboard/analytics/top-questions"),
          axios.get("/admin-dashboard/analytics/active"),
          axios.get("/admin-dashboard/analytics/retention"),
          axios.get("/admin-dashboard/analytics/by-hour"),
          axios.get("/admin-dashboard/analytics/by-region"),
          axios.get("/admin-dashboard/analytics/user-growth"),
          axios.get("/admin-dashboard/analytics/by-action"),
          axios.get("/admin-dashboard/analytics/retention-trend"),
        ]);

        setStats(statsRes.data);
        setTopQuestions(topQRes.data);
        setAnalytics({
          activeData: activeRes.data,
          retentionData: retentionRes.data,
          byHour: hourRes.data,
          byRegion: regionRes.data,
          userGrowth: growthRes.data,
          byAction: actionRes.data,
          retentionTrend: retentionTrendRes.data,
        });
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        Admin Overview
      </h1>
      <StatsGrid stats={stats} />
      <TopQuestions questions={topQuestions} />
      <Analytics data={analytics} />
    </div>
  );
};

// Users Component
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/admin-dashboard/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        User Management
      </h1>
      <UsersTable users={users} setUsers={setUsers} />
    </div>
  );
};

// Content Component
const AdminContent = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("/admin-dashboard/stories");
        setStories(res.data);
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        Content Management
      </h1>
      <StoriesTable stories={stories} setStories={setStories} />
    </div>
  );
};

// AI Training Component
const AdminAITraining = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("/admin-dashboard/documents");
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        AI Training
      </h1>
      <AITraining documents={documents} setDocuments={setDocuments} />
    </div>
  );
};

// Chats Component
const AdminChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/admin-dashboard/all");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        Chat Management
      </h1>
      <ChatsList chats={chats} />
    </div>
  );
};

// Support Component
const AdminSupport = () => {
  const [supportChats, setSupportChats] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [selectedSupportId, setSelectedSupportId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSupport = async () => {
    try {
      const res = await axios.get("/support/admin/chats");
      setSupportChats(res.data || []);
    } catch (e) {
      console.error("Failed to load support chats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupport();
  }, []);

  // Socket logic for real-time updates (simplified)
  const socket = useMemo(() => makeSocket(undefined), []);
  useEffect(() => {
    if (!socket) return;

    const handler = ({ chatId, message }) => {
      setSupportChats((prev) => {
        const idx = prev.findIndex((c) => c._id === chatId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx] };
        updated.messages = [...(updated.messages || []), message];
        updated.updatedAt = new Date().toISOString();

        const copy = [...prev];
        copy.splice(idx, 1);
        copy.unshift(updated);
        return copy;
      });

      setUnreadMap((m) => {
        if (selectedSupportId === chatId) {
          return { ...m, [chatId]: 0 };
        }
        return { ...m, [chatId]: (m[chatId] || 0) + 1 };
      });
    };

    socket.on("support:new-message", handler);
    socket.on("support:admin-new-message", handler);

    return () => {
      socket.off("support:new-message", handler);
      socket.off("support:admin-new-message", handler);
      socket.disconnect();
    };
  }, [socket, selectedSupportId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        Support Management
      </h1>
      {selectedSupportId ? (
        <SupportChatDetail chatId={selectedSupportId} onBack={() => setSelectedSupportId(null)} />
      ) : (
        <SupportChatsTable items={supportChats} unreadMap={unreadMap} onSelect={setSelectedSupportId} />
      )}
    </div>
  );
};

// Tools Component
const AdminTools = () => {
  const [scrapedSites, setScrapedSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScrapedSites = async () => {
      try {
        const res = await axios.get("/admin-dashboard/scrape/list");
        setScrapedSites(res.data);
      } catch (err) {
        console.error("Failed to load scraped sites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedSites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#30B349]">
        Admin Tools
      </h1>
      <ScrapeTools scrapedSites={scrapedSites} setScrapedSites={setScrapedSites} />
    </div>
  );
};

// ================================
// MAIN ADMIN PAGE COMPONENT
// ================================
export default function AdminPage() {
  const location = useLocation();
  
  // Socket for contact messages (kept from original)
  const socket = useMemo(() => makeSocket(undefined), []);
  useEffect(() => {
    if (!socket) return;

    socket.on("contact:new-message", (newMsg) => {
      toast.info(`📩 New contact message from ${newMsg.name || "Visitor"}`, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "light",
      });

      const audio = new Audio(notifySound);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    });

    return () => {
      socket.off("contact:new-message");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <Routes>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="ai-training" element={<AdminAITraining />} />
        <Route path="chats" element={<AdminChats />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="faq" element={<FAQManager />} />
        <Route path="contact" element={<ContactAdmin />} />
        <Route path="tools" element={<AdminTools />} />
      </Routes>
    </div>
  );
}