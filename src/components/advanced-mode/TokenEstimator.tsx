import { Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TokenEstimate } from '@/types/prompt.types';

interface TokenEstimatorProps {
  estimate: TokenEstimate;
}

function TokenRange({ label, low, high }: { label: string; low: number; high: number }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-medium">
        {low.toLocaleString()} -- {high.toLocaleString()}
      </span>
    </div>
  );
}

export function TokenEstimatorPanel({ estimate }: TokenEstimatorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Token Estimate</CardTitle>
          <span className="text-xs text-muted-foreground ml-auto">Estimated range</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          <TokenRange
            label="Input tokens"
            low={estimate.inputTokens.low}
            high={estimate.inputTokens.high}
          />
          <TokenRange
            label="Output tokens"
            low={estimate.outputTokens.low}
            high={estimate.outputTokens.high}
          />
          <TokenRange
            label="Total tokens"
            low={estimate.totalTokens.low}
            high={estimate.totalTokens.high}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Estimates are approximate. Actual usage depends on model, prompt complexity, and response.
        </p>
      </CardContent>
    </Card>
  );
}
