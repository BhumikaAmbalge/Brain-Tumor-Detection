export type TumorType = 'glioma' | 'meningioma' | 'pituitary' | 'notumor';

export interface PatientDetails {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  hospitalName: string;
  date: string;
}

export interface AnalysisResult {
  id: string;
  patientId: string;
  tumorType: TumorType;
  confidence: number;
  imageUrl: string;
  gradCamUrl: string;
  timestamp: string;
  symptoms: string[];
}

export interface FullReport extends PatientDetails, AnalysisResult {}
