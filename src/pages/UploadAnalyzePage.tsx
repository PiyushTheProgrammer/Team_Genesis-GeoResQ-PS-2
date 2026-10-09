import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../store/useGeoStore';
import { DEMO_MODEL_SPECS } from '../data/demoData';
import { uploadImagery } from '../services/api';
import {
  IconUpload,
  IconFileCheck,
  IconAlertTriangle,
  IconCpu,
  IconAdjustmentsHorizontal,
  IconPlayerPlay,
  IconCheck,
  IconLoader2,
  IconMapPin,
} from '@tabler/icons-react';

export const UploadAnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject, triggerMockAnalysis, currentJob } = useGeoStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const [selectedModel, setSelectedModel] = useState<string>('genresq_unet_best.pth (PyTorch Custom UNet)');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);
  const [extractClasses, setExtractClasses] = useState({
    flooded_area: true,
    damaged_building: true,
    road_affected: true,
    vehicle: true,
    other_asset: true,
  });

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null);
    setUploadSuccess(false);

    if (rejectedFiles.length > 0) {
      setFileError('Invalid file format. Please upload a GeoTIFF (.tif, .tiff) or orthomosaic image.');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setFileError('File size exceeds 2 GB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/tiff': ['.tif', '.tiff'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    await uploadImagery(activeProject?.id || 'proj-nashik-2026-001', selectedFile, (pct) => {
      setUploadProgress(pct);
    });

    setIsUploading(false);
    setUploadSuccess(true);
  };

  const handleRunJob = async () => {
    triggerMockAnalysis(
      selectedFile ? selectedFile.name : 'Nashik Drone Survey Orthomosaic',
      selectedModel
    );
  };

  const isJobProcessing = currentJob?.status === 'processing';
  const isJobCompleted = currentJob?.status === 'completed';

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-3">
        <h1 className="text-xl font-bold text-[#0F172A] font-sans">
          Drone Imagery Upload & AI Inference Workflow
        </h1>
        <p className="text-xs text-[#64748B] font-mono mt-0.5">
          Submit high-resolution aerial GeoTIFF imagery to trigger automated geospatial detection models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Dropzone & File Telemetry (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconUpload className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                1. Select Drone Imagery File
              </h2>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-xl transition-all ${
                isDragActive
                  ? 'border-[#0284C7] bg-[#F0F9FF]'
                  : selectedFile
                  ? 'border-[#10B981] bg-[#ECFDF5]'
                  : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0284C7]'
              }`}
            >
              <input {...getInputProps()} />
              <IconUpload className="w-8 h-8 text-[#0284C7] mx-auto mb-2 stroke-[1.5]" />
              {selectedFile ? (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#0F172A] font-mono">{selectedFile.name}</div>
                  <div className="text-[11px] font-mono text-[#64748B]">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Drag & drop GeoTIFF or Orthomosaic imagery here
                  </p>
                  <p className="text-[10px] text-[#64748B] font-mono">
                    Supported formats: .tif, .tiff, .jpg, .png (Max 2 GB)
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-[#DC2626] text-xs font-mono flex items-center space-x-2">
                <IconAlertTriangle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {selectedFile && !uploadSuccess && (
              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="w-full py-2.5 bg-[#043D38] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Payload ({uploadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <IconUpload className="w-4 h-4" />
                    <span>Upload & Extract Telemetry</span>
                  </>
                )}
              </button>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#047857] text-xs font-mono flex items-center space-x-2 font-semibold">
                <IconCheck className="w-4 h-4 text-[#047857]" />
                <span>Payload validated & uploaded successfully!</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconFileCheck className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                2. Extracted Georeferencing Telemetry
              </h2>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Filename:</span>
                <span className="text-[#0F172A] font-semibold">{selectedFile ? selectedFile.name : activeProject?.imagery.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Target Location:</span>
                <span className="text-[#0F172A] font-semibold">{activeProject?.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">CRS Reference:</span>
                <span className="text-[#0F172A] font-semibold">EPSG:4326 (WGS84 Geodetic)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Spatial GSD:</span>
                <span className="text-[#0F172A] font-semibold">0.045 m / px</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Dimensions:</span>
                <span className="text-[#0F172A] font-semibold">14200 x 9800 px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Specs & Execution (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconCpu className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                3. GeoAI Model Architecture
              </h2>
            </div>

            <div className="space-y-2">
              {DEMO_MODEL_SPECS.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModel(mod.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === mod.name
                      ? 'bg-[#F0F9FF] border-[#0284C7] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] font-mono">{mod.name}</span>
                    <span className="text-[10px] font-mono font-bold text-[#0284C7]">mAP: {mod.mAP50 * 100}%</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 font-sans">{mod.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconAdjustmentsHorizontal className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                4. Inference Parameters
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#64748B]">Confidence Cutoff:</span>
                  <span className="font-bold text-[#0284C7]">
                    {Math.round(confidenceThreshold * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                />
              </div>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <div className="text-xs font-mono font-semibold text-[#0F172A] mb-1.5">
                  Target Classes to Segment:
                </div>
                <div className="space-y-1 font-mono text-xs">
                  {Object.entries(extractClasses).map(([key, val]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setExtractClasses({ ...extractClasses, [key]: e.target.checked })
                        }
                        className="rounded accent-[#0284C7]"
                      />
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleRunJob}
                  disabled={isJobProcessing}
                  className={`w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs border flex items-center justify-center space-x-2 text-white transition-all ${
                    isJobProcessing
                      ? 'bg-[#64748B] border-[#64748B] cursor-not-allowed'
                      : 'bg-[#043D38] border-[#043D38] hover:bg-[#022D29]'
                  }`}
                >
                  {isJobProcessing ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Job Running ({currentJob?.progressPercent}%)</span>
                    </>
                  ) : (
                    <>
                      <IconPlayerPlay className="w-4 h-4 fill-current" />
                      <span>Submit GeoAI Trace Job</span>
                    </>
                  )}
                </button>

                {isJobCompleted && (
                  <button
                    onClick={() => navigate('/map')}
                    className="w-full mt-2 py-2 bg-[#F8FAFC] text-[#0284C7] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2"
                  >
                    <IconMapPin className="w-4 h-4 text-[#0284C7]" />
                    <span>Review Detections on Map</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
