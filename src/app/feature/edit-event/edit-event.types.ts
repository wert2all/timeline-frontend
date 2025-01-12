type EditableEvent = {
  id: number | null;
  date: string | null;
  time: string | null;
  showTime: boolean | null;
  title: string | null;
  content: string | null;
  link: string | null;
  tags: string[] | null;
  isPrivate: boolean | null;
  imageId: number | null;
};

export type EditEventFormChanges = Partial<EditableEvent>;
