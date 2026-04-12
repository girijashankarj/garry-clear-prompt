import type { LintSeverity } from '@/types/prompt.types';

export interface LintRuleDefinition {
  id: string;
  name: string;
  severity: LintSeverity;
  description: string;
  suggestion: string;
  check: (text: string) => boolean;
}

export const LINT_RULES: LintRuleDefinition[] = [
  {
    id: 'missing-goal',
    name: 'Missing clear goal',
    severity: 'error',
    description: 'Prompt does not state a clear objective or task',
    suggestion: 'Start with a clear action: "Generate...", "Explain...", "Create...", "Compare..."',
    check: (text: string) => text.trim().length < 10,
  },
  {
    id: 'too-vague',
    name: 'Overly vague language',
    severity: 'warning',
    description: 'Uses vague words like "everything", "anything", "all about", "in detail"',
    suggestion: 'Be specific about what you want. Replace "everything" with exact items.',
    check: (text: string) =>
      /\b(everything|anything|all about|in detail|tell me more|explain fully)\b/i.test(text),
  },
  {
    id: 'no-output-format',
    name: 'Missing output format',
    severity: 'warning',
    description: 'No output format specified (bullets, table, JSON, steps, etc.)',
    suggestion: 'Specify the desired format: "in bullet points", "as a table", "in JSON format"',
    check: (text: string) =>
      !/\b(bullet|list|table|json|markdown|steps|format|structured|numbered)\b/i.test(text),
  },
  {
    id: 'no-length-constraint',
    name: 'No length constraint',
    severity: 'info',
    description: 'No length or size limit specified for the output',
    suggestion: 'Add a limit: "in 5 points", "max 3 sentences", "under 200 words"',
    check: (text: string) =>
      !/\b(\d+\s*(points?|items?|sentences?|words?|lines?|paragraphs?|bullet)|\bmax\b|\blimit\b|\bbrief\b|\bconcise\b|\bshort\b)\b/i.test(
        text
      ),
  },
  {
    id: 'conflicting-instructions',
    name: 'Potentially conflicting instructions',
    severity: 'warning',
    description: 'Contains contradictory instructions like "brief" and "detailed"',
    suggestion: 'Choose one level of detail. Remove conflicting modifiers.',
    check: (text: string) => {
      const hasBrief = /\b(brief|short|concise)\b/i.test(text);
      const hasDetailed = /\b(detailed|comprehensive|thorough|exhaustive)\b/i.test(text);
      return hasBrief && hasDetailed;
    },
  },
  {
    id: 'too-many-tasks',
    name: 'Multiple tasks in one prompt',
    severity: 'warning',
    description: 'Prompt asks for many different things at once',
    suggestion: 'Focus on one task per prompt. Split complex requests into separate prompts.',
    check: (text: string) => {
      const actionWords = text.match(
        /\b(create|generate|explain|write|build|design|analyze|compare|list|summarize)\b/gi
      );
      return (actionWords?.length ?? 0) > 3;
    },
  },
  {
    id: 'emotional-language',
    name: 'Emotional or filler language',
    severity: 'info',
    description: 'Contains emotional or conversational filler that wastes tokens',
    suggestion: 'Remove filler like "please", "I think", "maybe". Be direct.',
    check: (text: string) =>
      /\b(please|i think|maybe|perhaps|i guess|could you|would you mind|i need you to|i want you to)\b/i.test(
        text
      ),
  },
  {
    id: 'repetition',
    name: 'Repetitive content',
    severity: 'warning',
    description: 'Same idea repeated in different words',
    suggestion: 'Say it once, clearly. Remove duplicate instructions.',
    check: (text: string) => {
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
      if (sentences.length < 2) return false;
      for (let i = 0; i < sentences.length; i++) {
        for (let j = i + 1; j < sentences.length; j++) {
          const wordsA = new Set(sentences[i].toLowerCase().split(/\s+/));
          const wordsB = new Set(sentences[j].toLowerCase().split(/\s+/));
          const intersection = [...wordsA].filter((w) => wordsB.has(w) && w.length > 3);
          const overlap = intersection.length / Math.min(wordsA.size, wordsB.size);
          if (overlap > 0.6) return true;
        }
      }
      return false;
    },
  },
  {
    id: 'missing-audience',
    name: 'No audience specified',
    severity: 'info',
    description: 'Does not specify who the output is for',
    suggestion:
      'Add audience context: "for a beginner", "for a senior developer", "for management"',
    check: (text: string) =>
      !/\b(for a|audience|reader|beginner|expert|senior|junior|non-technical|technical|team|manager|child|student)\b/i.test(
        text
      ),
  },
  {
    id: 'open-ended',
    name: 'Open-ended request',
    severity: 'warning',
    description: 'Request is too open-ended without clear boundaries',
    suggestion: 'Add constraints: scope, count, domain, timeframe, or specific aspects to cover.',
    check: (text: string) => {
      const isShort = text.trim().split(/\s+/).length < 8;
      const hasQuestion = /\?/.test(text);
      const isOpenEnded = /\b(what do you think|tell me about|how does|what is)\b/i.test(text);
      return isShort && (hasQuestion || isOpenEnded);
    },
  },
  {
    id: 'absolutist-language',
    name: 'Absolutist language',
    severity: 'info',
    description: 'Uses absolutist words like "always", "never", "must" that may be too rigid',
    suggestion:
      'Consider if absolute constraints are truly needed. Use "prefer" or "when possible" for flexibility.',
    check: (text: string) => {
      const absoluteCount = (
        text.match(/\b(always|never|must|absolutely|every single|without exception)\b/gi) || []
      ).length;
      return absoluteCount >= 3;
    },
  },
  {
    id: 'security-risk-secrets',
    name: 'Potential secret exposure',
    severity: 'error',
    description: 'Prompt may include or request secrets, API keys, or credentials',
    suggestion: 'Never include real credentials. Use placeholders like [API_KEY] or [PASSWORD].',
    check: (text: string) =>
      /\b(api[_\s]?key|password|secret|credential|token|private[_\s]?key|access[_\s]?key)\b/i.test(
        text
      ) && !/\bplaceholder\b/i.test(text),
  },
  {
    id: 'security-risk-pii',
    name: 'Potential PII in prompt',
    severity: 'error',
    description: 'Prompt may contain personally identifiable information',
    suggestion: 'Remove real names, emails, phone numbers. Use anonymized data.',
    check: (text: string) =>
      /\b[\w.-]+@[\w.-]+\.\w{2,}\b/.test(text) || /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text),
  },
  {
    id: 'no-examples',
    name: 'No examples provided',
    severity: 'info',
    description: 'Complex request without examples may lead to unexpected output',
    suggestion: 'Add 1-2 examples of expected input/output for better accuracy.',
    check: (text: string) => {
      const isComplex = text.trim().split(/\s+/).length > 30;
      const hasExample = /\b(example|for instance|such as|e\.g\.|like this|sample)\b/i.test(text);
      return isComplex && !hasExample;
    },
  },
  {
    id: 'prompt-injection-risk',
    name: 'Prompt injection pattern',
    severity: 'error',
    description: 'Contains patterns that look like prompt injection attempts',
    suggestion: 'Remove system-level instructions. Focus on the actual task.',
    check: (text: string) =>
      /\b(ignore previous|ignore all|disregard|forget everything|system prompt|you are now|act as root|override)\b/i.test(
        text
      ),
  },
];
