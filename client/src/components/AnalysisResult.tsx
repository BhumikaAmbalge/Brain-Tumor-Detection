import { useState } from 'react';
import { AnalysisResult, PatientDetails, TumorType } from '@/lib/types';
import { TUMOR_INFO } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, AlertCircle, CheckCircle2, Eye, ClipboardList } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResultProps {
  result: AnalysisResult;
  patient: PatientDetails;
}

export default function AnalysisResultView({ result, patient }: AnalysisResultProps) {
  const [showGradCam, setShowGradCam] = useState(true);
  const info = TUMOR_INFO[result.tumorType];
  
  const handleDownloadReport = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    const dateStr = new Date(result.timestamp).toISOString().split('T')[0];
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`MRI_Report_${patient.name.replace(' ', '_')}_${dateStr}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Results Header */}
      <Card className="border-primary/20 shadow-lg overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-2 h-full ${result.tumorType === 'notumor' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                Analysis Report 
                {result.tumorType === 'notumor' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>
                ) : (
                  <Badge variant="destructive" className="animate-pulse">Tumor Detected</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                Scan ID: {result.id} • Analyzed on {new Date(result.timestamp).toLocaleString()}
              </CardDescription>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Visualization */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-muted bg-black group">
                <img 
                  src={result.imageUrl} 
                  alt="Original MRI" 
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {showGradCam && result.gradCamUrl && (
                  <img 
                    src={result.gradCamUrl} 
                    alt="Grad-CAM Overlay" 
                    className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-80 transition-opacity duration-500"
                  />
                )}
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-black/50 text-white backdrop-blur-md hover:bg-black/70 border border-white/20"
                    onClick={() => setShowGradCam(!showGradCam)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    {showGradCam ? 'Hide Heatmap' : 'Show Heatmap'}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                *Grad-CAM visualization highlights the regions most important for the model's prediction.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Classification Result</h3>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-xl capitalize">{info.name}</span>
                    <span className="font-bold text-xl text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">Confidence Score</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{info.description}</p>
              </div>

              {info.symptoms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {info.symptoms.slice(0, 5).map((symptom, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {info.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ClipboardList className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Report Template for PDF Generation */}
      <div id="report-content" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '2rem', position: 'absolute', top: '-10000px', width: '210mm' }}>
        <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>NEUROSCAN AI</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Advanced Brain Tumor Detection System</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 'bold', margin: 0 }}>CONFIDENTIAL MEDICAL REPORT</p>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem', paddingBottom: '0.25rem' }}>PATIENT DETAILS</h3>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Name:</span> {patient.name}</p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>ID:</span> {patient.id}</p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Age/Gender:</span> {patient.age} / {patient.gender}</p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Hospital:</span> {patient.hospitalName}</p>
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem', paddingBottom: '0.25rem' }}>ANALYSIS SUMMARY</h3>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Scan ID:</span> {result.id}</p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Prediction:</span> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{info.name}</span></p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Confidence:</span> {(result.confidence * 100).toFixed(2)}%</p>
            <p style={{ margin: '0.25rem 0' }}><span style={{ fontWeight: '600' }}>Model:</span> CNN (VGG16/ResNet50)</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
           <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem', paddingBottom: '0.25rem' }}>VISUAL ANALYSIS</h3>
           <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1 }}>
                <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Original MRI</p>
                <img src={result.imageUrl} style={{ width: '100%', height: '12rem', objectFit: 'contain', border: '1px solid #e5e7eb' }} />
             </div>
             <div style={{ flex: 1 }}>
                <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Tumor Localization (Grad-CAM)</p>
                <img src={result.gradCamUrl || result.imageUrl} style={{ width: '100%', height: '12rem', objectFit: 'contain', border: '1px solid #e5e7eb' }} />
             </div>
           </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
           <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem', paddingBottom: '0.25rem' }}>CLINICAL CONTEXT</h3>
           <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{info.description}</p>
           <h4 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Associated Symptoms:</h4>
           <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
             {info.symptoms.map(s => <li key={s}>{s}</li>)}
           </ul>
           <h4 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Medical Recommendations:</h4>
           <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
             {info.recommendations.map(r => <li key={r}>{r}</li>)}
           </ul>
        </div>
        
        <div style={{ marginBottom: '2rem', breakInside: 'avoid' }}>
           <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem', paddingBottom: '0.25rem' }}>CONFUSION MATRIX</h3>
           <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ border: '1px solid #e5e7eb', padding: '1rem', backgroundColor: '#f9fafb', width: '75%' }}>
                <h4 style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Model Performance (Validation Set)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.25rem', fontSize: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}></div>
                  <div style={{ fontWeight: 'bold' }}>Glioma</div>
                  <div style={{ fontWeight: 'bold' }}>Mening.</div>
                  <div style={{ fontWeight: 'bold' }}>Pituitary</div>
                  <div style={{ fontWeight: 'bold' }}>No Tumor</div>
                  
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Glioma</div>
                  <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem' }}>98%</div>
                  <div style={{ backgroundColor: '#dbeafe', padding: '0.5rem' }}>1%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>1%</div>

                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Mening.</div>
                  <div style={{ backgroundColor: '#dbeafe', padding: '0.5rem' }}>2%</div>
                  <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem' }}>96%</div>
                  <div style={{ backgroundColor: '#dbeafe', padding: '0.5rem' }}>2%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>

                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pituitary</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>
                  <div style={{ backgroundColor: '#dbeafe', padding: '0.5rem' }}>1%</div>
                  <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem' }}>99%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>

                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Tumor</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>1%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem' }}>0%</div>
                  <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem' }}>99%</div>
                </div>
              </div>
           </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ margin: 0 }}>This report is generated by an AI Diagnostic Support System. It should be reviewed by a certified radiologist.</p>
          <p style={{ margin: 0 }}>NeuroScan AI v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
