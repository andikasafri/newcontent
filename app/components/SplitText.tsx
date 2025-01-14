import {
  useSprings,
  animated,
  EasingFunction,
  SpringValue,
  AnimatedProps,
} from "@react-spring/web";
import { useEffect, useRef, useState, CSSProperties } from "react";

interface SplitTextProps {
  /** Text to be animated */
  text?: string;
  /** Optional className for styling */
  className?: string;
  /** Delay between each letter animation in milliseconds */
  delay?: number;
  /** Initial animation state */
  animationFrom?: { opacity: number; transform: string };
  /** Final animation state */
  animationTo?: { opacity: number; transform: string };
  /** Animation easing function */
  easing?: EasingFunction;
  /** Intersection observer threshold */
  threshold?: number;
  /** Intersection observer root margin */
  rootMargin?: string;
  /** Text alignment */
  textAlign?: CSSProperties["textAlign"];
  /** Callback when all letters finish animating */
  onLetterAnimationComplete?: () => void;
}

interface AnimatedStyle {
  opacity: SpringValue<number>;
  transform: SpringValue<string>;
}

/**
 * Animated text component that splits text into individual letters
 * Each letter animates independently with configurable animations
 *
 * @component
 * @example
 * ```tsx
 * <SplitText
 *   text="Hello World"
 *   delay={100}
 *   className="text-4xl"
 * />
 * ```
 */
const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = (t: number) => t,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const letters = text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: inView
        ? async (next: (props: typeof animationTo) => Promise<void>) => {
            await next(animationTo);
            animatedCount.current += 1;
            if (
              animatedCount.current === letters.length &&
              onLetterAnimationComplete
            ) {
              onLetterAnimationComplete();
            }
          }
        : animationFrom,
      delay: i * delay,
      config: {
        duration: 1000,
        easing,
      },
    }))
  );

  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline ${className}`}
      style={{ textAlign }}
    >
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={props as AnimatedProps<AnimatedStyle>}
          className="inline-block transform transition-opacity will-change-transform"
          aria-hidden="true"
        >
          {letters[index] === " " ? "\u00A0" : letters[index]}
        </animated.span>
      ))}
      <span className="sr-only">{text}</span>
    </p>
  );
};

export default SplitText;
