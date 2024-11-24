import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useEchoStore } from '../../store/echoStore';

interface EchoCategoriesProps {
  type: string;
}

const EchoCategories: React.FC<EchoCategoriesProps> = ({ type }) => {
  const { categories, toggleItem, updateReport, addCustomItem, removeCustomItem } = useEchoStore();
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>({});

  const handleItemToggle = (categoryId: string, itemId: string) => {
    toggleItem(type, categoryId, itemId);
    updateReport();
  };

  const handleAddCustom = (categoryId: string) => {
    const text = prompt('Entrez un nouvel élément :');
    if (text) {
      addCustomItem(type, categoryId, text);
      updateReport();
    }
  };

  const handleRemoveCustom = (categoryId: string, itemId: string) => {
    removeCustomItem(type, categoryId, itemId);
    updateReport();
  };

  return (
    <div className="space-y-6">
      {categories[type].map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg">
          <details className="group">
            <summary className="flex items-center justify-between p-4 cursor-pointer">
              <h3 className="text-lg font-medium text-gray-900">
                {category.name}
              </h3>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>

            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={item.checked}
                      onChange={() => handleItemToggle(category.id, item.id)}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm text-gray-700 flex-1"
                    >
                      {item.text}
                    </label>
                    {item.custom ? (
                      <button
                        onClick={() => handleRemoveCustom(category.id, item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
                
                <button
                  onClick={() => handleAddCustom(category.id)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un élément personnalisé
                </button>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}

export default EchoCategories;