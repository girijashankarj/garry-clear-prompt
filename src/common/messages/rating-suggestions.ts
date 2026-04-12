/** Variant pools for gap-targeted rating suggestions (stable pick via hash of source text). */

export const RATING_SUGGESTION_ACTION_VERB = [
  'Open with a strong imperative: “Summarize…”, “Draft…”, or “List…”.',
  'Lead with the task: “Explain…”, “Compare…”, or “Implement…”.',
  'Start with one clear verb so the model knows the deliverable.',
  'Replace hedging with a direct command at the beginning of the prompt.',
] as const;

export const RATING_SUGGESTION_OUTPUT_FORMAT = [
  'Name the output shape: bullet list, markdown table, or strict JSON with keys.',
  'Say how you want the answer laid out—bullets, a table, or machine-readable JSON.',
  'Specify structure: “Use headings”, “one table”, or “valid JSON only”.',
  'Add a format line so the model doesn’t guess (bullets vs prose vs JSON).',
] as const;

export const RATING_SUGGESTION_LENGTH = [
  'Cap length: “max 3 sentences”, “exactly 5 bullets”, or “≤200 words”.',
  'Add a numeric bound so scope stays predictable (points, sentences, or words).',
  'State how long the reply should be—prevents rambling or under-delivery.',
  'Use “in N bullet points” or “one short paragraph” to bound the output.',
] as const;

export const RATING_SUGGESTION_SECTIONS = [
  'Use labeled blocks: Goal, Context, Constraints, Output (even as short headings).',
  'Split into Goal / Context / Constraints / Output so nothing important is buried.',
  'Mirror a spec: what you want, what you know, rules, and the exact deliverable.',
  'Add headings so the model can scan for task vs background vs format.',
] as const;

export const RATING_SUGGESTION_TOKEN = [
  'Cut filler (“please”, “I think”, “maybe”)—keep instructions tight.',
  'Remove hedging and repetition; one crisp instruction beats polite padding.',
  'Trim duplicate sentences; say each requirement once.',
  'Prefer direct phrasing over conversational softeners.',
] as const;

export const RATING_SUGGESTION_SCOPE = [
  'Split into separate prompts if you have several unrelated tasks.',
  'Narrow to one outcome per prompt; chain follow-ups for the rest.',
  'Shrink scope: one deliverable, one audience, one format.',
] as const;

export const RATING_SUGGESTION_AUDIENCE = [
  'Name the reader: “for a junior dev”, “for executives”, “for support agents”.',
  'Add audience level so depth and jargon match who will read the answer.',
  'Say who consumes the output—experience level changes the right answer.',
] as const;

export const RATING_SUGGESTION_EXCELLENT = [
  'Add 1–2 short examples of “good” output to anchor tone and structure.',
  'Include success criteria: what “done” looks like for this task.',
  'Spell out edge cases or failures to handle (empty input, unknowns).',
  'Add an evaluation rubric: what must be true for the answer to be acceptable.',
  'Request self-check: “List assumptions, then answer.”',
] as const;

export const RATING_SUGGESTION_COMPARISON_INTENT = [
  'For comparisons, add criteria (cost, speed, risk) and how to weight them.',
  'Ask for a decision matrix or scored table so trade-offs are explicit.',
] as const;

export const RATING_SUGGESTION_QUESTION_INTENT = [
  'If you need a direct answer, say the preferred format (one paragraph vs bullets).',
  'Clarify whether you want reasoning shown or only the final conclusion.',
] as const;
