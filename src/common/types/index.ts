// Re-export all types from the existing types module
export type * from '@/types/prompt.types';

// Generic utility types (from boilerplate pattern)
export type Nullable<T> = T | null;
export type ID = string | number;
