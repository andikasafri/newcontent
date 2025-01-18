import React from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
  children: string; // Define the type for children
}

export function SplitText({ children, ...rest }: SplitTextProps) {
  const words = children.split(" ");
  return words.map((word: string, i: number) => {
    // Define types for word and i
    return (
      <div
        key={children + i}
        style={{ display: "inline-block", overflow: "hidden" }}
      >
        <motion.div
          {...rest}
          style={{ display: "inline-block", willChange: "transform" }}
          custom={i}
          initial={{ y: "100%" }}
          animate={{ y: 0, transition: { delay: i * 0.1 } }}
        >
          {word + (i !== words.length - 1 ? "\u00A0" : "")}
        </motion.div>
      </div>
    );
  });
}
