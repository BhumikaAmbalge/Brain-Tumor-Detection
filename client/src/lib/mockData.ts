import { FullReport } from './types';
import gliomaImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_glioma_tumor.png';
import meningiomaImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_meningioma_tumor.png';
import pituitaryImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_pituitary_tumor.png';
import healthyImage from '@assets/generated_images/mri_scan_of_a_healthy_human_brain.png';
import gradCamImage from '@assets/generated_images/grad-cam_heatmap_overlay_for_brain_tumor_detection.png';

export const MOCK_HISTORY: FullReport[] = [
  {
    id: 'REP-001',
    patientId: 'PAT-1024',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    hospitalName: 'Central City Hospital',
    date: '2024-05-10',
    tumorType: 'glioma',
    confidence: 0.98,
    imageUrl: gliomaImage,
    gradCamUrl: gradCamImage,
    timestamp: '2024-05-10T10:30:00Z',
    symptoms: ['Headaches', 'Seizures', 'Vision loss']
  },
  {
    id: 'REP-002',
    patientId: 'PAT-1025',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    hospitalName: 'General Medical Center',
    date: '2024-05-11',
    tumorType: 'meningioma',
    confidence: 0.95,
    imageUrl: meningiomaImage,
    gradCamUrl: gradCamImage,
    timestamp: '2024-05-11T14:15:00Z',
    symptoms: ['Headaches', 'Hearing loss', 'Memory loss']
  },
  {
    id: 'REP-003',
    patientId: 'PAT-1026',
    name: 'Robert Johnson',
    age: 58,
    gender: 'Male',
    hospitalName: 'St. Mary Hospital',
    date: '2024-05-12',
    tumorType: 'pituitary',
    confidence: 0.92,
    imageUrl: pituitaryImage,
    gradCamUrl: gradCamImage,
    timestamp: '2024-05-12T09:00:00Z',
    symptoms: ['Vision problems', 'Headaches', 'Hormonal changes']
  },
  {
    id: 'REP-004',
    patientId: 'PAT-1027',
    name: 'Emily Davis',
    age: 24,
    gender: 'Female',
    hospitalName: 'Central City Hospital',
    date: '2024-05-13',
    tumorType: 'notumor',
    confidence: 0.99,
    imageUrl: healthyImage,
    gradCamUrl: '',
    timestamp: '2024-05-13T11:45:00Z',
    symptoms: []
  }
];

export const TUMOR_INFO = {
  glioma: {
    name: 'Glioma',
    description: 'A type of tumor that occurs in the brain and spinal cord.',
    symptoms: ['Headaches', 'Nausea or vomiting', 'Confusion or decline in brain function', 'Memory loss', 'Personality changes or irritability', 'Difficulty with balance', 'Urinary incontinence', 'Vision problems', 'Speech difficulties', 'Seizures']
  },
  meningioma: {
    name: 'Meningioma',
    description: 'A tumor that arises from the meninges — the membranes that surround your brain and spinal cord.',
    symptoms: ['Changes in vision, such as seeing double or blurriness', 'Headaches, especially those that are worse in the morning', 'Hearing loss or ringing in the ears', 'Memory loss', 'Loss of smell', 'Seizures', 'Weakness in your arms or legs', 'Language difficulty']
  },
  pituitary: {
    name: 'Pituitary Tumor',
    description: 'Abnormal growths that develop in your pituitary gland.',
    symptoms: ['Headache', 'Vision loss', 'Nausea or vomiting', 'Weakness', 'Feeling cold', 'Less frequent or no menstrual periods', 'Body hair loss', 'Sexual dysfunction', 'Increased amount of urine']
  },
  notumor: {
    name: 'No Tumor Detected',
    description: 'No abnormalities detected in the MRI scan.',
    symptoms: []
  }
};
