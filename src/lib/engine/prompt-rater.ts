import type {
  PromptRating,
  PromptRatingDimensionHints,
  RatingDimension,
  RatingBand,
  RatePromptOptions,
  PromptSectionCoverage,
} from '@/types/prompt.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { INFO_MESSAGES } from '@/common/messages/info';
import {
  RATING_SUGGESTION_ACTION_VERB,
  RATING_SUGGESTION_OUTPUT_FORMAT,
  RATING_SUGGESTION_LENGTH,
  RATING_SUGGESTION_SECTIONS,
  RATING_SUGGESTION_TOKEN,
  RATING_SUGGESTION_SCOPE,
  RATING_SUGGESTION_AUDIENCE,
  RATING_SUGGESTION_EXCELLENT,
  RATING_SUGGESTION_COMPARISON_INTENT,
  RATING_SUGGESTION_QUESTION_INTENT,
} from '@/common/messages/rating-suggestions';

const EMPTY_SECTION_COVERAGE: PromptSectionCoverage = {
  goal: false,
  context: false,
  constraints: false,
  output: false,
};

/** Stable non-negative hash for picking suggestion variants. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

function pickVariant(pool: readonly string[], seed: string): string {
  if (pool.length === 0) return '';
  return pool[hashString(seed) % pool.length] ?? pool[0];
}

/** Detect labeled or builder-implied sections in the rated / effective prompt. */
export function detectSectionCoverage(text: string): PromptSectionCoverage {
  if (!text.trim()) {
    return { ...EMPTY_SECTION_COVERAGE };
  }
  const t = text;

  const labeledGoal =
    /\b(task|objective|goal)\s*:/im.test(t) || /^#{1,3}\s*(task|objective|goal)\b/im.test(t);
  const implicitGoal = (() => {
    const first =
      t
        .trim()
        .split(/\n\s*\n/)[0]
        ?.trim() ?? '';
    return (
      first.length >= 12 &&
      /\b(create|explain|list|write|build|design|analyze|compare|summarize|implement|fix|describe|generate|refactor|debug|draft|outline|propose|evaluate|translate)\b/i.test(
        first
      )
    );
  })();

  const context =
    /\b(context|background|given)\s*:/im.test(t) ||
    /^#{1,3}\s*context\b/im.test(t) ||
    /\b(assuming|given that)\b/i.test(t);

  const constraints =
    /\b(constraints|rules|requirements)\s*:/im.test(t) ||
    /^#{1,3}\s*(constraints|rules|requirements)\b/im.test(t) ||
    /rules to follow:/i.test(t);

  const output =
    /\b(output|deliverable)\s*:/im.test(t) ||
    /^#{1,3}\s*output\b/im.test(t) ||
    /\boutput format:/i.test(t) ||
    /present the response as/i.test(t) ||
    /return the output in strict/i.test(t) ||
    /keep the response (brief|concise|moderately|thorough)/i.test(t) ||
    /\b(numbered steps|bullet points?|as a table|in json|valid json)\b/i.test(t);

  return {
    goal: labeledGoal || implicitGoal,
    context,
    constraints,
    output,
  };
}

interface GapSignals {
  hasExplicitOutputFormat: boolean;
  hasLengthLimit: boolean;
  sectionCoverage: PromptSectionCoverage;
  sectionLabelCount: number;
}

