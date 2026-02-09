import { exportAsZip } from '@/lib/exporters/zip-exporter';
import { createMockEngineResult } from '../../../mock';

describe('zip-exporter', () => {
  describe('exportAsZip', () => {
    it('should return a Blob', async () => {
      const result = createMockEngineResult();
      const blob = await exportAsZip(result);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should produce a non-empty blob', async () => {
      const result = createMockEngineResult();
      const blob = await exportAsZip(result);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should work with no meta prompt', async () => {
      const result = createMockEngineResult({ metaPrompt: '' });
      const blob = await exportAsZip(result);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should work with no lint warnings', async () => {
      const result = createMockEngineResult({ lintWarnings: [] });
      const blob = await exportAsZip(result);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should work with MCP suggestions', async () => {
      const result = createMockEngineResult({
        mcpSuggestions: [{
          name: 'Postgres',
          description: 'Database access',
          permission: 'read-only',
          safeEnvironments: ['dev'],
          riskNote: 'Be careful',
          recommended: true,
        }],
      });
      const blob = await exportAsZip(result);
      expect(blob.size).toBeGreaterThan(0);
    });
  });
});
