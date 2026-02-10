import { Routes, Route, Navigate } from "react-router-dom";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminContactMessages from "./AdminContactMessages";
import AdminTestimonials from "./AdminTestimonials";

export default function AdminPage() {
  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6">
      <Routes>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contact" element={<AdminContactMessages />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </div>
  );
}
