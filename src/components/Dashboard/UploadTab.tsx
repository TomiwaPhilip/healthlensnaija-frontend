// src/components/dashboard/UploadTab.jsx
import React from "react";
import UploadData from "../../pages/Dashboard/UploadData";

const UploadTab = () => {
  // ⬇️ Reuse the UploadData component directly
  // We only override layout padding to fit into tabbed layout cleanly
  return (
    <div className="p-2 md:p-4 overflow-y-auto h-[calc(100vh-200px)]">
      <UploadData embedded />
    </div>
  );
};

export default UploadTab;
