// ===== Mode =====
export type AppMode = 'basic' | 'advanced';
export type ThemeMode = 'light' | 'dark';

// ===== Detail & Style options (Basic Mode) =====
export type DetailLevel = 'short' | 'medium' | 'detailed';
export type StyleTone = 'simple' | 'professional' | 'friendly';
export type ResponseFormat = 'steps' | 'explanation' | 'both';

// ===== Basic Mode Form =====
export interface BasicPromptInput {
  goal: string;
  detailLevel: DetailLevel;
  styleTone: StyleTone;
  responseFormat: ResponseFormat;
  rules: string;
}

// ===== Advanced Mode Form =====
export type TaskType =
  | 'refactor'
  | 'debug'
  | 'design'
  | 'sql'
  | 'docs'
  | 'data'
  | 'testing'
  | 'general';

export type Complexity = 'low' | 'medium' | 'high';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ContextSize = 'small' | 'medium' | 'large';
export type OutputSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface OutputFormatOptions {
  strictJson: boolean;
  includeCode: boolean;
  includeTables: boolean;
  includeDiagrams: boolean;
  includeExamples: boolean;
}

export interface AdvancedPromptInput {
  prompt: string;
  metaPrompt: string;
  planFirst: boolean;
  taskType: TaskType;
  complexity: Complexity;
  riskLevel: RiskLevel;
  contextSize: ContextSize;
  outputSize: OutputSize;
  outputFormat: OutputFormatOptions;
  needsToolUse: boolean;
  audience: string;
}

// ===== Rating =====
export interface RatingDimension {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export type RatingBand = 'excellent' | 'good' | 'average' | 'weak' | 'poor';

export interface PromptRating {
  totalScore: number;
  band: RatingBand;
  dimensions: {
    clarity: RatingDimension;
    constraints: RatingDimension;
    structure: RatingDimension;
    tokenEfficiency: RatingDimension;
    riskPenalty: RatingDimension;
  };
  suggestions: string[];
}

// ===== Token Estimation =====
export interface TokenEstimate {
  inputTokens: { low: number; high: number };
  outputTokens: { low: number; high: number };
  totalTokens: { low: number; high: number };
}

// ===== Model Advisor =====
export type ModelTier = 'fast' | 'balanced' | 'reasoning';

export interface ModelRecommendation {
  recommended: ModelTier;
  alternative: ModelTier;
  avoid: ModelTier | null;
  confidence: 'low' | 'medium' | 'high';
  reason: string;
}

export interface ModelTierInfo {
  tier: ModelTier;
  label: string;
  description: string;
  bestFor: string[];
  avoidFor: string[];
  costLevel: 'low' | 'medium' | 'high';
  speedLevel: 'fast' | 'medium' | 'slow';
}

// ===== MCP Advisor =====
export type McpPermission = 'read-only' | 'read-write';
export type McpEnvironment = 'dev' | 'staging' | 'prod';

export interface McpToolSuggestion {
  name: string;
  description: string;
  permission: McpPermission;
  safeEnvironments: McpEnvironment[];
  riskNote: string;
  recommended: boolean;
}

// ===== Lint =====
export type LintSeverity = 'error' | 'warning' | 'info';

export interface LintWarning {
  rule: string;
  severity: LintSeverity;
  message: string;
  suggestion: string;
}

// ===== Engine Result =====
export interface PromptEngineResult {
  structuredPrompt: string;
  metaPrompt: string;
  rating: PromptRating;
  tokenEstimate: TokenEstimate;
  modelRecommendation: ModelRecommendation;
  mcpSuggestions: McpToolSuggestion[];
  lintWarnings: LintWarning[];
}

// ===== Export =====
export type ExportFormat = 'markdown' | 'text' | 'json';
