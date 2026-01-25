// src/components/admin/TicketsTable.jsx
import React from "react";

export default function TicketsTable({ tickets, setTickets }) {
  if (!tickets.length) return <p className="p-4">No tickets yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="hover:bg-gray-50">
              <td className="p-2 border">{t._id}</td>
              <td className="p-2 border">{t.userId?.email || t.email}</td>
              <td className="p-2 border">{t.subject}</td>
              <td className="p-2 border">{t.status || "open"}</td>
              <td className="p-2 border">{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
