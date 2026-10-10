import psycopg2

SUPABASE_URI = "postgresql://postgres.gehfjqpqwcqgrchsmcmg:AlphaProgrammer%40140406@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

def setup_supabase_db():
    print(f"[Supabase] Connecting to Supabase PostgreSQL at aws-0-ap-northeast-1.pooler.supabase.com...")
    try:
        conn = psycopg2.connect(SUPABASE_URI, connect_timeout=10)
        cursor = conn.cursor()
        
        print("[Supabase] Creating 'projects' table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                description TEXT,
                status VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                features_count INT DEFAULT 0,
                total_affected_area_sq_km FLOAT DEFAULT 0.0,
                severity_distribution JSONB,
                imagery_metadata JSONB,
                model_used VARCHAR(100)
            );
        """)

        print("[Supabase] Creating 'spatial_features' table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS spatial_features (
                id VARCHAR(100) PRIMARY KEY,
                project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
                category VARCHAR(100),
                name VARCHAR(255),
                confidence FLOAT,
                severity VARCHAR(50),
                geometry_type VARCHAR(50),
                coordinates JSONB,
                area_sq_km FLOAT DEFAULT 0.0,
                length_km FLOAT DEFAULT 0.0,
                detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                details TEXT
            );
        """)

        print("[Supabase] Creating 'analysis_jobs' table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analysis_jobs (
                id VARCHAR(100) PRIMARY KEY,
                project_id VARCHAR(100),
                project_name VARCHAR(255),
                status VARCHAR(50),
                progress_percent INT DEFAULT 0,
                submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP WITH TIME ZONE,
                model_name VARCHAR(100),
                confidence_threshold FLOAT DEFAULT 0.75,
                detected_features_count INT DEFAULT 0
            );
        """)

        # Insert Seed Project
        print("[Supabase] Seeding default project dataset...")
        cursor.execute("""
            INSERT INTO projects (
                id, name, location, description, status, created_at,
                features_count, total_affected_area_sq_km, severity_distribution,
                imagery_metadata, model_used
            ) VALUES (
                'proj-nashik-2026-001',
                'Nashik Godavari Basin Surge Analysis',
                'Panchavati & Ramkund Basin, Nashik, Maharashtra',
                'Comprehensive aerial drone survey and multispectral analysis of urban riverine flooding, structural inundation, and road breaches.',
                'completed',
                NOW(),
                4,
                5.27,
                '{"high": 2, "medium": 1, "low": 1, "unclassified": 0, "total": 4}'::jsonb,
                '{"id": "img-001", "name": "Nashik_Godavari_Surge_HD_Orthomosaic.tif", "crs": "EPSG:4326 (WGS84)", "bbox": [19.995, 73.770, 20.025, 73.810], "center": [20.0059, 73.7898]}'::jsonb,
                'genresq_unet_best.pth (PyTorch Custom UNet)'
            ) ON CONFLICT (id) DO NOTHING;
        """)

        # Insert Seed Features
        print("[Supabase] Seeding spatial detection features...")
        cursor.execute("""
            INSERT INTO spatial_features (
                id, project_id, category, name, confidence, severity,
                geometry_type, coordinates, area_sq_km, length_km, details
            ) VALUES 
            ('feat-001', 'proj-nashik-2026-001', 'flooded_area', 'Panchavati Godavari Surge Sector', 0.96, 'high', 'polygon', '[[20.0125, 73.7955], [20.0135, 73.7985], [20.0110, 73.8010], [20.0095, 73.7970]]'::jsonb, 0.42, 0, 'Deep riverine inundation covering residential and temple access zones.'),
            ('feat-002', 'proj-nashik-2026-001', 'damaged_building', 'Commercial Complex Submerged Block B', 0.92, 'high', 'polygon', '[[20.0080, 73.7920], [20.0090, 73.7940], [20.0075, 73.7945], [20.0070, 73.7925]]'::jsonb, 0.08, 0, 'Structural foundation weakness detected due to standing water.'),
            ('feat-003', 'proj-nashik-2026-001', 'road_affected', 'Ramkund Access Bridge Approach Road', 0.89, 'medium', 'polyline', '[[20.0150, 73.7910], [20.0140, 73.7940], [20.0130, 73.7970]]'::jsonb, 0, 1.2, 'Asphalt degradation and partial blockage under 0.5m water.'),
            ('feat-004', 'proj-nashik-2026-001', 'vehicle', 'Stranded Rescue Support Transport', 0.94, 'low', 'point', '[20.0105, 73.7935]'::jsonb, 0, 0, 'Stationary emergency vehicle requiring clearing.')
            ON CONFLICT (id) DO NOTHING;
        """)

        conn.commit()
        cursor.close()
        conn.close()
        print("[Supabase SUCCESS] Tables created & populated cleanly in online PostgreSQL database!")

    except Exception as e:
        print(f"[Supabase ERROR] Failed executing SQL setup: {e}")

if __name__ == "__main__":
    setup_supabase_db()
