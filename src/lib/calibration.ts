/**
 * Calibration module: records actual token usage and computes
 * a correction factor to refine future estimates.
 */

const STORAGE_KEY = 'gcp-calibration-records';

export interface CalibrationRecord {
  id: string;
  timestamp: number;
  promptSnippet: string;            // first 100 chars
  estimatedInput: number;           // mid-point of estimate range
  estimatedOutput: number;          // mid-point of estimate range
  actualInput: number;
  actualOutput: number;
}

export interface CalibrationStats {
  totalRecords: number;
  avgInputRatio: number;            // actual / estimated (1.0 = perfect)
  avgOutputRatio: number;
  inputCorrectionFactor: number;    // multiplier to apply to estimates
  outputCorrectionFactor: number;
}

function loadRecords(): CalibrationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: CalibrationRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addCalibrationRecord(
  record: Omit<CalibrationRecord, 'id' | 'timestamp'>
): CalibrationRecord {
  const records = loadRecords();
  const newRecord: CalibrationRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  records.push(newRecord);
  // Keep last 100 records
  const trimmed = records.slice(-100);
  saveRecords(trimmed);
  return newRecord;
}

export function getCalibrationRecords(): CalibrationRecord[] {
  return loadRecords();
}

export function clearCalibrationRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCalibrationStats(): CalibrationStats {
  const records = loadRecords();
  if (records.length === 0) {
    return {
      totalRecords: 0,
      avgInputRatio: 1,
      avgOutputRatio: 1,
      inputCorrectionFactor: 1,
      outputCorrectionFactor: 1,
    };
  }

  let inputRatioSum = 0;
  let outputRatioSum = 0;
  let validInputCount = 0;
  let validOutputCount = 0;

  for (const r of records) {
    if (r.estimatedInput > 0 && r.actualInput > 0) {
      inputRatioSum += r.actualInput / r.estimatedInput;
      validInputCount++;
    }
    if (r.estimatedOutput > 0 && r.actualOutput > 0) {
      outputRatioSum += r.actualOutput / r.estimatedOutput;
      validOutputCount++;
    }
  }

  const avgInputRatio = validInputCount > 0 ? inputRatioSum / validInputCount : 1;
  const avgOutputRatio = validOutputCount > 0 ? outputRatioSum / validOutputCount : 1;

  return {
    totalRecords: records.length,
    avgInputRatio: Math.round(avgInputRatio * 100) / 100,
    avgOutputRatio: Math.round(avgOutputRatio * 100) / 100,
    inputCorrectionFactor: Math.round(avgInputRatio * 100) / 100,
    outputCorrectionFactor: Math.round(avgOutputRatio * 100) / 100,
  };
}
