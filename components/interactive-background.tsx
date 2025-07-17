"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, Coins, CreditCard, Banknote } from "lucide-react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: "dollar" | "coin" | "card" | "banknote";
  color: string;
  initialX: number;
  initialY: number;
}

function generateFloatingData(length: number) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const floatings = [];
  for (let i = 0; i < length; i += 1) {
    floatings.push({
      from: {
        x: Math.random() * width,
        y: Math.random() * height,
      },
      to: {
        x: Math.random() * width,
        y: Math.random() * height,
      },
      duration: 8 + Math.random() * 4,
    });
  }
  return floatings;
}

export function InteractiveBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [floaters, setFloaters] = useState<
    ReturnType<typeof generateFloatingData>
  >([]);
  useEffect(() => {
    setFloaters(generateFloatingData(15));
  }, []);
  // Initialize floating elements
  useEffect(() => {
    const createElements = () => {
      const newElements: FloatingElement[] = [];
      const types: FloatingElement["type"][] = [
        "dollar",
        "coin",
        "card",
        "banknote",
      ];
      const colors = [
        "text-orange-300/20",
        "text-amber-300/20",
        "text-yellow-300/20",
        "text-green-300/20",
        "text-emerald-300/20",
        "text-teal-300/20",
      ];

      for (let i = 0; i < 25; i++) {
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
          color: colors[Math.floor(Math.random() * colors.length)],
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
  }, []);

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

  const getIcon = (type: FloatingElement["type"]) => {
    switch (type) {
      case "dollar":
        return DollarSign;
      case "coin":
        return Coins;
      case "card":
        return CreditCard;
      case "banknote":
        return Banknote;
      default:
        return DollarSign;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {elements.map((element) => {
        const Icon = getIcon(element.type);
        const position = calculatePosition(element);

        return (
          <motion.div
            key={element.id}
            className={`absolute ${element.color}`}
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
              <Icon size={element.size} className="drop-shadow-sm" />
            </motion.div>
          </motion.div>
        );
      })}
      {/* Floating particles */}
      {floaters.map((f, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-orange-300/30 rounded-full"
          initial={f.from}
          animate={{
            ...f.to,
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: f.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
