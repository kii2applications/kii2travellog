
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFlights } from '@/hooks/useFlights';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: any;
}

interface ColumnMapping {
  departureCountry: string;
  arrivalCountry: string;
  departureDate: string;
  arrivalDate: string;
}

export const ExcelImport = () => {
  const { addFlight, isAddingFlight } = useFlights();
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    departureCountry: '',
    arrivalCountry: '',
    departureDate: '',
    arrivalDate: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          toast({
            title: "Invalid File",
            description: "Excel file must contain at least a header row and one data row.",
            variant: "destructive"
          });
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map(row => {
          const obj: ExcelData = {};
          headers.forEach((header, index) => {
            obj[header] = (row as any[])[index] || '';
          });
          return obj;
        });

        setExcelColumns(headers);
        setExcelData(rows);
        
        toast({
          title: "File Loaded",
          description: `Successfully loaded ${rows.length} rows from ${file.name}`,
        });
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Error",
          description: "Failed to read Excel file. Please ensure it's a valid .xlsx or .xls file.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({ ...prev, [field]: value }));
  };

  const validateMapping = (): boolean => {
    const requiredFields = ['departureCountry', 'arrivalCountry', 'departureDate', 'arrivalDate'];
    return requiredFields.every(field => columnMapping[field as keyof ColumnMapping] !== '');
  };

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // If it's already a string in YYYY-MM-DD format, return as is
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // If it's a number (Excel date serial), convert it
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
    
    // Try to parse as a regular date
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      // If all else fails, return empty string
    }
    
    return '';
  };

  const handleImport = async () => {
    if (!validateMapping()) {
      toast({
        title: "Mapping Required",
        description: "Please map all required fields before importing.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    console.log('Starting import with column mapping:', columnMapping);
    console.log('Sample data row:', excelData[0]);

    for (const row of excelData) {
      try {
        const departureDate = formatDate(row[columnMapping.departureDate]);
        const arrivalDate = formatDate(row[columnMapping.arrivalDate]);
        
        console.log('Processing row:', {
          departureCountry: row[columnMapping.departureCountry],
          arrivalCountry: row[columnMapping.arrivalCountry],
          departureDate,
          arrivalDate
        });
        
        if (!departureDate || !arrivalDate) {
          console.error('Invalid dates for row:', row);
          errorCount++;
          continue;
        }

        const flightData = {
          departure_country: String(row[columnMapping.departureCountry] || '').trim(),
          arrival_country: String(row[columnMapping.arrivalCountry] || '').trim(),
          departure_date: departureDate,
          arrival_date: arrivalDate,
        };

        if (!flightData.departure_country || !flightData.arrival_country) {
          console.error('Missing country data for row:', row);
          errorCount++;
          continue;
        }

        console.log('Adding flight:', flightData);
        addFlight(flightData);
        successCount++;
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error importing row:', error, row);
        errorCount++;
      }
    }

    setIsProcessing(false);
    
    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} flights. ${errorCount > 0 ? `${errorCount} rows failed.` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default"
    });

    // Reset form if successful
    if (errorCount === 0) {
      setExcelData([]);
      setExcelColumns([]);
      setColumnMapping({
        departureCountry: '',
        arrivalCountry: '',
        departureDate: '',
        arrivalDate: ''
      });
      setFileName('');
    }
  };

  const isMappingComplete = validateMapping();

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-500" />
          Import from Excel
        </CardTitle>
        <CardDescription>
          Upload an Excel file and map columns to import flight data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="excel-file">Excel File (.xlsx or .xls)</Label>
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="bg-white/50"
            disabled={isProcessing}
          />
          {fileName && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Loaded: {fileName}
            </p>
          )}
        </div>

        {/* Column Mapping */}
        {excelColumns.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Map Columns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departure Country</Label>
                  <Select
                    value={columnMapping.departureCountry}
                    onValueChange={(value) => handleColumnMappingChange('departureCountry', value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {excelColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Arrival Country</Label>
                  <Select
                    value={columnMapping.arrivalCountry}
                    onValueChange={(value) => handleColumnMappingChange('arrivalCountry', value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {excelColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Departure Date</Label>
                  <Select
                    value={columnMapping.departureDate}
                    onValueChange={(value) => handleColumnMappingChange('departureDate', value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {excelColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Arrival Date</Label>
                  <Select
                    value={columnMapping.arrivalDate}
                    onValueChange={(value) => handleColumnMappingChange('arrivalDate', value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {excelColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Preview */}
            {isMappingComplete && excelData.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Preview (first 3 rows)</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  {excelData.slice(0, 3).map((row, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded border">
                      <div className="grid grid-cols-2 gap-2">
                        <div><strong>From:</strong> {row[columnMapping.departureCountry]}</div>
                        <div><strong>To:</strong> {row[columnMapping.arrivalCountry]}</div>
                        <div><strong>Departure:</strong> {formatDate(row[columnMapping.departureDate])}</div>
                        <div><strong>Arrival:</strong> {formatDate(row[columnMapping.arrivalDate])}</div>
                      </div>
                    </div>
                  ))}
                  {excelData.length > 3 && (
                    <p className="text-gray-600 text-center">
                      ... and {excelData.length - 3} more rows
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="border-t pt-4">
              <Button
                onClick={handleImport}
                disabled={!isMappingComplete || isProcessing || isAddingFlight}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isProcessing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {excelData.length} Flights
                  </>
                )}
              </Button>
              
              {!isMappingComplete && excelColumns.length > 0 && (
                <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please map all required fields to enable import
                </p>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
