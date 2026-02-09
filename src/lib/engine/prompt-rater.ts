import type { PromptRating, RatingDimension, RatingBand } from '@/types/prompt.types';

function rateClarity(text: string): RatingDimension {
  let score = 0;
  const maxScore = 25;

  // Has a clear action word at or near the start
  if (/^(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize|translate|describe|evaluate)/i.test(text.trim())) {
    score += 8;
  } else if (/\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review)\b/i.test(text)) {
    score += 4;
  }

  // Reasonable length (not too short, not too long without structure)
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount >= 10 && wordCount <= 200) {
    score += 5;
  } else if (wordCount >= 5) {
    score += 3;
  }

  // Doesn't use overly vague language
  const vagueWords = (text.match(/\b(everything|anything|all about|stuff|things|whatever|somehow)\b/gi) || []).length;
  if (vagueWords === 0) {
    score += 5;
  } else if (vagueWords <= 1) {
    score += 2;
  }

  // Has specific nouns/subjects (indicates clear topic)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length >= 1) {
    score += 4;
  }

  // Single clear task vs multiple jumbled tasks
  const actionVerbs = (text.match(/\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize)\b/gi) || []).length;
  if (actionVerbs === 1) {
    score += 3;
  } else if (actionVerbs <= 2) {
    score += 1;
  }

  const feedback = score >= 20 ? 'Goal is clear and specific' :
    score >= 12 ? 'Goal is somewhat clear but could be more specific' :
    'Goal is unclear or too vague. Start with a specific action.';

  return { name: 'Clarity', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateConstraints(text: string): RatingDimension {
  let score = 0;
  const maxScore = 20;

  // Output format specified
  if (/\b(bullet|list|table|json|markdown|steps|format|structured|numbered|csv|yaml|xml)\b/i.test(text)) {
    score += 6;
  }

  // Length/size constraint
  if (/\b(\d+\s*(points?|items?|sentences?|words?|lines?|paragraphs?|bullet)|max|limit|brief|concise|short|under \d+)\b/i.test(text)) {
    score += 5;
  }

  // Do/don't rules
  if (/\b(do not|don't|avoid|must not|should not|never|without|exclude|skip|no\s+\w+ing)\b/i.test(text)) {
    score += 4;
  }

  // Positive constraints
  if (/\b(must|should|require|include|always|ensure|make sure)\b/i.test(text)) {
    score += 3;
  }

  // Scope boundary
  if (/\b(only|focus on|limited to|specifically|scope|within)\b/i.test(text)) {
    score += 2;
  }

  const feedback = score >= 15 ? 'Well-constrained with clear boundaries' :
    score >= 8 ? 'Some constraints present, consider adding output format or length limits' :
    'Missing constraints. Add output format, length limits, or do/dont rules.';

  return { name: 'Constraints', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateStructure(text: string): RatingDimension {
  let score = 0;
  const maxScore = 20;

  // Has line breaks / sections
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length >= 3) {
    score += 5;
  } else if (lines.length >= 2) {
    score += 3;
  }

  // Has labeled sections (Goal:, Context:, etc.)
  if (/\b(goal|context|rules|output|format|constraints|audience|background|requirements)\s*:/i.test(text)) {
    score += 6;
  }

  // Has bullet points or numbered items
  if (/^[\s]*[-*•]\s+/m.test(text) || /^[\s]*\d+[.)]\s+/m.test(text)) {
    score += 4;
  }

  // Not a wall of text (has paragraphs)
  if (text.includes('\n\n')) {
    score += 3;
  }

  // Logical flow (context before action)
  const hasContext = /\b(context|background|given|assuming)\b/i.test(text);
  if (hasContext) {
    score += 2;
  }

  const feedback = score >= 15 ? 'Well-structured with clear sections' :
    score >= 8 ? 'Some structure present. Consider adding labeled sections.' :
    'Lacks structure. Break into sections: Goal, Context, Constraints, Output format.';

  return { name: 'Structure', score: Math.min(score, maxScore), maxScore, feedback };
}

function rateTokenEfficiency(text: string): RatingDimension {
  let score = 20; // Start full, subtract for waste
  const maxScore = 20;

  // Filler words
  const fillerCount = (text.match(/\b(please|kindly|i think|maybe|perhaps|i guess|basically|actually|really|very|just|quite|rather|somewhat)\b/gi) || []).length;
  score -= Math.min(fillerCount * 1.5, 6);

  // Repetitive sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length >= 2) {
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const wordsA = new Set(sentences[i].toLowerCase().split(/\s+/));
        const wordsB = new Set(sentences[j].toLowerCase().split(/\s+/));
        const intersection = [...wordsA].filter(w => wordsB.has(w) && w.length > 3);
        const overlap = intersection.length / Math.min(wordsA.size, wordsB.size);
        if (overlap > 0.6) score -= 3;
      }
    }
  }

  // Conversational padding
  if (/\b(i want you to|i need you to|could you please|would you mind|can you help me)\b/i.test(text)) {
    score -= 3;
  }

  // Very long without structure (wall of text)
  const wordCount = text.trim().split(/\s+/).length;
  const lineCount = text.split('\n').filter(l => l.trim()).length;
  if (wordCount > 100 && lineCount <= 2) {
    score -= 4;
  }

  const finalScore = Math.max(0, Math.round(score));

  const feedback = finalScore >= 16 ? 'Token-efficient and concise' :
    finalScore >= 10 ? 'Some token waste detected. Remove filler and repetition.' :
    'Significant token waste. Trim filler words, repetition, and conversational padding.';

  return { name: 'Token Efficiency', score: Math.min(finalScore, maxScore), maxScore, feedback };
}

