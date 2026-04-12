import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  AdvancedPromptInput,
  TaskType,
  Complexity,
  RiskLevel,
  ContextSize,
  OutputSize,
} from '@/types/prompt.types';
import { TASK_TYPE_LABELS } from '@/lib/data/model-tiers';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { CharCounter } from '@/components/shared/CharCounter';

const PROMPT_MAX_CHARS = 10000;
const META_MAX_CHARS = 4000;
const AUDIENCE_MAX_CHARS = 200;

interface AdvancedPromptFormProps {
  input: AdvancedPromptInput;
  onChange: (input: AdvancedPromptInput) => void;
}

export function AdvancedPromptForm({ input, onChange }: AdvancedPromptFormProps) {
  const update = (partial: Partial<AdvancedPromptInput>) => {
    onChange({ ...input, ...partial });
  };

  const updateFormat = (key: keyof AdvancedPromptInput['outputFormat'], value: boolean) => {
    onChange({
      ...input,
      outputFormat: { ...input.outputFormat, [key]: value },
    });
  };

  return (
    <div className="space-y-3">
      {/* Prompt Editor */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-semibold tracking-tight">Prompt</CardTitle>
            <InfoTooltip
              content="Your main prompt text. This is what gets sent to the AI model. Be specific about your task, include constraints, and specify output format for the best results."
              label="More information about prompt"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Write your prompt here..."
            value={input.prompt}
            onChange={(e) => update({ prompt: e.target.value.slice(0, PROMPT_MAX_CHARS) })}
            className="min-h-[120px] text-sm font-mono resize-y focus:ring-primary/30"
            maxLength={PROMPT_MAX_CHARS}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {input.prompt.length > 0
                ? `~${Math.ceil(input.prompt.length / 4)} estimated tokens`
                : 'Start writing your prompt'}
            </p>
            <CharCounter
              current={input.prompt.length}
              max={PROMPT_MAX_CHARS}
              showWords
              text={input.prompt}
            />
          </div>
        </CardContent>
      </Card>

      {/* Meta Prompt */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-semibold tracking-tight">
                Meta Prompt (System Instructions)
              </CardTitle>
              <InfoTooltip
                content="System instructions that define how the AI should behave. If left empty, one is auto-generated based on your task configuration below."
                label="More information about meta prompt"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">Optional</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <Textarea
            placeholder="Define how the model should behave... (leave empty for auto-generation)"
            value={input.metaPrompt}
            onChange={(e) => update({ metaPrompt: e.target.value.slice(0, META_MAX_CHARS) })}
            className="min-h-[64px] text-sm font-mono resize-y"
            maxLength={META_MAX_CHARS}
          />
          <div className="flex justify-end">
            <CharCounter current={input.metaPrompt.length} max={META_MAX_CHARS} />
          </div>
        </CardContent>
      </Card>

      {/* Task Configuration + Output Format merged */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-semibold tracking-tight">
              Task Configuration
            </CardTitle>
            <InfoTooltip
              content="These settings drive the Model Advisor and Token Estimator. They help recommend the right AI model tier and estimate costs for your specific task."
              label="More information about task configuration"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Task Type</Label>
                <InfoTooltip
                  content="What kind of work you're doing. Affects model recommendation -- debugging and design tasks favor reasoning models."
                  side="right"
                  label="More information about task type"
                />
              </div>
              <Select
                value={input.taskType}
                onValueChange={(v) => update({ taskType: v as TaskType })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Complexity</Label>
                <InfoTooltip
                  content="How complex is your task? High complexity tasks are routed to reasoning-tier models for better results."
                  side="right"
                  label="More information about complexity"
                />
              </div>
              <Select
                value={input.complexity}
                onValueChange={(v) => update({ complexity: v as Complexity })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Risk Level</Label>
                <InfoTooltip
                  content="How critical is accuracy? High-risk tasks (production code, security) favor slower, more careful models."
                  side="right"
                  label="More information about risk level"
                />
              </div>
              <Select
                value={input.riskLevel}
                onValueChange={(v) => update({ riskLevel: v as RiskLevel })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Context Size</Label>
                <InfoTooltip
                  content="How much context will you provide? Large contexts (many files, long docs) favor models with bigger context windows."
                  side="right"
                  label="More information about context size"
                />
              </div>
              <Select
                value={input.contextSize}
                onValueChange={(v) => update({ contextSize: v as ContextSize })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Output Size</Label>
                <InfoTooltip
                  content="How long should the AI response be? This drives the token estimate and cost calculation. XS = 1 paragraph, XL = full document."
                  side="right"
                  label="More information about output size"
                />
              </div>
              <Select
                value={input.outputSize}
                onValueChange={(v) => update({ outputSize: v as OutputSize })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS (1 paragraph)</SelectItem>
                  <SelectItem value="s">S (short list)</SelectItem>
                  <SelectItem value="m">M (detailed steps)</SelectItem>
                  <SelectItem value="l">L (deep + examples)</SelectItem>
                  <SelectItem value="xl">XL (full document)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Label htmlFor="audience" className="text-xs">
                  Target Audience
                </Label>
                <InfoTooltip
                  content="Who is the output for? Specifying 'beginner', 'senior developer', or 'management' helps the AI adjust complexity and vocabulary."
                  side="right"
                  label="More information about target audience"
                />
              </div>
              <input
                id="audience"
                type="text"
                placeholder="e.g., senior developer"
                value={input.audience}
                onChange={(e) => update({ audience: e.target.value.slice(0, AUDIENCE_MAX_CHARS) })}
                maxLength={AUDIENCE_MAX_CHARS}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Output Format toggles — compact 2-col grid */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-xs font-semibold tracking-tight">Output Format</span>
              <InfoTooltip
                content="Toggle output features to include in your prompt. Each option adds format multipliers that affect the token estimate."
                label="More information about output format"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="plan-first" className="text-xs">
                  Plan before answering
                </Label>
                <Switch
                  id="plan-first"
                  checked={input.planFirst}
                  onCheckedChange={(v) => update({ planFirst: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="strict-json" className="text-xs">
                  Strict JSON output
                </Label>
                <Switch
                  id="strict-json"
                  checked={input.outputFormat.strictJson}
                  onCheckedChange={(v) => updateFormat('strictJson', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-code" className="text-xs">
                  Include code examples
                </Label>
                <Switch
                  id="include-code"
                  checked={input.outputFormat.includeCode}
                  onCheckedChange={(v) => updateFormat('includeCode', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-tables" className="text-xs">
                  Include tables
                </Label>
                <Switch
                  id="include-tables"
                  checked={input.outputFormat.includeTables}
                  onCheckedChange={(v) => updateFormat('includeTables', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-diagrams" className="text-xs">
                  Include diagrams
                </Label>
                <Switch
                  id="include-diagrams"
                  checked={input.outputFormat.includeDiagrams}
                  onCheckedChange={(v) => updateFormat('includeDiagrams', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-examples" className="text-xs">
                  Include examples
                </Label>
                <Switch
                  id="include-examples"
                  checked={input.outputFormat.includeExamples}
                  onCheckedChange={(v) => updateFormat('includeExamples', v)}
                />
              </div>
              <div className="flex items-center justify-between col-span-2">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="needs-tool" className="text-xs">
                    Needs tool / MCP access
                  </Label>
                  <InfoTooltip
                    content="Enable if the task requires external tools (database, browser, filesystem). This triggers MCP tool suggestions and favors models with tool-use capability."
                    side="right"
                    label="More information about tool access"
                  />
                </div>
                <Switch
                  id="needs-tool"
                  checked={input.needsToolUse}
                  onCheckedChange={(v) => update({ needsToolUse: v })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
