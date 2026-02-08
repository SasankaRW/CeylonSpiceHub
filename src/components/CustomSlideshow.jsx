
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

const CustomSlideshow = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(handleNext, 7000);
    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  // Preload all slider images on initial mount
  useEffect(() => {
    if (slides && slides.length > 0) {
      slides.forEach((slide) => {
        if (slide?.image) {
          const img = new Image();
          img.src = slide.image;
        }
      });
    }
  }, [slides]);

  if (!slides || slides.length === 0) {
    return <div>No slides to display.</div>;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-2xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <img
            className="w-full h-full object-cover"
            alt={slides[currentIndex].alt}
            src={slides[currentIndex].image}
            loading="eager"
            fetchpriority="high" />
          {/* Text Content - Top Left for First Slide */}
          <div className={cn(
            "absolute",
            currentIndex === 0
              ? "top-0 left-0 pt-8 md:pt-20 lg:pt-28 pl-4 md:pl-16 lg:pl-24 pr-4 md:pr-12"
              : currentIndex === 1
                ? "inset-0 flex items-start md:items-center justify-center pt-12 md:pt-0 p-4 md:p-8 lg:p-12"
                : "inset-0 flex items-start justify-center pt-12 md:pt-16 lg:pt-20 p-4 md:p-8 lg:p-12"
          )}>
            <div className={cn(
              "flex flex-col",
              currentIndex === 0 ? "items-start text-left max-w-full md:max-w-2xl gap-3 md:gap-6" : "max-w-4xl w-full text-center items-center gap-3 md:gap-4"
            )}>
              <motion.h2
                className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-0 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-lg"
                  style={{
                    // backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {slides[currentIndex].title}
                </span>
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-yellow-400 font-bold mb-0 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  textShadow: '2px 2px 6px rgba(0,0,0,0.7)'
                }}
              >
                {slides[currentIndex].tagline}
              </motion.p>
              {slides[currentIndex].imageDescription && (
                <motion.p
                  className="text-sm md:text-base lg:text-lg text-white font-medium mb-2 md:mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{
                    textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
                  }}
                >
                  {slides[currentIndex].imageDescription}
                </motion.p>
              )}
            </div>
          </div>

          {/* Button - Lower Position */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 lg:pb-16 pointer-events-none">
            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base md:text-lg px-6 py-4 md:px-8 md:py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link to="/products">Shop Now</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-primary-foreground"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-primary-foreground"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              currentIndex === index ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomSlideshow;
