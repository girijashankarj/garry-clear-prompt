import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { BasicPromptInput, DetailLevel, StyleTone, ResponseFormat } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface BasicPromptFormProps {
  input: BasicPromptInput;
  onChange: (input: BasicPromptInput) => void;
}

interface OptionCardProps<T extends string> {
  value: T;
  selected: T;
  label: string;
  description: string;
  onSelect: (value: T) => void;
}

function OptionCard<T extends string>({ value, selected, label, description, onSelect }: OptionCardProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'flex flex-col items-start rounded-lg border p-3 text-left transition-all duration-200',
        'hover:border-primary/50 hover:bg-accent/50',
        selected === value
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
          : 'border-border'
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
    </button>
  );
}

export function BasicPromptForm({ input, onChange }: BasicPromptFormProps) {
  const update = (partial: Partial<BasicPromptInput>) => {
    onChange({ ...input, ...partial });
  };

  return (
    <div className="space-y-6">
      {/* Main input */}
      <div className="space-y-2">
        <Label htmlFor="basic-goal" className="text-base font-medium">
          What do you want help with?
        </Label>
        <Textarea
          id="basic-goal"
          placeholder="Describe what you need... For example: 'Explain how React hooks work for a beginner in 5 bullet points'"
          value={input.goal}
          onChange={(e) => update({ goal: e.target.value })}
          className="min-h-[140px] text-base resize-y"
        />
        <p className="text-xs text-muted-foreground">
          {input.goal.length > 0 ? `${input.goal.trim().split(/\s+/).length} words` : 'Start typing to see your prompt score'}
        </p>
      </div>

      {/* Refiners */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Detail level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">How detailed should the answer be?</Label>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<DetailLevel>
                value="short" selected={input.detailLevel} onSelect={(v) => update({ detailLevel: v })}
                label="Short" description="Brief and concise"
              />
              <OptionCard<DetailLevel>
                value="medium" selected={input.detailLevel} onSelect={(v) => update({ detailLevel: v })}
                label="Medium" description="Moderate detail"
              />
              <OptionCard<DetailLevel>
                value="detailed" selected={input.detailLevel} onSelect={(v) => update({ detailLevel: v })}
                label="Detailed" description="Thorough response"
              />
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">What style do you want?</Label>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<StyleTone>
                value="simple" selected={input.styleTone} onSelect={(v) => update({ styleTone: v })}
                label="Simple" description="Easy to understand"
              />
              <OptionCard<StyleTone>
                value="professional" selected={input.styleTone} onSelect={(v) => update({ styleTone: v })}
                label="Professional" description="Formal and clear"
              />
              <OptionCard<StyleTone>
                value="friendly" selected={input.styleTone} onSelect={(v) => update({ styleTone: v })}
                label="Friendly" description="Conversational tone"
              />
            </div>
          </div>

          {/* Response format */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Do you want steps or explanation?</Label>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<ResponseFormat>
                value="steps" selected={input.responseFormat} onSelect={(v) => update({ responseFormat: v })}
                label="Steps" description="Numbered steps"
              />
              <OptionCard<ResponseFormat>
                value="explanation" selected={input.responseFormat} onSelect={(v) => update({ responseFormat: v })}
                label="Explanation" description="Clear explanation"
              />
              <OptionCard<ResponseFormat>
                value="both" selected={input.responseFormat} onSelect={(v) => update({ responseFormat: v })}
                label="Both" description="Steps + explanation"
              />
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <Label htmlFor="basic-rules" className="text-sm font-medium">
              Any rules to follow? <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="basic-rules"
              placeholder="Example: avoid jargon, use examples, keep it under 200 words"
              value={input.rules}
              onChange={(e) => update({ rules: e.target.value })}
              className="min-h-[80px] resize-y"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
