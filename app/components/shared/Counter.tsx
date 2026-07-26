// components/shared/Counter.tsx
"use client";

import { Minus, Plus } from "lucide-react";

interface CounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function Counter({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  className = "",
}: CounterProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  return (
    <div
      className={`flex items-center border border-stone-200 dark:border-dark-border rounded-lg overflow-hidden ${className}`}
    >
      <button
        onClick={onDecrement}
        disabled={isMin}
        className={`p-2 transition-colors ${
          isMin
            ? "text-stone-300 dark:text-stone-600 cursor-not-allowed"
            : "hover:bg-stone-100 dark:hover:bg-dark-elevated text-stone-600 dark:text-stone-400"
        }`}
        aria-label="Decrease quantity"
      >
        <Minus size={18} />
      </button>
      <span className="w-12 text-center font-medium text-stone-800 dark:text-stone-200">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={isMax}
        className={`p-2 transition-colors ${
          isMax
            ? "text-stone-300 dark:text-stone-600 cursor-not-allowed"
            : "hover:bg-stone-100 dark:hover:bg-dark-elevated text-stone-600 dark:text-stone-400"
        }`}
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
