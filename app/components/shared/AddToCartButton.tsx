// components/products/AddToCartButton.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useGlobal } from "@/app/contexts/GlobalContext";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  imageUrl?: string;
  author?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  price,
  imageUrl,
  author,
}) => {
  const { cart, addToCart, updateQuantity } = useGlobal();

  // Find current item in cart
  const cartItem = cart.find((item) => item.id === productId);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productName,
      price: price,
      imageUrl: imageUrl,
      author: author,
    });
  };

  const handleIncrement = () => {
    updateQuantity(productId, (cartItem?.quantity || 0) + 1);
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(productId, cartItem.quantity - 1);
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
            className="btn-primary btn-md btn-full relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <ShoppingCart className="w-4 h-4 relative z-10" />
            <span className="relative z-10">যোগ করুন</span>
          </motion.button>
        ) : (
          <motion.div
            key="quantity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="btn-primary py-1"
          >
            <button
              onClick={handleDecrement}
              className="btn-quantity-button hover:bg-white/30 transition-colors relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Minus className="w-4 h-4 relative z-10" />
            </button>

            <span className="btn-quantity-text">{quantity}</span>

            <button
              onClick={handleIncrement}
              className="btn-quantity-button hover:bg-white/30 transition-colors relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Plus className="w-4 h-4 relative z-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddToCartButton;
