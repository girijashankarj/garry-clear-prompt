import type { McpPermission, McpEnvironment } from '@/types/prompt.types';

export interface McpToolDefinition {
  name: string;
  description: string;
  defaultPermission: McpPermission;
  safeEnvironments: McpEnvironment[];
  riskNote: string;
  keywords: string[];
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'Postgres',
    description: 'Direct database access for queries and data exploration',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev'],
    riskNote:
      'Write access in production can cause data loss. Always use read-only in non-dev environments.',
    keywords: [
      'sql',
      'database',
      'query',
      'postgres',
      'db',
      'table',
      'schema',
      'migration',
      'data',
    ],
  },
  {
    name: 'Playwright',
    description: 'Browser automation for UI testing and validation',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev', 'staging'],
    riskNote:
      'Can interact with live UIs. Avoid in production to prevent unintended user-facing changes.',
    keywords: ['test', 'browser', 'ui', 'e2e', 'automation', 'playwright', 'screenshot', 'click'],
  },
  {
    name: 'Figma',
    description: 'Design file access for tokens, components, and specs',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev', 'staging', 'prod'],
    riskNote: 'Read-only is generally safe. Write access could modify shared design files.',
    keywords: ['design', 'figma', 'ui', 'component', 'style', 'token', 'color', 'layout'],
  },
  {
    name: 'GitHub',
    description: 'Repository access for code, PRs, and issues',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev', 'staging'],
    riskNote: 'Write access can modify code, merge PRs, or close issues. Use cautiously.',
    keywords: ['git', 'github', 'repo', 'pr', 'pull request', 'issue', 'code', 'branch', 'commit'],
  },
  {
    name: 'Filesystem',
    description: 'Local file system access for reading and writing files',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev'],
    riskNote:
      'Write access can modify or delete local files. Restrict to project directories only.',
    keywords: ['file', 'read', 'write', 'directory', 'folder', 'path', 'filesystem', 'local'],
  },
  {
    name: 'OpenSearch / Elasticsearch',
    description: 'Search and analytics engine for log and data queries',
    defaultPermission: 'read-only',
    safeEnvironments: ['dev', 'staging'],
    riskNote:
      'Write access can modify indices or delete data. Use read-only for queries and dashboards.',
    keywords: ['opensearch', 'elasticsearch', 'search', 'log', 'dashboard', 'index', 'analytics'],
  },
];
