require('@testing-library/jest-dom');

// ML intent flag: intent-classifier reads process.env first, then import.meta.env.
process.env.VITE_ML_INTENT_ENABLED = process.env.VITE_ML_INTENT_ENABLED ?? 'false';
