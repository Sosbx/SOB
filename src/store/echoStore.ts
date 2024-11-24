import { create } from 'zustand';

interface Symptom {
  id: string;
  text: string;
  checked: boolean;
  custom?: boolean;
  isSubtitle?: boolean;
  input?: boolean;
  unit?: string;
  value?: string;
  secondInput?: boolean;
  value2?: string;
}

interface Category {
  id: string;
  name: string;
  symptoms: Symptom[];
}

interface EchoType {
  name: string;
  categories: Category[];
}

interface EchoState {
  selectedType: string;
  report: string;
  types: {
    [key: string]: EchoType;
  };
  setSelectedType: (type: string) => void;
  toggleSymptom: (categoryId: string, symptomId: string) => void;
  updateReport: (text?: string) => void;
  resetReport: () => void;
  addCustomSymptom: (categoryId: string, text: string) => void;
  removeCustomSymptom: (categoryId: string, symptomId: string) => void;
  updateSymptomValue: (categoryId: string, symptomId: string, value: string, isSecond?: boolean) => void;
}

export const useEchoStore = create<EchoState>((set) => ({
  selectedType: 'renal',
  report: '',
  types: {
    renal: {
      name: 'Échographie rénale',
      categories: [
        {
          id: 'indications',
          name: 'INDICATIONS',
          symptoms: [
            { id: 'ind1', text: 'Douleur fosse lombaire', checked: false },
            { id: 'ind2', text: 'Dysurie', checked: false }
          ]
        },
        {
          id: 'technique',
          name: 'TECHNIQUE',
          symptoms: [
            { id: 'tech1', text: 'Échographie rénale par voie abdominale antérieure et postérieure', checked: false },
            { id: 'tech2', text: 'Sonde ultraportable butterfly IQ/IQ+/IQ3', checked: false },
            { id: 'tech3', text: 'Sonde ultraportable GE Vscan', checked: false }
          ]
        },
        {
          id: 'resultats',
          name: 'RÉSULTATS',
          symptoms: [
            { id: 'rd_title', text: 'Rein DROIT', isSubtitle: true, checked: false },
            { id: 'rd1', text: 'Morphologie : normale', checked: false },
            { id: 'rd2', text: 'Dimensions : ', input: true, unit: 'cm', secondInput: true, checked: false },
            { id: 'rd3', text: 'Structure : homogène, sans échostructure anormale', checked: false },
            { id: 'rd4', text: 'Cortex : épaisseur ', input: true, unit: 'mm', checked: false },
            { id: 'rd5', text: 'Médullaire : structure normale', checked: false },
            { id: 'rd6', text: 'Sinus rénaux : libres', checked: false },
            { id: 'rd7', text: 'Vascularisation : normale, artères rénales perméables, flux rénaux normaux', checked: false },
            { id: 'rd8', text: 'Dilatation pyélocalicielle du rein Droit', checked: false },
            { id: 'rd9', text: 'Flux méat uretral non visualisé', checked: false },
            
            { id: 'rg_title', text: 'Rein GAUCHE', isSubtitle: true, checked: false },
            { id: 'rg1', text: 'Morphologie : normale', checked: false },
            { id: 'rg2', text: 'Dimensions : ', input: true, unit: 'cm', secondInput: true, checked: false },
            { id: 'rg3', text: 'Structure : homogène, sans échostructure anormale', checked: false },
            { id: 'rg4', text: 'Cortex : épaisseur ', input: true, unit: 'mm', checked: false },
            { id: 'rg5', text: 'Médullaire : structure normale', checked: false },
            { id: 'rg6', text: 'Sinus rénaux : libres', checked: false },
            { id: 'rg7', text: 'Vascularisation : normale, artères rénales perméables, flux rénaux normaux', checked: false },
            { id: 'rg8', text: 'Dilatation pyélocalicielle du rein gauche', checked: false },
            { id: 'rg9', text: 'Flux méat uretral non visualisé', checked: false },
            
            { id: 'v_title', text: 'Vessie', isSubtitle: true, checked: false },
            { id: 'v1', text: 'Paroi normale', checked: false }
          ]
        },
        {
          id: 'conclusion',
          name: 'CONCLUSION',
          symptoms: [
            { id: 'c1', text: 'Échographie rénale dans les limites de la normale', checked: false },
            { id: 'c2', text: 'Pas d\'anomalie morphologique, structurelle ou vasculaire des reins ni des voies urinaires', checked: false },
            { id: 'c3', text: 'Pas de dilatation pyélocalicielle visualisée', checked: false },
            { id: 'c4', text: 'Échographie rénale en faveur d\'une CN Droite', checked: false },
            { id: 'c5', text: 'Échographie rénale en faveur d\'une CN Gauche', checked: false },
            { id: 'c6', text: 'Calcul visible de ', input: true, unit: 'mm', secondInput: true, checked: false },
            { id: 'c7', text: 'Calcul non visualisé', checked: false }
          ]
        }
      ]
    },
    pleuropulmonaire: {
      name: 'Échographie pleuro-pulmonaire',
      categories: [
        {
          id: 'indications',
          name: 'INDICATIONS',
          symptoms: [
            { id: 'ind1', text: 'Dyspnée', checked: false },
            { id: 'ind2', text: 'Toux', checked: false },
            { id: 'ind3', text: 'Fièvre', checked: false },
            { id: 'ind4', text: 'Douleurs thoraciques', checked: false }
          ]
        },
        {
          id: 'technique',
          name: 'TECHNIQUE',
          symptoms: [
            { id: 'tech1', text: 'Sonde ultraportable butterfly IQ/IQ+/IQ3', checked: false },
            { id: 'tech2', text: 'Sonde ultraportable GE Vscan', checked: false }
          ]
        },
        {
          id: 'resultats',
          name: 'RÉSULTATS',
          symptoms: [
            { id: 'r1', text: 'Glissement pleural bilatéral', checked: false },
            { id: 'r2', text: 'Absence d\'épanchement pleural', checked: false },
            { id: 'r3', text: 'Absence de syndrome interstitiel', checked: false },
            { id: 'r4', text: 'Absence de syndrome alvéolaire', checked: false },
            { id: 'r5', text: 'Absence de glissement pleural droit', checked: false },
            { id: 'r6', text: 'Absence de glissement pleural gauche', checked: false },
            { id: 'r7', text: 'Présence d\'un épanchement pleural droit', checked: false },
            { id: 'r8', text: 'Présence d\'un épanchement pleural gauche', checked: false },
            { id: 'r9', text: 'Présence d\'un syndrome interstitiel bilatéral et diffus', checked: false },
            { id: 'r10', text: 'Présence d\'un syndrome interstitiel à droite', checked: false },
            { id: 'r11', text: 'Présence d\'un syndrome interstitiel à gauche', checked: false },
            { id: 'r12', text: 'Présence d\'un syndrome alvéolaire à droite', checked: false },
            { id: 'r13', text: 'Présence d\'un syndrome alvéolaire à gauche', checked: false }
          ]
        },
        {
          id: 'conclusion',
          name: 'CONCLUSION',
          symptoms: [
            { id: 'c1', text: 'Échographie pleuro-pulmonaire dans les limites de la normale', checked: false },
            { id: 'c2', text: 'Échographie pleuro-pulmonaire en faveur d\'une pneumopathie droite', checked: false },
            { id: 'c3', text: 'Échographie pleuro-pulmonaire en faveur d\'une pneumopathie gauche', checked: false },
            { id: 'c4', text: 'Échographie pleuro-pulmonaire en faveur d\'un épanchement pleural droit', checked: false },
            { id: 'c5', text: 'Échographie pleuro-pulmonaire en faveur d\'un épanchement pleural gauche', checked: false },
            { id: 'c6', text: 'Échographie pleuro-pulmonaire en faveur d\'un pneumothorax droit', checked: false },
            { id: 'c7', text: 'Échographie pleuro-pulmonaire en faveur d\'un pneumothorax gauche', checked: false },
            { id: 'c8', text: 'À réévaluer en fonction de la clinique.', checked: false },
            { id: 'c9', text: 'L\'examen pourra être répété quelques jours plus tard afin de suivre l\'évolution.', checked: false }
          ]
        }
      ]
    },
    tvp: {
      name: 'Écho-Doppler des veines des membres inférieurs',
      categories: [
        {
          id: 'indications',
          name: 'INDICATIONS',
          symptoms: [
            { id: 'ind1', text: 'OMI', checked: false },
            { id: 'ind2', text: 'Douleur mollet', checked: false },
            { id: 'ind3', text: 'Dyspnée', checked: false }
          ]
        },
        {
          id: 'technique',
          name: 'TECHNIQUE',
          symptoms: [
            { id: 'tech1', text: 'Sonde ultraportable butterfly IQ/IQ+/IQ3', checked: false },
            { id: 'tech2', text: 'Sonde ultraportable GE Vscan', checked: false }
          ]
        },
        {
          id: 'resultats',
          name: 'RÉSULTATS',
          symptoms: [
            { id: 'rd_title', text: 'Jambe DROITE - CARREFOUR FÉMORAL', isSubtitle: true, checked: false },
            { id: 'rd1', text: 'Lumière de la veine : Anéchogene', checked: false },
            { id: 'rd2', text: 'Lumière de la veine : Peu echogene', checked: false },
            { id: 'rd3', text: 'Lumière de la veine : Tres echogene', checked: false },
            { id: 'rd4', text: 'Test de compressibilité : compressible jusqu\'au collabsus', checked: false },
            { id: 'rd5', text: 'Incompressibilité partielle uniquement centrale', checked: false },
            { id: 'rd6', text: 'Incompressibilité partielle uniquement en région latérale de la veine', checked: false },
            { id: 'rd7', text: 'Incompressibilité partielle périphérique en faveur d\'un thrombus reperméabilisé', checked: false },
            { id: 'rd8', text: 'Incompressibilité totale, en faveur d\'un caillot occlusif', checked: false },
            { id: 'rd9', text: 'Étude des flux Doppler : Flux au Doppler pulsé', checked: false },
            { id: 'rd10', text: 'Étude des flux Doppler : Absence de flux au doppler pulsé', checked: false },

            { id: 'rdp_title', text: 'Jambe DROITE - RÉGION POPLITÉE', isSubtitle: true, checked: false },
            { id: 'rdp1', text: 'Lumière de la veine : Anéchogene', checked: false },
            { id: 'rdp2', text: 'Lumière de la veine : Peu echogene', checked: false },
            { id: 'rdp3', text: 'Lumière de la veine : Tres echogene', checked: false },
            { id: 'rdp4', text: 'Test de compressibilité : compressible jusqu\'au collabsus', checked: false },
            { id: 'rdp5', text: 'Incompressibilité partielle uniquement centrale', checked: false },
            { id: 'rdp6', text: 'Incompressibilité partielle uniquement en région latérale de la veine', checked: false },
            { id: 'rdp7', text: 'Incompressibilité partielle périphérique en faveur d\'un thrombus reperméabilisé', checked: false },
            { id: 'rdp8', text: 'Incompressibilité totale, en faveur d\'un caillot occlusif', checked: false },
            { id: 'rdp9', text: 'Étude des flux Doppler : Flux au Doppler pulsé', checked: false },
            { id: 'rdp10', text: 'Étude des flux Doppler : Absence de flux au doppler pulsé', checked: false },

            { id: 'rg_title', text: 'Jambe GAUCHE - CARREFOUR FÉMORAL', isSubtitle: true, checked: false },
            { id: 'rg1', text: 'Lumière de la veine : Anéchogene', checked: false },
            { id: 'rg2', text: 'Lumière de la veine : Peu echogene', checked: false },
            { id: 'rg3', text: 'Lumière de la veine : Tres echogene', checked: false },
            { id: 'rg4', text: 'Test de compressibilité : compressible jusqu\'au collabsus', checked: false },
            { id: 'rg5', text: 'Incompressibilité partielle uniquement centrale', checked: false },
            { id: 'rg6', text: 'Incompressibilité partielle uniquement en région latérale de la veine', checked: false },
            { id: 'rg7', text: 'Incompressibilité partielle périphérique en faveur d\'un thrombus reperméabilisé', checked: false },
            { id: 'rg8', text: 'Incompressibilité totale, en faveur d\'un caillot occlusif', checked: false },
            { id: 'rg9', text: 'Étude des flux Doppler : Flux au Doppler pulsé', checked: false },
            { id: 'rg10', text: 'Étude des flux Doppler : Absence de flux au doppler pulsé', checked: false },

            { id: 'rgp_title', text: 'Jambe GAUCHE - RÉGION POPLITÉE', isSubtitle: true, checked: false },
            { id: 'rgp1', text: 'Lumière de la veine : Anéchogene', checked: false },
            { id: 'rgp2', text: 'Lumière de la veine : Peu echogene', checked: false },
            { id: 'rgp3', text: 'Lumière de la veine : Tres echogene', checked: false },
            { id: 'rgp4', text: 'Test de compressibilité : compressible jusqu\'au collabsus', checked: false },
            { id: 'rgp5', text: 'Incompressibilité partielle uniquement centrale', checked: false },
            { id: 'rgp6', text: 'Incompressibilité partielle uniquement en région latérale de la veine', checked: false },
            { id: 'rgp7', text: 'Incompressibilité partielle périphérique en faveur d\'un thrombus reperméabilisé', checked: false },
            { id: 'rgp8', text: 'Incompressibilité totale, en faveur d\'un caillot occlusif', checked: false },
            { id: 'rgp9', text: 'Étude des flux Doppler : Flux au Doppler pulsé', checked: false },
            { id: 'rgp10', text: 'Étude des flux Doppler : Absence de flux au doppler pulsé', checked: false }
          ]
        },
        {
          id: 'conclusion',
          name: 'CONCLUSION',
          symptoms: [
            { id: 'c1', text: 'Cet examen est en faveur de l\'absence de thrombose veineuse fémoro-poplitée', checked: false },
            { id: 'c2', text: 'Cet examen est en faveur de la présence de thrombose veineuse fémoro-poplitée', checked: false },
            { id: 'c3', text: 'À réévaluer en fonction de la clinique.', checked: false },
            { id: 'c4', text: 'L\'examen pourra être répété quelques jours plus tard afin de suivre l\'évolution.', checked: false }
          ]
        }
      ]
    },
    fast: {
      name: 'FAST ÉCHO',
      categories: [
        {
          id: 'indications',
          name: 'INDICATIONS',
          symptoms: [
            { id: 'ind1', text: 'Douleurs abdominales aiguës', checked: false },
            { id: 'ind2', text: 'Douleurs thoraciques', checked: false },
            { id: 'ind3', text: 'Dyspnée', checked: false }
          ]
        },
        {
          id: 'technique',
          name: 'TECHNIQUE',
          symptoms: [
            { id: 'tech1', text: 'Sonde ultraportable butterfly IQ/IQ+/IQ3', checked: false },
            { id: 'tech2', text: 'Sonde ultraportable GE Vscan', checked: false }
          ]
        },
        {
          id: 'resultats',
          name: 'RÉSULTATS',
          symptoms: [
            { id: 'r1', text: 'Pas d\'épanchement dans le cul-de-sac hépatorenal', checked: false },
            { id: 'r2', text: 'Pas d\'épanchement dans le cul-de-sac splénorenal', checked: false },
            { id: 'r3', text: 'Pas d\'épanchement dans le Douglas', checked: false },
            { id: 'r4', text: 'Pas d\'épanchement pleural droit', checked: false },
            { id: 'r5', text: 'Pas d\'épanchement pleural gauche', checked: false },
            { id: 'r6', text: 'Glissement pleural présent bilatéral', checked: false },
            { id: 'r7', text: 'Pas d\'épanchement péricardique', checked: false }
          ]
        },
        {
          id: 'conclusion',
          name: 'CONCLUSION',
          symptoms: [
            { id: 'c1', text: 'Fast écho dans les limites de la normale', checked: false },
            { id: 'c2', text: 'Présence d\'un épanchement péritonéal', checked: false },
            { id: 'c3', text: 'Présence d\'un épanchement pleural droit', checked: false },
            { id: 'c4', text: 'Présence d\'un épanchement pleural gauche', checked: false },
            { id: 'c5', text: 'Présence d\'un pneumothorax droit', checked: false },
            { id: 'c6', text: 'Présence d\'un pneumothorax gauche', checked: false },
            { id: 'c7', text: 'Présence d\'un épanchement péricardique', checked: false },
            { id: 'c8', text: 'À réévaluer en fonction de la clinique.', checked: false },
            { id: 'c9', text: 'L\'examen pourra être répété quelques jours plus tard afin de suivre l\'évolution.', checked: false }
          ]
        }
      ]
    }
  },

  setSelectedType: (type) => set({ selectedType: type }),

  toggleSymptom: (categoryId, symptomId) =>
    set((state) => {
      const newTypes = { ...state.types };
      const type = newTypes[state.selectedType];
      
      type.categories = type.categories.map((cat) =>
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
      );

      return { types: newTypes };
    }),

  updateReport: (text) =>
    set((state) => {
      if (text !== undefined) {
        return { report: text };
      }

      const type = state.types[state.selectedType];
      const report = type.categories
        .map((cat) => {
          const checkedSymptoms = cat.symptoms.filter((sym) => 
            (sym.checked || sym.isSubtitle || (sym.input && (sym.value || sym.value2)))
          );
          
          if (checkedSymptoms.length === 0) return '';

          const categoryText = [`${cat.name} :`];
          
          checkedSymptoms.forEach((sym) => {
            if (sym.isSubtitle) {
              categoryText.push(`\n${sym.text}`);
            } else if (sym.input) {
              const valueText = sym.text + (sym.value || '');
              const fullText = sym.secondInput && sym.value2
                ? `${valueText} x ${sym.value2}${sym.unit ? ` ${sym.unit}` : ''}`
                : `${valueText}${sym.unit ? ` ${sym.unit}` : ''}`;
              categoryText.push(fullText);
            } else {
              categoryText.push(sym.text);
            }
          });

          return categoryText.join('\n');
        })
        .filter(Boolean)
        .join('\n\n');

      return { report };
    }),

  resetReport: () =>
    set((state) => {
      const newTypes = { ...state.types };
      const type = newTypes[state.selectedType];
      
      type.categories = type.categories.map((cat) => ({
        ...cat,
        symptoms: cat.symptoms.map((sym) => ({
          ...sym,
          checked: false,
          value: undefined,
          value2: undefined
        })),
      }));

      return { types: newTypes, report: '' };
    }),

  addCustomSymptom: (categoryId, text) =>
    set((state) => {
      const newTypes = { ...state.types };
      const type = newTypes[state.selectedType];
      
      type.categories = type.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: [
                ...cat.symptoms,
                {
                  id: `custom-${Date.now()}`,
                  text,
                  checked: true,
                  custom: true,
                },
              ],
            }
          : cat
      );

      return { types: newTypes };
    }),

  removeCustomSymptom: (categoryId, symptomId) =>
    set((state) => {
      const newTypes = { ...state.types };
      const type = newTypes[state.selectedType];
      
      type.categories = type.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: cat.symptoms.filter((sym) => sym.id !== symptomId),
            }
          : cat
      );

      return { types: newTypes };
    }),

  updateSymptomValue: (categoryId, symptomId, value, isSecond = false) =>
    set((state) => {
      const newTypes = { ...state.types };
      const type = newTypes[state.selectedType];
      
      type.categories = type.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              symptoms: cat.symptoms.map((sym) =>
                sym.id === symptomId
                  ? {
                      ...sym,
                      [isSecond ? 'value2' : 'value']: value,
                      checked: true,
                    }
                  : sym
              ),
            }
          : cat
      );

      return { types: newTypes };
    }),
}));