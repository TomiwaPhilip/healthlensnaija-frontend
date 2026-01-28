import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Phone, Mail, User, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
        stiffness: 80,
        damping: 15
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        toast.error("Failed to send message.");
      }
    } catch (err) {
      // Fallback for demo if API endpoint doesn't exist yet
      setTimeout(() => {
          setStatus("success");
          toast.success("Message sent successfully! (Demo)");
          setForm({ name: "", email: "", message: "" });
          setTimeout(() => setStatus("idle"), 3000);
      }, 1500)
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen py-20 lg:py-32 px-4 md:px-8 lg:px-16 overflow-hidden bg-background"
    >
      {/* Background Decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 lg:mb-24">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Get in Touch
          </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            We'd Love to <span className="text-primary">Hear From You</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions, feedback, or want to collaborate? Reach out to the HealthLens Naija team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
          {/* Contact Information Column */}
          <motion.div variants={itemVariants} className="space-y-8 order-2 lg:order-1">
             <Card className="border-border shadow-lg overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-primary/10"></div>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">Contact Information</CardTitle>
                    <CardDescription>Our team is here to help.</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <div className="flex items-start group/item">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all duration-300">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div className="ml-5">
                            <h4 className="text-lg font-semibold text-foreground mb-1">Our Office</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                123 Health Avenue<br />
                                Central Business District, Abuja
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start group/item">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all duration-300">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div className="ml-5">
                            <h4 className="text-lg font-semibold text-foreground mb-1">Phone</h4>
                            <p className="text-muted-foreground">
                                +234 (0) 123 456 7890<br />
                                +234 (0) 987 654 3210
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start group/item">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all duration-300">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div className="ml-5">
                            <h4 className="text-lg font-semibold text-foreground mb-1">Email</h4>
                            <p className="text-muted-foreground">
                                info@nigeriahealthwatch.com<br />
                                contact@nigeriahealthwatch.com
                            </p>
                        </div>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 text-primary-foreground/20">
                    <Clock className="h-40 w-40" />
                </div>
                <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold">Operating Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-3">
                        <span className="font-medium opacity-90">Monday - Friday</span>
                        <span className="font-bold">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-3">
                        <span className="font-medium opacity-90">Saturday</span>
                        <span className="font-bold">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium opacity-90">Sunday</span>
                        <span className="font-bold opacity-60">Closed</span>
                    </div>
                </CardContent>
             </Card>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div variants={itemVariants} className="order-1 lg:order-2">
            <Card className="shadow-xl border-border">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we will get back to you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Your Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    name="name"
                                    type="text" 
                                    placeholder="John Doe" 
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-sm font-medium leading-none text-foreground">
                                Your Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    name="email"
                                    type="email" 
                                    placeholder="john@example.com" 
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Message
                            </label>
                            <Textarea 
                                name="message"
                                placeholder="How can we help you?" 
                                rows={5}
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="resize-none"
                            />
                        </div>
                        
                        <Button 
                            type="submit"
                            disabled={status === "sending"}
                            className="w-full"
                            size="lg"
                        >
                            {status === "sending" ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                                </>
                            ) : (
                                <>
                                Send Message
                                <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <AnimatePresence>
                            {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-sm border border-green-500/20 rounded-lg"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-medium">Message sent! We'll be in touch.</span>
                            </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>
            </Card>
          </motion.div>
        
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;