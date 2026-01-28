import React from "react";

export default function StatsGrid({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Users", value: stats.activeUsers },
    { label: "Total Stories", value: stats.totalStories },
    { label: "Avg Engagement", value: stats.avgEngagement },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">{card.label}</p>
          <p className="text-xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
