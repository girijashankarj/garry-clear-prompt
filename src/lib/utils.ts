import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Format a Date as DD_MM_YYYY_HH_MM for use in export file names.
 * Example: 09_02_2026_14_35
 */
export function formatExportTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = String(date.getFullYear());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${dd}_${mm}_${yyyy}_${hh}_${min}`;
}

/**
 * Build a timestamped export file name.
 * @param base  Base name without extension, e.g. "prompt-export"
 * @param ext   Extension including dot, e.g. ".md"
 * @returns     e.g. "prompt-export_09_02_2026_14_35.md"
 */
export function getExportFileName(base: string, ext: string): string {
  return `${base}_${formatExportTimestamp()}${ext}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
