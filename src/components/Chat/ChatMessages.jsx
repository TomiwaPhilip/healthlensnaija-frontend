// components/Chat/ChatMessages.jsx
import React from 'react';
import { FiCopy, FiEdit, FiMoreVertical } from 'react-icons/fi';
import DOMPurify from 'dompurify';

const ChatMessages = ({ 
  messages = [], 
  isNightMode, 
  loading,
  onCopyMessage,
  onEditMessage,
  onCopyAndEdit 
}) => {
  
  const formatAIResponse = (text) => {
    if (!text) return '';
    
    const formattedText = text
      .replace(/\*\*Overview\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Overview</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Key Data Points\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Key Data Points</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Policy Recommendations\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Policy Recommendations</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Challenges & Solutions\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Challenges & Solutions</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Challenge\*\*/g, "</li><li class='font-semibold'>Challenge:</li><li>")
      .replace(/\*\*Solution\*\*/g, "</li><li class='font-semibold'>Solution:</li><li>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/- /g, "<li>")
      .replace(/\n/g, "<br/>");
    
    return DOMPurify.sanitize(`<ul class='list-disc ml-6 space-y-2'>${formattedText}</ul>`);
  };

  const MessageDropdown = ({ message, onCopy, onEdit, onCopyAndEdit }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            isNightMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiMoreVertical className="h-4 w-4" />
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${
              isNightMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  onCopy(message);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 ${
                  isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              >
                <FiCopy className="h-4 w-4 mr-2" />
                Copy Message
              </button>

              <button
                onClick={() => {
                  onCopyAndEdit(message);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 ${
                  isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              >
                <FiEdit className="h-4 w-4 mr-2" />
                Copy & Edit
              </button>

              {message.user === "You" && (
                <button
                  onClick={() => {
                    onEdit(message);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-4 py-2 ${
                    isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                >
                  <FiEdit className="h-4 w-4 mr-2" />
                  Edit & Resend
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className={`p-4 rounded-full mb-4 ${
          isNightMode ? "bg-gray-800 text-green-400" : "bg-gray-100 text-green-500"
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {isNightMode ? "Start a conversation" : "Welcome to AI Chat"}
        </h2>
        <p className={`max-w-md ${isNightMode ? "text-gray-400" : "text-gray-500"}`}>
          Ask questions, discuss health policies, or get insights. The AI assistant is ready to help.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`group relative ${
            msg.user === "You" ? "flex justify-end" : "flex justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] lg:max-w-[75%] rounded-xl relative ${
              msg.user === "You"
                ? isNightMode
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white"
                : isNightMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <strong className="text-sm font-medium">
                  {msg.user === "You" ? "You" : "Healthlens Naija Assist"}
                </strong>
                
                <MessageDropdown 
                  message={msg}
                  onCopy={(message) => {
                    const cleanText = message.text.replace(/<[^>]+>/g, '');
                    navigator.clipboard.writeText(cleanText);
                    onCopyMessage?.("Copied to clipboard!");
                  }}
                  onEdit={(message) => {
                    const cleanText = message.text.replace(/<[^>]+>/g, '');
                    onEdit?.(cleanText);
                  }}
                  onCopyAndEdit={(message) => {
                    const cleanText = message.text.replace(/<[^>]+>/g, '');
                    onCopyAndEdit?.(cleanText);
                  }}
                />
              </div>
              <div
                className={`prose max-w-none ${
                  isNightMode ? "prose-invert" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }}
              />
            </div>
          </div>
        </div>
      ))}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-start">
          <div className={`max-w-[85%] lg:max-w-[75%] rounded-xl relative ${
            isNightMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <strong className="text-sm font-medium">Healthlens Naija Assistant</strong>
              </div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isNightMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 rounded-full ${
                    isNightMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 rounded-full ${
                    isNightMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Thinking...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;