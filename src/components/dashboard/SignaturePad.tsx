"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface SignaturePadProps {
  onSignature: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export default function SignaturePad({ onSignature, disabled }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return { canvas, ctx };
  }, []);

  useEffect(() => {
    const result = getCtx();
    if (!result) return;
    const { canvas, ctx } = result;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set style
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [getCtx]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const result = getCtx();
    if (!result) return;
    const { ctx } = result;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const result = getCtx();
    if (!result) return;
    const { ctx } = result;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (canvas) {
      onSignature(canvas.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const result = getCtx();
    if (!result) return;
    const { canvas, ctx } = result;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    setHasSignature(false);
    onSignature(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Your Signature
        </label>
        {hasSignature && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors"
          >
            <RotateCcw size={12} /> Clear
          </button>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          className="w-full bg-white cursor-crosshair touch-none"
          style={{ height: "160px" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-sm">Draw your signature here</span>
          </div>
        )}
      </div>
    </div>
  );
}
