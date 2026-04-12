import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileTabLayoutProps {
  form: ReactNode;
  results: ReactNode;
}

export function MobileTabLayout({ form, results }: MobileTabLayoutProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'results'>('form');

  return (
    <>
      {/* Mobile: tab bar + single panel */}
      <div className="lg:hidden">
        <div
          className="flex rounded-xl border border-border/50 bg-muted/50 p-1 mb-5"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'form'}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
              activeTab === 'form'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTab('form')}
          >
            Form
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'results'}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
              activeTab === 'results'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
        </div>
        <div role="tabpanel">{activeTab === 'form' ? form : results}</div>
      </div>

      {/* Desktop: two-column grid — form narrower, results wider */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(17rem,5fr)_minmax(0,6fr)] gap-5 items-start">
        <div className="sticky top-16 min-w-0">{form}</div>
        <div className="min-w-0">{results}</div>
      </div>
    </>
  );
}
