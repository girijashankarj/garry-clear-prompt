import type { OutputSize } from '@/types/prompt.types';

export interface OutputSizeRange {
  label: string;
  description: string;
  tokenRange: { low: number; high: number };
}

export const OUTPUT_SIZE_RANGES: Record<OutputSize, OutputSizeRange> = {
  xs: {
    label: 'Extra Small',
    description: '5-8 lines, one paragraph',
    tokenRange: { low: 100, high: 250 },
  },
  s: {
    label: 'Small',
    description: 'Bullet points, short list',
    tokenRange: { low: 250, high: 600 },
  },
  m: {
    label: 'Medium',
    description: 'Detailed steps with small code blocks',
    tokenRange: { low: 600, high: 1500 },
  },
  l: {
    label: 'Large',
    description: 'Deep explanation with examples',
    tokenRange: { low: 1500, high: 3000 },
  },
  xl: {
    label: 'Extra Large',
    description: 'Full document with multiple sections',
    tokenRange: { low: 3000, high: 8000 },
  },
};

export const FORMAT_MULTIPLIERS = {
  strictJson: 1.1,
  includeCode: 1.5,
  includeTables: 1.2,
  includeDiagrams: 1.5,
  includeExamples: 1.4,
} as const;
