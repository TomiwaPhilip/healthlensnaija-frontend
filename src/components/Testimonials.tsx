import React, { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL;

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/testimonials`);
        const data = await res.json();
        // Fallback or demo data if empty (optional, keeping logic same as before)
        if (mounted) setTestimonials(data || []);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
               <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
            ))}
          </div>
        </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
        <section className="py-20 text-center text-muted-foreground bg-background">
            <p className="text-lg">No testimonials available yet.</p>
        </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24">
           <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
            Hear What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Trusted by health professionals and organizations nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={t._id || i} className="border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <Quote className="h-8 w-8 text-primary/20 mb-6" />
                <p className="text-muted-foreground mb-8 text-base leading-relaxed flex-grow italic">
                    "{t.review}"
                </p>

                <div className="flex items-center mt-auto pt-6 border-t border-border">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={t.image} alt={t.name} />
                    <AvatarFallback>{t.name ? t.name.substring(0,2).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{t.role}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, idx) => (
                         <Star 
                            key={idx} 
                            className={`h-4 w-4 ${idx < (t.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground/20'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

