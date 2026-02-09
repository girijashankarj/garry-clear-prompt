import { useMemo } from 'react';
import { Brain, MessageCircleQuestion, Terminal, FileText, GitCompare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzePromptNlp, type NlpAnalysis, type PromptIntent } from '@/lib/engine/nlp-analyzer';

interface NlpAnalysisPanelProps {
  text: string;
}

const INTENT_CONFIG: Record<PromptIntent, { label: string; icon: typeof Brain; color: string }> = {
  question: { label: 'Question', icon: MessageCircleQuestion, color: 'text-blue-500' },
  instruction: { label: 'Instruction', icon: Terminal, color: 'text-emerald-500' },
  description: { label: 'Description', icon: FileText, color: 'text-amber-500' },
  comparison: { label: 'Comparison', icon: GitCompare, color: 'text-violet-500' },
  unknown: { label: 'Unknown', icon: Brain, color: 'text-muted-foreground' },
};

const COMPLEXITY_COLORS = {
  simple: 'bg-emerald-500/10 text-emerald-500',
  moderate: 'bg-amber-500/10 text-amber-500',
  complex: 'bg-red-500/10 text-red-500',
};

export function NlpAnalysisPanel({ text }: NlpAnalysisPanelProps) {
  const analysis: NlpAnalysis = useMemo(() => analyzePromptNlp(text), [text]);

  if (!text.trim()) return null;

  const intentConfig = INTENT_CONFIG[analysis.intent];
  const IntentIcon = intentConfig.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-pink-500" />
          <CardTitle className="text-sm font-medium">NLP Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Intent + Complexity badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <IntentIcon className={`h-3.5 w-3.5 ${intentConfig.color}`} />
            <Badge variant="secondary" className="text-xs">{intentConfig.label}</Badge>
          </div>
          <Badge className={`text-xs ${COMPLEXITY_COLORS[analysis.complexity]}`}>
            {analysis.complexity}
          </Badge>
          <Badge variant="outline" className="text-xs tabular-nums">
            Grade {analysis.readabilityGrade}
          </Badge>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Words" value={analysis.wordCount} />
          <StatBox label="Sentences" value={analysis.sentenceCount} />
          <StatBox label="Avg/Sent" value={analysis.avgWordsPerSentence} />
          <StatBox label="Nouns" value={analysis.nounCount} />
          <StatBox label="Verbs" value={analysis.verbCount} />
          <StatBox label="Questions" value={analysis.questionCount} />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-1.5">
          {analysis.hasList && <Badge variant="outline" className="text-[10px]">Has list</Badge>}
          {analysis.hasConditional && <Badge variant="outline" className="text-[10px]">Conditional</Badge>}
          {analysis.hasNegation && <Badge variant="outline" className="text-[10px]">Negation</Badge>}
        </div>

        {/* Top nouns/verbs */}
        {(analysis.topNouns.length > 0 || analysis.topVerbs.length > 0) && (
          <div className="space-y-1.5">
            {analysis.topNouns.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">Key nouns: </span>
                <span className="font-medium">{analysis.topNouns.join(', ')}</span>
              </div>
            )}
            {analysis.topVerbs.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">Key verbs: </span>
                <span className="font-medium">{analysis.topVerbs.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-2 text-center">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