function calculateRiskPenalty(text: string): RatingDimension {
  let penalty = 0;
  const maxScore = 0; // This is a penalty, displayed as negative

  // Open-ended: no clear boundary
  if (/\b(everything|anything|all about)\b/i.test(text)) {
    penalty += 4;
  }

  // Multiple unrelated tasks
  const actionVerbs = (text.match(/\b(create|generate|explain|write|build|design|analyze|compare|list|summarize|convert|implement|fix|review|optimize)\b/gi) || []).length;
  if (actionVerbs > 3) {
    penalty += 4;
  }

  // Missing audience for complex content
  const isComplex = text.trim().split(/\s+/).length > 40;
  const hasAudience = /\b(for a|audience|reader|beginner|expert|senior|junior|non-technical|technical|team)\b/i.test(text);
  if (isComplex && !hasAudience) {
    penalty += 3;
  }

  // Implicit assumptions
  if (/\b(obviously|of course|everyone knows|clearly|naturally)\b/i.test(text)) {
    penalty += 2;
  }

  // Contradiction signals
  const hasBrief = /\b(brief|short|concise)\b/i.test(text);
  const hasDetailed = /\b(detailed|comprehensive|thorough|exhaustive)\b/i.test(text);
  if (hasBrief && hasDetailed) {
    penalty += 2;
  }

  const finalPenalty = Math.min(penalty, 15);

  const feedback = finalPenalty === 0 ? 'No significant risks detected' :
    finalPenalty <= 5 ? 'Minor risk factors present' :
    'Significant risk factors: open-ended scope, multiple tasks, or missing audience.';

  return { name: 'Risk Penalty', score: -finalPenalty, maxScore, feedback };
}

function getBand(score: number): RatingBand {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  if (score >= 40) return 'weak';
  return 'poor';
}

function generateSuggestions(dimensions: PromptRating['dimensions']): string[] {
  const suggestions: string[] = [];

  if (dimensions.clarity.score < 15) {
    suggestions.push('Start with a clear action verb: "Create...", "Explain...", "Generate..."');
  }
  if (dimensions.constraints.score < 10) {
    suggestions.push('Add output format: "in bullet points", "as a table", "in JSON"');
  }
  if (dimensions.constraints.score < 15) {
    suggestions.push('Add a length limit: "in 5 points", "max 3 sentences"');
  }
  if (dimensions.structure.score < 10) {
    suggestions.push('Break your prompt into sections: Goal, Context, Constraints, Output');
  }
  if (dimensions.tokenEfficiency.score < 12) {
    suggestions.push('Remove filler words like "please", "I think", "maybe". Be direct.');
  }
  if (dimensions.riskPenalty.score < -5) {
    suggestions.push('Narrow the scope. Focus on one specific task per prompt.');
  }
  if (dimensions.riskPenalty.score < -3) {
    suggestions.push('Specify your audience: "for a beginner", "for a senior developer"');
  }

  // Always give at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push('Your prompt is well-crafted. Consider adding examples for even better results.');
  }

  return suggestions.slice(0, 5);
}

export function ratePrompt(text: string): PromptRating {
  if (!text.trim()) {
    return {
      totalScore: 0,
      band: 'poor',
      dimensions: {
        clarity: { name: 'Clarity', score: 0, maxScore: 25, feedback: 'No prompt text provided' },
        constraints: { name: 'Constraints', score: 0, maxScore: 20, feedback: 'No prompt text provided' },
        structure: { name: 'Structure', score: 0, maxScore: 20, feedback: 'No prompt text provided' },
        tokenEfficiency: { name: 'Token Efficiency', score: 0, maxScore: 20, feedback: 'No prompt text provided' },
        riskPenalty: { name: 'Risk Penalty', score: 0, maxScore: 0, feedback: 'No prompt text provided' },
      },
      suggestions: ['Start by writing your prompt.'],
    };
  }

  const clarity = rateClarity(text);
  const constraints = rateConstraints(text);
  const structure = rateStructure(text);
  const tokenEfficiency = rateTokenEfficiency(text);
  const riskPenalty = calculateRiskPenalty(text);

  const rawTotal = clarity.score + constraints.score + structure.score + tokenEfficiency.score + riskPenalty.score;
  const totalScore = Math.max(0, Math.min(100, rawTotal));

  const dimensions = { clarity, constraints, structure, tokenEfficiency, riskPenalty };

  return {
    totalScore,
    band: getBand(totalScore),
    dimensions,
    suggestions: generateSuggestions(dimensions),
  };
}
