import React, { useRef } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  PenTool, 
  MessageSquare, 
  UploadCloud, 
  LineChart, 
  Lightbulb, 
  Search, 
  ArrowRight, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Using Swiper for the slider section
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeatureCard = ({ title, description, useCases, icon, index, isReversed = false }) => {
  const cardAnimation = {
    hidden: { opacity: 0, x: isReversed ? 50 : -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 60 }
    }
  };

  const contentAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: (index * 0.1) + 0.2 }
    }
  };

  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16 mb-20 lg:mb-24`}>
      {/* Visual Card */}
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full lg:w-1/2"
      >
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-300"></div>
           <Card className="relative border-border shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 lg:p-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    {icon}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{description}</p>
                
                <div className="border-t border-border pt-6">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                    Journalist Use Cases:
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                    {useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start text-sm lg:text-base text-muted-foreground group/li">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="group-hover/li:text-foreground transition-colors">{useCase}</span>
                        </li>
                    ))}
                    </ul>
                </div>
              </CardContent>
            </Card>
        </div>
      </motion.div>

      {/* Context Content */}
      <motion.div
        variants={contentAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full lg:w-1/2"
      >
        <div className="space-y-6 lg:pl-8">
            <Badge variant="outline" className="py-1 px-3 bg-primary/10 text-primary border-primary/20">
                Efficiency Booster
            </Badge>
            <h4 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">How it empowers your reporting</h4>
            <p className="text-muted-foreground text-lg leading-relaxed">
            This tool is engineered to remove the friction from your workflow. By automating the heavy lifting of {title.toLowerCase()}, you can dedicate more time to the human elements of journalism—interviews, analysis, and crafting impactful narratives.
            </p>
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Lightbulb className="h-24 w-24 text-primary" />
                </div>
                <p className="text-foreground text-base relative z-10 leading-relaxed">
                    <strong className="block text-primary mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" /> PRO TIP
                    </strong> 
                    Use this feature to quickly generate multiple angles for breaking news stories, ensuring comprehensive coverage in record time.
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeaturesSlider = () => {
    const features = [
      { 
        title: "AI Story Generation", 
        description: "Generate multiple story angles in seconds with verified facts and proper citations.", 
        icon: <PenTool className="h-6 w-6" /> 
      },
      { 
        title: "Document Analysis", 
        description: "Upload PDFs and get instant summaries, key points, and fact verification.", 
        icon: <UploadCloud className="h-6 w-6" /> 
      },
      { 
        title: "AI Research Assistant", 
        description: "Chat with AI to research topics, verify facts, and brainstorm ideas.", 
        icon: <MessageSquare className="h-6 w-6" /> 
      },
      { 
        title: "Performance Analytics", 
        description: "Track your content performance and get improvement suggestions.", 
        icon: <LineChart className="h-6 w-6" /> 
      },
      { 
        title: "Smart Search", 
        description: "Find relevant information across all your documents instantly.", 
        icon: <Search className="h-6 w-6" /> 
      },
      { 
        title: "Content Recommendations", 
        description: "Get AI-powered suggestions to improve your writing and engagement.", 
        icon: <Lightbulb className="h-6 w-6" /> 
      },
    ];
  
    const prevRef = useRef(null);
    const nextRef = useRef(null);
  
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 lg:py-24 bg-muted/30 rounded-3xl my-24 relative overflow-hidden border border-border"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
               Comprehensive Toolset
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Everything you need to modernize your newsroom in one platform.</p>
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            onBeforeInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-16 !px-4"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="h-auto">
                <Card className="h-full border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary-foreground group-hover:bg-primary transition-colors duration-300">
                        {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
  
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button ref={prevRef} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-card shadow-sm">
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button ref={nextRef} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-card shadow-sm">
                <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.section>
    );
  };

const FeaturesPage = () => {
    const mainFeatures = [
        {
          title: "AI Story Generation",
          description: "Generate compelling stories with multiple angles in seconds. Our AI understands context and creates structured, citation-rich content perfect for journalism.",
          useCases: [
            "Break news faster with AI-assisted drafting",
            "Generate multiple perspectives on complex topics",
            "Overcome writer's block with creative prompts",
            "Create structured articles with verified facts"
          ],
          icon: <PenTool className="h-8 w-8" />,
          isReversed: false
        },
        {
          title: "Document Intelligence",
          description: "Upload PDFs, reports, and documents to extract key information, summarize content, and verify facts automatically. No more sifting through hundreds of pages manually.",
          useCases: [
            "Quickly analyze government reports and policy documents",
            "Extract key statistics and quotes from research papers",
            "Verify facts across multiple uploaded sources",
            "Generate executive summaries for complex documents"
          ],
          icon: <UploadCloud className="h-8 w-8" />,
          isReversed: true
        },
        {
          title: "AI Research Assistant",
          description: "Chat with our AI to research topics, fact-check information, and develop story ideas through natural conversation. It's like having a dedicated researcher available 24/7.",
          useCases: [
            "Research background information for investigative pieces",
            "Fact-check claims and verify data in real-time",
            "Brainstorm interview questions and story approaches",
            "Get explanations for complex policy topics"
          ],
          icon: <MessageSquare className="h-8 w-8" />,
          isReversed: false
        }
    ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background overflow-hidden font-sans">
        
        {/* Page Header */}
        <div className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 lg:px-16 overflow-hidden">
             {/* Background Blobs */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-4xl mx-auto text-center z-10"
            >
            <Badge className="mb-6 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm tracking-wide uppercase">
                Product Features
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            AI Tools strictly for <br />
            <span className="text-primary">Modern Journalists</span>
          </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Streamline your reporting workflow with powerful AI engines. Create better stories, analyze deeper data, and engage simpler audiences.
            </p>
            </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            {/* Main Features */}
            <div className="space-y-12 lg:space-y-24">
            {mainFeatures.map((feature, index) => (
                <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                useCases={feature.useCases}
                icon={feature.icon}
                index={index}
                isReversed={feature.isReversed}
                />
            ))}
            </div>

            {/* Slider Section */}
            <FeaturesSlider />

            {/* CTA Section */}
            <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-24 relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl"
            >
                {/* Abstract Patterns */}
                <div className="absolute inset-0 opacity-10">
                   <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                   </svg>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 tracking-tight">Ready to Transform Your Journalism?</h2>
                    <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 leading-relaxed opacity-90">
                        Join verified journalists and newsrooms who are already creating better stories faster with HealthLensNaija.
                    </p>
                    <Button size="lg" variant="secondary" className="px-8 py-8 text-lg rounded-full font-bold shadow-lg hover:scale-105 transition-all text-primary">
                        Start Creating Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeaturesPage;