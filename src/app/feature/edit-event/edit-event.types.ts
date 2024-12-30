export type EditableEvent = {
  id: number | null;
  date: string | null;
  time: string | null;
  withTime: boolean | null;
  showTime: boolean | null;
  title: string | null;
  content: string | null;
  url: string | null;
  tags: string[];
  isPrivate: boolean | null;
  imageId: number | null;
};

export type EditValue = Partial<EditableEvent>;
