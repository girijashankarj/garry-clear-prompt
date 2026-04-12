/**
 * Semantic prompt suggestions: find similar saved prompts
 * from the version history using keyword-based similarity.
 */

import { getPromptVersions, type PromptVersion } from './versioning';

export interface PromptSuggestion {
  version: PromptVersion;
  similarity: number; // 0-1 score
  matchedKeywords: string[];
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'can',
  'shall',
  'must',
  'need',
  'dare',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'out',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'every',
  'both',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'because',
  'but',
  'and',
  'or',
  'if',
  'while',
  'that',
  'this',
  'these',
  'those',
  'it',
  'its',
  'i',
  'me',
  'my',
  'we',
  'our',
  'you',
  'your',
  'he',
  'she',
  'they',
  'them',
  'his',
  'her',
  'their',
  'what',
  'which',
  'who',
  'whom',
  'about',
  'up',
  'down',
  'also',
  'like',
]);

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function computeSimilarity(
  queryKeywords: Set<string>,
  candidateKeywords: Set<string>
): { score: number; matched: string[] } {
  if (queryKeywords.size === 0 || candidateKeywords.size === 0) {
    return { score: 0, matched: [] };
  }

  const matched: string[] = [];
  for (const kw of queryKeywords) {
    if (candidateKeywords.has(kw)) {
      matched.push(kw);
    }
  }

  // Jaccard-like similarity
  const unionSize = new Set([...queryKeywords, ...candidateKeywords]).size;
  const score = matched.length / unionSize;

  return { score, matched };
}

export function findSimilarPrompts(
  currentText: string,
  maxResults: number = 5,
  mode?: 'basic' | 'advanced'
): PromptSuggestion[] {
  if (!currentText.trim()) return [];

  const versions = getPromptVersions(mode);
  if (versions.length === 0) return [];

  const queryKeywords = extractKeywords(currentText);
  if (queryKeywords.size === 0) return [];

  const results: PromptSuggestion[] = [];

  for (const version of versions) {
    // Don't suggest the exact same text
    if (version.prompt.trim() === currentText.trim()) continue;

    const candidateKeywords = extractKeywords(version.prompt);
    const { score, matched } = computeSimilarity(queryKeywords, candidateKeywords);

    if (score > 0.05 && matched.length >= 1) {
      results.push({
        version,
        similarity: Math.round(score * 100) / 100,
        matchedKeywords: matched,
      });
    }
  }

  // Sort by similarity descending
  results.sort((a, b) => b.similarity - a.similarity);

  return results.slice(0, maxResults);
}
