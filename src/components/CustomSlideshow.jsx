
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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
  const heroPillars = [
    { label: 'Ethically Sourced', icon: Sparkles },
    { label: 'Freshly Packed', icon: ShieldCheck },
    { label: '100% Natural', icon: Leaf },
  ];

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
      const createdLinks = [];

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://res.cloudinary.com';
      document.head.appendChild(preconnect);
      createdLinks.push(preconnect);

      slides.forEach((slide) => {
        if (slide?.image) {
          const img = new Image();
          img.src = slide.image;
          img.decoding = 'async';

          const preload = document.createElement('link');
          preload.rel = 'preload';
          preload.as = 'image';
          preload.href = slide.image;
          document.head.appendChild(preload);
          createdLinks.push(preload);
        }
      });

      return () => {
        createdLinks.forEach((link) => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [slides]);

  if (!slides || slides.length === 0) {
    return <div>No slides to display.</div>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full min-h-[540px] overflow-hidden rounded-[1.75rem] shadow-2xl sm:min-h-[600px] md:h-[620px] md:rounded-[2rem] lg:h-[720px]">
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
            alt={currentSlide.alt}
            src={currentSlide.image}
            loading="eager"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.12),transparent_28%)]" />

          <div className="absolute inset-0 px-4 pb-28 pt-6 sm:px-5 sm:pb-24 sm:pt-8 md:px-10 md:pb-24 md:pt-10 lg:px-16 lg:pb-28">
            <div className="flex h-full items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="max-w-xl rounded-[1.5rem] border border-white/15 bg-black/20 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5 md:max-w-2xl md:rounded-[1.75rem] md:border-white/20 md:bg-black/15 md:p-7 lg:p-8"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/95 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
                      The Ceylon Spice Hub
                    </span>
                  </div>

                  <h2 className="text-[2rem] font-extrabold leading-[1.05] text-balance sm:text-4xl md:text-5xl lg:text-6xl">
                    {currentSlide.title}
                  </h2>

                  <p className="mt-2.5 max-w-xl text-sm font-semibold leading-6 text-yellow-200 sm:mt-3 sm:text-base md:text-xl lg:text-2xl">
                    {currentSlide.tagline}
                  </p>

                  {currentSlide.imageDescription && (
                    <p className="mt-3 hidden max-w-xl text-sm leading-6 text-white/85 sm:block sm:mt-4 sm:leading-7 md:text-base">
                      {currentSlide.imageDescription}
                    </p>
                  )}

                  <div className="mt-5 grid gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
                    {heroPillars.map((item, index) => (
                      <span
                        key={item.label}
                        className={cn(
                          'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 sm:justify-start sm:px-3.5',
                          index < 2 && 'hidden sm:inline-flex'
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 text-yellow-200" />
                        {item.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 w-full bg-primary px-6 text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 sm:h-auto sm:w-auto sm:px-7 sm:text-base"
                    >
                      <Link to="/products">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 w-full border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white sm:h-auto sm:w-auto sm:px-7 sm:text-base"
                    >
                      <Link to="/we-are">Our Story</Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-black/15 text-white backdrop-blur-sm transition-all hover:bg-black/25 md:flex"
        onClick={handlePrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-black/15 text-white backdrop-blur-sm transition-all hover:bg-black/25 md:flex"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute inset-x-0 bottom-3 z-10 hidden px-3 sm:block sm:bottom-4 sm:px-4 md:bottom-6 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-black/22 px-3 py-3 backdrop-blur-sm sm:rounded-2xl sm:px-4 md:flex-row md:items-center md:justify-center md:px-5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 sm:h-2.5',
                  currentIndex === index
                    ? 'w-8 bg-primary sm:w-10'
                    : 'w-2 bg-white/45 hover:bg-white/80 sm:w-2.5'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onClick={handlePrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSlideshow;
