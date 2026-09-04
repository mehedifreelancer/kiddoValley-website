// components/shared/SearchModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // মোডাল ওপেন হলে ইনপুটে ফোকাস
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="বই খুঁজুন" size="4xl">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 p-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="বইয়ের নাম দিয়ে খুঁজুন..."
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white/80 dark:bg-black/50 backdrop-blur-sm text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="sm:flex-none"
        >
          <Search className="w-5 h-5 mr-2" />
          খুঁজুন
        </Button>
      </form>
    </Modal>
  );
}
