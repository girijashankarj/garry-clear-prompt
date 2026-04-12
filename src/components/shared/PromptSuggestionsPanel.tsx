import { useMemo } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { findSimilarPrompts, type PromptSuggestion } from '@/lib/prompt-suggestions';

interface PromptSuggestionsPanelProps {
  currentText: string;
  mode: 'basic' | 'advanced';
  onApply: (prompt: string) => void;
}

export function PromptSuggestionsPanel({
  currentText,
  mode,
  onApply,
}: PromptSuggestionsPanelProps) {
  const suggestions: PromptSuggestion[] = useMemo(
    () => findSimilarPrompts(currentText, 5, mode),
    [currentText, mode]
  );

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-sm font-medium">Similar Prompts from History</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {suggestions.map((s) => (
          <button
            key={s.version.id}
            onClick={() => onApply(s.version.prompt)}
            className="w-full text-left rounded-md border p-2.5 text-xs hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                    {s.version.label}
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] tabular-nums shrink-0">
                    {Math.round(s.similarity * 100)}% match
                  </Badge>
                  <Badge variant="outline" className="text-[9px] tabular-nums shrink-0">
                    Score: {s.version.score}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2">{s.version.prompt}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  Keywords: {s.matchedKeywords.slice(0, 5).join(', ')}
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
