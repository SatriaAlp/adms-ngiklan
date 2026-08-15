import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in';
  duration?: number; // in ms
  delay?: number; // in ms
  threshold?: number; // 0 to 1
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'slide-up',
  duration = 700,
  delay = 0,
  threshold = 0.05,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // Trigger slightly before entering fully
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getVariantStyles = () => {
    if (isIntersecting) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    }

    switch (variant) {
      case 'fade-in':
        return 'opacity-0';
      case 'slide-up':
        return 'opacity-0 translate-y-8';
      case 'slide-down':
        return 'opacity-0 -translate-y-8';
      case 'slide-left':
        return 'opacity-0 translate-x-8';
      case 'slide-right':
        return 'opacity-0 -translate-x-8';
      case 'zoom-in':
        return 'opacity-0 scale-95';
      default:
        return 'opacity-0 translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${className} ${getVariantStyles()}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};
