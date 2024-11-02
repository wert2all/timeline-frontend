export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const FEATURE_FLAGS = {
  edit_event: false,
  profile_dropdown: false,
  user_settings: true,
  user_feature_flag: true,
} as const satisfies Record<string, boolean>;
