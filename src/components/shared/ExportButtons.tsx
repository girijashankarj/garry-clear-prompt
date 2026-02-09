import { Copy, Download, FileText, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { PromptEngineResult } from '@/types/prompt.types';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { exportAsMarkdown } from '@/lib/exporters/markdown-exporter';
import { exportAsText } from '@/lib/exporters/text-exporter';
import { exportAsJson } from '@/lib/exporters/json-exporter';

interface ExportButtonsProps {
  result: PromptEngineResult;
}

export function ExportButtons({ result }: ExportButtonsProps) {
  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(result.structuredPrompt);
    if (success) {
      toast.success('Prompt copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleCopyMeta = async () => {
    const success = await copyToClipboard(result.metaPrompt);
    if (success) {
      toast.success('Meta prompt copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadMd = () => {
    const content = exportAsMarkdown(result);
    downloadFile(content, 'prompt-export.md', 'text/markdown');
    toast.success('Downloaded as Markdown');
  };

  const handleDownloadTxt = () => {
    const content = exportAsText(result);
    downloadFile(content, 'prompt-export.txt', 'text/plain');
    toast.success('Downloaded as Text');
  };

  const handleDownloadJson = () => {
    const content = exportAsJson(result);
    downloadFile(content, 'prompt-export.json', 'application/json');
    toast.success('Downloaded as JSON');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
        <Copy className="h-4 w-4 mr-1.5" />
        Copy Prompt
      </Button>
      {result.metaPrompt && (
        <Button variant="outline" size="sm" onClick={handleCopyMeta}>
          <Copy className="h-4 w-4 mr-1.5" />
          Copy Meta
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={handleDownloadMd}>
        <Download className="h-4 w-4 mr-1.5" />
        .md
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
        <FileText className="h-4 w-4 mr-1.5" />
        .txt
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadJson}>
        <FileJson className="h-4 w-4 mr-1.5" />
        .json
      </Button>
    </div>
  );
}
