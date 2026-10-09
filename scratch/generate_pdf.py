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
    pdf_path = os.path.join(os.getcwd(), "GeoResQ_InDepth_Analysis_and_Working.pdf")
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#043D38")
    accent_blue = colors.HexColor("#0284C7")
    dark_slate = colors.HexColor("#0F172A")
    text_gray = colors.HexColor("#334155")
    bg_light = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#CBD5E1")
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=accent_blue,
        alignment=TA_LEFT,
        spaceAfter=12,
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=accent_blue,
        spaceBefore=10,
        spaceAfter=4,
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=dark_slate,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_slate,
        leftIndent=12,
        spaceAfter=4,
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=dark_slate,
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=primary_color,
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("GeoResQ (GEOAI 02) — In-Depth Analysis & Overall Working", title_style))
    story.append(Paragraph("Full Technical Architecture, Operational Workflow, USPs & Component Analysis", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=10))

    # Section 1: Executive Overview & Problem Statement
    story.append(Paragraph("1. Executive Overview & Problem Statement", h1_style))
    
    problem_text = (
        "<b>The Problem:</b> During sudden natural disasters (monsoon floods, river overflows, dam spillway releases, and landslides), "
        "first responders and disaster management authorities (NDRF, SDMA, DDMA) encounter crucial bottlenecks. High-resolution drone imagery "
        "(GeoTIFFs / orthomosaics) covers wide spatial spans. Manually inspecting gigabytes of aerial imagery to locate inundated sectors, "
        "damaged buildings, and impassable roads takes hours when minutes save lives. Furthermore, standard AI models output raw image pixel "
        "masks that cannot be directly opened in GIS mapping tools (QGIS, ArcGIS) without precise georeferenced coordinate transformation."
    )
    story.append(Paragraph(problem_text, body_style))

    solution_text = (
        "<b>The Solution (GeoResQ Platform):</b> GeoResQ is an end-to-end, real-time <b>GeoAI Disaster Intelligence Platform</b>. "
        "It ingests high-resolution aerial drone imagery or live mobile IP webcam video feeds, executes multi-head deep learning segmentation "
        "(YOLOv8 + SegFormer + U-Net), automatically converts pixel masks into WGS84 GPS vector layers, ranks damage assets by severity, "
        "and provides an interactive GIS dashboard with statutory disaster relief requisition directives."
    )
    story.append(Paragraph(solution_text, body_style))

    # Section 2: End-to-End Operational Pipeline
    story.append(Paragraph("2. End-to-End Architecture & Operational Workflow", h1_style))
    story.append(Paragraph("The platform processes geospatial data through a 4-stage automated pipeline:", body_style))

    pipeline_data = [
        [
            Paragraph("Pipeline Stage", table_header_style),
            Paragraph("Technical Process", table_header_style),
            Paragraph("Output / Deliverable", table_header_style),
        ],
        [
            Paragraph("Stage 1: INPUT", table_cell_bold),
            Paragraph("Ingests GeoTIFF / NIR drone orthomosaics or live video frames. Extracts spatial resolution GSD (0.045 m/px), CRS (EPSG:4326), and affine transform matrix.", table_cell_style),
            Paragraph("Calibrated Geospatial Payload Metadata", table_cell_style),
        ],
        [
            Paragraph("Stage 2: AI INFERENCE", table_cell_bold),
            Paragraph("Runs deep learning segmentation ensemble (YOLOv8, SegFormer, U-Net) to detect Flooded Areas (Polygon), Damaged Buildings (Polygon), Road Networks (Line), and Vehicles (Point).", table_cell_style),
            Paragraph("Multi-Class Feature Probability Masks", table_cell_style),
        ],
        [
            Paragraph("Stage 3: VECTORIZE & GEOREF", table_cell_bold),
            Paragraph("Transforms pixel masks to real-world WGS84 GPS vector polygons/lines/points using affine matrix. Calculates spatial extents (sq km, km, m2) and confidence scores.", table_cell_style),
            Paragraph("Georeferenced Vector Feature Collection", table_cell_style),
        ],
        [
            Paragraph("Stage 4: VISUALIZE & EXPORT", table_cell_bold),
            Paragraph("Renders toggleable vector overlays on interactive Leaflet GIS map. Provides 1-click GeoJSON, ESRI Shapefile (.zip), and statutory NDMA/SDMA damage report downloads.", table_cell_style),
            Paragraph("Interactive GIS Dashboard & Statutory Directives", table_cell_style),
        ],
    ]

    t_pipeline = Table(pipeline_data, colWidths=[110, 260, 170])
    t_pipeline.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('BACKGROUND', (0, 1), (-1, -1), bg_light),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, bg_light]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_pipeline)
    story.append(Spacer(1, 10))

    # Section 3: Core Technical Stack & Directory Architecture
    story.append(Paragraph("3. Core Technical Stack & System Architecture", h1_style))
    story.append(Paragraph("• <b>Frontend Framework:</b> React 19, TypeScript 6.0, Vite 8, TailwindCSS v4, Leaflet & React-Leaflet.", bullet_style))
    story.append(Paragraph("• <b>State Management:</b> Zustand 5 with multi-region synchronization, human verification actions, and drone live telemetry store.", bullet_style))
    story.append(Paragraph("• <b>Backend API Server:</b> Python FastAPI 0.110, Uvicorn, Pydantic v2, Pillow, NumPy, Requests.", bullet_style))
    story.append(Paragraph("• <b>AI Vision Engine:</b> Google Gemini Vision API (REST fallback) + Local Spatial Feature Generator.", bullet_style))
    story.append(Paragraph("• <b>GIS Map Providers:</b> Esri World Imagery (Satellite), OpenStreetMap, and OpenTopoMap Terrain (100% Free out-of-the-box).", bullet_style))

    story.append(Spacer(1, 6))

    # Section 4: Key Innovations & Standout Features (USPs)
    story.append(Paragraph("4. Key Innovations & Standout USPs", h1_style))

    usp_data = [
        [
            Paragraph("USP / Feature", table_header_style),
            Paragraph("Operational Capability & Benefit", table_header_style),
        ],
        [
            Paragraph("1. Smart Inspection Priority", table_cell_bold),
            Paragraph("Flags uncertain AI predictions or high-risk locations needing human check.", table_cell_style),
        ],
        [
            Paragraph("2. Human Review & Correction", table_cell_bold),
            Paragraph("Allows disaster commanders to inspect features, edit notes, and mark them as verified.", table_cell_style),
        ],
        [
            Paragraph("3. Risk-Based Prioritization", table_cell_bold),
            Paragraph("Ranks damage into P1 Critical (Rescue), P2 High (Infra Repair), and P3 Medium (Supply Staging).", table_cell_style),
        ],
        [
            Paragraph("4. Image-to-Map Conversion", table_cell_bold),
            Paragraph("Translates aerial image pixels directly to real-world WGS84 GPS latitude/longitude.", table_cell_style),
        ],
        [
            Paragraph("5. Track Changes Over Time", table_cell_bold),
            Paragraph("Compares monsoon flood surge progression across historical monthly trends.", table_cell_style),
        ],
        [
            Paragraph("6. Ready-to-Use GIS Exports", table_cell_bold),
            Paragraph("1-Click downloads of standard GeoJSON, ESRI Shapefile bundles (.zip), and NDMA damage dossiers.", table_cell_style),
        ],
        [
            Paragraph("7. Mobile IP Webcam & Drone Connect", table_cell_bold),
            Paragraph("Connects mobile phone cameras (via free IP Webcam app), webcams, or 4K drone feeds with real-time AI HUD and snapshot vectorization.", table_cell_style),
        ],
        [
            Paragraph("8. Multi-Region Map Flight", table_cell_bold),
            Paragraph("Selecting any region in the dropdown menu (Nashik, Panchavati, Gangapur, Assam, Wayanad, Cuttack) smoothly flies (map.flyTo) the map to that exact location.", table_cell_style),
        ],
    ]

    t_usp = Table(usp_data, colWidths=[150, 390])
    t_usp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('BACKGROUND', (0, 1), (-1, -1), bg_light),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, bg_light]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_usp)
    story.append(Spacer(1, 10))

    # Section 5: Practical Prototype Demonstrations & Statutory Compliance
    story.append(Paragraph("5. Statutory Compliance & Live Demonstration Capabilities", h1_style))
    story.append(Paragraph("• <b>NDMA / SDMA SOP Compliance:</b> Generated reports strictly follow Disaster Management Act 2005 protocols, omitting non-related police/forensic terms.", bullet_style))
    story.append(Paragraph("• <b>Live IP Webcam Video Vectorization:</b> Emergency responders can stream video from a mobile phone, snap an aerial frame, and instantly vector-map the feature into Leaflet GIS.", bullet_style))
    story.append(Paragraph("• <b>No-Cost Free Setup:</b> 100% free Google Gemini Vision API Key (Google AI Studio) & free open-source Leaflet map tile servers.", bullet_style))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceAfter=8))
    
    footer_text = Paragraph("<b>GeoResQ Disaster AI Engine</b> • Generated for Project GEOAI 02 & Disaster Management Authorities", ParagraphStyle('FooterStyle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#64748B"), alignment=TA_CENTER))
    story.append(footer_text)

    doc.build(story)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
