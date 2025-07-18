"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, Coins, CreditCard, Banknote } from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { tokenIcons } from "./create-gateway";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: keyof typeof tokenIcons;
  initialX: number;
  initialY: number;
}

export function InteractiveBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Initialize floating elements
  useEffect(() => {
    const createElements = () => {
      const newElements: FloatingElement[] = [];
      const types: FloatingElement["type"][] = ["ETH", "USDC", "LISK"];

      for (let i = 0; i < (isMobile ? 10 : 25); i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        newElements.push({
          id: i,
          x,
          y,
          initialX: x,
          initialY: y,
          size: Math.random() * 30 + 20,
          rotation: Math.random() * 360,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      setElements(newElements);
    };

    createElements();

    const handleResize = () => {
      createElements();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate distance and apply repulsion effect
  const calculatePosition = (element: FloatingElement) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - element.x, 2) +
        Math.pow(mousePosition.y - element.y, 2)
    );

    const repulsionRadius = 150;
    const maxOffset = 80;

    if (distance < repulsionRadius && distance > 0) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      const angle = Math.atan2(
        element.y - mousePosition.y,
        element.x - mousePosition.x
      );

      const offsetX = Math.cos(angle) * force * maxOffset;
      const offsetY = Math.sin(angle) * force * maxOffset;

      return {
        x: element.initialX + offsetX,
        y: element.initialY + offsetY,
      };
    }

    return {
      x: element.initialX,
      y: element.initialY,
    };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden bg-orange-100"
      style={{ zIndex: 1 }}
    >
      {elements.map((element) => {
        const position = calculatePosition(element);

        return (
          <motion.div
            key={element.id}
            className="absolute"
            initial={{
              x: element.initialX,
              y: element.initialY,
              rotate: element.rotation,
            }}
            animate={{
              x: position.x,
              y: position.y,
              rotate:
                element.rotation +
                Math.sin(Date.now() * 0.001 + element.id) * 10,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              mass: 1,
            }}
            style={{
              width: element.size,
              height: element.size,
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            >
              <img
                className="rounded-full overflow-hidden"
                src={tokenIcons[element.type]}
                alt={element.type}
                style={{
                  width: element.size,
                  height: element.size,
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
