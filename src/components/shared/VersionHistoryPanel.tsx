import { useState, useCallback, useEffect } from 'react';
import { History, Save, Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { INFO_MESSAGES } from '@/common/messages/info';
import { ERROR_MESSAGES } from '@/common/messages/error';
import {
  getPromptVersions,
  savePromptVersion,
  deletePromptVersion,
  clearPromptVersions,
  type PromptVersion,
} from '@/lib/versioning';

interface VersionHistoryPanelProps {
  currentPrompt: string;
  currentMetaPrompt: string;
  currentScore: number;
  mode: 'basic' | 'advanced';
  onRestore: (prompt: string) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function VersionHistoryPanel({
  currentPrompt,
  currentMetaPrompt,
  currentScore,
  mode,
  onRestore,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<PromptVersion[]>([]);

  const refresh = useCallback(() => {
    setVersions(getPromptVersions(mode));
  }, [mode]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSave = () => {
    if (!currentPrompt.trim()) {
      toast.error(ERROR_MESSAGES.PROMPT_EMPTY);
      return;
    }
    const v = savePromptVersion(currentPrompt, currentMetaPrompt, currentScore, mode);
    refresh();
    toast.success(`${INFO_MESSAGES.VERSION_SAVED} as ${v.label}`);
  };

  const handleRestore = (v: PromptVersion) => {
    onRestore(v.prompt);
    toast.success(`${INFO_MESSAGES.VERSION_RESTORED} ${v.label}`);
  };

  const handleDelete = (id: string) => {
    deletePromptVersion(id);
    refresh();
    toast.success(INFO_MESSAGES.VERSION_DELETED);
  };

  const handleClear = () => {
    clearPromptVersions(mode);
    refresh();
    toast.success(INFO_MESSAGES.VERSION_CLEARED);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-500" />
          <CardTitle className="text-sm font-medium">Version History</CardTitle>
          {versions.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">{versions.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Save current */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!currentPrompt.trim()}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Version
          </Button>
          {versions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Clear All
            </Button>
          )}
        </div>

        {/* Version list */}
        {versions.length > 0 && (
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {[...versions].reverse().map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-2 rounded-md border p-2 text-xs group hover:bg-muted/50 transition-colors"
              >
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">{v.label}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-muted-foreground">{v.prompt.slice(0, 60)}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    Score: {v.score} &middot; {formatTime(v.timestamp)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleRestore(v)}
                    className="p-1 rounded hover:bg-muted"
                    title="Restore this version"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1 rounded hover:bg-destructive/10 text-destructive"
                    title="Delete this version"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {versions.length === 0 && (
          <p className="text-xs text-muted-foreground">No saved versions yet. Save your prompt to track changes over time.</p>
        )}
      </CardContent>
    </Card>
  );
}
