import { useState, useRef, useCallback } from 'react';
import { Copy, Check, Download, FileText, FileJson, FolderArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { PromptEngineResult } from '@/types/prompt.types';
import { copyToClipboard, downloadFile, getExportFileName } from '@/lib/utils';
import { exportAsMarkdown } from '@/lib/exporters/markdown-exporter';
import { exportAsText } from '@/lib/exporters/text-exporter';
import { exportAsJson } from '@/lib/exporters/json-exporter';
import { exportAsZip } from '@/lib/exporters/zip-exporter';
import { INFO_MESSAGES } from '@/common/messages/info';
import { ERROR_MESSAGES } from '@/common/messages/error';
import { FILE_NAMES, EXPORT_EXTENSIONS } from '@/common/fileNames';

interface ExportButtonsProps {
  result: PromptEngineResult;
}

function useCopyConfirmation(timeout = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const markCopied = useCallback(
    (key: string) => {
      clearTimeout(timerRef.current);
      setCopiedKey(key);
      timerRef.current = setTimeout(() => setCopiedKey(null), timeout);
    },
    [timeout]
  );

  return { copiedKey, markCopied };
}

export function ExportButtons({ result }: ExportButtonsProps) {
  const { copiedKey, markCopied } = useCopyConfirmation();

  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(result.structuredPrompt);
    if (success) {
      markCopied('prompt');
      toast.success(INFO_MESSAGES.PROMPT_COPIED);
    } else {
      toast.error(ERROR_MESSAGES.CLIPBOARD_FAILED);
    }
  };

  const handleCopyMeta = async () => {
    const success = await copyToClipboard(result.metaPrompt);
    if (success) {
      markCopied('meta');
      toast.success(INFO_MESSAGES.META_COPIED);
    } else {
      toast.error(ERROR_MESSAGES.CLIPBOARD_FAILED);
    }
  };

  const handleDownloadMd = () => {
    const content = exportAsMarkdown(result);
    downloadFile(
      content,
      getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.MD),
      'text/markdown'
    );
    toast.success(INFO_MESSAGES.EXPORT_MD);
  };

  const handleDownloadTxt = () => {
    const content = exportAsText(result);
    downloadFile(
      content,
      getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.TXT),
      'text/plain'
    );
    toast.success(INFO_MESSAGES.EXPORT_TXT);
  };

  const handleDownloadJson = () => {
    const content = exportAsJson(result);
    downloadFile(
      content,
      getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.JSON),
      'application/json'
    );
    toast.success(INFO_MESSAGES.EXPORT_JSON);
  };

  const handleDownloadZip = async () => {
    try {
      const blob = await exportAsZip(result);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.ZIP);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(INFO_MESSAGES.EXPORT_ZIP);
    } catch {
      toast.error(ERROR_MESSAGES.ZIP_FAILED);
    }
  };

  const isPromptCopied = copiedKey === 'prompt';
  const isMetaCopied = copiedKey === 'meta';

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyPrompt}
        aria-label="Copy prompt to clipboard"
        className="rounded-lg"
      >
        {isPromptCopied ? (
          <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 mr-1.5" />
        )}
        {isPromptCopied ? 'Copied!' : 'Copy Prompt'}
      </Button>
      {result.metaPrompt && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyMeta}
          aria-label="Copy meta prompt to clipboard"
          className="rounded-lg"
        >
          {isMetaCopied ? (
            <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1.5" />
          )}
          {isMetaCopied ? 'Copied!' : 'Copy Meta'}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadMd}
        aria-label="Download as Markdown"
        className="rounded-lg"
      >
        <Download className="h-3.5 w-3.5 mr-1.5" />
        .md
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadTxt}
        aria-label="Download as Text"
        className="rounded-lg"
      >
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        .txt
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadJson}
        aria-label="Download as JSON"
        className="rounded-lg"
      >
        <FileJson className="h-3.5 w-3.5 mr-1.5" />
        .json
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadZip}
        aria-label="Download as ZIP"
        className="rounded-lg"
      >
        <FolderArchive className="h-3.5 w-3.5 mr-1.5" />
        .zip
      </Button>
    </div>
  );
}
