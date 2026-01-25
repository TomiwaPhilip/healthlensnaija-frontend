// src/components/common/StorySettingsForm.jsx
import React from "react";

export const toneMap = {
  neutral: "Neutral",
  formal: "Formal",
  casual: "Casual",
  inspirational: "Inspirational",
  storytelling: "Storytelling",
};

export const toneMapReverse = Object.fromEntries(
  Object.entries(toneMap).map(([k, v]) => [v, k])
);

const StorySettingsForm = ({ language, tone, setLanguage, setTone }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Language Dropdown */}
      <div>
        <label className="block font-bold mb-2">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="English">English</option>
          <option value="Hausa">Hausa</option>
          <option value="Yoruba">Yoruba</option>
          <option value="Igbo">Igbo</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>

      {/* Tone Dropdown */}
      <div>
        <label className="block font-bold mb-2">Tone:</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          {Object.values(toneMap).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StorySettingsForm;
