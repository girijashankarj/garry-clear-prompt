import {
  exportAsCursorRule,
  exportAsCursorAgent,
  exportAsCursorSkill,
  exportAsCursorCommand,
  exportForCursor,
} from '@/lib/exporters/cursor-exporter';
import { createMockEngineResult } from '../../../mock';

describe('cursor-exporter', () => {
  const result = createMockEngineResult();
  const options = { name: 'My Test Rule', description: 'A test description' };

  describe('exportAsCursorRule', () => {
    it('should include YAML frontmatter', () => {
      const output = exportAsCursorRule(result, options);
      expect(output).toContain('---');
      expect(output).toContain('description: A test description');
      expect(output).toContain('alwaysApply: false');
    });

    it('should include the rule name as heading', () => {
      const output = exportAsCursorRule(result, options);
      expect(output).toContain('# My Test Rule');
    });

    it('should include the structured prompt', () => {
      const output = exportAsCursorRule(result, options);
      expect(output).toContain('REST API endpoint');
    });

    it('should include meta prompt as system instructions when present', () => {
      const output = exportAsCursorRule(result, options);
      expect(output).toContain('## System Instructions');
      expect(output).toContain('expert backend developer');
    });

    it('should omit system instructions when no meta prompt', () => {
      const noMeta = createMockEngineResult({ metaPrompt: '' });
      const output = exportAsCursorRule(noMeta, options);
      expect(output).not.toContain('## System Instructions');
    });
  });

  describe('exportAsCursorAgent', () => {
    it('should include the agent name as heading', () => {
      const output = exportAsCursorAgent(result, options);
      expect(output).toContain('# My Test Rule');
    });

    it('should include Role and Instructions sections', () => {
      const output = exportAsCursorAgent(result, options);
      expect(output).toContain('## Role');
      expect(output).toContain('## Instructions');
    });

    it('should include Tools section', () => {
      const output = exportAsCursorAgent(result, options);
      expect(output).toContain('## Tools');
      expect(output).toContain('Read files');
    });
  });

  describe('exportAsCursorSkill', () => {
    it('should include SKILL.md header', () => {
      const output = exportAsCursorSkill(result, options);
      expect(output).toContain('# SKILL.md');
    });

    it('should include steps', () => {
      const output = exportAsCursorSkill(result, options);
      expect(output).toContain('### Step 1');
      expect(output).toContain('### Step 2');
      expect(output).toContain('### Step 3');
    });

    it('should include the score in notes', () => {
      const output = exportAsCursorSkill(result, options);
      expect(output).toContain('72/100');
    });
  });

  describe('exportAsCursorCommand', () => {
    it('should include slugified name in frontmatter', () => {
      const output = exportAsCursorCommand(result, options);
      expect(output).toContain('name: my-test-rule');
    });

    it('should include the structured prompt', () => {
      const output = exportAsCursorCommand(result, options);
      expect(output).toContain('REST API endpoint');
    });
  });

  describe('exportForCursor', () => {
    it('should return rule export with .mdc extension', () => {
      const out = exportForCursor('rule', result, options);
      expect(out.filename.endsWith('.mdc')).toBe(true);
      expect(out.mimeType).toBe('text/markdown');
    });

    it('should return agent export with .md extension', () => {
      const out = exportForCursor('agent', result, options);
      expect(out.filename.endsWith('.md')).toBe(true);
    });

    it('should return skill export with SKILL.md filename', () => {
      const out = exportForCursor('skill', result, options);
      expect(out.filename).toBe('SKILL.md');
    });

    it('should return command export with .md extension', () => {
      const out = exportForCursor('command', result, options);
      expect(out.filename.endsWith('.md')).toBe(true);
    });

    it('should use slugified name in filenames', () => {
      const out = exportForCursor('rule', result, { name: 'My Complex Rule Name' });
      expect(out.filename).toBe('my-complex-rule-name.mdc');
    });
  });
});
