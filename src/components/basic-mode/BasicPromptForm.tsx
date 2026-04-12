import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type {
  BasicPromptInput,
  DetailLevel,
  StyleTone,
  ResponseFormat,
} from '@/types/prompt.types';
import { cn } from '@/lib/utils';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { CharCounter } from '@/components/shared/CharCounter';

const GOAL_MAX_CHARS = 2000;
const RULES_MAX_CHARS = 500;

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

function OptionCard<T extends string>({
  value,
  selected,
  label,
  description,
  onSelect,
}: OptionCardProps<T>) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      data-selected={isSelected}
      className={cn(
        'option-card-glow flex flex-col items-start rounded-lg border p-2.5 text-left transition-all duration-200',
        'hover:border-primary/40 hover:bg-accent/40',
        isSelected
          ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-sm'
          : 'border-border/60'
      )}
    >
      <span className={cn('text-sm font-semibold tracking-tight', isSelected && 'text-primary')}>
        {label}
      </span>
      <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</span>
    </button>
  );
}

export function BasicPromptForm({ input, onChange }: BasicPromptFormProps) {
  const update = (partial: Partial<BasicPromptInput>) => {
    onChange({ ...input, ...partial });
  };

  return (
    <div className="space-y-4">
      {/* Main input */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="basic-goal" className="text-base font-semibold tracking-tight">
            What do you want help with?
          </Label>
          <InfoTooltip
            content="Describe your goal clearly. The more specific you are, the higher your prompt quality score. Start with an action verb like 'Explain', 'Create', or 'Compare'."
            label="More information about goal"
          />
        </div>
        <Textarea
          id="basic-goal"
          placeholder="Describe what you need... For example: 'Explain how React hooks work for a beginner in 5 bullet points'"
          value={input.goal}
          onChange={(e) => update({ goal: e.target.value.slice(0, GOAL_MAX_CHARS) })}
          className="min-h-[120px] text-base resize-y focus:ring-primary/30"
          maxLength={GOAL_MAX_CHARS}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {input.goal.length > 0
              ? 'Your prompt is being scored in real-time'
              : 'Start typing to see your prompt score'}
          </p>
          <CharCounter
            current={input.goal.length}
            max={GOAL_MAX_CHARS}
            showWords
            text={input.goal}
          />
        </div>
      </div>

      {/* Refiners */}
      <Card>
        <CardContent className="space-y-4">
          {/* Detail level */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">How detailed should the answer be?</Label>
              <InfoTooltip
                content="Controls the depth of the AI response. 'Short' yields a brief answer, 'Medium' gives balanced detail, and 'Detailed' produces a thorough, in-depth response."
                label="More information about detail level"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<DetailLevel>
                value="short"
                selected={input.detailLevel}
                onSelect={(v) => update({ detailLevel: v })}
                label="Short"
                description="Brief and concise"
              />
              <OptionCard<DetailLevel>
                value="medium"
                selected={input.detailLevel}
                onSelect={(v) => update({ detailLevel: v })}
                label="Medium"
                description="Moderate detail"
              />
              <OptionCard<DetailLevel>
                value="detailed"
                selected={input.detailLevel}
                onSelect={(v) => update({ detailLevel: v })}
                label="Detailed"
                description="Thorough response"
              />
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">What style do you want?</Label>
              <InfoTooltip
                content="Sets the tone of the AI response. 'Simple' avoids jargon, 'Professional' uses formal language, and 'Friendly' feels conversational."
                label="More information about style"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<StyleTone>
                value="simple"
                selected={input.styleTone}
                onSelect={(v) => update({ styleTone: v })}
                label="Simple"
                description="Easy to understand"
              />
              <OptionCard<StyleTone>
                value="professional"
                selected={input.styleTone}
                onSelect={(v) => update({ styleTone: v })}
                label="Professional"
                description="Formal and clear"
              />
              <OptionCard<StyleTone>
                value="friendly"
                selected={input.styleTone}
                onSelect={(v) => update({ styleTone: v })}
                label="Friendly"
                description="Conversational tone"
              />
            </div>
          </div>

          {/* Response format */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">Do you want steps or explanation?</Label>
              <InfoTooltip
                content="Determines the structure of the response. 'Steps' gives numbered instructions, 'Explanation' provides flowing prose, and 'Both' combines them."
                label="More information about response format"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <OptionCard<ResponseFormat>
                value="steps"
                selected={input.responseFormat}
                onSelect={(v) => update({ responseFormat: v })}
                label="Steps"
                description="Numbered steps"
              />
              <OptionCard<ResponseFormat>
                value="explanation"
                selected={input.responseFormat}
                onSelect={(v) => update({ responseFormat: v })}
                label="Explanation"
                description="Clear explanation"
              />
              <OptionCard<ResponseFormat>
                value="both"
                selected={input.responseFormat}
                onSelect={(v) => update({ responseFormat: v })}
                label="Both"
                description="Steps + explanation"
              />
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="basic-rules" className="text-sm font-medium">
                Any rules to follow?{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <InfoTooltip
                content="Add constraints like 'avoid jargon', 'use examples', or 'keep it under 200 words'. Rules help the AI focus and produce more predictable results."
                label="More information about rules"
              />
            </div>
            <Textarea
              id="basic-rules"
              placeholder="Example: avoid jargon, use examples, keep it under 200 words"
              value={input.rules}
              onChange={(e) => update({ rules: e.target.value.slice(0, RULES_MAX_CHARS) })}
              className="min-h-[64px] resize-y"
              maxLength={RULES_MAX_CHARS}
            />
            <div className="flex justify-end">
              <CharCounter current={input.rules.length} max={RULES_MAX_CHARS} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
