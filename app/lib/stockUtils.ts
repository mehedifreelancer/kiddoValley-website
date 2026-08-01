import { CartItem } from "../contexts/GlobalContext";
import { checkBulkStock, checkSingleStock } from "../services/cart.service";

export interface StockCheckResult {
  stockId: number;
  available: boolean;
  currentQty: number;
  productName: string;
  message: string;
}

/**
 * একটি নির্দিষ্ট স্টকের জন্য চেক করুন (কার্টে যোগ করার সময়)
 */
export const checkStockForAdd = async (
  stockId: number,
  quantityToAdd: number = 1,
  existingCartItems: CartItem[] = [],
): Promise<StockCheckResult> => {
  const existingQuantity = existingCartItems
    .filter((item) => item.stockId === stockId)
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalRequested = existingQuantity + quantityToAdd;
  return await checkSingleStock(stockId, totalRequested);
};

/**
 * বাল্ক স্টক চেক (চেকআউটের আগে)
 */
export const checkBulkStockForCheckout = async (
  cartItems: CartItem[],
): Promise<StockCheckResult[]> => {
  const items = cartItems.map((item) => ({
    stockId: item.stockId,
    quantity: item.quantity,
  }));
  return await checkBulkStock(items);
};

/**
 * চেকের ফলাফল থেকে অশুদ্ধ আইটেমের তালিকা তৈরি করা
 */
export const getUnavailableItemsList = (
  results: StockCheckResult[],
  cart: CartItem[],
): string[] => {
  return results
    .filter((r) => !r.available)
    .map((r) => {
      const cartItem = cart.find((item) => item.stockId === r.stockId);
      const variantLabel = cartItem?.variant?.attributes
        ? Object.entries(cartItem.variant.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "";
      const displayName = cartItem?.name || r.productName;
      const attrStr = variantLabel ? ` (${variantLabel})` : "";
      const stockMsg =
        r.currentQty === 0
          ? "স্টক শেষ"
          : `শুধুমাত্র ${r.currentQty}টি স্টকে আছে`;
      return `${displayName}${attrStr}: ${stockMsg}`;
    });
};
