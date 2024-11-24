import React from 'react';
import EchoExam from '../components/echo/EchoExam';
import EchoReport from '../components/echo/EchoReport';
import { useEchoStore } from '../store/echoStore';

function EchoPage() {
  const { report } = useEchoStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-6">
            Compte rendu d'échographie
          </h1>
          <EchoExam />
        </div>
      </div>

      <EchoReport report={report} />
    </div>
  );
}

export default EchoPage;