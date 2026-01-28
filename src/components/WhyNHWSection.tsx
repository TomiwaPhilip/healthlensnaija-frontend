import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import ReactPlayer from "react-player/lazy";

const WhyNHWSection = () => {
  const features = [
    { title: "Efficiency at its Best", description: "Save hours of work with AI tools that streamline your workflow." },
    { title: "Customizable Solutions", description: "Adapt our features to your unique storytelling and data analysis needs." },
    { title: "User-friendly Design", description: "Navigate easily with an intuitive interface built for everyone." },
    { title: "Reliable Support", description: "Get expert help whenever you need it, ensuring smooth experiences." },
    { title: "Innovation Technology", description: "Stay ahead with AI that evolves with your needs." },
  ];

  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
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
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Why <span className="text-accent">HealthLens Naija</span> Stands Out
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Practical AI tools and expert-backed workflows to speed up reporting and improve accuracy.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Video Block */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-xl bg-card border border-border shadow-lg cursor-pointer"
            style={{ paddingBottom: '56.25%' }}
            onClick={() => setShowModal(true)}
            ref={videoRef}
          >
            <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
              <FaPlay className="text-accent-foreground text-4xl" />
            </div>
          </div>
        </div>

        {/* Feature List Block */}
        <div className="overflow-hidden">
          <div style={{ height: videoHeight || 'auto' }} className="space-y-4 overflow-y-auto pr-2 hide-scrollbar">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start bg-card p-6 rounded-xl border border-border shadow-sm"
              >
                <div className="flex-shrink-0 mt-1 text-accent-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-4xl z-10" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white hover:text-gray-200 transition-colors" onClick={() => setShowModal(false)}>
              <FaTimes className="text-2xl" />
            </button>
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <ReactPlayer
                url="https://youtu.be/xlROWz1W7dI?si=hXd9Fy3VvzQIQ5Hk"
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                playing={showModal}
                controls={true}
                config={{
                  youtube: { playerVars: { modestbranding: 1, rel: 0, showinfo: 0 } },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyNHWSection;
