/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  delay?: number;
  scale?: number;
  blur?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  duration = 0.6,
  delay = 0,
  scale = 1,
  blur = false,
}) => {
  const getVariants = () => {
    let x = 0;
    let y = 0;

    if (direction === 'up') y = 50;
    if (direction === 'down') y = -50;
    if (direction === 'left') x = 50;
    if (direction === 'right') x = -50;

    return {
      hidden: {
        opacity: 0,
        x,
        y,
        scale: scale !== 1 ? scale : undefined,
        filter: blur ? 'blur(10px)' : undefined,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration,
          delay,
          ease: [0.23, 1, 0.32, 1], // premium custom cubic-bezier
        },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
};
