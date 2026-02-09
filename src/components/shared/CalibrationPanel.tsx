import { useState, useEffect, useCallback } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { INFO_MESSAGES } from '@/common/messages/info';
import { ERROR_MESSAGES } from '@/common/messages/error';
import type { TokenEstimate } from '@/types/prompt.types';
import {
  addCalibrationRecord,
  getCalibrationStats,
  getCalibrationRecords,
  clearCalibrationRecords,
  type CalibrationStats,
  type CalibrationRecord,
} from '@/lib/calibration';

interface CalibrationPanelProps {
  promptSnippet: string;
  tokenEstimate: TokenEstimate;
}

export function CalibrationPanel({ promptSnippet, tokenEstimate }: CalibrationPanelProps) {
  const [stats, setStats] = useState<CalibrationStats | null>(null);
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [actualInput, setActualInput] = useState('');
  const [actualOutput, setActualOutput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(() => {
    setStats(getCalibrationStats());
    setRecords(getCalibrationRecords());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAdd = () => {
    const ai = parseInt(actualInput, 10);
    const ao = parseInt(actualOutput, 10);
    if (isNaN(ai) || isNaN(ao) || ai <= 0 || ao <= 0) {
      toast.error(ERROR_MESSAGES.INVALID_INPUT);
      return;
    }

    const estInput = Math.round((tokenEstimate.inputTokens.low + tokenEstimate.inputTokens.high) / 2);
    const estOutput = Math.round((tokenEstimate.outputTokens.low + tokenEstimate.outputTokens.high) / 2);

    addCalibrationRecord({
      promptSnippet: promptSnippet.slice(0, 100),
      estimatedInput: estInput,
      estimatedOutput: estOutput,
      actualInput: ai,
      actualOutput: ao,
    });

    setActualInput('');
    setActualOutput('');
    setShowForm(false);
    refresh();
    toast.success(INFO_MESSAGES.CALIBRATION_RECORDED);
  };

  const handleClear = () => {
    clearCalibrationRecords();
    refresh();
    toast.success(INFO_MESSAGES.CALIBRATION_CLEARED);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-500" />
          <CardTitle className="text-sm font-medium">Token Calibration</CardTitle>
          {stats && stats.totalRecords > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {stats.totalRecords} records
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Record actual token usage after running prompts to refine future estimates.
        </p>

        {/* Correction factors */}
        {stats && stats.totalRecords > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Input Factor</p>
              <p className="text-lg font-bold tabular-nums">{stats.inputCorrectionFactor}x</p>
              <p className="text-[10px] text-muted-foreground">avg ratio: {stats.avgInputRatio}</p>
            </div>
            <div className="rounded-md border p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Output Factor</p>
              <p className="text-lg font-bold tabular-nums">{stats.outputCorrectionFactor}x</p>
              <p className="text-[10px] text-muted-foreground">avg ratio: {stats.avgOutputRatio}</p>
            </div>
          </div>
        )}

        {/* Add form */}
        {showForm ? (
          <div className="space-y-2 rounded-md border p-3 bg-muted/30">
            <p className="text-xs font-medium">Enter actual token counts from your model:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Actual Input Tokens</label>
                <input
                  type="number"
                  min="1"
                  value={actualInput}
                  onChange={(e) => setActualInput(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Actual Output Tokens</label>
                <input
                  type="number"
                  min="1"
                  value={actualOutput}
                  onChange={(e) => setActualOutput(e.target.value)}
                  placeholder="e.g. 800"
                  className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAdd}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)} disabled={!promptSnippet.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Record
            </Button>
            {records.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Recent records */}
        {records.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent records</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {records.slice(-5).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between text-[11px] text-muted-foreground py-0.5">
                  <span className="truncate max-w-[120px]">{r.promptSnippet || '...'}</span>
                  <span className="tabular-nums">
                    est {r.estimatedInput}/{r.estimatedOutput} → actual {r.actualInput}/{r.actualOutput}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
