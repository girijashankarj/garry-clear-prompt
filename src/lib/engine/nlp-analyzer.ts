import nlp from 'compromise';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

export type PromptIntent = 'question' | 'instruction' | 'description' | 'comparison' | 'unknown';
export type ComplexityLevel = 'simple' | 'moderate' | 'complex';

export interface NlpAnalysis {
  intent: PromptIntent;
  complexity: ComplexityLevel;
  sentenceCount: number;
  wordCount: number;
  avgWordsPerSentence: number;
  questionCount: number;
  verbCount: number;
  nounCount: number;
  adjectiveCount: number;
  topNouns: string[];
  topVerbs: string[];
  hasList: boolean;
  hasConditional: boolean;
  hasNegation: boolean;
  readabilityGrade: number; // Flesch-Kincaid approx
}

function detectIntent(doc: ReturnType<typeof nlp>, text: string): PromptIntent {
  const questionMarks = (text.match(/\?/g) || []).length;
  const sentences = doc.sentences().length || 1;

  // If more than half of sentences are questions
  if (questionMarks > 0 && questionMarks >= sentences * 0.5) {
    return 'question';
  }

  // Check for comparison keywords
  if (/\b(compare|versus|vs\.?|difference between|pros and cons|better than)\b/i.test(text)) {
    return 'comparison';
  }

  // Check for imperative mood (starts with verb)
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() || '';
  const imperativeStarters = [
    'create',
    'generate',
    'write',
    'build',
    'design',
    'implement',
    'explain',
    'describe',
    'list',
    'summarize',
    'analyze',
    'review',
    'fix',
    'optimize',
    'convert',
    'translate',
    'refactor',
    'debug',
    'add',
    'remove',
    'update',
    'delete',
    'deploy',
    'test',
    'make',
    'show',
    'find',
    'search',
    'get',
    'set',
    'configure',
    'help',
  ];
  if (imperativeStarters.includes(firstWord)) {
    return 'instruction';
  }

  // If has descriptive language
  if (/\b(is|are|was|were|about|overview|introduction|what is)\b/i.test(text)) {
    return 'description';
  }

  return 'instruction'; // default for prompts
}

function calculateComplexity(
  analysis: Omit<NlpAnalysis, 'complexity' | 'intent'>
): ComplexityLevel {
  let score = 0;

  if (analysis.wordCount > 80) score += 2;
  else if (analysis.wordCount > 30) score += 1;

  if (analysis.sentenceCount > 5) score += 2;
  else if (analysis.sentenceCount > 2) score += 1;

  if (analysis.avgWordsPerSentence > 20) score += 1;
  if (analysis.questionCount > 2) score += 1;
  if (analysis.hasConditional) score += 1;
  if (analysis.hasList) score += 1;
  if (analysis.nounCount > 10) score += 1;

  if (score >= 5) return 'complex';
  if (score >= 2) return 'moderate';
  return 'simple';
}

function fleschKincaidGrade(text: string): number {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  if (wordCount === 0) return 0;

  const sentenceCount = Math.max(1, (text.match(/[.!?]+/g) || []).length);

  // Approximate syllable count
  let syllableCount = 0;
  for (const word of words) {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length <= 3) {
      syllableCount += 1;
    } else {
      const vowelGroups = cleaned.match(/[aeiouy]+/g) || [];
      let count = vowelGroups.length;
      if (cleaned.endsWith('e') && count > 1) count--;
      syllableCount += Math.max(1, count);
    }
  }

  // Flesch-Kincaid Grade Level
  const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

export function analyzePromptNlp(text: string): NlpAnalysis {
  if (!text.trim()) {
    return {
      intent: 'unknown',
      complexity: 'simple',
      sentenceCount: 0,
      wordCount: 0,
      avgWordsPerSentence: 0,
      questionCount: 0,
      verbCount: 0,
      nounCount: 0,
      adjectiveCount: 0,
      topNouns: [],
      topVerbs: [],
      hasList: false,
      hasConditional: false,
      hasNegation: false,
      readabilityGrade: 0,
    };
  }

  const doc = nlp(text);

  const sentenceCount = Math.max(1, doc.sentences().length);
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

  const questionCount = (text.match(/\?/g) || []).length;

  const nouns = doc.nouns().out('array') as string[];
  const verbs = doc.verbs().out('array') as string[];
  const adjectives = doc.adjectives().out('array') as string[];

  const hasList = /^[\s]*[-*•]\s+/m.test(text) || /^\s*\d+[.)]\s+/m.test(text);
  const hasConditional = /\b(if|when|unless|provided|assuming|given that|in case)\b/i.test(text);
  const hasNegation = /\b(not|no|don't|doesn't|won't|can't|never|without|neither|nor)\b/i.test(
    text
  );

  // Frequency-ranked unique nouns/verbs
  const topNouns = [...new Set(nouns.map((n) => n.toLowerCase()))].slice(0, 5);
  const topVerbs = [...new Set(verbs.map((v) => v.toLowerCase()))].slice(0, 5);

  const partial = {
    sentenceCount,
    wordCount,
    avgWordsPerSentence,
    questionCount,
    verbCount: verbs.length,
    nounCount: nouns.length,
    adjectiveCount: adjectives.length,
    topNouns,
    topVerbs,
    hasList,
    hasConditional,
    hasNegation,
    readabilityGrade: fleschKincaidGrade(text),
  };

  const result = {
    ...partial,
    intent: detectIntent(doc, text),
    complexity: calculateComplexity(partial),
  };

  loggerDebug(
    DEBUG_MESSAGES.NLP_COMPLETE,
    { intent: result.intent, complexity: result.complexity, wordCount: result.wordCount },
    'engine',
    'nlp-analyzer.ts',
    'analyzePromptNlp'
  );
  return result;
}
