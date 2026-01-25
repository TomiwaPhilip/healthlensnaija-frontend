import React from "react";

export default function TopQuestions({ questions }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Top 10 Most Asked Questions</h2>
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Question</th>
            <th className="px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{q.question}</td>
              <td className="px-4 py-2 text-center">{q.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
