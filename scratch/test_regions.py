import psycopg2

PASS = "AlphaProgrammer%40140406"
REF = "gehfjqpqwcqgrchsmcmg"

REGIONS = [
    "ap-south-1",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "us-east-1",
    "us-west-1",
    "us-west-2",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "sa-east-1",
    "ca-central-1"
]

def test_regions():
    for reg in REGIONS:
        host = f"aws-0-{reg}.pooler.supabase.com"
        # Try both formats: postgres.ref and postgres
        for user in [f"postgres.{REF}", "postgres"]:
            uri = f"postgresql://{user}:{PASS}@{host}:6543/postgres"
            print(f"Testing {host} with user {user}...")
            try:
                conn = psycopg2.connect(uri, connect_timeout=3)
                print(f"SUCCESS! Connected via {host} ({user})")
                conn.close()
                return uri
            except Exception as e:
                err_str = str(e)
                if "tenant/user" in err_str:
                    continue
                print(f"  Result for {host} ({user}): {err_str.strip()}")
    return None

if __name__ == "__main__":
    test_regions()
