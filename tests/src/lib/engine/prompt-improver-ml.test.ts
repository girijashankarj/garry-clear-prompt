jest.mock('@/lib/ml/intent-classifier', () => ({
  ML_INTENT_FEATURE_ENABLED: true,
  classifyIntentWithMl: jest.fn(),
}));

import { IMPROVE_CHECKLIST_HEADER } from '@/common/messages/improve-checklists';
import {
  appendDomainChecklistForIntent,
  improvePrompt,
  refineImprovementWithMl,
  stripDomainChecklistBlock,
} from '@/lib/engine/prompt-improver';
import { classifyIntentWithMl } from '@/lib/ml/intent-classifier';

const mockedClassify = classifyIntentWithMl as jest.MockedFunction<typeof classifyIntentWithMl>;

describe('prompt-improver ML helpers', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    mockedClassify.mockReset();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('stripDomainChecklistBlock / appendDomainChecklistForIntent', () => {
    it('should strip checklist and append a different intent block', () => {
      const base = improvePrompt('Get data from users table in yolo database');
      expect(base.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      const stripped = stripDomainChecklistBlock(base.improved);
      expect(stripped).not.toContain(IMPROVE_CHECKLIST_HEADER);
      const withCode = appendDomainChecklistForIntent(stripped, 'code');
      expect(withCode).toContain('language, runtime');
    });
  });

  describe('refineImprovementWithMl', () => {
    it('should apply ML checklist when classifier returns an intent', async () => {
      mockedClassify.mockResolvedValue({
        intent: 'education',
        score: 0.91,
        topLabel: 'education label',
      });
      const base = improvePrompt('Get data from users table in yolo database');
      const out = await refineImprovementWithMl(
        base,
        'Build a homework worksheet for students',
        {}
      );
      expect(out.status).toBe('applied');
      expect(out.improvement.improved).toContain('Learner level');
      expect(out.improvement.changes.some((c) => c.includes('ML'))).toBe(true);
    });

    it('should skip when classifier yields low confidence', async () => {
      mockedClassify.mockResolvedValue({
        intent: null,
        score: 0.08,
        topLabel: 'none',
      });
      const base = improvePrompt('Summarize quarterly revenue');
      const out = await refineImprovementWithMl(base, 'Summarize quarterly revenue', {});
      expect(out.status).toBe('skipped_low_confidence');
      expect(out.improvement).toBe(base);
    });

    it('should skip when classifier throws internally and returns null', async () => {
      mockedClassify.mockResolvedValue(null);
      const base = improvePrompt('Hello world');
      const out = await refineImprovementWithMl(base, 'Hello world', {});
      expect(out.status).toBe('skipped_inference_failed');
    });
  });
});
