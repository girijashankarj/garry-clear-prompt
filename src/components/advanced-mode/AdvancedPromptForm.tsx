import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type {
  AdvancedPromptInput, TaskType, Complexity,
  RiskLevel, ContextSize, OutputSize,
} from '@/types/prompt.types';
import { TASK_TYPE_LABELS } from '@/lib/data/model-tiers';

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
    <div className="space-y-4">
      {/* Prompt Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write your prompt here..."
            value={input.prompt}
            onChange={(e) => update({ prompt: e.target.value })}
            className="min-h-[140px] text-sm font-mono resize-y"
          />
          <p className="text-xs text-muted-foreground">
            {input.prompt.length > 0 ? `${input.prompt.trim().split(/\s+/).length} words | ~${Math.ceil(input.prompt.length / 4)} tokens` : 'Start writing your prompt'}
          </p>
        </CardContent>
      </Card>

      {/* Meta Prompt */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Meta Prompt (System Instructions)</CardTitle>
            <span className="text-xs text-muted-foreground">Optional -- auto-generated if empty</span>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Define how the model should behave... (leave empty for auto-generation)"
            value={input.metaPrompt}
            onChange={(e) => update({ metaPrompt: e.target.value })}
            className="min-h-[80px] text-sm font-mono resize-y"
          />
        </CardContent>
      </Card>

      {/* Task Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Task Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Task Type</Label>
              <Select value={input.taskType} onValueChange={(v) => update({ taskType: v as TaskType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Complexity</Label>
              <Select value={input.complexity} onValueChange={(v) => update({ complexity: v as Complexity })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Risk Level</Label>
              <Select value={input.riskLevel} onValueChange={(v) => update({ riskLevel: v as RiskLevel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Context Size</Label>
              <Select value={input.contextSize} onValueChange={(v) => update({ contextSize: v as ContextSize })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Expected Output Size</Label>
              <Select value={input.outputSize} onValueChange={(v) => update({ outputSize: v as OutputSize })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS (1 paragraph)</SelectItem>
                  <SelectItem value="s">S (short list)</SelectItem>
                  <SelectItem value="m">M (detailed steps)</SelectItem>
                  <SelectItem value="l">L (deep + examples)</SelectItem>
                  <SelectItem value="xl">XL (full document)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="audience" className="text-xs">Target Audience</Label>
              <input
                id="audience"
                type="text"
                placeholder="e.g., senior developer"
                value={input.audience}
                onChange={(e) => update({ audience: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Format & Toggles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Output Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="plan-first" className="text-sm">Plan before answering</Label>
              <Switch id="plan-first" checked={input.planFirst} onCheckedChange={(v) => update({ planFirst: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="strict-json" className="text-sm">Strict JSON output</Label>
              <Switch id="strict-json" checked={input.outputFormat.strictJson} onCheckedChange={(v) => updateFormat('strictJson', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-code" className="text-sm">Include code examples</Label>
              <Switch id="include-code" checked={input.outputFormat.includeCode} onCheckedChange={(v) => updateFormat('includeCode', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-tables" className="text-sm">Include tables</Label>
              <Switch id="include-tables" checked={input.outputFormat.includeTables} onCheckedChange={(v) => updateFormat('includeTables', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-diagrams" className="text-sm">Include diagrams</Label>
              <Switch id="include-diagrams" checked={input.outputFormat.includeDiagrams} onCheckedChange={(v) => updateFormat('includeDiagrams', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-examples" className="text-sm">Include examples</Label>
              <Switch id="include-examples" checked={input.outputFormat.includeExamples} onCheckedChange={(v) => updateFormat('includeExamples', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="needs-tool" className="text-sm">Needs tool / MCP access</Label>
              <Switch id="needs-tool" checked={input.needsToolUse} onCheckedChange={(v) => update({ needsToolUse: v })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
