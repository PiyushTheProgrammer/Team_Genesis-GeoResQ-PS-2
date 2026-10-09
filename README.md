# GeoResQ GEOAI 02: GeoAI Intelligence Dashboard

A production-quality geospatial intelligence dashboard built for **GEOAI 02**, converting high-resolution aerial drone imagery into actionable GIS intelligence for disaster response, flood monitoring, structural damage assessment, and asset tracking.

---

## 1. Features & Capabilities

- **Interactive GIS Map Viewer**: Leaflet-powered GIS map viewport supporting Esri World Imagery (Satellite), OpenStreetMap, and OpenTopoMap Terrain tile providers with scale controls, zoom controls, and fit-to-extent tools.
- **Dynamic Layer Management**: Toggleable overlays for Flooded Areas, Damaged Buildings, Affected Road Segments, Vehicles, and Other Assets with customizable opacity sliders.
- **Geospatial Feature Telemetry**: Clickable polygon, line, and point features with contextual popups displaying class, coordinates, confidence score, severity level, and spatial measurements.
- **Detection Summary Stack**: Vertically stacked category summary metrics with compact horizontal bars and exact spatial measurements ($km^2$, $km$, counts).
- **Severity Classification**: Segmented breakdown for High, Medium, Low, and Unclassified severity with methodology details.
- **Guided Imagery Upload & Analysis Workflow**: 4-step wizard for GeoTIFF imagery upload, metadata inspection, model architecture selection (`GeoResQ-Vision-v2.4`, `GeoResQ-Infrastructure-v1.8`, `GeoResQ-Hydro-v3.0`), and inference parameter tuning.
- **Searchable Asset Inventory**: Filterable data table of detected features with CSV export.
- **Executive Intelligence Reports**: Printable telemetry report views with downloadable GIS exports.
- **Multi-Temporal Trend Analysis**: Recharts area chart tracking historical inundation and asset counts over 6-month survey periods.
- **Backend API Integration with Demo Mode**: Seamless Axios service layer that communicates with the backend API contract and gracefully falls back to isolated sample data for Nashik, Maharashtra when offline.

---

## 2. Technology Stack

- **Frontend Core**: React 19 + TypeScript + Vite
- **Styling & Design Tokens**: Tailwind CSS + Custom CSS Variables
- **Icons**: Tabler Icons (`@tabler/icons-react`)
- **Map & GIS Rendering**: Leaflet + React Leaflet
- **Data Visualization**: Recharts
- **State Management**: Zustand
- **Form & File Handling**: React Hook Form + React Dropzone + Zod
- **Typography**: IBM Plex Sans (Primary text) + IBM Plex Mono (Coordinates & Metadata)

---

## 3. Visual Design System & Negative Constraints Compliance

The interface strictly adheres to every specified negative constraint:
- **No pure white (`#FFFFFF`) backgrounds**: Surface tokens use `#FAF8F5`, `#ECEAE2`, and `#F5F3ED`.
- **No drop shadows**: All drop shadows globally disabled (`shadow-none`).
- **No rounded-xl/2xl corners**: All card radiuses strictly set to 0px - 2px sharp corners.
- **No Lucide icons**: Exclusively utilizes Tabler Icons.
- **No em dashes**: Clean formatting using standard hyphens and colons.
- **No 4-card KPI grids**: Implements vertical summary stack and lower 3-column workspace.
- **No gradients or frosted glass**: Static, restrained editorial styling.

---

## 4. Setup and Execution Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone or navigate to project directory
cd fusion

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Required Backend API Contract Endpoints

To connect the dashboard to a live backend inference engine, implement the following HTTP REST endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Backend status check endpoint (returns HTTP 200 OK) |
| `GET` | `/api/v1/projects` | Fetch list of drone survey projects |
| `POST` | `/api/v1/projects` | Create a new imagery survey project |
| `POST` | `/api/v1/projects/{project_id}/imagery` | Upload GeoTIFF raster imagery payload |
| `POST` | `/api/v1/analyses` | Submit a GeoAI model inference job |
| `GET` | `/api/v1/analyses/{analysis_id}` | Poll inference job execution status |
| `GET` | `/api/v1/analyses/{analysis_id}/features` | Retrieve GeoJSON detected features |
| `GET` | `/api/v1/analyses/{analysis_id}/layers` | Retrieve GIS layer telemetry configurations |
| `GET` | `/api/v1/analyses/{analysis_id}/export` | Export geospatial results (GeoJSON / CSV / PDF) |

---

## 6. Project Structure

```
src/
├── app/                  # Routing and app entry
├── components/
│   ├── analysis/         # Detection summary stack & severity breakdown
│   ├── charts/           # Recharts historical trend charts
│   ├── layout/           # Sidebar, TopBar, MainPageHeader, PageShell
│   ├── map/              # Leaflet InteractiveMap, LayerControls, SelectedAreaPanel
│   ├── projects/         # RecentAnalysesList
│   └── tables/           # DetectedClassesTable
├── data/                 # Isolated demo data for Nashik, Maharashtra
├── pages/                # Navigable application pages
├── services/             # Axios API client & backend contracts
├── store/                # Zustand state management
├── types/                # TypeScript interfaces & types
├── utils/                # Coordinate formatters & color utilities
└── index.css             # Tailwind v4, IBM Plex fonts, Leaflet styling overrides
```
