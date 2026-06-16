"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: Number(i) * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

type AnimateOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function AnimateOnScroll({ children, className, delay = 0, id }: AnimateOnScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type AnimateOnMountProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimateOnMount({ children, className, delay = 0 }: AnimateOnMountProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionCard({ children, className, delay = 0 }: MotionCardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}
