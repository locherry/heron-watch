import { clsx, type ClassValue } from 'clsx'; 
// `clsx` helps conditionally join class names together
// `ClassValue` is the type accepted by clsx (string, array, object, etc.)

import { twMerge } from 'tailwind-merge'; 
// `tailwind-merge` intelligently merges Tailwind CSS class names
// It resolves conflicts (e.g., "p-2 p-4" → "p-4")

/**
 * Utility function for combining class names
 * - Uses `clsx` to conditionally build a class string
 * - Uses `twMerge` to handle Tailwind CSS class conflicts
 * 
 * Example:
 * cn('p-2', condition && 'bg-red-500', 'p-4') → "bg-red-500 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param string - The input text
 * @returns The same string but with the first character uppercase
 * 
 * Example:
 * capitalizeFirst('hello') → "Hello"
 */
export function capitalizeFirst(string: string): string {
  if (typeof string !== 'string' || string.length === 0) return string; // Guard clause
  return string.charAt(0).toUpperCase() + string.slice(1); // Capitalize first letter
}
