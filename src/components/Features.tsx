import React from "react";
import { FaPenFancy, FaComments, FaUpload, FaChartLine, FaLightbulb, FaSearch } from "react-icons/fa";

const features = [
  {
    title: "AI-Powered Story Generation",
    description: "Craft compelling stories in seconds using our advanced AI technology that understands context and narrative structure.",
    icon: <FaPenFancy className="text-2xl" />,
  },
  {
    title: "Interactive Conversations",
    description: "Collaborate with AI for brainstorming, Q&A, and real-time insights through natural language processing.",
    icon: <FaComments className="text-2xl" />,
  },
  {
    title: "Data Upload & Processing",
    description: "Upload documents to summarize, analyze, or review with precision using our document intelligence features.",
    icon: <FaUpload className="text-2xl" />,
  },
  {
    title: "Performance Analytics",
    description: "Track and manage your progress with actionable metrics and comprehensive reports.",
    icon: <FaChartLine className="text-2xl" />,
  },
  {
    title: "Smart Recommendations",
    description: "Get personalized suggestions to improve your content based on AI analysis of your writing patterns.",
    icon: <FaLightbulb className="text-2xl" />,
  },
  {
    title: "Advanced Search",
    description: "Quickly find relevant information across all your documents with semantic search capabilities.",
    icon: <FaSearch className="text-2xl" />,
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">What We Offer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover powerful tools to elevate your storytelling.</p>
          <div className="h-1 w-20 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col p-8 bg-card rounded-xl shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;