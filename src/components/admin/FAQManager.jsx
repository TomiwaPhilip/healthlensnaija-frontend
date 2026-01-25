import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const loadFaqs = async () => {
    const res = await axios.get("/support/faq/admin");
    setFaqs(res.data);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const addFaq = async () => {
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
        <button onClick={addFaq} className="bg-[#30B349] text-white px-4 py-2 rounded">
          Add FAQ
        </button>
      </div>

      <ul className="space-y-2">
        {faqs.map((f) => (
          <li key={f._id} className="border p-2 rounded flex justify-between">
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
      </ul>
    </div>
  );
}
