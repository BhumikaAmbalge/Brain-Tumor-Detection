import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Download, Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useData } from '@/lib/store';
import AnalysisResultView from '@/components/AnalysisResult';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function History() {
  const { reports } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredHistory = reports.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.tumorType === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patient History</h2>
          <p className="text-muted-foreground mt-2">View and manage past diagnostic reports.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
              <div>
                <CardTitle>Diagnostic Records</CardTitle>
                <CardDescription>Total {filteredHistory.length} records found</CardDescription>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patient name or ID..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="glioma">Glioma</SelectItem>
                    <SelectItem value="meningioma">Meningioma</SelectItem>
                    <SelectItem value="pituitary">Pituitary</SelectItem>
                    <SelectItem value="notumor">No Tumor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.patientId}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                          ${record.tumorType === 'notumor' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {record.tumorType === 'notumor' ? 'No Tumor' : record.tumorType}
                        </span>
                      </TableCell>
                      <TableCell>{(record.confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-muted-foreground">{record.hospitalName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="View Details"
                                onClick={() => setSelectedReportId(record.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedReport && (
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="mt-4">
                                  <AnalysisResultView result={selectedReport} patient={selectedReport} />
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No records found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
