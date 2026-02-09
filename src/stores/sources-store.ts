import { create } from "zustand";
import type { SourceItem } from "@types/sources";

interface SourcesStore {
  isOpen: boolean;
  activeSectionId: string | null;
  sectionTitle: string;
  sources: SourceItem[];

  openForSection: (
    sectionId: string,
    title: string,
    sources: SourceItem[],
  ) => void;
  close: () => void;
}

export const useSourcesStore = create<SourcesStore>((set) => ({
  isOpen: false,
  activeSectionId: null,
  sectionTitle: "",
  sources: [],

  openForSection: (sectionId, title, sources) =>
    set({
      isOpen: true,
      activeSectionId: sectionId,
      sectionTitle: title,
      sources,
    }),

  close: () =>
    set({
      isOpen: false,
      activeSectionId: null,
      sectionTitle: "",
      sources: [],
    }),
}));
