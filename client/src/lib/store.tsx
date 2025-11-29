import React, { createContext, useContext, useState, useEffect } from 'react';
import { FullReport, AnalysisResult, PatientDetails } from './types';
import { MOCK_HISTORY } from './mockData';

// Define the shape of our context
interface DataContextType {
  reports: FullReport[];
  addReport: (report: FullReport) => void;
  stats: {
    totalScans: number;
    tumorDetected: number;
    healthy: number;
    accuracy: number; // Still mocked as we don't have ground truth for user uploads
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<FullReport[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('neuroscan_reports_v2');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Failed to parse reports', e);
        setReports([]); // Fallback to empty
      }
    } else {
      // Initialize empty if no saved data
      setReports([]);
      localStorage.setItem('neuroscan_reports_v2', JSON.stringify([]));
    }
  }, []);

  const addReport = (report: FullReport) => {
    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    localStorage.setItem('neuroscan_reports_v2', JSON.stringify(updatedReports));
  };

  // Calculate dynamic stats
  const stats = {
    totalScans: reports.length,
    tumorDetected: reports.filter(r => r.tumorType !== 'notumor').length,
    healthy: reports.filter(r => r.tumorType === 'notumor').length,
    accuracy: 98.5, // Fixed model accuracy
  };

  return (
    <DataContext.Provider value={{ reports, addReport, stats }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
