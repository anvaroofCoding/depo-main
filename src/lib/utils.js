import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind klasslarini birlashtirish uchun yordamchi funksiya
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
