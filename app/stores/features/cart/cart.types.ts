// app/stores/features/cart.types.ts
export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  // Add any other properties your cart items need
}

export interface CartItem extends AddToCartPayload {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
}
