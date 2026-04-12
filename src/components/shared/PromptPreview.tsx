import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PromptPreviewProps {
  title: string;
  content: string;
  maxHeight?: string;
}

export function PromptPreview({ title, content, maxHeight = '300px' }: PromptPreviewProps) {
  if (!content.trim()) return null;

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }} className="rounded-lg border bg-muted/30 p-3">
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
