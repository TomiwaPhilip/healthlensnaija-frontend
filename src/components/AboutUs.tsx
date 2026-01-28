import React from "react";
import {
  FaHeartbeat,
  FaUserMd,
  FaNewspaper,
  FaAward,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaRobot,
  FaComments,
  FaUserTie,
  FaSearch,
  FaGlobeAfrica,
  FaLightbulb
} from "react-icons/fa";
import { Button } from "./ui/button";

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
      icon: <FaHeartbeat className="text-3xl text-accent" />,
      title: "Health Advocacy",
      description: "Reducing inequalities through strategic communication."
    },
    {
      icon: <FaUserMd className="text-3xl text-accent" />,
      title: "Evidence-Based",
      description: "Data-driven insights for impactful health reporting."
    },
    {
      icon: <FaNewspaper className="text-3xl text-accent" />,
      title: "Quality Journalism",
      description: "Credible, verified information you can trust."
    }
  ];

  const values = [
    {
      icon: <FaAward className="text-4xl text-accent" />,
      title: "Excellence",
      description: "Highest standards in health journalism."
    },
    {
      icon: <FaUsers className="text-4xl text-accent" />,
      title: "Collaboration",
      description: "Partnering for better health outcomes."
    },
    {
      icon: <FaChartLine className="text-4xl text-accent" />,
      title: "Impact",
      description: "Driving measurable change in healthcare."
    }
  ];

  const healthLensFeatures = [
    {
      icon: <FaRobot className="text-2xl text-white" />,
      title: "AI-Powered Story Generator",
      description: "Generates data-driven story ideas aligned with the Four Point Agenda.",
      bg: "bg-accent"
    },
    {
      icon: <FaComments className="text-2xl text-white" />,
      title: "Interactive Chatbot",
      description: "Guides users through story development and brainstorming.",
      bg: "bg-accent"
    },
    {
      icon: <FaUserTie className="text-2xl text-white" />,
      title: "Expert Recommendations",
      description: "Connects you with credible subject matter experts.",
      bg: "bg-gray-800"
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
    <section className="relative py-20 lg:py-32 px-4 md:px-8 lg:px-16 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            About Nigeria Health Watch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            Advocating for Better <br className="hidden md:block" />
            <span className="text-[#3AB54A]">Health Access</span>
          </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-accent to-accent mx-auto rounded-full" />
        </div>

        {/* Mission Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    To use <span className="text-accent font-semibold">communication and advocacy</span> to influence health policy and seek better health and access to quality healthcare for Nigerians.
                </p>
                <div className="space-y-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 mt-1 p-2 bg-muted rounded-lg shadow-sm border border-border">
                                {feature.icon}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card p-2 border border-border">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/5 z-0"></div>
                     <div className="relative z-10 p-8 md:p-12">
                         <FaGlobeAfrica className="text-6xl text-accent mb-6 opacity-20 absolute top-4 right-4" />
                         <h3 className="text-2xl font-bold text-foreground mb-4">Who We Are</h3>
                         <p className="text-muted-foreground mb-6 leading-relaxed">
                             Nigeria Health Watch is a not-for-profit health communication and advocacy organization. We work to hold leaders accountable and collaborate with partners to implement innovative solutions.
                         </p>
                         <p className="text-muted-foreground leading-relaxed">
                             We provide a platform for constructive dialogue and disseminate credible health information to influence policy and practice in Nigeria.
                         </p>
                     </div>
                 </div>
                 {/* Decorative Circle */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            </div>
        </div>

        {/* HealthLensNaija Highlight */}
        <div className="bg-card rounded-3xl p-8 lg:p-16 shadow-xl border border-border mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-muted skew-x-12 transform translate-x-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                 <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-xl mb-6">
                    <FaLightbulb className="text-2xl text-accent" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Introducing <span className="text-accent">HealthLensNaija</span>
                 </h2>
                 <p className="text-muted-foreground text-lg">
                    An AI-powered tool designed to strengthen media coverage and accountability of Nigeria's health sector by monitoring the Federal Ministry of Health's Four Point Agenda.
                 </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 {healthLensFeatures.map((feature, index) => (
                <div key={index} className="bg-card p-8 rounded-2xl shadow-lg border border-border flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                  <div className={`w-14 h-14 rounded-full ${feature.bg} flex items-center justify-center mb-6 shadow-md`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
               ))}
            </div>

            <div className="bg-accent/5 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                 <div className="lg:w-1/2">
                    <h4 className="text-xl font-bold text-foreground mb-4 flex items-center">
                        <FaUsers className="text-accent mr-3" />
                         Who is it for?
                    </h4>
                    <p className="text-muted-foreground mb-4">
                        Health journalists, Newsrooms, CSOs, Public Health researchers, and more.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {targetUsers.map((user, idx) => (
                            <span key={idx} className="bg-card px-3 py-1 rounded-md text-xs font-medium text-foreground border border-border shadow-sm">
                                {user}
                            </span>
                        ))}
                    </div>
                 </div>
                 <div className="lg:w-1/2 bg-muted p-6 rounded-xl border-l-4 border-accent shadow-sm">
                    <h5 className="font-bold text-foreground mb-2">Addressing Challenges</h5>
                    <p className="text-muted-foreground text-sm">
                        Helping journalists overcome time constraints, access credible data, and connect with experts for richer storytelling.
                    </p>
                 </div>
            </div>
          </div>
        </div>

        {/* Core Values & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
                 <h3 className="text-2xl font-bold text-foreground mb-8">Our Core Values</h3>
                 <div className="space-y-4">
                    {values.map((value, idx) => (
                        <div key={idx} className="flex items-center p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                            <div className="mr-5">{value.icon}</div>
                            <div>
                                <h4 className="text-lg font-bold text-foreground">{value.title}</h4>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        </div>
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
                        <div key={idx} className="bg-card p-6 rounded-xl border border-border text-center shadow-sm flex flex-col justify-center h-40">
                            <span className="text-3xl lg:text-4xl font-extrabold text-accent mb-2">{stat.number}</span>
                            <span className="text-muted-foreground font-medium text-sm text-transform uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="default" size="lg" className="inline-flex items-center gap-3">
            Join Our Mission
            <FaArrowRight className="ml-1" />
          </Button>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;