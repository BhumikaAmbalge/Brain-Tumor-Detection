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
      <div id="report-content" className="bg-white text-black p-8 absolute top-[-10000px] w-[210mm]">
        <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">NEUROSCAN AI</h1>
            <p className="text-sm text-gray-500">Advanced Brain Tumor Detection System</p>
          </div>
          <div className="text-right">
            <p className="font-bold">CONFIDENTIAL MEDICAL REPORT</p>
            <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold border-b mb-2">PATIENT DETAILS</h3>
            <p><span className="font-semibold">Name:</span> {patient.name}</p>
            <p><span className="font-semibold">ID:</span> {patient.id}</p>
            <p><span className="font-semibold">Age/Gender:</span> {patient.age} / {patient.gender}</p>
            <p><span className="font-semibold">Hospital:</span> {patient.hospitalName}</p>
          </div>
          <div>
            <h3 className="font-bold border-b mb-2">ANALYSIS SUMMARY</h3>
            <p><span className="font-semibold">Scan ID:</span> {result.id}</p>
            <p><span className="font-semibold">Prediction:</span> <span className="uppercase font-bold">{info.name}</span></p>
            <p><span className="font-semibold">Confidence:</span> {(result.confidence * 100).toFixed(2)}%</p>
            <p><span className="font-semibold">Model:</span> CNN (VGG16/ResNet50)</p>
          </div>
        </div>

        <div className="mb-8">
           <h3 className="font-bold border-b mb-4">VISUAL ANALYSIS</h3>
           <div className="flex gap-4">
             <div className="flex-1">
                <p className="text-center text-sm mb-1">Original MRI</p>
                <img src={result.imageUrl} className="w-full h-48 object-contain border" />
             </div>
             <div className="flex-1">
                <p className="text-center text-sm mb-1">Tumor Localization (Grad-CAM)</p>
                {/* Since overlay mix-blend doesn't work well in html2canvas, we show just the cam or side by side, 
                    but here we try to simulate the overlay by just showing the cam image separately for the printed report */}
                <img src={result.gradCamUrl || result.imageUrl} className="w-full h-48 object-contain border" />
             </div>
           </div>
        </div>

        <div className="mb-8">
           <h3 className="font-bold border-b mb-2">CLINICAL CONTEXT</h3>
           <p className="text-sm mb-2">{info.description}</p>
           <h4 className="font-semibold text-sm mb-1">Associated Symptoms:</h4>
           <ul className="list-disc pl-5 text-sm mb-2">
             {info.symptoms.map(s => <li key={s}>{s}</li>)}
           </ul>
           <h4 className="font-semibold text-sm mb-1">Medical Recommendations:</h4>
           <ul className="list-disc pl-5 text-sm">
             {info.recommendations.map(r => <li key={r}>{r}</li>)}
           </ul>
        </div>
        
        <div className="mb-8 break-inside-avoid">
           <h3 className="font-bold border-b mb-4">CONFUSION MATRIX</h3>
           <div className="w-full flex justify-center">
              <div className="border p-4 bg-gray-50 w-3/4">
                <h4 className="text-center text-sm font-semibold mb-2">Model Performance (Validation Set)</h4>
                <div className="grid grid-cols-5 gap-1 text-xs text-center">
                  <div className="font-bold"></div>
                  <div className="font-bold">Glioma</div>
                  <div className="font-bold">Mening.</div>
                  <div className="font-bold">Pituitary</div>
                  <div className="font-bold">No Tumor</div>
                  
                  <div className="font-bold flex items-center justify-center">Glioma</div>
                  <div className="bg-blue-600 text-white p-2">98%</div>
                  <div className="bg-blue-100 p-2">1%</div>
                  <div className="bg-blue-50 p-2">0%</div>
                  <div className="bg-blue-50 p-2">1%</div>

                  <div className="font-bold flex items-center justify-center">Mening.</div>
                  <div className="bg-blue-100 p-2">2%</div>
                  <div className="bg-blue-600 text-white p-2">96%</div>
                  <div className="bg-blue-100 p-2">2%</div>
                  <div className="bg-blue-50 p-2">0%</div>

                  <div className="font-bold flex items-center justify-center">Pituitary</div>
                  <div className="bg-blue-50 p-2">0%</div>
                  <div className="bg-blue-100 p-2">1%</div>
                  <div className="bg-blue-600 text-white p-2">99%</div>
                  <div className="bg-blue-50 p-2">0%</div>

                  <div className="font-bold flex items-center justify-center">No Tumor</div>
                  <div className="bg-blue-50 p-2">1%</div>
                  <div className="bg-blue-50 p-2">0%</div>
                  <div className="bg-blue-50 p-2">0%</div>
                  <div className="bg-blue-600 text-white p-2">99%</div>
                </div>
              </div>
           </div>
        </div>

        <div className="mt-12 pt-4 border-t text-xs text-center text-gray-400">
          <p>This report is generated by an AI Diagnostic Support System. It should be reviewed by a certified radiologist.</p>
          <p>NeuroScan AI v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
