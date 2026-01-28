// src/components/Dashboard/AIChatTab.jsx
import React from "react";
import AIChat from "../../pages/Dashboard/AIChat";

const AIChatTab = ({ 
  activeChatId, 
  input, 
  setInput, 
  onSendMessage, 
  onBackToStories 
}) => {
  return (
    <div className="animate-fadeIn">
      <AIChat 
        activeChatId={activeChatId}
        input={input}
        setInput={setInput}
        onSendMessage={onSendMessage}
        onBackToStories={onBackToStories}
      />
    </div>
  );
};

export default AIChatTab;