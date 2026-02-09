import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LintWarning, LintSeverity } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface LintWarningsProps {
  warnings: LintWarning[];
}

const SEVERITY_CONFIG: Record<LintSeverity, { icon: typeof AlertTriangle; color: string; badge: string }> = {
  error: { icon: AlertCircle, color: 'text-red-500', badge: 'bg-red-500/10 text-red-600 border-red-500/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  info: { icon: Info, color: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
};

export function LintWarningsPanel({ warnings }: LintWarningsProps) {
  if (warnings.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prompt Lint</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-500 font-medium">No issues found</p>
        </CardContent>
      </Card>
    );
  }

  const errorCount = warnings.filter(w => w.severity === 'error').length;
  const warningCount = warnings.filter(w => w.severity === 'warning').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Prompt Lint</CardTitle>
          <div className="flex gap-1.5">
            {errorCount > 0 && <Badge variant="outline" className={cn('text-xs', SEVERITY_CONFIG.error.badge)}>{errorCount} errors</Badge>}
            {warningCount > 0 && <Badge variant="outline" className={cn('text-xs', SEVERITY_CONFIG.warning.badge)}>{warningCount} warnings</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {warnings.map((warning, i) => {
          const config = SEVERITY_CONFIG[warning.severity];
          const Icon = config.icon;
          return (
            <div key={i} className="flex items-start gap-2 rounded-md border p-2.5">
              <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.color)} />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{warning.rule}</span>
                  <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', config.badge)}>
                    {warning.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{warning.message}</p>
                <p className="text-xs text-primary/80">Fix: {warning.suggestion}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
