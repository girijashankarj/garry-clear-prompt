import { useState, useCallback, useEffect } from 'react';
import { FlaskConical, Plus, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import {
  getTestSuites,
  createTestSuite,
  addTestCase,
  removeTestCase,
  deleteTestSuite,
  exportTestSuiteAsJson,
  type PromptTestSuite,
} from '@/lib/test-cases';

interface TestCasesPanelProps {
  promptSnippet: string;
}

export function TestCasesPanel({ promptSnippet }: TestCasesPanelProps) {
  const [suites, setSuites] = useState<PromptTestSuite[]>([]);
  const [activeSuiteId, setActiveSuiteId] = useState<string | null>(null);
  const [showNewSuite, setShowNewSuite] = useState(false);
  const [suiteName, setSuiteName] = useState('');
  const [showAddCase, setShowAddCase] = useState(false);
  const [caseInput, setCaseInput] = useState('');
  const [caseExpected, setCaseExpected] = useState('');
  const [caseNotes, setCaseNotes] = useState('');

  const refresh = useCallback(() => {
    const all = getTestSuites();
    setSuites(all);
    if (activeSuiteId && !all.find(s => s.id === activeSuiteId)) {
      setActiveSuiteId(all.length > 0 ? all[all.length - 1].id : null);
    }
  }, [activeSuiteId]);

  useEffect(() => { refresh(); }, [refresh]);

  const activeSuite = suites.find(s => s.id === activeSuiteId) || null;

  const handleCreateSuite = () => {
    if (!suiteName.trim()) {
      toast.error('Enter a suite name');
      return;
    }
    const s = createTestSuite(suiteName.trim(), promptSnippet);
    setSuiteName('');
    setShowNewSuite(false);
    setActiveSuiteId(s.id);
    refresh();
    toast.success(`Created test suite "${s.name}"`);
  };

  const handleAddCase = () => {
    if (!activeSuiteId) return;
    if (!caseInput.trim()) { toast.error('Input is required'); return; }
    if (!caseExpected.trim()) { toast.error('Expected output is required'); return; }

    const tc = addTestCase(activeSuiteId, caseInput.trim(), caseExpected.trim(), caseNotes.trim());
    if (!tc) {
      toast.error('Max 10 test cases per suite');
      return;
    }
    setCaseInput('');
    setCaseExpected('');
    setCaseNotes('');
    setShowAddCase(false);
    refresh();
    toast.success('Test case added');
  };

  const handleRemoveCase = (caseId: string) => {
    if (!activeSuiteId) return;
    removeTestCase(activeSuiteId, caseId);
    refresh();
  };

  const handleDeleteSuite = (id: string) => {
    deleteTestSuite(id);
    if (activeSuiteId === id) setActiveSuiteId(null);
    refresh();
    toast.success('Suite deleted');
  };

  const handleExport = () => {
    if (!activeSuite) return;
    const json = exportTestSuiteAsJson(activeSuite);
    downloadFile(json, `test-suite-${activeSuite.name.replace(/\s+/g, '-').toLowerCase()}.json`, 'application/json');
    toast.success('Exported test suite');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-orange-500" />
          <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
          {activeSuite && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {activeSuite.cases.length}/10
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Add test cases to validate your prompt produces expected outputs.
        </p>

        {/* Suite selector */}
        {suites.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suites.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSuiteId(s.id)}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                  activeSuiteId === s.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                }`}
              >
                {s.name} ({s.cases.length})
              </button>
            ))}
          </div>
        )}

        {/* Create new suite */}
        {showNewSuite ? (
          <div className="space-y-2 rounded-md border p-2.5 bg-muted/30">
            <input
              type="text"
              value={suiteName}
              onChange={(e) => setSuiteName(e.target.value)}
              placeholder="Suite name, e.g. 'Email Generation Tests'"
              className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateSuite}>Create</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowNewSuite(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowNewSuite(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Suite
          </Button>
        )}

        {/* Active suite content */}
        {activeSuite && (
          <div className="space-y-2">
            {/* Suite actions */}
            <div className="flex gap-2">
              {!showAddCase && activeSuite.cases.length < 10 && (
                <Button variant="outline" size="sm" onClick={() => setShowAddCase(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Case
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteSuite(activeSuite.id)}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5 text-destructive" />
              </Button>
            </div>

            {/* Add case form */}
            {showAddCase && (
              <div className="space-y-2 rounded-md border p-2.5 bg-muted/30">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Test Input</label>
                  <Textarea
                    value={caseInput}
                    onChange={(e) => setCaseInput(e.target.value)}
                    placeholder="The input to test with your prompt..."
                    className="mt-1 text-xs min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Expected Output</label>
                  <Textarea
                    value={caseExpected}
                    onChange={(e) => setCaseExpected(e.target.value)}
                    placeholder="What the model should output..."
                    className="mt-1 text-xs min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
                  <input
                    type="text"
                    value={caseNotes}
                    onChange={(e) => setCaseNotes(e.target.value)}
                    placeholder="Edge case, happy path, etc."
                    className="w-full mt-1 rounded-md border bg-background px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCase}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddCase(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Case list */}
            {activeSuite.cases.length > 0 && (
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {activeSuite.cases.map((tc, idx) => (
                  <div key={tc.id} className="rounded-md border p-2 text-xs group hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge variant="outline" className="text-[9px] font-mono">#{idx + 1}</Badge>
                          {tc.notes && <span className="text-muted-foreground/70 truncate">{tc.notes}</span>}
                        </div>
                        <p className="text-muted-foreground truncate"><span className="font-medium text-foreground">In:</span> {tc.input}</p>
                        <p className="text-muted-foreground truncate"><span className="font-medium text-foreground">Out:</span> {tc.expectedOutput}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveCase(tc.id)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-opacity shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSuite.cases.length === 0 && (
              <p className="text-xs text-muted-foreground">No test cases yet. Add one above.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
