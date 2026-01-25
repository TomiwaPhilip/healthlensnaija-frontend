import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { FiPlay, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PromptInputTour = ({ isNightMode }) => {
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 🧠 Auto-start tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenPromptTour");
    console.log("🔍 useEffect called — hasSeenTour:", hasSeenTour);
    if (!hasSeenTour) {
      console.log("🔍 Auto-starting tour (first-time user)");
      setTimeout(() => {
        setRunTour(true);
        localStorage.setItem("hasSeenPromptTour", "true");
      }, 1000);
    }
  }, []);

  const tourSteps = [
    {
      target: '.pillar-dropdown',
      content: 'Click here to select a content pillar. Pillars help categorize your content and provide relevant keywords.',
      placement: 'bottom',
      title: 'Content Pillar',
    },
    {
      target: '.prompt-textarea',
      content: 'Write your prompt here. You can type your content ideas or questions, and press Enter to generate.',
      placement: 'bottom',
      title: 'Prompt Input',
    },
    {
      target: '.settings-button',
      content: 'Configure language and tone settings here. Choose from multiple languages and writing styles.',
      placement: 'bottom',
      title: 'Settings',
    },
    {
      target: '.send-button',
      content: 'Click to generate content. If no text is entered, this becomes a microphone for voice input.',
      placement: 'bottom',
      title: 'Generate/Voice Input',
    },
    {
      target: '.keyword-tray',
      content: 'Selected keywords appear here. You can scroll through them and clear selections when needed.',
      placement: 'top',
      title: 'Keywords',
    },
    {
      target: '.language-tone-preview',
      content: 'Your current language and tone settings are displayed here for quick reference.',
      placement: 'left',
      title: 'Current Settings',
    }
  ];

  const handleTourStart = () => {
    console.log('🎬 handleTourStart triggered');
  
    console.log("🧩 Checking target elements:");
    tourSteps.forEach((step, i) => {
      const el = document.querySelector(step.target);
      console.log(`   Step ${i + 1}: ${step.target} →`, el ? "✅ Found" : "❌ Not found");
    });
  
    // Start tour with a slight delay to ensure Joyride renders cleanly
    setRunTour(false);
    setTimeout(() => {
      console.log("✅ Starting Joyride tour now...");
      setRunTour(true);
      setTourStepIndex(0);
    }, 300);
  };
  
  const handleTourCallback = (data) => {
    const { action, index, type, status, lifecycle } = data;
    console.log('🎯 Joyride callback:', { action, index, type, status, lifecycle });
  
    if (type === 'tour:start') {
      console.log('🚀 Joyride tour started — forcing step to render tooltip');
      // Force tooltip to open in case Joyride starts in beacon mode
      setTimeout(() => {
        setTourStepIndex(0);
      }, 200);
    }
  
    if (type === 'step:before' || lifecycle === 'tooltip') {
      setIsTransitioning(true);
      console.log('🔄 Transition starting (step before)...');
      setTimeout(() => setIsTransitioning(false), 300);
    }
  
    if (type === 'beacon') {
      console.log('⚠️ Beacon state detected — forcing tooltip open');
      setTimeout(() => {
        setTourStepIndex(prev => prev); // trigger re-render of tooltip
      }, 200);
    }
  
    if (type === 'tour:end' || action === 'close' || status === 'finished') {
      console.log('🛑 Tour ended — resetting state');
      setIsTransitioning(true);
      setTimeout(() => {
        setRunTour(false);
        setTourStepIndex(0);
        setIsTransitioning(false);
        console.log('🔁 Tour state reset complete');
      }, 500);
    } else if (type === 'step:after' && action === 'next') {
      console.log('➡️ Moving to next step');
      setTourStepIndex(index + 1);
    } else if (type === 'step:after' && action === 'prev') {
      console.log('⬅️ Moving to previous step');
      setTourStepIndex(index - 1);
    }
  };
  
  useEffect(() => {
    console.log("🔄 Component render — runTour:", runTour, "step:", tourStepIndex);
  });

  // Custom Tooltip Component
  const CustomTooltip = ({ 
    continuous, 
    index, 
    step, 
    backProps, 
    closeProps, 
    primaryProps, 
    skipProps, 
    tooltipProps,
    isLast 
  }) => {
    const isFirst = index === 0;
    const actualIsLast = index === tourSteps.length - 1;

    const handleNext = (e) => {
      e?.preventDefault?.();
      if (primaryProps && primaryProps.onClick) {
        primaryProps.onClick(e || {});
      }
    };
    

    const handleBack = () => {
      if (backProps && backProps.onClick) {
        backProps.onClick({ preventDefault: () => {} });
      }
    };

    const handleClose = () => {
      if (closeProps && closeProps.onClick) {
        closeProps.onClick({ preventDefault: () => {} });
      }
    };

    return (
      <div
        {...tooltipProps}
        className={`relative max-w-xs mx-4 transition-all duration-300 transform ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Custom Card */}
        <div className={`
          relative rounded-2xl shadow-2xl border backdrop-blur-sm
          ${isNightMode 
            ? 'bg-gray-800/95 border-gray-700 text-white' 
            : 'bg-white/95 border-gray-200 text-gray-900'
          }
          transform transition-all duration-300
          hover:scale-105
        `}>
          {/* Header */}
          <div className={`
            flex items-center justify-between p-4 border-b
            ${isNightMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <button
              onClick={handleClose}
              className={`
                p-1 rounded-full transition-colors
                ${isNightMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm leading-relaxed">{step.content}</p>
          </div>

          {/* Footer */}
          <div className={`
            flex items-center justify-between p-4 border-t
            ${isNightMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-70">
                {index + 1} of {tourSteps.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {!isFirst && (
                <button
                  onClick={handleBack}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isNightMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                    transform hover:scale-105 active:scale-95
                  `}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {continuous && (
                <button
                  onClick={handleNext}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    bg-green-600 hover:bg-green-700 text-white
                    transform hover:scale-105 active:scale-95
                  `}
                >
                  <span>{actualIsLast ? 'Finish' : 'Next'}</span>
                  {!actualIsLast && <FiChevronRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className={`
            absolute w-4 h-4 rotate-45
            ${step.placement === 'top' ? 'bottom-2' : 'top-2'}
            ${step.placement === 'left' ? 'right-2' : 'left-2'}
            ${isNightMode ? 'bg-gray-800/95' : 'bg-white/95'}
            border-l border-t
            ${isNightMode ? 'border-gray-700' : 'border-gray-200'}
          `} />
        </div>
      </div>
    );
  };

  const tourStyles = {
    options: {
      primaryColor: '#16a34a',
      textColor: isNightMode ? '#f3f4f6' : '#1f2937',
      backgroundColor: isNightMode ? '#1f2937' : '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      arrowColor: isNightMode ? '#374151' : '#e5e7eb',
      zIndex: 9999,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      animation: 'fadeIn 0.5s ease-in-out',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    tooltip: {
      borderRadius: 16,
      padding: 0,
      minWidth: 280,
      maxWidth: 320,
    },
    buttonNext: {
      display: 'none',
    },
    buttonBack: {
      display: 'none',
    },
    buttonSkip: {
      display: 'none',
    },
    // beacon: {
    //   display: 'none',
    // },
  };

  return (
    <>
      {/* 🎬 Animated Play Button */}
      <button
        onClick={() => {
          console.log("🖱️ Play button clicked");
          handleTourStart();
        }}
        className={`
          fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg 
          transition-all duration-500 transform hover:scale-110 active:scale-95
          backdrop-blur-sm border
          ${isNightMode 
            ? 'bg-green-600/90 hover:bg-green-700/90 text-white border-green-700' 
            : 'bg-green-500/90 hover:bg-green-600/90 text-white border-green-600'
          }
          animate-pulse hover:animate-none
        `}
        title="Start tour"
      >
        <FiPlay className="w-5 h-5" />
      </button>

      {/* 🚀 Custom Joyride Tour */}
      <Joyride
  steps={tourSteps}
  run={runTour}
  stepIndex={tourStepIndex}
  callback={handleTourCallback}
  continuous
  showSkipButton
  showProgress
  spotlightClicks
  spotlightPadding={10}
  disableOverlayClose={false}
  disableScrolling={false}
  // disableBeacon
  styles={tourStyles}
  tooltipComponent={CustomTooltip}
/>


      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .react-joyride__tooltip {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .react-joyride__overlay {
          animation: overlayFade 0.5s ease-in-out;
        }
        
        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default PromptInputTour;