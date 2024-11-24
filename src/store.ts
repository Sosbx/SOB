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
  updateReport: () => void;
  resetReport: () => void;
}

export const useStore = create<Store>((set) => ({
  categories: [
    {
      id: 'general',
      name: 'Examen général',
      symptoms: [
        { id: 'g1', text: 'Bon état général', checked: false },
        { id: 'g2', text: 'GSC 15', checked: false },
        { id: 'g3', text: 'Constantes normales', checked: false },
        { id: 'g4', text: 'Pas de signe de gravité', checked: false },
        { id: 'g5', text: 'Pas de signe de déshydratation', checked: false },
        { id: 'g6', text: 'Tonique, joue, sourit', checked: false },
        { id: 'g7', text: 'Mange bien, boit bien', checked: false },
      ],
    },
    {
      id: 'cardio',
      name: 'Cardio',
      symptoms: [
        { id: 'c1', text: 'Pas de douleur thoracique', checked: false },
        { id: 'c2', text: 'Bruits du cœur réguliers', checked: false },
        { id: 'c3', text: 'Pas de signe d\'insuffisance cardiaque droite', checked: false },
        { id: 'c4', text: 'Pas de signe d\'insuffisance cardiaque gauche', checked: false },
        { id: 'c5', text: 'Pas de souffle', checked: false },
        { id: 'c6', text: 'Pouls perçus', checked: false },
        { id: 'c7', text: 'ECG = RSR, Pas de trouble de repo. ni de cond.', checked: false },
        { id: 'c8', text: 'ECG comparable au tracé de référence', checked: false },
      ],
    },
    {
      id: 'pneumo',
      name: 'Pneumo',
      symptoms: [
        { id: 'p1', text: 'Eupnéique', checked: false },
        { id: 'p2', text: 'MV +/+', checked: false },
        { id: 'p3', text: 'Pas de toux', checked: false },
        { id: 'p4', text: 'Pas de crépitant', checked: false },
        { id: 'p5', text: 'Pas de sibilant', checked: false },
        { id: 'p6', text: 'Pas d\'expectoration', checked: false },
        { id: 'p7', text: 'Pas d\'hémoptysie', checked: false },
      ],
    },
    {
      id: 'neuro',
      name: 'Neuro',
      symptoms: [
        { id: 'n1', text: 'Pas de trouble du comportement', checked: false },
        { id: 'n2', text: 'RPM symétriques et consensuels', checked: false },
        { id: 'n3', text: 'Paires crâniennes normales', checked: false },
        { id: 'n4', text: 'Pas de déficit sensitif', checked: false },
        { id: 'n5', text: 'Pas de déficit moteur', checked: false },
        { id: 'n6', text: 'Pas de syndrome méningé', checked: false },
        { id: 'n7', text: 'Pas de syndrome cérébelleux', checked: false },
        { id: 'n8', text: 'Pas de syndrome méningé', checked: false },
        { id: 'n9', text: 'ROT +/+', checked: false },
      ],
    },
    {
      id: 'abdo',
      name: 'Abdo',
      symptoms: [
        { id: 'a1', text: 'Abdomen souple dépressible indolore', checked: false },
        { id: 'a2', text: 'Pas de défense', checked: false },
        { id: 'a3', text: 'Pas de contracture', checked: false },
        { id: 'a4', text: 'Pas de méléna', checked: false },
        { id: 'a5', text: 'Pas d\'hématémèse', checked: false },
        { id: 'a6', text: 'Orifices herniaires libres', checked: false },
        { id: 'a7', text: 'Pas de vomissement', checked: false },
        { id: 'a8', text: 'Pas de trouble du transit', checked: false },
      ],
    },
    {
      id: 'uro',
      name: 'Uro',
      symptoms: [
        { id: 'u1', text: 'Pas de brûlure mictionnelle', checked: false },
        { id: 'u2', text: 'Pas de pollakiurie', checked: false },
        { id: 'u3', text: 'Pas d\'hématurie', checked: false },
        { id: 'u4', text: 'Fosses lombaires libres', checked: false },
        { id: 'u5', text: 'Pas de globe', checked: false },
        { id: 'u6', text: 'Testicules de taille normale pour l\'âge', checked: false },
        { id: 'u7', text: 'Testicules palpés', checked: false },
      ],
    },
    {
      id: 'gyneco',
      name: 'Gyneco',
      symptoms: [
        { id: 'gy1', text: 'Pas de méno-métrorragie', checked: false },
        { id: 'gy2', text: 'Règles régulières et d\'abondance normale', checked: false },
        { id: 'gy3', text: 'Pas de leucorrhée', checked: false },
        { id: 'gy4', text: 'Pas de grossesse en cours déclarée', checked: false },
      ],
    },
    {
      id: 'traumato',
      name: 'Traumato',
      symptoms: [
        { id: 't1', text: 'Marche sans aide', checked: false },
        { id: 't2', text: 'Pas de plaie', checked: false },
        { id: 't3', text: 'Pas d\'hématome', checked: false },
        { id: 't4', text: 'Pas de déformation', checked: false },
        { id: 't5', text: 'Pas de douleur à la palpation des articulations adjacentes', checked: false },
        { id: 't6', text: 'Pas d\'impotence fonctionnelle', checked: false },
      ],
    },
    {
      id: 'psy',
      name: 'Psy',
      symptoms: [
        { id: 'ps1', text: 'Pas d\'idées noires', checked: false },
        { id: 'ps2', text: 'Pas de délire', checked: false },
        { id: 'ps3', text: 'Pas d\'agitation', checked: false },
        { id: 'ps4', text: 'Risque suicidaire faible', checked: false },
      ],
    },
    {
      id: 'orl',
      name: 'ORL',
      symptoms: [
        { id: 'o1', text: 'Pas d\'angine', checked: false },
        { id: 'o2', text: 'Pas d\'ADP', checked: false },
        { id: 'o3', text: 'Pas d\'OMA', checked: false },
        { id: 'o4', text: 'Tympans vus non perforés', checked: false },
        { id: 'o5', text: 'Streptatest positif', checked: false },
        { id: 'o6', text: 'Streptatest négatif', checked: false },
      ],
    },
    {
      id: 'cutane',
      name: 'Cutané',
      symptoms: [
        { id: 'cu1', text: 'Pas de purpura', checked: false },
        { id: 'cu2', text: 'Pas de prurit', checked: false },
        { id: 'cu3', text: 'Pas d\'exanthème', checked: false },
        { id: 'cu4', text: 'Pas d\'énanthème', checked: false },
      ],
    },
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

  updateReport: () =>
    set((state) => {
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