/** Intent buckets for optional checklist appended by `improvePrompt` (coarse keyword routing). */
export type ImprovePromptIntent =
  | 'sql'
  | 'code'
  | 'ops'
  | 'product'
  | 'research'
  | 'analysis'
  | 'legal'
  | 'education'
  | 'dataviz'
  | 'creative'
  | 'translation'
  | 'writing';

/** User-visible header; used to avoid duplicating the block if already present. */
export const IMPROVE_CHECKLIST_HEADER = 'Reminder (fill in for clearer results):';

export const IMPROVE_CHECKLIST_LINES: Record<ImprovePromptIntent, readonly string[]> = {
  sql: [
    'Name SQL dialect and real table/column names (or say to assume conventional names).',
    'Say read-only vs writes; how to treat NULLs; LIMIT/TOP/FETCH semantics.',
    'Clarify whether you need N rows or N distinct values.',
    'Note security: no secrets in the prompt; say if identifiers must be redacted.',
    'If tuning performance, note approximate data volume and whether indexes or EXPLAIN output exist.',
  ],
  code: [
    'State language, runtime, and framework versions when they matter.',
    'Say whether you want code only, explanation only, or both.',
    'Note constraints: dependencies, style guide, performance or complexity limits.',
    'Paste minimal reproducible context (file excerpt, types, failing input) when debugging.',
    'Secrets: use placeholders only; say if snippets must avoid real keys, tokens, or customer data.',
  ],
  ops: [
    'Name environment (prod/stage/dev), cloud or on-prem, and critical constraints (downtime, cost).',
    'Specify target platform (e.g. Kubernetes, VM, serverless) and relevant versions.',
    'Say whether you want commands only, architecture notes, or a runbook-style answer.',
    'Call out compliance, secrets handling, and rollback / blast-radius expectations.',
    'Add networking, storage, and identity context if it changes failover, access, or cost.',
  ],
  product: [
    'Name product area, primary user persona, and the decision this artifact should unblock.',
    'List constraints: timeline, scope, non-goals, dependencies on other teams or systems.',
    'Clarify format: PRD section, user stories, acceptance criteria, roadmap slice, etc.',
    'Say how to treat open questions (flag vs assume) and what success metrics matter.',
    'Note competitors or benchmarks if they should influence scope or positioning.',
  ],
  research: [
    'Say depth (overview vs deep dive), audience expertise, and any region or time bounds.',
    'Specify source expectations (cite reputable sources, primary literature, or internal docs only).',
    'Note recency (as of date) and whether the model may infer vs must stick to given material.',
    'Say how to flag uncertainty, conflicting evidence, and what to do if data is missing.',
    'Citation style or link policy if it matters (APA, MLA, DOIs, plain URLs only).',
  ],
  analysis: [
    'List options or criteria; say what data you have vs what is missing.',
    'Specify output shape (table, ranked recommendation, pros/cons, numeric scores).',
    'Say how to handle ambiguity (state assumptions vs ask clarifying questions).',
    'Add sensitivity or risk lens if relevant (legal, fairness, operational risk).',
    'State time horizon (tactical vs strategic) and how often the conclusion should be revisited.',
  ],
  legal: [
    'Name jurisdiction(s) and whether this is a draft, checklist, or education—not a substitute for counsel.',
    'Say if a lawyer must review before use; include “not legal advice” where appropriate.',
    'Anonymize facts; never paste real PII, sealed filings, or confidential deal terms.',
    'List applicable frameworks (GDPR, HIPAA, SOC2, etc.) and your role (controller, processor, vendor).',
    'Desired output shape: clause outline, risk memo, policy section, or Q&A only.',
  ],
  education: [
    'Learner level (age, grade, or prior knowledge) and time budget for the answer.',
    'Learning goal: recall, application, exam prep, or conceptual intuition.',
    'Say if direct solutions to graded work are off-limits; prefer hints or scaffolding if so.',
    'Preferred style: step-by-step, analogy-first, Socratic questions, or worked examples.',
    'Include practice items, rubric, or self-check criteria if you want assessment support.',
  ],
  dataviz: [
    'Describe fields, units, sample size, and where the graphic will appear (slide, report, web).',
    'Tool or medium: code library, BI tool, sketch, static vs interactive.',
    'Accessibility: colorblind-safe palette, pattern fills, alt text or data table fallback.',
    'Primary message or comparison the reader should take away in one glance.',
    'Branding constraints (fonts, colors) and export format (SVG, PNG, PDF).',
  ],
  creative: [
    'Genre, length, medium, and tone (e.g. literary, humor, horror, cozy).',
    'Constraints: rating, violence, IP rules, canon, or “original only.”',
    'POV, tense, structure, and cast size if they matter.',
    'Deliverable: single draft, three variants, outline-only, or critique of my draft.',
    'Reference works or “in the style of” only if licensing and ethics allow.',
  ],
  translation: [
    'Source and target languages or dialects; register (formal, casual, technical, medical).',
    'Glossary terms, brand names, and whether to keep acronyms literal or localized.',
    'Output shape: plain text, side-by-side, table, or bilingual JSON keys.',
    'Units, dates, currencies, and locale conventions (e.g. 24h time, decimal separator).',
    'Sensitive content handling: redact, anonymize, or flag culturally loaded terms.',
  ],
  writing: [
    'Audience, channel, and target length or format (outline vs full draft).',
    'Tone and any words, claims, or topics to avoid.',
    'Brand, style guide, or reference examples if they apply.',
    'Say CTA, disclaimers, or legal/compliance review needs if any.',
    'SEO keywords, readability target, or accessibility (plain language, headings) if relevant.',
  ],
};

export const IMPROVE_CHECKLIST_CHANGE_SUMMARY: Record<ImprovePromptIntent, string> = {
  sql: 'Added data/SQL checklist hints',
  code: 'Added code checklist hints',
  ops: 'Added DevOps / platform checklist hints',
  product: 'Added product / requirements checklist hints',
  research: 'Added research checklist hints',
  analysis: 'Added analysis checklist hints',
  legal: 'Added legal / compliance checklist hints',
  education: 'Added teaching / learning checklist hints',
  dataviz: 'Added data visualization checklist hints',
  creative: 'Added creative writing checklist hints',
  translation: 'Added translation checklist hints',
  writing: 'Added writing checklist hints',
};
