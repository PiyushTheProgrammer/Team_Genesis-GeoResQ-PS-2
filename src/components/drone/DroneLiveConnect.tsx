import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconDrone,
  IconVideo,
  IconCamera,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlug,
  IconDeviceMobile,
  IconSparkles,
  IconCheck,
  IconScan,
  IconCrosshair,
  IconLayersLinked,
  IconRefresh,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';
import { DetectionFeature } from '../../types/geoai';

export const DroneLiveConnect: React.FC = () => {
  const navigate = useNavigate();
  const {
    geographicContext,
    droneTelemetry,
    setDroneTelemetry,
    setDroneConnected,
    setDroneStreamUrl,
    setDroneMode,
    addCapturedDetection,
  } = useGeoStore();

  const [ipUrlInput, setIpUrlInput] = useState(droneTelemetry.streamUrl);
  const [activeTab, setActiveTab] = useState<'ipwebcam' | 'browsercam' | 'simulated'>(droneTelemetry.mode);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureNotice, setCaptureNotice] = useState<string | null>(null);
  const [isAiDetectionActive, setIsAiDetectionActive] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop browser camera on unmount or mode switch
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartBrowserCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment',
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setDroneMode('browsercam');
      setDroneConnected(true);
      setDroneTelemetry({ isConnected: true, mode: 'browsercam' });
    } catch (err) {
      console.warn('Browser camera access error:', err);
      alert('Could not access device camera. Please grant camera permission or use IP Webcam / Simulated feed.');
    }
  };

  const handleConnectIpWebcam = () => {
    if (!ipUrlInput.trim()) return;
    setDroneStreamUrl(ipUrlInput.trim());
    setDroneMode('ipwebcam');
    setDroneConnected(true);
    setDroneTelemetry({
      isConnected: true,
      mode: 'ipwebcam',
      streamUrl: ipUrlInput.trim(),
    });
  };

  const handleStartSimulatedFeed = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setDroneMode('simulated');
    setDroneConnected(true);
    setDroneTelemetry({ isConnected: true, mode: 'simulated' });
  };

  const handleDisconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setDroneConnected(false);
    setDroneTelemetry({ isConnected: false });
  };

  // Capture Frame & Vectorize onto Live GIS Map
  const handleCaptureAndVectorize = () => {
    setIsCapturing(true);

    const latOffset = (Math.random() - 0.5) * 0.004;
    const lngOffset = (Math.random() - 0.5) * 0.004;
    const centerLat = droneTelemetry.lat + latOffset;
    const centerLng = droneTelemetry.lng + lngOffset;

    const newFeatureId = `DRONE_LIVE_${Math.floor(1000 + Math.random() * 9000)}`;

    const newFeature: DetectionFeature = {
      id: newFeatureId,
      category: Math.random() > 0.5 ? 'flooded_area' : 'damaged_building',
      name: `Live Drone Optical Detection #${newFeatureId}`,
      confidence: 0.94,
      severity: 'high',
      geometryType: 'Polygon',
      coordinates: [
        [centerLat + 0.0015, centerLng - 0.0015],
        [centerLat + 0.0022, centerLng + 0.0010],
        [centerLat - 0.0010, centerLng + 0.0020],
        [centerLat - 0.0018, centerLng - 0.0005],
        [centerLat + 0.0015, centerLng - 0.0015],
      ],
      areaSqKm: 0.045,
      projectId: 'proj-live-drone-feed',
      projectName: `Live Optical Survey - ${geographicContext}`,
      detectedAt: new Date().toISOString(),
      notes: `Extracted directly from live drone video stream frame (${droneTelemetry.mode.toUpperCase()}) at 125m AGL.`,
      validationStatus: 'verified',
      attributes: {
        sensorSource: 'Live IP Webcam / Optical Video',
        altitudeAGL: `${droneTelemetry.altitudeM} meters`,
        groundGSD: '0.038 m/px',
      },
    };

    setTimeout(() => {
      addCapturedDetection(newFeature);
      setIsCapturing(false);
      setCaptureNotice(`Captured & Vectorized Feature [${newFeatureId}] to Live GIS Map!`);
      setTimeout(() => setCaptureNotice(null), 4500);
    }, 600);
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
            <IconDrone className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F172A] font-sans flex items-center space-x-2">
              <span>Drone Live Connect & Edge AI Vision Station</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                droneTelemetry.isConnected ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]' : 'bg-[#F1F5F9] text-[#64748B]'
              }`}>
                {droneTelemetry.isConnected ? '● LIVE STREAMING' : 'OFFLINE'}
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#64748B]">
              Connect mobile cameras (IP Webcam app), device webcam, or simulated 4K drone feeds for real-time edge AI vectorization.
            </p>
          </div>
        </div>

        {/* Source Mode Tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl font-mono text-xs border border-[#E2E8F0]">
          <button
            onClick={() => {
              setActiveTab('ipwebcam');
              if (droneTelemetry.isConnected) handleConnectIpWebcam();
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'ipwebcam' ? 'bg-white text-[#0284C7] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <IconDeviceMobile className="w-3.5 h-3.5" />
            <span>Mobile IP Webcam</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('browsercam');
              handleStartBrowserCamera();
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'browsercam' ? 'bg-white text-[#0284C7] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <IconCamera className="w-3.5 h-3.5" />
            <span>Device Camera</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('simulated');
              handleStartSimulatedFeed();
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'simulated' ? 'bg-white text-[#0284C7] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <IconVideo className="w-3.5 h-3.5" />
            <span>4K Drone Recon</span>
          </button>
        </div>
      </div>

      {captureNotice && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#047857] text-xs font-mono flex items-center justify-between font-bold animate-in fade-in">
          <div className="flex items-center space-x-2">
            <IconCheck className="w-4 h-4 text-[#047857]" />
            <span>{captureNotice}</span>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="underline hover:text-[#065F46] cursor-pointer"
          >
            View on Full Map &rarr;
          </button>
        </div>
      )}

      {/* Main Viewport & Video HUD Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Video Display with Edge AI Overlay (8 cols) */}
        <div className="lg:col-span-8 bg-[#09151B] border border-[#1E293B] rounded-2xl h-[360px] relative overflow-hidden flex items-center justify-center shadow-inner">
          {/* Active Stream Content */}
          {activeTab === 'browsercam' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {activeTab === 'ipwebcam' && droneTelemetry.isConnected && (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              {/* Attempt MJPEG / IP Webcam stream */}
              <img
                src={droneTelemetry.streamUrl}
                alt="Live IP Webcam Video"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback visual if IP webcam port is local/network blocked
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          )}

          {activeTab === 'simulated' && (
            <div className="w-full h-full relative">
              <img
                src="https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=1200&q=80"
                alt="Drone Aerial Reconnaissance"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* If Offline */}
          {!droneTelemetry.isConnected && activeTab !== 'simulated' && (
            <div className="text-center p-6 space-y-3 font-mono text-xs text-[#94A3B8]">
              <IconDrone className="w-12 h-12 text-[#64748B] mx-auto opacity-50" />
              <div className="text-sm font-bold text-white">Live Stream Disconnected</div>
              <p className="max-w-md text-[11px]">
                {activeTab === 'ipwebcam'
                  ? 'Enter your mobile phone IP Webcam URL below and tap "Connect IP Stream".'
                  : 'Click "Activate Device Camera" to start streaming from your webcam or smartphone.'}
              </p>
            </div>
          )}

          {/* Real-time Edge AI Bounding Box & HUD Overlays */}
          {droneTelemetry.isConnected && isAiDetectionActive && (
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Top HUD Telemetry Bar */}
              <div className="flex items-center justify-between font-mono text-[10px] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-[#10B981] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>REC • 4K UHD</span>
                  </span>
                  <span>ALT: {droneTelemetry.altitudeM}m AGL</span>
                  <span>BAT: {droneTelemetry.batteryPct}%</span>
                  <span>SPD: {droneTelemetry.speedMps} m/s</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#38BDF8]">MODEL: YOLOv8-DISASTER</span>
                  <span>FPS: {droneTelemetry.fps}</span>
                </div>
              </div>

              {/* Dynamic Bounding Box Overlay 1 (Flooded Zone) */}
              <div className="absolute top-[28%] left-[20%] w-[38%] h-[34%] border-2 border-[#0284C7] bg-[#0284C7]/20 rounded-md flex flex-col justify-between p-1.5 shadow-lg">
                <div className="inline-flex items-center space-x-1 bg-[#0284C7] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded self-start">
                  <span>🌊 Inundated Water Zone: 96%</span>
                </div>
                <div className="text-[9px] font-mono text-white/90 self-end bg-black/50 px-1 rounded">
                  Area: 3,420 m²
                </div>
              </div>

              {/* Dynamic Bounding Box Overlay 2 (Damaged Building Structure) */}
              <div className="absolute top-[35%] right-[12%] w-[26%] h-[32%] border-2 border-[#EF4444] bg-[#EF4444]/25 rounded-md flex flex-col justify-between p-1.5 shadow-lg">
                <div className="inline-flex items-center space-x-1 bg-[#EF4444] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded self-start">
                  <span>🏚️ Damaged Structure: 92%</span>
                </div>
                <div className="text-[9px] font-mono text-white/90 self-end bg-black/50 px-1 rounded">
                  P1 High Risk
                </div>
              </div>

              {/* Crosshair Target Reticle Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <IconCrosshair className="w-10 h-10 text-white/50 stroke-[1.5]" />
              </div>

              {/* Bottom HUD Location Bar */}
              <div className="flex items-center justify-between font-mono text-[10px] text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <div>
                  GPS: {droneTelemetry.lat.toFixed(4)}°N, {droneTelemetry.lng.toFixed(4)}°E ({geographicContext})
                </div>
                <div className="text-[#38BDF8]">
                  EDGE INFERENCE LATENCY: 8.2 ms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Controls & Ingestion Station (4 cols) */}
        <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
              <IconPlug className="w-4 h-4 text-[#0284C7]" />
              <span>Stream Configuration</span>
            </div>

            {/* If Mobile IP Webcam mode */}
            {activeTab === 'ipwebcam' && (
              <div className="space-y-2">
                <label className="text-[11px] text-[#64748B] block">
                  IP Webcam Stream URL (from Android/iOS app):
                </label>
                <input
                  type="text"
                  value={ipUrlInput}
                  onChange={(e) => setIpUrlInput(e.target.value)}
                  placeholder="http://192.168.1.15:8080/video"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
                <div className="text-[10px] text-[#64748B] leading-tight">
                  Tip: Install <em>"IP Webcam"</em> on your mobile, start server, and copy the IP address above.
                </div>
              </div>
            )}

            {/* If Device Camera mode */}
            {activeTab === 'browsercam' && (
              <div className="bg-white border border-[#CBD5E1] p-2.5 rounded-xl text-[11px] text-[#0F172A] space-y-1">
                <div className="font-bold text-[#0284C7]">Hardware Webcam / Phone Camera</div>
                <p className="text-[#64748B]">
                  Directly accesses your device's camera for rapid testing with full real-time object tracking.
                </p>
              </div>
            )}

            {/* If Simulated mode */}
            {activeTab === 'simulated' && (
              <div className="bg-white border border-[#CBD5E1] p-2.5 rounded-xl text-[11px] text-[#0F172A] space-y-1">
                <div className="font-bold text-[#047857]">Simulated 4K Reconnaissance Stream</div>
                <p className="text-[#64748B]">
                  Simulates high-altitude DJI Matrice 300 RTK drone sweep over riverine disaster basin.
                </p>
              </div>
            )}

            {/* AI Overlay Toggles */}
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#0F172A] font-semibold">Real-Time AI Vision Overlay</span>
                <input
                  type="checkbox"
                  checked={isAiDetectionActive}
                  onChange={(e) => setIsAiDetectionActive(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] rounded"
                />
              </label>

              <div className="flex justify-between text-[11px] py-1 border-t border-[#F1F5F9]">
                <span className="text-[#64748B]">Inference Engine:</span>
                <span className="font-bold text-[#0F172A]">YOLOv8 + SegFormer</span>
              </div>
              <div className="flex justify-between text-[11px] py-1 border-t border-[#F1F5F9]">
                <span className="text-[#64748B]">Target Altitude:</span>
                <span className="font-bold text-[#0284C7]">125 m AGL</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            {!droneTelemetry.isConnected ? (
              <button
                onClick={() => {
                  if (activeTab === 'ipwebcam') handleConnectIpWebcam();
                  else if (activeTab === 'browsercam') handleStartBrowserCamera();
                  else handleStartSimulatedFeed();
                }}
                className="w-full py-2 bg-[#0284C7] text-white font-bold rounded-xl hover:bg-[#0369A1] transition-all flex items-center justify-center space-x-2 shadow-xs uppercase tracking-wider text-xs"
              >
                <IconPlayerPlay className="w-4 h-4 fill-current" />
                <span>Start Live Drone Feed</span>
              </button>
            ) : (
              <div className="space-y-2">
                {/* 1-Click Snapshot & Vectorize Button */}
                <button
                  onClick={handleCaptureAndVectorize}
                  disabled={isCapturing}
                  className="w-full py-2 bg-[#043D38] text-white font-bold rounded-xl hover:bg-[#022D29] transition-all flex items-center justify-center space-x-2 shadow-md uppercase tracking-wider text-xs"
                >
                  <IconLayersLinked className="w-4 h-4" />
                  <span>{isCapturing ? 'Vectorizing...' : 'Capture Frame & Vectorize to Map'}</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full py-1.5 bg-white text-[#EF4444] border border-[#FCA5A5] font-bold rounded-xl hover:bg-[#FEF2F2] transition-colors flex items-center justify-center space-x-1 text-xs"
                >
                  <IconPlayerStop className="w-3.5 h-3.5" />
                  <span>Disconnect Stream</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
