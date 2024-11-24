import { create } from 'zustand';

interface Symptom {
  id: string;
  text: string;
  checked: boolean;
  custom?: boolean;
  parentId?: string;
}

interface Category {
  id: string;
  name: string;
  symptoms: Symptom[];
}

interface Store {
  categories: Category[];
  report: string;
  addSymptom: (categoryId: string, symptom: Symptom) => void;
  toggleSymptom: (categoryId: string, symptomId: string) => void;
  removeSymptom: (categoryId: string, symptomId: string) => void;
  updateReport: (text?: string) => void;
  resetReport: () => void;
}

export const useStore = create<Store>((set) => ({
  categories: [
    // ... existing categories ...
  ],
  report: '',

  addSymptom: (categoryId, symptom) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: cat.symptoms.filter(s => s.id !== symptom.id).concat(symptom),
            }
          : cat
      ),
    })),

  toggleSymptom: (categoryId, symptomId) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: cat.symptoms.map((sym) =>
                sym.id === symptomId
                  ? { ...sym, checked: !sym.checked }
                  : sym
              ),
            }
          : cat
      ),
    })),

  removeSymptom: (categoryId, symptomId) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: cat.symptoms.filter((sym) => sym.id !== symptomId),
            }
          : cat
      ),
    })),

  updateReport: (text?: string) =>
    set((state) => {
      if (text !== undefined) {
        return { report: text };
      }

      const report = state.categories
        .map((cat) => {
          const checkedSymptoms = cat.symptoms.filter((sym) => sym.checked);
          if (checkedSymptoms.length === 0) return '';

          return `${cat.name}:\n${checkedSymptoms
            .map((sym) => `- ${sym.text}`)
            .join('\n')}`;
        })
        .filter(Boolean)
        .join('\n\n');

      return { report };
    }),

  resetReport: () =>
    set((state) => ({
      categories: state.categories.map((cat) => ({
        ...cat,
        symptoms: cat.symptoms.filter(s => !s.custom).map((sym) => ({ ...sym, checked: false })),
      })),
      report: '',
    })),
}));