import React from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Stethoscope,
  Newspaper,
  Award,
  Users,
  LineChart,
  ArrowRight,
  Bot,
  MessageSquare,
  UserCheck,
  Globe,
  Lightbulb
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  const features = [
    {
      icon: <HeartPulse className="text-primary h-6 w-6" />,
      title: "Health Advocacy",
      description: "Reducing inequalities through strategic communication."
    },
    {
      icon: <Stethoscope className="text-primary h-6 w-6" />,
      title: "Evidence-Based",
      description: "Data-driven insights for impactful health reporting."
    },
    {
      icon: <Newspaper className="text-primary h-6 w-6" />,
      title: "Quality Journalism",
      description: "Credible, verified information you can trust."
    }
  ];

  const values = [
    {
      icon: <Award className="text-primary h-8 w-8" />,
      title: "Excellence",
      description: "Highest standards in health journalism."
    },
    {
      icon: <Users className="text-primary h-8 w-8" />,
      title: "Collaboration",
      description: "Partnering for better health outcomes."
    },
    {
      icon: <LineChart className="text-primary h-8 w-8" />,
      title: "Impact",
      description: "Driving measurable change in healthcare."
    }
  ];

  const healthLensFeatures = [
    {
      icon: <Bot className="text-primary-foreground h-6 w-6" />,
      title: "AI-Powered Story Generator",
      description: "Generates data-driven story ideas aligned with the Four Point Agenda.",
      bg: "bg-primary"
    },
    {
      icon: <MessageSquare className="text-primary-foreground h-6 w-6" />,
      title: "Interactive Chatbot",
      description: "Guides users through story development and brainstorming.",
      bg: "bg-primary"
    },
    {
      icon: <UserCheck className="text-primary-foreground h-6 w-6" />,
      title: "Expert Recommendations",
      description: "Connects you with credible subject matter experts.",
      bg: "bg-foreground" // Using foreground (dark) for contrast
    }
  ];

  const targetUsers = [
    "Health & Investigative Journalists",
    "Newsrooms",
    "Civil Society Organisations",
    "Public Health Comm. Professionals",
    "Public Health Researchers"
  ];

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="relative py-20 lg:py-32 px-4 md:px-8 lg:px-16 overflow-hidden bg-background"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1">
            About Nigeria Health Watch
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            Advocating for Better <br className="hidden md:block" />
            <span className="text-primary">Health Access</span>
          </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full" />
        </motion.div>

        {/* Mission Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-foreground mb-6 tracking-tight">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    To use <span className="text-primary font-semibold">communication and advocacy</span> to influence health policy and seek better health and access to quality healthcare for Nigerians.
                </p>
                <div className="space-y-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-background border-none shadow-none hover:bg-muted/50 transition-colors duration-200">
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1 p-2 bg-primary/10 rounded-lg">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
                 <Card className="rounded-2xl overflow-hidden shadow-2xl bg-card border-border">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 z-0"></div>
                     <CardContent className="relative z-10 p-8 md:p-12">
                         <Globe className="h-32 w-32 text-primary mb-6 opacity-10 absolute top-4 right-4" />
                         <h3 className="text-2xl font-bold text-foreground mb-4">Who We Are</h3>
                         <p className="text-muted-foreground mb-6 leading-relaxed">
                             Nigeria Health Watch is a not-for-profit health communication and advocacy organization. We work to hold leaders accountable and collaborate with partners to implement innovative solutions.
                         </p>
                         <p className="text-muted-foreground leading-relaxed">
                             We provide a platform for constructive dialogue and disseminate credible health information to influence policy and practice in Nigeria.
                         </p>
                     </CardContent>
                 </Card>
                 {/* Decorative Circle */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            </motion.div>
        </div>

        {/* HealthLensNaija Highlight */}
        <motion.div variants={itemVariants}>
        <Card className="bg-card rounded-3xl shadow-xl border-border mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/50 skew-x-12 transform translate-x-20 z-0"></div>
          
          <CardContent className="relative z-10 p-8 lg:p-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
                 <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
                    <Lightbulb className="h-8 w-8 text-primary" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                    Introducing <span className="text-primary">HealthLensNaija</span>
                 </h2>
                 <p className="text-muted-foreground text-lg leading-relaxed">
                    An AI-powered tool designed to strengthen media coverage and accountability of Nigeria's health sector by monitoring the Federal Ministry of Health's Four Point Agenda.
                 </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 {healthLensFeatures.map((feature, index) => (
                <div key={index} className="bg-background p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:-translate-y-1 transition-transform group">
                  <div className={`w-14 h-14 rounded-full ${feature.bg} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-snug">{feature.description}</p>
                </div>
               ))}
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-primary/10">
                 <div className="lg:w-1/2">
                    <h4 className="text-xl font-bold text-foreground mb-4 flex items-center">
                        <Users className="text-primary mr-3 h-6 w-6" />
                         Who is it for?
                    </h4>
                    <p className="text-muted-foreground mb-6">
                        Health journalists, Newsrooms, CSOs, Public Health researchers, and more.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {targetUsers.map((user, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs font-medium bg-background px-3 py-1">
                                {user}
                            </Badge>
                        ))}
                    </div>
                 </div>
                 <div className="lg:w-1/2 bg-background p-6 rounded-xl border-l-4 border-primary shadow-sm">
                    <h5 className="font-bold text-foreground mb-2">Addressing Challenges</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Helping journalists overcome time constraints, access credible data, and connect with experts for richer storytelling.
                    </p>
                 </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Core Values & Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
                 <h3 className="text-2xl font-bold text-foreground mb-8">Our Core Values</h3>
                 <div className="space-y-4">
                    {values.map((value, idx) => (
                        <Card key={idx} className="border-border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="flex items-center p-4">
                                <div className="mr-5 bg-primary/10 p-3 rounded-full">{value.icon}</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground">{value.title}</h4>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
             <div>
                 <h3 className="text-2xl font-bold text-foreground mb-8">Our Impact</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                        { number: "15+", label: "Years of Impact" },
                        { number: "2000+", label: "Health Stories" },
                        { number: "50+", label: "Partners" },
                        { number: "1M+", label: "Lives Touched" }
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-border shadow-sm flex flex-col justify-center h-40">
                            <CardContent className="text-center p-6">
                                <span className="block text-3xl lg:text-4xl font-extrabold text-primary mb-2">{stat.number}</span>
                                <span className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-wider">{stat.label}</span>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <Button size="lg" className="inline-flex items-center gap-3 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
            Join Our Mission
            <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default AboutUs;