import { ratePrompt } from '@/lib/engine/prompt-rater';

/**
 * Golden-style checks: fixed prompts should stay within expected bands unless scoring rules change intentionally.
 */
describe('prompt-rater golden prompts', () => {
  it('should rate a minimal vague prompt as weak or poor', () => {
    const r = ratePrompt('stuff');
    expect(['weak', 'poor']).toContain(r.band);
    expect(r.dimensionHints.clarity.length).toBeGreaterThan(10);
  });

  it('should rate a structured API spec as average or better', () => {
    const text = `Goal: Add pagination to the users API.

Context: Node + Express, existing /users route.

Constraints:
- Use cursor-based pagination
- Max page size 50

Output: numbered implementation steps with code blocks.`;
    const r = ratePrompt(text);
    expect(['excellent', 'good', 'average']).toContain(r.band);
    expect(r.sectionCoverage.goal).toBe(true);
    expect(r.sectionCoverage.context).toBe(true);
    expect(r.sectionCoverage.constraints).toBe(true);
    expect(r.sectionCoverage.output).toBe(true);
  });

  it('should flag comparison-style prompt with comparison intent option', () => {
    const r = ratePrompt('Compare Kafka and RabbitMQ for event-driven microservices.', {
      nlpIntent: 'comparison',
    });
    expect(r.totalScore).toBeGreaterThan(30);
    expect(r.suggestions.some((s) => /criteria|rubric|matrix|trade/i.test(s))).toBe(true);
  });
});
