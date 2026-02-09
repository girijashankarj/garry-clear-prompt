import { ratePrompt } from './prompt-rater';
import type { PromptRating } from '@/types/prompt.types';

export interface PromptImprovement {
  original: string;
  improved: string;
  originalRating: PromptRating;
  improvedRating: PromptRating;
  changes: string[];
}

export function improvePrompt(text: string): PromptImprovement {
  if (!text.trim()) {
    const emptyRating = ratePrompt('');
    return { original: text, improved: '', originalRating: emptyRating, improvedRating: emptyRating, changes: [] };
  }

  let improved = text.trim();
  const changes: string[] = [];

  // 1. Remove filler / conversational padding
  const fillerPatterns = [
    { pattern: /\b(please|kindly)\s+/gi, label: 'Removed filler: "please/kindly"' },
    { pattern: /\bi think\s+/gi, label: 'Removed hedge: "I think"' },
    { pattern: /\b(maybe|perhaps)\s+/gi, label: 'Removed hedge: "maybe/perhaps"' },
    { pattern: /\bi want you to\s+/gi, label: 'Removed padding: "I want you to"' },
    { pattern: /\bi need you to\s+/gi, label: 'Removed padding: "I need you to"' },
    { pattern: /\bcould you (please\s+)?/gi, label: 'Removed padding: "could you"' },
    { pattern: /\bcan you help me\s+(to\s+)?/gi, label: 'Removed padding: "can you help me"' },
    { pattern: /\bwould you mind\s+/gi, label: 'Removed padding: "would you mind"' },
  ];

  for (const { pattern, label } of fillerPatterns) {
    if (pattern.test(improved)) {
      improved = improved.replace(pattern, '');
      changes.push(label);
    }
  }

  // 2. Capitalize first letter after cleanup
  improved = improved.replace(/^\s*\w/, (c) => c.toUpperCase());

  // 3. Add output format if missing
  const hasFormat = /\b(bullet|list|table|json|markdown|steps|format|structured|numbered)\b/i.test(improved);
  if (!hasFormat) {
    improved += '\n\nProvide the response in a clear, structured format.';
    changes.push('Added output format instruction');
  }

  // 4. Add length constraint if missing
  const hasLength = /\b(\d+\s*(points?|items?|sentences?|words?|lines?)|max|limit|brief|concise)\b/i.test(improved);
  if (!hasLength) {
    improved += '\nKeep the response concise.';
    changes.push('Added length constraint');
  }

  // 5. Add audience if missing and prompt is complex
  const wordCount = improved.trim().split(/\s+/).length;
  const hasAudience = /\b(for a|audience|reader|beginner|expert|senior|junior|non-technical|technical)\b/i.test(improved);
  if (wordCount > 20 && !hasAudience) {
    // Don't add audience for simple prompts -- it would feel forced
    changes.push('Consider specifying your target audience');
  }

  // Clean up extra whitespace
  improved = improved.replace(/\n{3,}/g, '\n\n').trim();

  const originalRating = ratePrompt(text);
  const improvedRating = ratePrompt(improved);

  return {
    original: text.trim(),
    improved,
    originalRating,
    improvedRating,
    changes,
  };
}
