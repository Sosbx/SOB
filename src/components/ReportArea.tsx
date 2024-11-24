import React from 'react';
import { Copy, RotateCcw } from 'lucide-react';

interface ReportAreaProps {
  report: string;
  onReportChange: (text: string) => void;
}

const ReportArea: React.FC<ReportAreaProps> = ({ report, onReportChange }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleReset = () => {
    onReportChange('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <textarea
        value={report}
        onChange={(e) => onReportChange(e.target.value)}
        className="w-full h-[calc(100vh-300px)] p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Le texte généré apparaîtra ici. Vous pouvez modifier directement le texte..."
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
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ReportArea;