import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Stethoscope, Star } from 'lucide-react';
import ClinicalExam from '../components/ClinicalExam';
import Favorites from '../components/Favorites';
import ReportArea from '../components/ReportArea';
import { useStore } from '../store';

function ObservationPage() {
  const [clinicalReport, setClinicalReport] = useState('');
  const [favoritesReport, setFavoritesReport] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabSelect = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Tabs className="space-y-6" onSelect={handleTabSelect}>
          <TabList className="flex">
            <Tab className="flex-1 px-6 py-3 text-base font-medium text-gray-500 hover:text-gray-700 cursor-pointer ui-selected:text-indigo-600 ui-selected:border-indigo-600 transition-all duration-200 border-2 border-b-0 rounded-t-lg mr-1 bg-gray-50 ui-selected:bg-white ui-selected:shadow-[2px_-2px_5px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Examen Clinique
              </div>
            </Tab>
            <Tab className="flex-1 px-6 py-3 text-base font-medium text-gray-500 hover:text-gray-700 cursor-pointer ui-selected:text-indigo-600 ui-selected:border-indigo-600 transition-all duration-200 border-2 border-b-0 rounded-t-lg bg-gray-50 ui-selected:bg-white ui-selected:shadow-[2px_-2px_5px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                Favoris
              </div>
            </Tab>
          </TabList>

          <div className="bg-white pt-6">
            <TabPanel>
              <ClinicalExam onReportChange={setClinicalReport} />
            </TabPanel>

            <TabPanel>
              <Favorites onReportChange={setFavoritesReport} />
            </TabPanel>
          </div>
        </Tabs>
      </div>

      <ReportArea 
        report={activeTab === 0 ? clinicalReport : favoritesReport}
        onReportChange={activeTab === 0 ? setClinicalReport : setFavoritesReport}
      />
    </div>
  );
}

export default ObservationPage;