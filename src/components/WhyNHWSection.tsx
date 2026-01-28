import React, { useRef, useEffect, useState } from "react";
import { Play, Check, X } from "lucide-react";
import ReactPlayer from "react-player/lazy";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const WhyNHWSection = () => {
  const features = [
    { title: "Efficiency at its Best", description: "Save hours of work with AI tools that streamline your workflow." },
    { title: "Customizable Solutions", description: "Adapt our features to your unique storytelling and data analysis needs." },
    { title: "User-friendly Design", description: "Navigate easily with an intuitive interface built for everyone." },
    { title: "Reliable Support", description: "Get expert help whenever you need it, ensuring smooth experiences." },
    { title: "Innovation Technology", description: "Stay ahead with AI that evolves with your needs." },
  ];

  const videoRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          Why <span className="text-primary">HealthLens Naija</span> Stands Out
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Practical AI tools and expert-backed workflows to speed up reporting and improve accuracy.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Video Block */}
        <div className="relative" ref={videoRef}>
          <Dialog>
            <DialogTrigger asChild>
                <div
                    className="relative overflow-hidden rounded-2xl bg-muted border border-border aspect-video cursor-pointer hover:shadow-xl transition-all group"
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="text-primary-foreground h-6 w-6 ml-1" />
                        </div>
                    </div>
                     {/* Placeholder image or overlay could go here */}
                     <div className="absolute bottom-4 left-4 p-4 text-white">
                        <p className="font-semibold text-lg drop-shadow-md">See it in action</p>
                     </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                 <div className="relative aspect-video w-full">
                    <ReactPlayer
                        url="https://youtu.be/xlROWz1W7dI?si=hXd9Fy3VvzQIQ5Hk"
                        width="100%"
                        height="100%"
                        controls={true}
                        playing={true}
                    />
                 </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feature List Block */}
        <div className="relative">
          <ScrollArea style={{ height: videoHeight ? videoHeight : 'auto', maxHeight: '500px' }} className="pr-4">
            <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/60 hover:border-primary/50 transition-colors">
                <CardContent className="flex items-start p-6">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default WhyNHWSection;
