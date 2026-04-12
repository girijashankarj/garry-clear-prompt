import { Card, CardContent, CardHeader } from '@/components/ui/card';

function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ''}`} />;
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-5">
      {/* Left: form skeleton */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Pulse className="h-4 w-48" />
          <Pulse className="h-[120px] w-full rounded-md" />
          <Pulse className="h-3 w-64" />
        </div>
        <Card>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Pulse className="h-3 w-40" />
                <div className="grid grid-cols-3 gap-2">
                  <Pulse className="h-12 rounded-lg" />
                  <Pulse className="h-12 rounded-lg" />
                  <Pulse className="h-12 rounded-lg" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right: results skeleton */}
      <div className="space-y-3">
        <Card>
          <CardContent className="pt-3">
            <div className="flex items-start gap-4">
              <Pulse className="h-[100px] w-[100px] rounded-full shrink-0" />
              <div className="flex-1 space-y-2.5 pt-1">
                <Pulse className="h-4 w-36" />
                <Pulse className="h-3 w-56" />
                <div className="space-y-2 pt-1">
                  <Pulse className="h-3 w-full" />
                  <Pulse className="h-3 w-4/5" />
                  <Pulse className="h-3 w-3/5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <Pulse className="h-3 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Pulse className="h-3 w-full" />
            <Pulse className="h-3 w-4/5" />
            <Pulse className="h-3 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <Pulse className="h-3 w-24" />
          </CardHeader>
          <CardContent>
            <Pulse className="h-16 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
