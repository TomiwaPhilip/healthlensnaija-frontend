import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    review: "",
    image: "",
    rating: 5
  });

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/testimonials/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast.error("Failed to load testimonials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_URL}/testimonials/${editing}`
      : `${API_URL}/testimonials`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      toast.success(editing ? "Updated successfully" : "Created successfully");
      setForm({ name: "", role: "", review: "", image: "", rating: 5 });
      setEditing(null);
      fetchTestimonials();
    } catch {
      toast.error("Failed to save testimonial");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error();
      toast.info("Deleted");
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <motion.div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#30B349]">Manage Testimonials</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Role"
            className="border p-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            placeholder="Image URL"
            className="border p-2 rounded"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating"
            className="border p-2 rounded"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Review"
          className="border p-2 rounded w-full mt-3"
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
          required
        />
        <button
          type="submit"
          className="mt-3 bg-[#30B349] text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <FiPlus />
          {editing ? "Update" : "Add"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <motion.div
            key={t._id}
            className="bg-white p-4 rounded shadow border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
                <p className="text-gray-600 mt-2">{t.review}</p>
                <p className="text-yellow-500 text-sm mt-1">
                  ⭐ {t.rating}/5
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm(t);
                    setEditing(t._id);
                  }}
                  className="text-green-600"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialsAdmin;
