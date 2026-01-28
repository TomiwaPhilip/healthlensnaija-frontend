// src/components/Dashboard/Uploads.jsx
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const Uploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
         const response = await fetch(`${API_URL}/upload/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUploads(data.documents);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch uploads");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleView = async (record) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/upload/documents/${record._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Failed to load story details");
  
      const data = await response.json();
      const storyText = data.story?.content || record.content_summary || "";
      setSelectedUpload({
        ...record,
        story: storyText.length > 600 ? storyText : record.story || storyText,
        quickInsights: data.story?.quickInsights || record.quickInsights || "",
      });

      console.log("Fetched story length:", data.story?.content?.length || data.story?.length);
      
      setIsModalVisible(true);
    } catch (err) {
      message.error(err.message);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
        await fetch(`${API_URL}/upload/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Document deleted successfully");
      fetchUploads();
    } catch (error) {
      message.error("Failed to delete document");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Uploads</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
          <UploadOutlined className="mr-2" />
          Upload New Document
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pillar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploads.map((upload) => (
                <tr key={upload._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.pillar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(upload.metadata.upload_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(upload)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      >
                        <EyeOutlined />
                      </button>
                      <button
                        onClick={() => handleDelete(upload._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-4/5 max-w-4xl max-h-[85vh] overflow-y-auto shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-green-700">{selectedUpload?.title}</h3>
          <button
            onClick={() => setIsModalVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Primary Pillar:</h4>
          <p className="text-gray-600">{selectedUpload?.pillar || "—"}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedUpload?.keywords?.map((k, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-green-700 mb-3">Generated Story</h4>
          <div
            className="prose prose-green max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedUpload?.story }}
          />
        </div>

        {selectedUpload?.quickInsights && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-green-700 mb-3">Key Insights</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {selectedUpload.quickInsights.split("\n").map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Uploads;