function buildGapSignals(text: string): GapSignals {
  const trimmed = text.trim();
  const sectionCoverage = detectSectionCoverage(trimmed);
  const sectionLabelCount = [
    sectionCoverage.goal,
    sectionCoverage.context,
    sectionCoverage.constraints,
    sectionCoverage.output,
  ].filter(Boolean).length;

  const hasExplicitOutputFormat =
    /\b(bullet|bullets|numbered list|as a table|in json|valid json|strict json|markdown|yaml|csv|xml|steps|format\s*:|structured|one table)\b/i.test(
      trimmed
    ) || /```json/.test(trimmed);

  const hasLengthLimit =
    /\b(\d+\s*(points?|items?|sentences?|words?|lines?|paragraphs?|bullets?)|max\s*\d+|limit|brief|concise|short|under\s+\d+|exactly\s+\d+)\b/i.test(
      trimmed
    );

  return {
    hasExplicitOutputFormat,
    hasLengthLimit,
    sectionCoverage,
    sectionLabelCount,
  };
}

function appendConstraintFeedback(base: string, gaps: GapSignals, score: number): string {
  if (score >= 15) return base;
  const miss: string[] = [];
  if (!gaps.hasExplicitOutputFormat) miss.push('explicit output shape');
  if (!gaps.hasLengthLimit) miss.push('length bound');
  if (miss.length === 0) return base;
  return `${base} — Missing: ${miss.slice(0, 2).join('; ')}.`;
}

function appendStructureFeedback(base: string, cov: PromptSectionCoverage, score: number): string {
  if (score >= 15) return base;
  const miss: string[] = [];
  if (!cov.goal) miss.push('goal');
  if (!cov.context) miss.push('context');
  if (!cov.constraints) miss.push('constraints');
  if (!cov.output) miss.push('output');
  if (miss.length === 0) return base;
  return `${base} — Consider labeled sections for: ${miss.slice(0, 3).join(', ')}.`;
}

function rateClarity(text: string): RatingDimension {
  let score = 0;
  const maxScore = 25;

  if (
    /^(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize|translate|describe|evaluate)/i.test(
      text.trim()
    )
  ) {
    score += 8;
  } else if (
    /\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review)\b/i.test(
      text
    )
  ) {
    score += 4;
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount >= 10 && wordCount <= 200) {
    score += 5;
  } else if (wordCount >= 5) {
    score += 3;
  }

  const vagueWords = (
    text.match(/\b(everything|anything|all about|stuff|things|whatever|somehow)\b/gi) || []
  ).length;
  if (vagueWords === 0) {
    score += 5;
  } else if (vagueWords <= 1) {
    score += 2;
  }

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
  if (sentences.length >= 1) {
    score += 4;
  }

  const actionVerbs = (
    text.match(
      /\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize)\b/gi
    ) || []
  ).length;
  if (actionVerbs === 1) {
    score += 3;
  } else if (actionVerbs <= 2) {
    score += 1;
  }

  const feedback =
    score >= 20
      ? 'Goal is clear and specific'
      : score >= 12
        ? 'Goal is somewhat clear but could be more specific'
        : 'Goal is unclear or too vague. Start with a specific action.';

  return { name: 'Clarity', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateConstraints(text: string): RatingDimension {
  let score = 0;
  const maxScore = 20;

  if (
    /\b(bullet|list|table|json|markdown|steps|format|structured|numbered|csv|yaml|xml)\b/i.test(
      text
    )
  ) {
    score += 6;
  }

  if (
    /\b(\d+\s*(points?|items?|sentences?|words?|lines?|paragraphs?|bullet)|max|limit|brief|concise|short|under \d+)\b/i.test(
      text
    )
  ) {
    score += 5;
  }

  if (
    /\b(do not|don't|avoid|must not|should not|never|without|exclude|skip|no\s+\w+ing)\b/i.test(
      text
    )
  ) {
    score += 4;
  }

  if (/\b(must|should|require|include|always|ensure|make sure)\b/i.test(text)) {
    score += 3;
  }

  if (/\b(only|focus on|limited to|specifically|scope|within)\b/i.test(text)) {
    score += 2;
  }

  const feedback =
    score >= 15
      ? 'Well-constrained with clear boundaries'
      : score >= 8
        ? 'Some constraints present, consider adding output format or length limits'
        : 'Missing constraints. Add output format, length limits, or do/dont rules.';

  return { name: 'Constraints', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateStructure(text: string): RatingDimension {
  let score = 0;
  const maxScore = 20;

  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length >= 3) {
    score += 5;
  } else if (lines.length >= 2) {
    score += 3;
  }

  if (
    /\b(goal|context|rules|output|format|constraints|audience|background|requirements)\s*:/i.test(
      text
    )
  ) {
    score += 6;
  }

  if (/^[\s]*[-*•]\s+/m.test(text) || /^[\s]*\d+[.)]\s+/m.test(text)) {
    score += 4;
  }

  if (text.includes('\n\n')) {
    score += 3;
  }

  const hasContext = /\b(context|background|given|assuming)\b/i.test(text);
  if (hasContext) {
    score += 2;
  }

  const feedback =
    score >= 15
      ? 'Well-structured with clear sections'
      : score >= 8
        ? 'Some structure present. Consider adding labeled sections.'
        : 'Lacks structure. Break into sections: Goal, Context, Constraints, Output format.';

  return { name: 'Structure', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateTokenEfficiency(text: string): RatingDimension {
  let score = 20;
  const maxScore = 20;

  const fillerCount = (
    text.match(
      /\b(please|kindly|i think|maybe|perhaps|i guess|basically|actually|really|very|just|quite|rather|somewhat)\b/gi
    ) || []
  ).length;
  score -= Math.min(fillerCount * 1.5, 6);

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length >= 2) {
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const wordsA = new Set(sentences[i].toLowerCase().split(/\s+/));
        const wordsB = new Set(sentences[j].toLowerCase().split(/\s+/));
        const intersection = [...wordsA].filter((w) => wordsB.has(w) && w.length > 3);
        const overlap = intersection.length / Math.min(wordsA.size, wordsB.size);
        if (overlap > 0.6) score -= 3;
      }
    }
  }

  if (
    /\b(i want you to|i need you to|could you please|would you mind|can you help me)\b/i.test(text)
  ) {
    score -= 3;
  }

  const wordCount = text.trim().split(/\s+/).length;
  const lineCount = text.split('\n').filter((l) => l.trim()).length;
  if (wordCount > 100 && lineCount <= 2) {
    score -= 4;
  }

  const finalScore = Math.max(0, Math.round(score));

  const feedback =
    finalScore >= 16
      ? 'Token-efficient and concise'
      : finalScore >= 10
        ? 'Some token waste detected. Remove filler and repetition.'
        : 'Significant token waste. Trim filler words, repetition, and conversational padding.';

  return { name: 'Token Efficiency', score: Math.min(finalScore, maxScore), maxScore, feedback };
}

function calculateRiskPenalty(text: string): RatingDimension {
  let penalty = 0;
  const maxScore = 0;

  if (/\b(everything|anything|all about)\b/i.test(text)) {
    penalty += 4;
  }

  const actionVerbs = (
    text.match(
      /\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize)\b/gi
    ) || []
  ).length;
  if (actionVerbs > 3) {
    penalty += 4;
  }

  const isComplex = text.trim().split(/\s+/).length > 40;
  const hasAudience =
    /\b(for a|audience|reader|beginner|expert|senior|junior|non-technical|technical|team)\b/i.test(
      text
    );
  if (isComplex && !hasAudience) {
    penalty += 3;
  }

  if (/\b(obviously|of course|everyone knows|clearly|naturally)\b/i.test(text)) {
    penalty += 2;
  }

  const hasBrief = /\b(brief|short|concise)\b/i.test(text);
  const hasDetailed = /\b(detailed|comprehensive|thorough|exhaustive)\b/i.test(text);
  if (hasBrief && hasDetailed) {
    penalty += 2;
  }

  const finalPenalty = Math.min(penalty, 15);

  const feedback =
    finalPenalty === 0
      ? 'No significant risks detected'
      : finalPenalty <= 5
        ? 'Minor risk factors present'
        : 'Significant risk factors: open-ended scope, multiple tasks, or missing audience.';

  return { name: 'Risk Penalty', score: -finalPenalty, maxScore, feedback };
}

function getBand(score: number): RatingBand {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  if (score >= 40) return 'weak';
  return 'poor';
}

function buildDimensionHints(
  dimensions: PromptRating['dimensions'],
  gapsRated: GapSignals
): PromptRatingDimensionHints {
  const { clarity, constraints, structure, tokenEfficiency, riskPenalty } = dimensions;
  const cov = gapsRated.sectionCoverage;

  const clarityHint =
    clarity.score >= 20
      ? 'Keep one imperative opener; avoid unrelated asks in the same prompt.'
      : clarity.score >= 12
        ? 'Next: name the single deliverable or decision you need.'
        : 'Next: start with a verb: Create, Explain, Compare, List…';

  const constraintsHint =
    constraints.score >= 15
      ? 'Strong constraints—optionally add numeric bounds (words, bullets, rows).'
      : !gapsRated.hasExplicitOutputFormat
        ? 'Next: specify output shape (bullets, table, JSON).'
        : !gapsRated.hasLengthLimit
          ? 'Next: cap length (e.g. max 5 bullets or 3 sentences).'
          : 'Next: add must/avoid rules or explicit scope limits.';

  const missingLabels = [
    !cov.goal && 'Goal',
    !cov.context && 'Context',
    !cov.constraints && 'Constraints',
    !cov.output && 'Output',
  ].filter(Boolean) as string[];

  const structureHint =
    structure.score >= 15
      ? 'Good structure—optional: add examples or edge-case notes.'
      : missingLabels.length > 0
        ? `Next: add labeled blocks for ${missingLabels.slice(0, 2).join(' & ')}.`
        : 'Next: separate background vs task with headings or blank lines.';

  const tokenHint =
    tokenEfficiency.score >= 16
      ? 'Lean wording—keep instructions this direct.'
      : tokenEfficiency.score >= 10
        ? 'Next: remove hedges and repeated sentences.'
        : 'Next: strip filler (please, I think, maybe) and say each rule once.';

  const riskHint =
    riskPenalty.score === 0
      ? 'No major scope risks at this length.'
      : riskPenalty.score >= -3
        ? 'Next: name audience or tighten scope a bit.'
        : 'Next: one task per prompt; add audience and clear boundaries.';

  return {
    clarity: clarityHint,
    constraints: constraintsHint,
    structure: structureHint,
    tokenEfficiency: tokenHint,
    riskPenalty: riskHint,
  };
}

function buildSuggestions(
  dimensions: PromptRating['dimensions'],
  gapsUser: GapSignals,
  seed: string,
  options?: RatePromptOptions
): string[] {
  const out: string[] = [];
  const pushPool = (pool: readonly string[], salt: string) => {
    if (out.length >= 5) return;
    out.push(pickVariant(pool, seed + salt));
  };

  if (dimensions.clarity.score < 15) pushPool(RATING_SUGGESTION_ACTION_VERB, 'clarity');

  if (!gapsUser.hasExplicitOutputFormat) pushPool(RATING_SUGGESTION_OUTPUT_FORMAT, 'fmt');

  if (!gapsUser.hasLengthLimit) pushPool(RATING_SUGGESTION_LENGTH, 'len');

  if (gapsUser.sectionLabelCount < 2) pushPool(RATING_SUGGESTION_SECTIONS, 'sec');

  if (options?.nlpIntent === 'comparison') pushPool(RATING_SUGGESTION_COMPARISON_INTENT, 'nlpcmp');

  if (options?.nlpIntent === 'question') pushPool(RATING_SUGGESTION_QUESTION_INTENT, 'nlpq');

  if (dimensions.tokenEfficiency.score < 12) pushPool(RATING_SUGGESTION_TOKEN, 'tok');

  if (dimensions.riskPenalty.score < -5) pushPool(RATING_SUGGESTION_SCOPE, 'risk5');

  if (dimensions.riskPenalty.score < -3) pushPool(RATING_SUGGESTION_AUDIENCE, 'risk3');

  if (out.length === 0) {
    pushPool(RATING_SUGGESTION_EXCELLENT, 'exc0');
  }

  let pad = 0;
  while (out.length < 5) {
    pushPool(RATING_SUGGESTION_EXCELLENT, `pad${pad}`);
    pad++;
    if (pad > 12) break;
  }

  return out.slice(0, 5);
}

export function ratePrompt(text: string, options?: RatePromptOptions): PromptRating {
  const ratedText = text;
  if (!ratedText.trim()) {
    const emptyHint = 'Write a prompt to get a tailored next step.';
    return {
      totalScore: 0,
      band: 'poor',
      sectionCoverage: { ...EMPTY_SECTION_COVERAGE },
      dimensionHints: {
        clarity: emptyHint,
        constraints: emptyHint,
        structure: emptyHint,
        tokenEfficiency: emptyHint,
        riskPenalty: emptyHint,
      },
      dimensions: {
        clarity: { name: 'Clarity', score: 0, maxScore: 25, feedback: 'No prompt text provided' },
        constraints: {
          name: 'Constraints',
          score: 0,
          maxScore: 20,
          feedback: 'No prompt text provided',
        },
        structure: {
          name: 'Structure',
          score: 0,
          maxScore: 20,
          feedback: 'No prompt text provided',
        },
        tokenEfficiency: {
          name: 'Token Efficiency',
          score: 0,
          maxScore: 20,
          feedback: 'No prompt text provided',
        },
        riskPenalty: {
          name: 'Risk Penalty',
          score: 0,
          maxScore: 0,
          feedback: 'No prompt text provided',
        },
      },
      suggestions: ['Start by writing your prompt.'],
    };
  }

  const suggestionSource = (options?.suggestionSource ?? ratedText).trim() || ratedText.trim();
  const gapsRated = buildGapSignals(ratedText);
  const gapsUser = buildGapSignals(suggestionSource);
  const sectionCoverage = gapsRated.sectionCoverage;

  const clarity = rateClarity(ratedText);
  let constraints = rateConstraints(ratedText);
  let structure = rateStructure(ratedText);
  const tokenEfficiency = rateTokenEfficiency(ratedText);
  const riskPenalty = calculateRiskPenalty(ratedText);

  constraints = {
    ...constraints,
    feedback: appendConstraintFeedback(constraints.feedback, gapsRated, constraints.score),
  };
  structure = {
    ...structure,
    feedback: appendStructureFeedback(
      structure.feedback,
      gapsRated.sectionCoverage,
      structure.score
    ),
  };

  const rawTotal =
    clarity.score + constraints.score + structure.score + tokenEfficiency.score + riskPenalty.score;
  const totalScore = Math.max(0, Math.min(100, rawTotal));

  const dimensions = { clarity, constraints, structure, tokenEfficiency, riskPenalty };
  const band = getBand(totalScore);

  const suggestions = buildSuggestions(dimensions, gapsUser, suggestionSource, options);
  const dimensionHints = buildDimensionHints(dimensions, gapsRated);

  loggerDebug(
    INFO_MESSAGES.PROMPT_RATED,
    { totalScore, band },
    'engine',
    'prompt-rater.ts',
    'ratePrompt'
  );

  return {
    totalScore,
    band,
    sectionCoverage,
    dimensionHints,
    dimensions,
    suggestions,
  };
}
