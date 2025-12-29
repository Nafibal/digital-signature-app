"use client";

import { useState, useEffect, RefObject } from "react";
import { SignaturePosition } from "../../types";
import Image from "next/image";

interface DraggableSignatureProps {
  signatureImage: string;
  position: SignaturePosition;
  onDrag: (x: number, y: number) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  width?: number;
  height?: number;
}

/**
 * Draggable Signature Component
 *
 * Allows users to drag a signature image to desired position on PDF preview
 *
 * Features:
 * - Window-level mouse events for smooth dragging
 * - Constrained to container bounds
 * - Visual feedback during drag (opacity change)
 */
export default function DraggableSignature({
  signatureImage,
  position,
  onDrag,
  containerRef,
  width = 400,
  height = 150,
}: DraggableSignatureProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Use window-level event listeners for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - offset.x;
      const newY = e.clientY - containerRect.top - offset.y;

      onDrag(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, onDrag, containerRef]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Image
        src={signatureImage}
        alt="Signature"
        className="w-full h-full object-contain"
        draggable={false}
        width={width}
        height={height}
      />
    </div>
  );
}
