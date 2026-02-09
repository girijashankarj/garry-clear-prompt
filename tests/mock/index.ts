// Shared test utilities and mock helpers

import type { PromptEngineResult } from '@/types/prompt.types';

/**
 * Creates a mock prompt text for testing
 */
export function createMockPrompt(overrides: { text?: string; length?: 'short' | 'medium' | 'long' } = {}): string {
  const { text, length = 'medium' } = overrides;

  if (text) return text;

  const prompts = {
    short: 'Explain React hooks.',
    medium: 'Create a REST API endpoint for user authentication using JWT tokens. Include input validation with zod. Return JSON responses with proper error codes.',
    long: 'Design a comprehensive microservices architecture for an e-commerce platform. Include service boundaries, data flow between services, event-driven communication patterns, database per service strategy, API gateway configuration, and deployment strategy using Kubernetes. Consider scalability, fault tolerance, and monitoring. Target audience: senior backend developers. Output format: structured document with diagrams.',
  };

  return prompts[length];
}

/**
 * Creates a mock PromptEngineResult for testing exporters and components
 */
export function createMockEngineResult(overrides: Partial<PromptEngineResult> = {}): PromptEngineResult {
  return {
    structuredPrompt: 'Create a REST API endpoint for user management.',
    metaPrompt: 'You are an expert backend developer.',
    rating: {
      totalScore: 72,
      band: 'average',
      dimensions: {
        clarity: { name: 'Clarity', score: 18, maxScore: 25, feedback: 'Good clarity' },
        constraints: { name: 'Constraints', score: 12, maxScore: 20, feedback: 'Add format constraints' },
        structure: { name: 'Structure', score: 14, maxScore: 20, feedback: 'Decent structure' },
        tokenEfficiency: { name: 'Token Efficiency', score: 16, maxScore: 20, feedback: 'Efficient' },
        riskPenalty: { name: 'Risk Penalty', score: -3, maxScore: 0, feedback: 'Minor risk' },
      },
      suggestions: ['Add output format', 'Specify constraints'],
    },
    tokenEstimate: {
      inputTokens: { low: 20, high: 35 },
      outputTokens: { low: 200, high: 400 },
      totalTokens: { low: 220, high: 435 },
    },
    modelRecommendation: {
      recommended: 'balanced',
      alternative: 'fast',
      avoid: null,
      confidence: 'medium',
      reason: 'Best general-purpose option for general tasks',
    },
    mcpSuggestions: [],
    lintWarnings: [
      {
        rule: 'no-output-format',
        severity: 'warning',
        message: 'No output format specified',
        suggestion: 'Add an output format instruction',
      },
    ],
    ...overrides,
  };
}

/**
 * Creates a mock basic prompt input
 */
export function createMockBasicInput(overrides = {}) {
  return {
    goal: 'Create a React component that displays a user profile card',
    detailLevel: 'medium' as const,
    styleTone: 'simple' as const,
    responseFormat: 'steps' as const,
    rules: '',
    ...overrides,
  };
}

/**
 * Creates a mock advanced prompt input
 */
export function createMockAdvancedInput(overrides = {}) {
  return {
    prompt: 'Build a REST API for user management with CRUD operations',
    metaPrompt: '',
    planFirst: false,
    taskType: 'general' as const,
    complexity: 'medium' as const,
    riskLevel: 'low' as const,
    contextSize: 'small' as const,
    outputSize: 'm' as const,
    outputFormat: {
      strictJson: false,
      includeCode: false,
      includeTables: false,
      includeDiagrams: false,
      includeExamples: false,
    },
    needsToolUse: false,
    audience: '',
    ...overrides,
  };
}
