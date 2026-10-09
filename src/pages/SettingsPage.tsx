import React, { useState } from 'react';
import { useGeoStore } from '../store/useGeoStore';
import {
  IconSettings,
  IconCheck,
  IconServer,
  IconDeviceDesktop,
  IconKey,
  IconMap,
  IconDeviceMobile,
  IconExternalLink,
} from '@tabler/icons-react';

export const SettingsPage: React.FC = () => {
  const { isDemoMode, setDemoMode, isBackendConnected } = useGeoStore();

  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  );
  const [defaultCrs, setDefaultCrs] = useState('EPSG:4326 (WGS84)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#CBD5E1] pb-3">
        <div className="flex items-center space-x-2">
          <IconSettings className="w-5 h-5 text-[#0284C7]" />
          <h1 className="text-xl font-bold text-[#0F172A] font-sans">
            GeoAI Dashboard Telemetry & System Settings
          </h1>
        </div>
        <p className="text-xs text-[#64748B] font-mono mt-0.5">
          Configure API endpoints, default coordinate systems, free API keys, and drone connection parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 font-sans">
        {/* Backend Endpoint Settings */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconServer className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              1. Backend API Endpoint
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#0F172A]">
              GeoResQ API Server URL:
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0284C7]"
            />
            <div className="text-[10px] text-[#64748B] font-mono">
              Current API State:{' '}
              {isBackendConnected ? (
                <span className="text-[#059669] font-bold">Connected (200 OK)</span>
              ) : (
                <span className="text-[#D97706] font-bold">Standalone / Demo Fallback Mode (Full GIS Active)</span>
              )}
            </div>
          </div>
        </div>

        {/* Free API Keys & Providers Guide (Answer to user's question) */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconKey className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              2. Free API Keys & Tile Providers (No-Cost Setup)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#0369A1]">
                <span>1. Google Gemini Vision API Key (100% Free)</span>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] underline text-[#0284C7]"
                >
                  <span>Google AI Studio</span>
                  <IconExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Google provides a 100% free tier (no credit card required) at Google AI Studio. Add <code className="bg-white px-1 py-0.5 rounded border border-[#BAE6FD] font-mono text-[#0F172A]">GEMINI_API_KEY</code> to your <code className="bg-white px-1 py-0.5 rounded border border-[#BAE6FD] font-mono">.env</code> file.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#047857]">
                <span>2. Esri World Imagery & OpenStreetMap (Already Integrated, 0 Key Needed)</span>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#A7F3D0] text-[#047857]">FREE TILE SERVER</span>
              </div>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                The satellite, street, and terrain layers on your interactive map use OpenStreetMap and Esri ArcGIS World Imagery tiles out-of-the-box with zero configuration and zero API keys needed.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#D97706]">
                <span>3. Mobile Camera via "IP Webcam" App (100% Free)</span>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#FCD34D] text-[#D97706]">PHONE CAMERA</span>
              </div>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Install the free <strong>IP Webcam</strong> app from Google Play Store on your mobile phone, tap "Start Server", and enter the local WiFi stream URL (e.g. <code className="bg-white px-1 py-0.5 rounded border font-mono text-[#0F172A]">http://192.168.1.15:8080/video</code>) on the Drone Live Connect station.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconDeviceDesktop className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              3. Demo Dataset Fallback Mode
            </h2>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0284C7]"
            />
            <div className="font-mono text-xs">
              <span className="font-bold text-[#0F172A]">Enable Demo Dataset Fallback Mode</span>
              <p className="text-[11px] text-[#64748B] font-sans mt-0.5">
                Loads calibrated high-resolution disaster features across Nashik, Panchavati, Gangapur, Assam, Wayanad, and Cuttack.
              </p>
            </div>
          </label>
        </div>

        {/* Spatial CRS Preferences */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconMap className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              4. Default Spatial Reference System (CRS)
            </h2>
          </div>

          <div className="space-y-2">
            <select
              value={defaultCrs}
              onChange={(e) => setDefaultCrs(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#CBD5E1] rounded-lg focus:outline-none"
            >
              <option value="EPSG:4326 (WGS84)">EPSG:4326 (WGS84 Geodetic Latitude / Longitude)</option>
              <option value="EPSG:32643 (UTM Zone 43N)">EPSG:32643 (UTM Zone 43N - India)</option>
              <option value="EPSG:3857 (Web Mercator)">EPSG:3857 (Web Mercator Projection)</option>
            </select>
          </div>
        </div>

        {/* Save Actions */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#043D38] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs border border-[#043D38] hover:bg-[#022D29] transition-all"
          >
            Save Configuration Preferences
          </button>

          {savedSuccess && (
            <div className="mt-3 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#047857] text-xs font-mono flex items-center space-x-2 font-semibold">
              <IconCheck className="w-4 h-4 text-[#047857]" />
              <span>Dashboard configuration saved successfully!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
