import { detectPrimaryImproveIntent } from '@/lib/engine/improve-intent';

describe('improve-intent', () => {
  describe('detectPrimaryImproveIntent', () => {
    it('should return sql when database and table both appear', () => {
      expect(
        detectPrimaryImproveIntent(
          'Get first 5 users last name from user management table in yolo database'
        )
      ).toBe('sql');
    });

    it('should return sql when SELECT is present', () => {
      expect(detectPrimaryImproveIntent('SELECT id FROM users')).toBe('sql');
    });

    it('should return sql for query plus database', () => {
      expect(detectPrimaryImproveIntent('Write a query against the production database')).toBe(
        'sql'
      );
    });

    it('should return code before analysis when both match', () => {
      expect(detectPrimaryImproveIntent('Analyze this JavaScript memory leak')).toBe('code');
    });

    it('should return analysis when no higher-priority intent matches', () => {
      expect(detectPrimaryImproveIntent('Compare waterfall and agile for our team')).toBe(
        'analysis'
      );
    });

    it('should return writing for email channel', () => {
      expect(detectPrimaryImproveIntent('Draft a professional email to the client')).toBe(
        'writing'
      );
    });

    it('should return null when no bucket matches', () => {
      expect(detectPrimaryImproveIntent('Create a user authentication system')).toBeNull();
    });

    it('should return ops for kubernetes and deployment wording', () => {
      expect(detectPrimaryImproveIntent('Roll out the new service to our kubernetes cluster')).toBe(
        'ops'
      );
    });

    it('should return product for user stories and PRD wording', () => {
      expect(detectPrimaryImproveIntent('Draft user stories for the checkout epic')).toBe(
        'product'
      );
    });

    it('should return research for citations and literature wording', () => {
      expect(
        detectPrimaryImproveIntent('Summarize climate studies with citations from primary sources')
      ).toBe('research');
    });

    it('should prefer ops over analysis when both match', () => {
      expect(
        detectPrimaryImproveIntent('Compare Jenkins vs GitHub Actions for our deploy pipeline')
      ).toBe('ops');
    });

    it('should prefer research over analysis when both match', () => {
      expect(
        detectPrimaryImproveIntent('Analyze the peer-reviewed literature on this treatment')
      ).toBe('research');
    });

    it('should return legal for privacy and regulatory wording', () => {
      expect(detectPrimaryImproveIntent('Draft a GDPR-compliant privacy policy for EU users')).toBe(
        'legal'
      );
    });

    it('should return education for teaching and quiz wording', () => {
      expect(detectPrimaryImproveIntent('Build a quiz on fractions for sixth-grade students')).toBe(
        'education'
      );
    });

    it('should return dataviz for chart and dashboard wording', () => {
      expect(detectPrimaryImproveIntent('Plot sales by region as a bar chart in matplotlib')).toBe(
        'dataviz'
      );
    });

    it('should return creative for fiction and poetry wording', () => {
      expect(detectPrimaryImproveIntent('Write a short story about a lighthouse keeper')).toBe(
        'creative'
      );
    });

    it('should return translation for explicit translate wording', () => {
      expect(detectPrimaryImproveIntent('Translate the following press release into German')).toBe(
        'translation'
      );
    });

    it('should prefer legal over education when both match', () => {
      expect(detectPrimaryImproveIntent('Teach a lesson on HIPAA privacy rules for nurses')).toBe(
        'legal'
      );
    });
  });
});
