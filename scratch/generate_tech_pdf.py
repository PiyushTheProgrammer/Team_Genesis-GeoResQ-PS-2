import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def build_pdf():
    pdf_path = os.path.join(os.getcwd(), "GeoResQ_TechStack_and_Live_Features_Analysis.pdf")
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    
    styles = getSampleStyleSheet()
    
    # Palette
    primary_color = colors.HexColor("#043D38")
    accent_blue = colors.HexColor("#0284C7")
    dark_slate = colors.HexColor("#0F172A")
    text_gray = colors.HexColor("#334155")
    bg_light = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#CBD5E1")
    code_bg = colors.HexColor("#F1F5F9")
    
    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=accent_blue,
        alignment=TA_LEFT,
        spaceAfter=10,
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=5,
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=accent_blue,
        spaceBefore=8,
        spaceAfter=3,
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_slate,
        alignment=TA_JUSTIFY,
        spaceAfter=5,
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=dark_slate,
        leftIndent=10,
        spaceAfter=3,
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=dark_slate,
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=primary_color,
    )

    story = []

    # Title Banner
    story.append(Paragraph("GeoResQ (GEOAI 02) — In-Depth Tech Stack & Live Features Analysis", title_style))
    story.append(Paragraph("Comprehensive Technical Breakdown of Architecture, Live Modules & Feature Mechanics", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=8))

    # Section 1: Integrated Technology Stack Matrix
    story.append(Paragraph("1. Technology Stack & Integration Architecture Matrix", h1_style))
    story.append(Paragraph("GeoResQ integrates modern frontend framework, reactive state management, GIS Leaflet rendering engines, and Python FastAPI AI microservices into a unified platform:", body_style))

    tech_matrix_data = [
        [
            Paragraph("System Layer", table_header_style),
            Paragraph("Technologies & Libraries", table_header_style),
            Paragraph("Role & Integration Mechanism", table_header_style),
        ],
        [
            Paragraph("Frontend UI Core", table_cell_bold),
            Paragraph("React 19, TypeScript 6.0, Vite 8, TailwindCSS v4", table_cell_style),
            Paragraph("Provides a high-performance single page app (SPA) with full type-safety, rapid Vite HMR, and responsive layout.", table_cell_style),
        ],
        [
            Paragraph("State Management", table_cell_bold),
            Paragraph("Zustand 5 (Zustand Store)", table_cell_style),
            Paragraph("Centralized reactive state store managing multi-region coordinates, active GIS features, drone telemetry, and QA verification.", table_cell_style),
        ],
        [
            Paragraph("GIS & Map Engine", table_cell_bold),
            Paragraph("Leaflet 1.9, React-Leaflet 5", table_cell_style),
            Paragraph("Renders interactive map viewports, Esri World Imagery (Satellite), OpenStreetMap, OpenTopoMap tiles, scale controls, and animated vector shapes.", table_cell_style),
        ],
        [
            Paragraph("Backend API Server", table_cell_bold),
            Paragraph("Python 3.12, FastAPI 0.110, Uvicorn, Pydantic v2", table_cell_style),
            Paragraph("Asynchronous REST API processing image uploads, AI jobs, drone frame snapshots, and location presets on http://localhost:8000.", table_cell_style),
        ],
        [
            Paragraph("AI Vision Engine", table_cell_bold),
            Paragraph("Google Gemini Vision API, Local Spatial Synthesis, OpenCV/NumPy", table_cell_style),
            Paragraph("Multi-head vision model processing aerial drone imagery to extract features (Flooded Areas, Damaged Buildings, Roads, Vehicles).", table_cell_style),
        ],
        [
            Paragraph("Geospatial Exporter", table_cell_bold),
            Paragraph("RFC 7946 GeoJSON, ESRI Shapefile Bundle Builder", table_cell_style),
            Paragraph("Transforms Leaflet coordinates [lat, lng] to GIS standard [lng, lat], appends WGS84 CRS headers, and zips Shapefile bundles.", table_cell_style),
        ],
    ]

    t_tech = Table(tech_matrix_data, colWidths=[100, 210, 230])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('BACKGROUND', (0, 1), (-1, -1), bg_light),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, bg_light]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 8))

    # Section 2: In-Depth Analysis of Live Features & Working Mechanics
    story.append(Paragraph("2. Feature-by-Feature Working Mechanics & Tech Stack Integration", h1_style))

    # Feature 1
    story.append(Paragraph("Feature 1: Interactive GIS Map & Dynamic Multi-Region Flight", h2_style))
    f1_desc = (
        "<b>Integrated Tech Stack:</b> React-Leaflet, Leaflet <code>L.map</code>, Zustand <code>useGeoStore</code>, Esri ArcGIS World Imagery.<br/>"
        "<b>Working Mechanics:</b> The interactive map incorporates a dynamic controller (<code>MapController</code>) that reactively monitors "
        "the <code>geographicContext</code> in the global store. When a user selects any region from the top bar dropdown "
        "(<i>Nashik, Panchavati, Gangapur Dam, Trimbakeshwar, Assam Brahmaputra, Wayanad, Cuttack</i>), the controller triggers "
        "<code>map.flyTo([lat, lng], zoom, { duration: 1.4 })</code>, smoothly panning and zooming the map across India to the disaster centroid. "
        "Vector layers (Polygons, LineStrings, Points) automatically render with custom stroke colors (Blue=Flood, Red=Building, Yellow=Road, Green=Vehicle)."
    )
    story.append(Paragraph(f1_desc, body_style))

    # Feature 2
    story.append(Paragraph("Feature 2: Mobile IP Webcam & Drone Live Stream Station", h2_style))
    f2_desc = (
        "<b>Integrated Tech Stack:</b> HTML5 <code>&lt;video&gt;</code>, <code>navigator.mediaDevices.getUserMedia</code>, MJPEG HTTP Stream Ingestion, HTML5 Canvas API, Zustand.<br/>"
        "<b>Working Mechanics:</b> Located directly below the map on the Dashboard and Map Viewer pages, this module supports 3 live sources: "
        "(1) <i>Mobile IP Webcam</i> app (streaming via local Wi-Fi e.g. <code>http://192.168.1.15:8080/video</code>), (2) <i>Device Camera / Webcam</i> via WebRTC MediaStreams, "
        "or (3) <i>Simulated 4K Drone Reconnaissance</i> video loops. Renders a real-time <b>Edge AI Vision HUD</b> with dynamic bounding boxes (<i>Inundated Zone 96%</i>, <i>Damaged Building 92%</i>), "
        "live altitude (125m AGL), speed, battery %, and 30 FPS inference telemetry. Tapping <b>'Capture Frame & Vectorize to Map'</b> snaps the current video frame, "
        "calculates spatial coordinates around the drone's position, and instantly plots a new georeferenced vector polygon onto the live GIS Leaflet map."
    )
    story.append(Paragraph(f2_desc, body_style))

    # Feature 3
    story.append(Paragraph("Feature 3: End-to-End Operational Pipeline & Timeline Flow", h2_style))
    f3_desc = (
        "<b>Integrated Tech Stack:</b> React 19, Lucide / Tabler Icons, TailwindCSS v4 grid utilities.<br/>"
        "<b>Working Mechanics:</b> Accessible via the top tab bar (<i>Timeline Flow & Architecture</i>), this module visualizes the complete "
        "4-stage disaster processing pipeline matching the reference architecture: <b>INPUT</b> (GeoTIFF, GSD 4.5 cm/px, CRS EPSG:4326 WGS84) &rarr; "
        "<b>AI INFERENCE</b> (YOLOv8 + SegFormer multi-class feature extraction) &rarr; <b>VECTORIZE & GEOREFERENCE</b> (Affine transform matrix pixel-to-GPS conversion) &rarr; "
        "<b>VISUALIZE & EXPORT</b> (Multi-layer map, GeoJSON, ESRI Shapefile). Includes interactive cards detailing problem-solution mapping, real-world disaster impact, and the 6 USPs."
    )
    story.append(Paragraph(f3_desc, body_style))

    # Feature 4
    story.append(Paragraph("Feature 4: Human Review & QA Verification System (Human-in-the-Loop)", h2_style))
    f4_desc = (
        "<b>Integrated Tech Stack:</b> Zustand 5 reactive actions (<code>verifyFeature</code>), Leaflet Popup Event Handlers.<br/>"
        "<b>Working Mechanics:</b> Addresses AI uncertainty under heavy cloud/smoke cover or muddy standing water. Disaster commanders can click any feature on the map or feature list, "
        "inspect AI confidence scores and spatial measurements, edit inspector notes, and toggle the feature's validation status between <code>unreviewed</code>, "
        "<code>✓ Human Verified</code>, <code>flagged</code>, or <code>rejected</code>."
    )
    story.append(Paragraph(f4_desc, body_style))

    # Feature 5
    story.append(Paragraph("Feature 5: Guided Drone Imagery Upload & AI Parameters Setup", h2_style))
    f5_desc = (
        "<b>Integrated Tech Stack:</b> React Dropzone (<code>react-dropzone</code>), FormData Payload, FastAPI <code>/api/v1/projects/{projectId}/imagery</code>, Axios progress listeners.<br/>"
        "<b>Working Mechanics:</b> Provides a drag-and-drop ingestion wizard for heavy aerial GeoTIFF / orthomosaic imagery (up to 2 GB). Automatically parses imagery metadata "
        "(CRS, GSD resolution, dimensions, file size), allows choosing model architecture (<code>GeoResQ-Vision-v2.4</code>, <code>GeoResQ-Infrastructure-v1.8</code>, <code>GeoResQ-Hydro-v3.0</code>), "
        "tunes confidence cutoff sliders (50% - 95%), and executes real-time AI spatial extraction."
    )
    story.append(Paragraph(f5_desc, body_style))

    # Feature 6
    story.append(Paragraph("Feature 6: Statutory Disaster Damage Assessment & Relief Reports", h2_style))
    f6_desc = (
        "<b>Integrated Tech Stack:</b> HTML5 Blob API, Browser Print API, NDMA / SDMA SOP Data Formatting.<br/>"
        "<b>Working Mechanics:</b> Generates official disaster damage assessment reports completely purged of non-related police/forensic terms. "
        "Summarizes quantitative spatial metrics (flooded area sq km, damaged structures count, blocked road km, stranded vehicles), details P1/P2/P3 emergency relief dispatch directives, "
        "and provides 1-click downloads for self-contained HTML dossiers and print-ready PDFs."
    )
    story.append(Paragraph(f6_desc, body_style))

    # Feature 7
    story.append(Paragraph("Feature 7: Standardized GIS Vector Layer Exporters", h2_style))
    f7_desc = (
        "<b>Integrated Tech Stack:</b> JavaScript Blob URL Builder, RFC 7946 GeoJSON Specification, ESRI WGS84 Projection (.prj) Headers.<br/>"
        "<b>Working Mechanics:</b> (1) <i>GeoJSON Exporter:</i> Converts Leaflet internal <code>[lat, lng]</code> to GeoJSON standard <code>[lng, lat]</code>, closes polygon rings, attaches all metadata attributes, and triggers file download. "
        "(2) <i>ESRI Shapefile Bundle Exporter:</i> Packages spatial projection headers (<code>GEOGCS[\"GCS_WGS_1984\"...]</code>) alongside feature attributes, ready for instant 1-click import into QGIS or ArcGIS."
    )
    story.append(Paragraph(f7_desc, body_style))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceAfter=8))
    
    footer_text = Paragraph("<b>GeoResQ Disaster AI Engine</b> • In-Depth Tech Stack & Live Features Analysis Report", ParagraphStyle('FooterStyle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#64748B"), alignment=TA_CENTER))
    story.append(footer_text)

    doc.build(story)
    print(f"Tech Stack PDF successfully generated at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
