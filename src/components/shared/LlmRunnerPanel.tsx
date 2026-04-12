import { useState } from 'react';
import {
  Play,
  Lock,
  Settings2,
  ChevronDown,
  ChevronUp,
  Zap,
  DollarSign,
  Clock,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PromptEngineResult } from '@/types/prompt.types';
import { LLM_PROVIDERS } from '@/lib/llm/providers';
import { LLM_FEATURE_ENABLED } from '@/lib/llm/adapter';

interface LlmRunnerPanelProps {
  result: PromptEngineResult;
}

export function LlmRunnerPanel({ result }: LlmRunnerPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const provider = LLM_PROVIDERS.find((p) => p.provider === selectedProvider);
  const model = provider?.models.find((m) => m.id === selectedModel);

  // Pre-compute estimated cost
  const midInput = Math.round(
    (result.tokenEstimate.inputTokens.low + result.tokenEstimate.inputTokens.high) / 2
  );
  const midOutput = Math.round(
    (result.tokenEstimate.outputTokens.low + result.tokenEstimate.outputTokens.high) / 2
  );
  const estimatedCost = model
    ? (midInput / 1000) * model.inputCostPer1k + (midOutput / 1000) * model.outputCostPer1k
    : 0;

  const isDisabled = !LLM_FEATURE_ENABLED;

  return (
    <Card className={isDisabled ? 'opacity-75' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-green-500" />
          <CardTitle className="text-sm font-medium">Run Prompt</CardTitle>
          {isDisabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="ml-auto text-[10px] gap-1 cursor-help">
                    <Lock className="h-2.5 w-2.5" />
                    Coming Soon
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    LLM integration is disabled. Will be enabled when we have money to waste on
                    tokens.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Provider selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Provider
          </label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {LLM_PROVIDERS.map((p) => (
              <button
                key={p.provider}
                onClick={() => {
                  setSelectedProvider(p.provider);
                  setSelectedModel(p.models[0]?.id || '');
                }}
                disabled={isDisabled}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:cursor-not-allowed ${
                  selectedProvider === p.provider
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted disabled:hover:bg-muted/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model selector */}
        {provider && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Model
            </label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {provider.models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  disabled={isDisabled}
                  className={`px-2 py-1 rounded-md text-xs border transition-colors disabled:cursor-not-allowed ${
                    selectedModel === m.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted disabled:hover:bg-muted/50'
                  }`}
                >
                  <span className="font-medium">{m.label}</span>
                  <span className="text-[9px] ml-1 opacity-70">({m.tier})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cost preview */}
        {model && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border p-2 text-center">
              <DollarSign className="h-3.5 w-3.5 mx-auto text-amber-500 mb-0.5" />
              <p className="text-xs font-bold tabular-nums">${estimatedCost.toFixed(4)}</p>
              <p className="text-[9px] text-muted-foreground">Est. cost</p>
            </div>
            <div className="rounded-md border p-2 text-center">
              <Zap className="h-3.5 w-3.5 mx-auto text-blue-500 mb-0.5" />
              <p className="text-xs font-bold tabular-nums">
                {(midInput + midOutput).toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground">Est. tokens</p>
            </div>
            <div className="rounded-md border p-2 text-center">
              <Clock className="h-3.5 w-3.5 mx-auto text-violet-500 mb-0.5" />
              <p className="text-xs font-bold">{model.tier}</p>
              <p className="text-[9px] text-muted-foreground">Speed</p>
            </div>
          </div>
        )}

        {/* Settings toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          disabled={isDisabled}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>Settings</span>
          {showSettings ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* Settings form (collapsed) */}
        {showSettings && (
          <div className="space-y-2 rounded-md border p-3 bg-muted/30">
            {/* Credential fields */}
            {provider?.configFields.map((field) => (
              <div key={field.key}>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ))}

            {/* Temperature */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                disabled={isDisabled}
                className="w-full mt-1 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>Precise (0)</span>
                <span>Creative (1)</span>
              </div>
            </div>

            {/* Max tokens */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Max Output Tokens
              </label>
              <input
                type="number"
                defaultValue={2048}
                min={1}
                max={model?.maxContext || 128000}
                disabled={isDisabled}
                className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-sm tabular-nums disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-md p-2">
              <Info className="h-3 w-3 shrink-0 mt-0.5 text-amber-500" />
              <span>
                API keys are stored locally in your browser. They are never sent anywhere except
                directly to the provider's API.
              </span>
            </div>
          </div>
        )}

        {/* Run button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button className="w-full gap-2" disabled={isDisabled}>
                  {isDisabled ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Run Prompt (Disabled)
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Prompt
                      {model && (
                        <span className="text-xs opacity-70">~${estimatedCost.toFixed(4)}</span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {isDisabled && (
              <TooltipContent side="top">
                <p>When we actually have money to waste on LLM tokens, this will light up.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Run history placeholder */}
        <div className="rounded-md border border-dashed p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Run History
          </p>
          <p className="text-xs text-muted-foreground">
            {isDisabled
              ? 'No runs yet. Feature coming soon.'
              : 'Run your prompt to see results here.'}
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-muted-foreground">0</p>
              <p className="text-[9px] text-muted-foreground">Runs</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-muted-foreground">$0.00</p>
              <p className="text-[9px] text-muted-foreground">Total Spend</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-muted-foreground">0</p>
              <p className="text-[9px] text-muted-foreground">Tokens Used</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
