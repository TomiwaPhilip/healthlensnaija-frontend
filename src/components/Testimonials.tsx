import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";

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
    return <div className="py-20 text-center text-muted-foreground text-lg">Loading testimonials...</div>;
  }

  if (!testimonials || testimonials.length === 0) {
    return <div className="py-20 text-center text-muted-foreground text-lg">No testimonials available yet.</div>;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">Hear What Our Users Are Saying</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Trusted by health professionals and organizations nationwide</p>
          <div className="h-1 w-20 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={t._id || i} className="p-6 bg-card rounded-xl border border-border flex flex-col shadow-sm">
              <div className="flex-grow mb-4">
                <FaQuoteLeft className="text-3xl text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4 text-base leading-relaxed">{t.review}</p>
              </div>

              <div className="flex items-center mt-auto">
                <img src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} alt={t.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <svg key={idx} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${idx < (t.rating || 0) ? 'text-yellow-400' : 'text-border'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.975 2.888c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L1.664 9.1c-.783-.57-.381-1.81.588-1.81h4.911a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

