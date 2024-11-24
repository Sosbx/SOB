import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useStore } from '../store';

interface ClinicalExamProps {
  onReportChange: (report: string) => void;
}

const ClinicalExam: React.FC<ClinicalExamProps> = ({ onReportChange }) => {
  const { categories, toggleSymptom, addSymptom, removeSymptom } = useStore();
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>({});

  const updateLocalReport = () => {
    const report = categories
      .map((cat) => {
        const checkedSymptoms = cat.symptoms.filter((sym) => sym.checked);
        if (checkedSymptoms.length === 0) return '';

        return `${cat.name}:\n${checkedSymptoms
          .map((sym) => `- ${sym.text}`)
          .join('\n')}`;
      })
      .filter(Boolean)
      .join('\n\n');

    onReportChange(report);
  };

  const handleSymptomToggle = (categoryId: string, symptomId: string) => {
    toggleSymptom(categoryId, symptomId);
    updateLocalReport();
  };

  const handleShowInput = (categoryId: string, symptomId: string) => {
    const key = `${categoryId}-${symptomId}`;
    if (!customInputs[key]) {
      setCustomInputs(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string, symptomId: string) => {
    const text = e.target.value;
    const key = `${categoryId}-${symptomId}`;
    setCustomInputs(prev => ({ ...prev, [key]: text }));

    if (text) {
      const newSymptom = {
        id: `custom-${key}`,
        text: text,
        checked: true,
        custom: true,
        parentId: symptomId,
      };
      addSymptom(categoryId, newSymptom);
      updateLocalReport();
    }
  };

  const handleRemoveCustomInput = (categoryId: string, symptomId: string) => {
    const key = `${categoryId}-${symptomId}`;
    const customSymptomId = `custom-${key}`;
    setCustomInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[key];
      return newInputs;
    });
    removeSymptom(categoryId, customSymptomId);
    updateLocalReport();
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <details className="group">
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors">
              <h3 className="text-lg font-semibold text-indigo-900">
                {category.name}
              </h3>
              <ChevronDown className="h-5 w-5 text-indigo-600 group-open:rotate-180 transition-transform" />
            </summary>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="space-y-3">
                {category.symptoms.map((symptom) => (
                  <React.Fragment key={symptom.id}>
                    {!symptom.custom ? (
                      <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          id={symptom.id}
                          checked={symptom.checked}
                          onChange={() => handleSymptomToggle(category.id, symptom.id)}
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={symptom.id}
                          className="text-sm text-gray-700 flex-1 cursor-pointer"
                        >
                          {symptom.text}
                        </label>
                        <button
                          onClick={() => handleShowInput(category.id, symptom.id)}
                          className="text-indigo-600 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                          title="Ajouter un symptôme personnalisé"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                    {customInputs[`${category.id}-${symptom.id}`] !== undefined && (
                      <div className="flex items-center gap-3 pl-8">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={customInputs[`${category.id}-${symptom.id}`]}
                          onChange={(e) => handleInputChange(e, category.id, symptom.id)}
                          placeholder="Entrez un nouveau symptôme..."
                          className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-indigo-500 focus:outline-none bg-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRemoveCustomInput(category.id, symptom.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          title="Supprimer ce symptôme"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default ClinicalExam;