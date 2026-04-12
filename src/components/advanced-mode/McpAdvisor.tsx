import { Wrench, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { McpToolSuggestion } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface McpAdvisorProps {
  suggestions: McpToolSuggestion[];
}

export function McpAdvisorPanel({ suggestions }: McpAdvisorProps) {
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">MCP Tool Suggestions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>No MCP tools needed for this prompt. Reasoning only.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">MCP Tool Suggestions</CardTitle>
          <Badge variant="secondary" className="text-xs ml-auto">
            {suggestions.length} found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((tool) => (
          <div
            key={tool.name}
            className={cn(
              'rounded-lg border p-3 space-y-2',
              tool.recommended ? 'border-primary/20 bg-primary/5' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{tool.name}</span>
                {tool.recommended && (
                  <Badge variant="secondary" className="text-xs">
                    Recommended
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {tool.permission}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{tool.description}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Safe in:</span>
              {tool.safeEnvironments.map((env) => (
                <Badge key={env} variant="outline" className="text-[10px] px-1.5 py-0">
                  {env}
                </Badge>
              ))}
            </div>
            <div className="flex items-start gap-1.5 text-[11px]">
              <ShieldAlert className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />
              <span className="text-muted-foreground">{tool.riskNote}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
