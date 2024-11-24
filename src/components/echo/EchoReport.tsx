import React, { useState } from 'react';
import { Copy, RotateCcw, FileText, Upload } from 'lucide-react';
import { useEchoStore } from '../../store/echoStore';
import { useUserStore } from '../../store/userStore';
import { generateEchoPDF } from '../../utils/echoPdfGenerator';

interface PatientInfo {
  lastName: string;
  firstName: string;
  birthDate: string; // Obligatoire pour l'échographie
}

const EchoReport: React.FC = () => {
  const { report, resetReport, updateReport } = useEchoStore();
  const { profile } = useUserStore();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    lastName: '',
    firstName: '',
    birthDate: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateReport(e.target.value);
  };

  const validatePatientInfo = () => {
    if (!patientInfo.lastName || !patientInfo.firstName) {
      throw new Error('Le nom et le prénom du patient sont requis');
    }
    if (!patientInfo.birthDate) {
      throw new Error('La date de naissance est requise pour le compte rendu d\'échographie');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setError(null);
      validatePatientInfo();
      
      const doc = await generateEchoPDF(
        report,
        patientInfo,
        profile
      );
      doc.save(`echo_${patientInfo.lastName}_${patientInfo.firstName}.pdf`);
      setShowPatientModal(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <textarea
        value={report}
        onChange={handleTextChange}
        className="w-full h-[calc(100vh-300px)] p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Le rapport s'affichera ici. Vous pouvez également modifier directement le texte..."
      />

      <div className="flex gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Copy className="h-4 w-4" />
          Copier le rapport
        </button>

        <button
          onClick={resetReport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RotateCcw className="h-4 w-4" />
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

      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Informations du patient</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={patientInfo.lastName}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={patientInfo.firstName}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={patientInfo.birthDate}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPatientModal(false);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGeneratePDF}
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
};

export default EchoReport;