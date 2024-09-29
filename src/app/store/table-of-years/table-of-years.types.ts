export type YearSubItems = { skip?: true; text?: string; number?: number };
export type Year = {
  number: number;
  isActive: boolean;
  subItems: YearSubItems[];
};
export type TableOfYearsState = {
  years: Year[];
};
