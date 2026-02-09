import type { McpToolSuggestion } from '@/types/prompt.types';
import { MCP_TOOLS } from '@/lib/data/mcp-tools';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

export function suggestMcpTools(promptText: string): McpToolSuggestion[] {
  if (!promptText.trim()) return [];

  const lowerText = promptText.toLowerCase();
  const suggestions: McpToolSuggestion[] = [];

  for (const tool of MCP_TOOLS) {
    const matchCount = tool.keywords.filter(kw => lowerText.includes(kw)).length;

    if (matchCount > 0) {
      suggestions.push({
        name: tool.name,
        description: tool.description,
        permission: tool.defaultPermission,
        safeEnvironments: tool.safeEnvironments,
        riskNote: tool.riskNote,
        recommended: matchCount >= 2,
      });
    }
  }

  // Sort: most relevant first
  suggestions.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

  loggerDebug(DEBUG_MESSAGES.MCP_SUGGESTED, { count: suggestions.length }, 'engine', 'mcp-advisor.ts', 'suggestMcpTools');
  return suggestions;
}

export function shouldUseMcp(promptText: string): boolean {
  // Simple heuristic: if the prompt is purely reasoning/planning, MCP is not needed
  const reasoningOnly = /\b(explain|describe|compare|summarize|plan|design|review|think)\b/i.test(promptText);
  const needsData = /\b(query|fetch|read|write|access|connect|execute|run|deploy|test|browse|screenshot)\b/i.test(promptText);

  return needsData && !reasoningOnly;
}
