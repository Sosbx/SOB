import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useEchoStore } from '../../store/echoStore';

const EchoExam: React.FC = () => {
  const { selectedType, types, setSelectedType, toggleSymptom, updateReport, addCustomSymptom, removeCustomSymptom, updateSymptomValue } = useEchoStore();
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>({});

  const handleSymptomToggle = (categoryId: string, symptomId: string) => {
    toggleSymptom(categoryId, symptomId);
    updateReport();
  };

  const handleShowInput = (categoryId: string, symptomId: string) => {
    const key = `${categoryId}-${symptomId}`;
    if (!customInputs[key]) {
      setCustomInputs(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleCustomInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    categoryId: string,
    symptomId: string
  ) => {
    const key = `${categoryId}-${symptomId}`;
    setCustomInputs(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleCustomInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    categoryId: string,
    symptomId: string
  ) => {
    if (e.key === 'Enter') {
      const key = `${categoryId}-${symptomId}`;
      const text = customInputs[key].trim();
      if (text) {
        addCustomSymptom(categoryId, text);
        setCustomInputs(prev => {
          const newInputs = { ...prev };
          delete newInputs[key];
          return newInputs;
        });
        updateReport();
      }
    }
  };

  const handleRemoveCustomInput = (categoryId: string, symptomId: string) => {
    const key = `${categoryId}-${symptomId}`;
    setCustomInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[key];
      return newInputs;
    });
    if (symptomId.startsWith('custom-')) {
      removeCustomSymptom(categoryId, symptomId);
      updateReport();
    }
  };

  const handleInputChange = (
    categoryId: string,
    symptomId: string,
    value: string,
    isSecond: boolean = false
  ) => {
    updateSymptomValue(categoryId, symptomId, value, isSecond);
    updateReport();
  };

  return (
    <div className="space-y-6">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="w-full p-3 text-lg font-semibold text-indigo-700 border-2 border-indigo-100 rounded-lg bg-indigo-50/50 hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-colors"
      >
        {Object.entries(types).map(([key, type]) => (
          <option key={key} value={key} className="text-gray-700 bg-white">
            {type.name}
          </option>
        ))}
      </select>

      {types[selectedType].categories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <details className="group">
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors">
              <h3 className="text-lg font-semibold text-indigo-900">
                {category.name}
              </h3>
              <ChevronDown className="h-5 w-5 text-indigo-600 group-open:rotate-180 transition-transform" />
            </summary>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="space-y-1">
                {category.symptoms.map((symptom) => (
                  <React.Fragment key={symptom.id}>
                    {symptom.custom ? (
                      <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="flex-1 text-sm text-gray-700">{symptom.text}</span>
                        <button
                          onClick={() => handleRemoveCustomInput(category.id, symptom.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          title="Supprimer cet élément"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={`flex items-center gap-3 ${
                          symptom.isSubtitle ? 'mt-6 mb-2 font-semibold' : 'hover:bg-gray-50'
                        } p-2 rounded-lg transition-colors`}
                      >
                        {!symptom.isSubtitle && (
                          <input
                            type="checkbox"
                            id={symptom.id}
                            checked={symptom.checked}
                            onChange={() => handleSymptomToggle(category.id, symptom.id)}
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                        )}
                        <label
                          htmlFor={symptom.id}
                          className={`${symptom.isSubtitle ? 'text-lg text-indigo-900 font-semibold' : 'text-sm text-gray-700'} flex-1`}
                        >
                          {symptom.text}
                        </label>
                        {symptom.input && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={symptom.value || ''}
                              onChange={(e) => handleInputChange(category.id, symptom.id, e.target.value)}
                              className="w-16 px-2 py-1 text-sm border rounded-md"
                              placeholder="..."
                            />
                            {symptom.unit && <span className="text-sm text-gray-500">{symptom.unit}</span>}
                            {symptom.secondInput && (
                              <>
                                <span className="text-sm text-gray-500">x</span>
                                <input
                                  type="text"
                                  value={symptom.value2 || ''}
                                  onChange={(e) => handleInputChange(category.id, symptom.id, e.target.value, true)}
                                  className="w-16 px-2 py-1 text-sm border rounded-md"
                                  placeholder="..."
                                />
                                {symptom.unit && <span className="text-sm text-gray-500">{symptom.unit}</span>}
                              </>
                            )}
                          </div>
                        )}
                        {!symptom.isSubtitle && (
                          <button
                            onClick={() => handleShowInput(category.id, symptom.id)}
                            className="text-indigo-600 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                            title="Ajouter un élément personnalisé"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                    {customInputs[`${category.id}-${symptom.id}`] !== undefined && (
                      <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={customInputs[`${category.id}-${symptom.id}`]}
                          onChange={(e) => handleCustomInputChange(e, category.id, symptom.id)}
                          onKeyDown={(e) => handleCustomInputKeyDown(e, category.id, symptom.id)}
                          placeholder="Entrez un nouvel élément et appuyez sur Entrée..."
                          className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-indigo-500 focus:outline-none bg-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRemoveCustomInput(category.id, symptom.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          title="Supprimer cet élément"
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

export default EchoExam;