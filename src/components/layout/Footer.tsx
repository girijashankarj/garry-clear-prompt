import { APP_NAME, PUBLIC_TECH_STACK } from '@/common/constants';
import { FOOTER_COPY } from '@/common/messages/info';

export function Footer() {
  return (
    <footer
      className="border-t border-border/30 bg-background/30 backdrop-blur-sm mt-auto"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-center space-y-3">
        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
          {APP_NAME} -- Clarity before cleverness. Structure before size. Constraints before
          creativity.
        </p>
        <div className="text-[11px] sm:text-xs text-muted-foreground/70 leading-relaxed max-w-3xl mx-auto">
          <p className="mb-2">{FOOTER_COPY.OPEN_SOURCE_INTRO}</p>
          <nav aria-label={FOOTER_COPY.STACK_NAV_LABEL}>
            <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1 list-none p-0 m-0">
              {PUBLIC_TECH_STACK.map((item, index) => (
                <li key={item.href} className="inline-flex items-center">
                  {index > 0 ? (
                    <span className="text-muted-foreground/40 select-none mr-2" aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:text-foreground/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                    aria-label={`${item.label}: ${FOOTER_COPY.STACK_LINK_SUFFIX}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
