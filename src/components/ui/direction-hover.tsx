"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  /**
  * Determines from which direction a mouse entered an element using angle calculations
  * 
  * How it works:
  * 1. First we get the element's position and size in the viewport
  * 2. Then calculate mouse position relative to element's center 
  * 3. Finally convert this angle to one of four directions (top, right, bottom, left)
  * 
  * Visual example of coordinate system:
  *   Viewport 
  *   +----------------------------------------+
  *   |                                        |
  *   |    Element's getBoundingClientRect():  |
  *   |    +----------------+                  |
  *   |    |   ↑ top (0)   | height: h        |
  *   |    |← left(3) (x,y) right(1)→|        |
  *   |    |  ↓ bottom (2) |                  |
  *   |    +----------------+                  |
  *   |    width: w                           |
  *   +----------------------------------------+
  * 
  * Math breakdown:
  * 1. Element boundaries (getBoundingClientRect):
  *    Returns: {
  *      width: w,    // Element width
  *      height: h,   // Element height
  *      left: x,     // Distance from viewport left
  *      top: y       // Distance from viewport top
  *    }
  * 
  * 2. Calculate normalized (x,y) from center:
  *    For x coordinate:
  *    - Start with mouse position: ev.clientX
  *    - Subtract element's left edge: (ev.clientX - left) 
  *    - Normalize center based on aspect ratio: (w/2) * (w > h ? h/w : 1)
  *    - Final x = ev.clientX - left - (w/2) * (w > h ? h/w : 1)
  *    
  *    For y coordinate:
  *    - Similar process with height: ev.clientY - top - (h/2) * (h > w ? w/h : 1)
  * 
  * 3. Convert (x,y) to angle & direction:
  *    a) Math.atan2(y,x) -> gets angle in radians (-π to π)
  *       - Right = 0 radians
  *       - Bottom = π/2 radians (1.57)
  *       - Left = π radians (3.14) 
  *       - Top = -π/2 radians (-1.57)
  *    
  *    b) Divide by π/2 (1.57079633) to get quarter turns
  *       - Right = 0
  *       - Bottom = 1
  *       - Left = 2 
  *       - Top = -1
  *    
  *    c) Add 5 to make all numbers positive
  *       - Right = 5
  *       - Bottom = 6
  *       - Left = 7
  *       - Top = 4
  *    
  *    d) % 4 maps to final direction
  *       - 4 % 4 = 0 (top)
  *       - 5 % 4 = 1 (right) 
  *       - 6 % 4 = 2 (bottom)
  *       - 7 % 4 = 3 (left)
  * 
  * Example calculation:
  * If mouse enters from right side (x=100, y=0):
  * 1. Math.atan2(0, 100) = 0 radians
  * 2. 0 / 1.57079633 = 0
  * 3. 0 + 5 = 5
  * 4. 5 % 4 = 1 (RIGHT)
  * 
  * @param ev - Mouse event containing cursor position (clientX, clientY)
  * @param obj - DOM element being hovered
  * @returns number - Direction index: 0(top), 1(right), 2(bottom), 3(left)
  */
  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    // Get element's size and position relative to viewport
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();

    // Calculate mouse position relative to element's center
    // For non-square elements, normalize based on aspect ratio to prevent bias
    // w > h ? h/w : 1 scales the center point based on element's shape
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);

    // Convert (x,y) coordinates to an angle in radians using Math.atan2
    // Then convert that angle to a direction number (0,1,2,3):
    // 1. atan2(y,x) gets angle in radians (-π to π)
    // 2. Divide by π/2 (1.57079633) to get quarter turns
    // 3. Add 5 to make all numbers positive
    // 4. % 4 maps to final directions: 0(top), 1(right), 2(bottom), 3(left)
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "bg-transparent rounded-lg overflow-hidden group/card relative h-full",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div className="absolute inset-0 w-full h-full bg-black/30 group-hover/card:bg-black/40 z-10 transition duration-500" />
          <motion.div
            variants={variants}
            className="h-full w-full relative bg-gray-50 dark:bg-black"
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <Image
              alt="image"
              className={cn(
                "h-full w-full object-cover scale-[1.15]",
                imageClassName
              )}
              fill
              src={imageUrl}
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className={cn(
              "text-white absolute bottom-4 left-4 z-40",
              childrenClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const variants = {
  initial: {
    x: 0,
  },
  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 20,
  },
  bottom: {
    y: -20,
  },
  left: {
    x: 20,
  },
  right: {
    x: -20,
  },
};

const textVariants = {
  initial: {
    y: 0,
    x: 0,
    opacity: 1,
  },
  exit: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  top: {
    y: -20,
    opacity: 1,
  },
  bottom: {
    y: 2,
    opacity: 1,
  },
  left: {
    x: -2,
    opacity: 1,
  },
  right: {
    x: 20,
    opacity: 1,
  },
};
