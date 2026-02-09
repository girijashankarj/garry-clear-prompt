import { APP_NAME } from '@/common/constants';

export function Footer() {
  return (
    <footer className="border-t bg-background/50 mt-auto" role="contentinfo">
      <div className="mx-auto max-w-5xl px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          {APP_NAME} -- Clarity before cleverness. Structure before size. Constraints before creativity.
        </p>
      </div>
    </footer>
  );
}
