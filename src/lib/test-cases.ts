/**
 * Prompt Test Cases: user adds input/expected-output pairs
 * to validate prompt behavior offline.
 */

const STORAGE_KEY = 'gcp-prompt-test-cases';

export interface PromptTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  notes: string;
  createdAt: number;
}

export interface PromptTestSuite {
  id: string;
  name: string;
  promptSnippet: string;      // first 100 chars of the prompt this suite is for
  cases: PromptTestCase[];
  createdAt: number;
  updatedAt: number;
}

function loadSuites(): PromptTestSuite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSuites(suites: PromptTestSuite[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suites));
}

export function getTestSuites(): PromptTestSuite[] {
  return loadSuites();
}

export function createTestSuite(name: string, promptSnippet: string): PromptTestSuite {
  const suites = loadSuites();
  const suite: PromptTestSuite = {
    id: crypto.randomUUID(),
    name,
    promptSnippet: promptSnippet.slice(0, 100),
    cases: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  suites.push(suite);
  saveSuites(suites);
  return suite;
}

export function addTestCase(
  suiteId: string,
  input: string,
  expectedOutput: string,
  notes: string = ''
): PromptTestCase | null {
  const suites = loadSuites();
  const suite = suites.find(s => s.id === suiteId);
  if (!suite) return null;

  if (suite.cases.length >= 10) return null; // max 10 per suite

  const tc: PromptTestCase = {
    id: crypto.randomUUID(),
    input,
    expectedOutput,
    notes,
    createdAt: Date.now(),
  };
  suite.cases.push(tc);
  suite.updatedAt = Date.now();
  saveSuites(suites);
  return tc;
}

export function removeTestCase(suiteId: string, caseId: string): void {
  const suites = loadSuites();
  const suite = suites.find(s => s.id === suiteId);
  if (!suite) return;
  suite.cases = suite.cases.filter(c => c.id !== caseId);
  suite.updatedAt = Date.now();
  saveSuites(suites);
}

export function deleteTestSuite(suiteId: string): void {
  const suites = loadSuites().filter(s => s.id !== suiteId);
  saveSuites(suites);
}

export function exportTestSuiteAsJson(suite: PromptTestSuite): string {
  return JSON.stringify(suite, null, 2);
}
