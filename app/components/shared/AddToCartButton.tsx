// components/products/AddToCartButton.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  onAddToCart?: (quantity: number) => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  price,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
      setIsAdded(true);
      onAddToCart?.(1);

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart?.(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToCart?.(newQuantity);
    } else {
      setQuantity(0);
      onAddToCart?.(0);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <motion.button
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddToCart}
            className="btn-primary btn-md btn-full"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>কার্টে যোগ হয়েছে</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>যোগ করুন</span>
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="quantity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="btn-quantity"
          >
            <button onClick={handleDecrement} className="btn-quantity-button">
              <Minus className="w-4 h-4" />
            </button>

            <span className="btn-quantity-text">{quantity}</span>

            <button onClick={handleIncrement} className="btn-quantity-button">
              <Plus className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddToCartButton;
