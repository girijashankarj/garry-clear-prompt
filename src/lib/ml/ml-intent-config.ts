import type { ImprovePromptIntent } from '@/common/messages/improve-checklists';

/** Quantized DistilBERT MNLI — loaded on demand when ML intent is enabled. */
export const ML_INTENT_MODEL_ID = 'Xenova/distilbert-base-uncased-mnli';

/**
 * Hypothesis labels for zero-shot NLI. Wording affects routing quality; keep stable for reproducibility.
 */
export const ML_ZERO_SHOT_LABEL_BY_INTENT: Record<ImprovePromptIntent, string> = {
  sql: 'The user wants SQL, relational databases, tables, or structured data queries',
  code: 'The user wants programming, debugging software, APIs, tests, or implementation help',
  ops: 'The user wants DevOps, Kubernetes, Docker, CI/CD, deployment, or infrastructure',
  product: 'The user wants product management artifacts like PRDs, user stories, or roadmaps',
  research: 'The user wants research, citations, literature review, or verified sources',
  analysis: 'The user wants comparison, trade-off analysis, evaluation, or decision support',
  legal: 'The user wants legal, compliance, contracts, privacy policy, or regulatory topics',
  education: 'The user wants teaching, lessons, quizzes, homework help, or curriculum',
  dataviz: 'The user wants charts, plots, dashboards, or data visualization',
  creative: 'The user wants creative writing, fiction, poetry, lyrics, or brainstorming stories',
  translation: 'The user wants translation between languages or localization',
  writing: 'The user wants marketing copy, email, articles, or general professional writing',
};

export const ML_NONE_INTENT_LABEL =
  'The user request is general and does not match one specific checklist domain above';
