import { create } from 'zustand'

interface SectionState {
  sections: Array<string>
}

interface SectionActions {
  addSection: (section: string) => void
  removeSection: (section: string) => void
  setSections: (sections: Array<string>) => void
  reset: () => void
}

export const useSectionStore = create<SectionState & SectionActions>((set) => ({
  sections: [],

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  removeSection: (section) =>
    set((state) => ({
      sections: state.sections.filter((s) => s !== section),
    })),

  setSections: (sections) =>
    set(() => ({
      sections: [...new Set(sections)],
    })),

  reset: () => set({ sections: [] }),
}))
