// providers/StoreProvider.tsx
"use client";

import { store } from "../stores/store";
import { Provider } from 'react-redux'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // @ts-ignore - Temporary fix for Provider type issue
  return <Provider store={store}>{children}</Provider>;
}