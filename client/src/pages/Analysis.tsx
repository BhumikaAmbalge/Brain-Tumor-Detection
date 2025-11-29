import { useState } from 'react';
import Layout from '@/components/Layout';
import PatientForm from '@/components/PatientForm';
import MRIUpload from '@/components/MRIUpload';
import AnalysisResultView from '@/components/AnalysisResult';
import { PatientDetails, AnalysisResult, TumorType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronRight, Loader2 } from 'lucide-react';

// Images for mock analysis
import gliomaImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_glioma_tumor.png';
import meningiomaImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_meningioma_tumor.png';
import pituitaryImage from '@assets/generated_images/mri_scan_of_a_human_brain_showing_a_pituitary_tumor.png';
import healthyImage from '@assets/generated_images/mri_scan_of_a_healthy_human_brain.png';
import gradCamImage from '@assets/generated_images/grad-cam_heatmap_overlay_for_brain_tumor_detection.png';
import { TUMOR_INFO } from '@/lib/mockData';

type Step = 'details' | 'upload' | 'analyzing' | 'result';

export default function Analysis() {
  const [step, setStep] = useState<Step>('details');
  const [patientData, setPatientData] = useState<PatientDetails | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handlePatientSubmit = (data: Omit<PatientDetails, 'id' | 'date'>) => {
    setPatientData({
      ...data,
      id: `PAT-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString()
    });
    setStep('upload');
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setStep('analyzing');
    
    // Simulate Analysis Process
    setTimeout(() => {
      // Mock Random Result Logic
      const types: TumorType[] = ['glioma', 'meningioma', 'pituitary', 'notumor'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      let resultImage = '';
      if (randomType === 'glioma') resultImage = gliomaImage;
      else if (randomType === 'meningioma') resultImage = meningiomaImage;
      else if (randomType === 'pituitary') resultImage = pituitaryImage;
      else resultImage = healthyImage;

      // If user uploads a specific file, we might want to use that preview, 
      // but for this prototype we swap to our "detected" image to match the class
      // In a real app, the backend would process the uploaded image.
      // For better UX here, let's assume the uploaded image IS the one we have.
      
      const mockResult: AnalysisResult = {
        id: `SCAN-${Math.floor(Math.random() * 10000)}`,
        patientId: patientData?.id || 'UNKNOWN',
        tumorType: randomType,
        confidence: 0.85 + Math.random() * 0.14, // 85-99%
        imageUrl: resultImage,
        gradCamUrl: randomType === 'notumor' ? '' : gradCamImage,
        timestamp: new Date().toISOString(),
        symptoms: TUMOR_INFO[randomType].symptoms
      };
      
      setResult(mockResult);
      setStep('result');
    }, 3000); // 3 second processing simulation
  };

  const steps = [
    { id: 'details', label: 'Patient Details' },
    { id: 'upload', label: 'MRI Upload' },
    { id: 'analyzing', label: 'Analysis' },
    { id: 'result', label: 'Report' }
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">New Analysis</h2>
            <p className="text-muted-foreground mt-2">Follow the steps to analyze a new MRI scan.</p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto mb-12">
          <div className="absolute left-0 top-1/2 h-0.5 w-full bg-muted -z-10" />
          {steps.map((s, index) => {
            const isActive = s.id === step;
            const isCompleted = steps.findIndex(item => item.id === step) > index;
            
            return (
              <div key={s.id} className="flex flex-col items-center bg-background px-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'border-primary bg-primary text-primary-foreground scale-110' : ''}
                  ${isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground bg-background'}
                `}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                <span className={`mt-2 text-sm font-medium ${isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[500px]">
          {step === 'details' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <PatientForm onSubmit={handlePatientSubmit} />
            </div>
          )}

          {step === 'upload' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">Patient</h3>
                        <p className="text-lg font-medium">{patientData?.name}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">ID</h3>
                        <p className="text-base">{patientData?.id}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">Hospital</h3>
                        <p className="text-base">{patientData?.hospitalName}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2 h-[400px]">
                  <MRIUpload onUpload={handleUpload} />
                </div>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="h-20 w-20 text-primary animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mt-8 mb-2">Analyzing MRI Scan...</h3>
              <p className="text-muted-foreground max-w-md text-center">
                Our Deep Learning models (VGG16, ResNet50) are processing the image to detect potential anomalies and segment tumor regions.
              </p>
              
              <div className="mt-8 space-y-2 w-full max-w-md">
                <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                  <span>Preprocessing</span>
                  <span>Feature Extraction</span>
                  <span>Classification</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-2/3 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 skew-x-12 animate-[translateX_1s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && result && patientData && (
            <AnalysisResultView result={result} patient={patientData} />
          )}
        </div>
      </div>
    </Layout>
  );
}
