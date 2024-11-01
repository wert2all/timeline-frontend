export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const FEATURE_FLAGS = {
  edit_event: false,
} as const satisfies Record<string, boolean>;
