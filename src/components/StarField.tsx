"use client";

import React, { useEffect, useState } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

export function StarField({ intensity = "normal" }: { intensity?: "normal" | "high" }) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const count = intensity === "high" ? 150 : 80;
    const newStars = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, [intensity]);

  return (
    <div className="star-container pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--duration": star.duration,
            animationDelay: star.delay,
            backgroundColor: intensity === "high" ? "#D8B4FE" : "white",
            boxShadow: intensity === "high" ? "0 0 10px #D8B4FE" : "none",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}