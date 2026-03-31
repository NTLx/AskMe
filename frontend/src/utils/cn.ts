import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 *
 * 使用 clsx 处理条件类名，使用 tailwind-merge 合并冲突的类名
 *
 * @example
 * cn('px-4 py-2', 'px-6') // 'py-2 px-6' (px-4 被覆盖)
 * cn('text-red-500', condition && 'text-blue-500') // 条件类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}