import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getConsultationById, getCountryFlag } from '@/data/mockVisaData';

export default function UploadCaseDocuments() {
  // Extract case ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch case data to verify access
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        // Get the specific case (with security check)
        const foundCase = getConsultationById(id);
        
        if (!foundCase) {
          toast.error("Case not found or access denied");
          navigate('/dashboard/visa-status/summary');
          return;
        }
        
        setCaseData(foundCase);
      } catch (error) {
        toast.error("Failed to load case details");
        navigate('/dashboard/visa-status/summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseData();
  }, [id, navigate]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types (only PDF, JPG, PNG)
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Only PDF, JPG, and PNG are allowed.`);
        return false;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  // Remove a file from the selection
  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    
    try {
      setUploading(true);
      
      // Simulating file upload - in production, this would upload to server/cloud storage
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In production, you would:
      // 1. Upload files to cloud storage (e.g., Cloudinary, AWS S3)
      // 2. Send document metadata to API
      // 3. Associate documents with the case ID
      
      // For now, we'll simulate success
      const uploadedCount = selectedFiles.length;
      
      toast.success(
        `Successfully uploaded ${uploadedCount} document${uploadedCount > 1 ? 's' : ''}!`,
        {
          description: "Your documents have been submitted for review."
        }
      );
      
      // Redirect back to case details page
      navigate(`/dashboard/visa-status/summary/details/${id}`);
      
    } catch (error) {
      toast.error("Failed to upload documents", {
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Upload size={48} className="mx-auto text-slate-300 animate-pulse" />
        <p className="text-slate-400 mt-4">Loading upload form...</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/visa-status/summary/details/${id}`)}
          className="gap-2 border-slate-300"
        >
          <ArrowLeft size={16} />
          Back to Case Details
        </Button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Documents</h1>
        <p className="text-slate-500 text-lg">
          Submit required documents for {caseData.destination} {caseData.visaType} (Case #{caseData.id})
        </p>
      </div>

      {/* Case Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getCountryFlag(caseData.countryCode)}</div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{caseData.destination} - {caseData.visaType}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Appointment: {caseData.dateBooked} at {caseData.appointmentTime}
              </p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {caseData.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              
              {/* File Upload Area */}
              <div>
                <Label htmlFor="documents" className="text-base font-semibold">
                  Select Documents
                </Label>
                <p className="text-sm text-slate-500 mb-3">
                  Upload PDF, JPG, or PNG files (max 10MB each)
                </p>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-700 font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-slate-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Selected Files ({selectedFiles.length})
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText size={20} className="text-blue-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">
                      Important Guidelines
                    </h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Ensure all documents are clear and legible</li>
                      <li>• Files should be in color for passports and photos</li>
                      <li>• All text must be readable without zooming</li>
                      <li>• Do not upload password-protected files</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/dashboard/visa-status/summary/details/${id}`)}
            disabled={uploading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="gap-2 min-w-[200px]"
          >
            {uploading ? (
              <>
                <Upload size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Upload {selectedFiles.length > 0 && `${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
              </>
            )}
          </Button>
        </div>
      </form>

    </div>
  );
}
