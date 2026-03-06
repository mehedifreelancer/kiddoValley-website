// store/features/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddToCartPayload, CartItem, CartState } from "./cart.types";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const existing = state.items.find(
        (item: any) => item.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        } as CartItem);
      }
      state.totalQuantity = state.items.reduce(
        (sum: any, item: any) => sum + item.quantity,
        0,
      );
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
