import { useState } from 'react';
import { FileCode2, Download, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { PromptEngineResult } from '@/types/prompt.types';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { exportForCursor, type CursorExportType } from '@/lib/exporters/cursor-exporter';

interface CursorExportPanelProps {
  result: PromptEngineResult;
}

const EXPORT_TYPES: { type: CursorExportType; label: string; description: string }[] = [
  { type: 'rule', label: 'Rule (.mdc)', description: 'Cursor rules file for persistent guidance' },
  { type: 'agent', label: 'Agent (.md)', description: 'Specialized AI agent definition' },
  { type: 'skill', label: 'Skill', description: 'Step-by-step SKILL.md workflow' },
  { type: 'command', label: 'Command', description: 'Quick-action command snippet' },
];

export function CursorExportPanel({ result }: CursorExportPanelProps) {
  const [selected, setSelected] = useState<CursorExportType>('rule');
  const [name, setName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handlePreview = () => {
    if (!name.trim()) {
      toast.error('Enter a name for the export');
      return;
    }
    const { content } = exportForCursor(selected, result, { name: name.trim() });
    setPreview(content);
  };

  const handleDownload = () => {
    if (!name.trim()) {
      toast.error('Enter a name for the export');
      return;
    }
    const { content, filename, mimeType } = exportForCursor(selected, result, {
      name: name.trim(),
    });
    downloadFile(content, filename, mimeType);
    toast.success(`Downloaded as ${filename}`);
  };

  const handleCopy = async () => {
    if (!name.trim()) {
      toast.error('Enter a name for the export');
      return;
    }
    const { content } = exportForCursor(selected, result, { name: name.trim() });
    const ok = await copyToClipboard(content);
    if (ok) toast.success('Copied to clipboard');
    else toast.error('Failed to copy');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-cyan-500" />
          <CardTitle className="text-sm font-medium">Cursor Export</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Type selector */}
        <div className="flex flex-wrap gap-1.5">
          {EXPORT_TYPES.map((et) => (
            <button
              key={et.type}
              onClick={() => {
                setSelected(et.type);
                setPreview(null);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                selected === et.type
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
              }`}
            >
              {et.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {EXPORT_TYPES.find((e) => e.type === selected)?.description}
        </p>

        {/* Name input */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPreview(null);
            }}
            placeholder="e.g. Code Review Helper"
            className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview} disabled={!name.trim()}>
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!name.trim()}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={!name.trim()}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>

        {/* Preview */}
        {preview && (
          <div className="rounded-md border bg-muted/30 p-3 max-h-64 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">{preview}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
