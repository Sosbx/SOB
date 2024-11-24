import React, { useState } from 'react';
import { Menu, X, Stethoscope, Upload, FileText, Trash2 } from 'lucide-react';
import { useEchoStore } from '../store/echoStore';
import EchoCategories from '../components/echo/EchoCategories';

const ECHO_TYPES = {
  renal: 'Échographie rénale',
  pleuropulmonaire: 'Échographie pleuro-pulmonaire',
  tvp: 'Écho-Doppler des veines des membres inférieurs',
  fast: 'FAST ÉCHO',
  perso: 'Échographie Personnalisée'
};

function Echo() {
  const { selectedType, setSelectedType, report, resetReport } = useEchoStore();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    rpps: '',
    signature: null
  });

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        >
          {Object.entries(ECHO_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <EchoCategories type={selectedType} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <textarea
          value={report}
          readOnly
          className="w-full h-[calc(100vh-500px)] p-4 border border-gray-200 rounded-lg resize-none"
          placeholder="Le rapport s'affichera ici..."
        />

        <div className="flex gap-4">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FileText className="h-4 w-4" />
            Copier le rapport
          </button>

          <button
            onClick={resetReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => {/* Implémenter la logique d'upload */}}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 w-full justify-center"
          >
            <Upload className="h-4 w-4" />
            Ajouter une image
          </button>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => setShowPatientModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full justify-center"
          >
            <FileText className="h-4 w-4" />
            Générer PDF
          </button>
        </div>
      </div>

      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Informations du patient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Implémenter la génération du PDF
                    setShowPatientModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Générer PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Echo;