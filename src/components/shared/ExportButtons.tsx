import { Copy, Download, FileText, FileJson, FolderArchive } from 'lucide-react';
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

export function ExportButtons({ result }: ExportButtonsProps) {
  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(result.structuredPrompt);
    if (success) {
      toast.success(INFO_MESSAGES.PROMPT_COPIED);
    } else {
      toast.error(ERROR_MESSAGES.CLIPBOARD_FAILED);
    }
  };

  const handleCopyMeta = async () => {
    const success = await copyToClipboard(result.metaPrompt);
    if (success) {
      toast.success(INFO_MESSAGES.META_COPIED);
    } else {
      toast.error(ERROR_MESSAGES.CLIPBOARD_FAILED);
    }
  };

  const handleDownloadMd = () => {
    const content = exportAsMarkdown(result);
    downloadFile(content, getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.MD), 'text/markdown');
    toast.success(INFO_MESSAGES.EXPORT_MD);
  };

  const handleDownloadTxt = () => {
    const content = exportAsText(result);
    downloadFile(content, getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.TXT), 'text/plain');
    toast.success(INFO_MESSAGES.EXPORT_TXT);
  };

  const handleDownloadJson = () => {
    const content = exportAsJson(result);
    downloadFile(content, getExportFileName(FILE_NAMES.EXPORT_BASE, EXPORT_EXTENSIONS.JSON), 'application/json');
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
      <Button variant="outline" size="sm" onClick={handleDownloadZip}>
        <FolderArchive className="h-4 w-4 mr-1.5" />
        .zip
      </Button>
    </div>
  );
}
