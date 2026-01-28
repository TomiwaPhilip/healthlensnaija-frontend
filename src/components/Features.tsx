import React from "react";
import { PenTool, MessageSquare, UploadCloud, LineChart, Lightbulb, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Story Generation",
    description: "Craft compelling stories in seconds using our advanced AI technology that understands context and narrative structure.",
    icon: <PenTool className="h-6 w-6" />,
  },
  {
    title: "Interactive Conversations",
    description: "Collaborate with AI for brainstorming, Q&A, and real-time insights through natural language processing.",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    title: "Data Upload & Processing",
    description: "Upload documents to summarize, analyze, or review with precision using our document intelligence features.",
    icon: <UploadCloud className="h-6 w-6" />,
  },
  {
    title: "Performance Analytics",
    description: "Track and manage your progress with actionable metrics and comprehensive reports.",
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: "Smart Recommendations",
    description: "Get personalized suggestions to improve your content based on AI analysis of your writing patterns.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    title: "Advanced Search",
    description: "Quickly find relevant information across all your documents with semantic search capabilities.",
    icon: <Search className="h-6 w-6" />,
  },
];

const Features: React.FC = () => {
    
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section id="features" className="py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
             What We Offer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover powerful tools designed to elevate your storytelling and streamline your workflow.
          </p>
        </div>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
                </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;