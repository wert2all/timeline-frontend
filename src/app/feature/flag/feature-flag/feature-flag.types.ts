export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const FEATURE_FLAGS = {
  edit_event: false,
  profile_dropdown: true,
} as const satisfies Record<string, boolean>;
