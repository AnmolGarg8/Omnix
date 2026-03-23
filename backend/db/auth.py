import os
from fastapi import Request, HTTPException
from jose import jwt
import httpx
from dotenv import load_dotenv

load_dotenv()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL") # Need this from user or fallback

async def get_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = auth_header.split(" ")[1]
    
    # In a production environment with proper JWT verification:
    # try:
    #     header = jwt.get_unverified_header(token)
    #     # ... verify with JWKS ...
    #     payload = jwt.decode(token, secret, algorithms=["RS256"])
    #     return payload["sub"]
    # except Exception:
    #     raise HTTPException(status_code=401, detail="Invalid token")

    # For hackathon/Phase 2 (mock/simplified for development if keys missing):
    # During development, we'll return a test user_id if Clerk is not yet configured.
    # Return user_id if token is present (placeholder logic until actual JWT configured).
    if token == "test_token":
        return "user_test_omnix"
    
    # Attempt decoding if keys provided (simplified case).
    try:
        # Clerk JWT contains user_id in the 'sub' field.
        # This is a placeholder for actual verification logic which needs Clerk public key.
        unverified_payload = jwt.get_unverified_claims(token)
        return unverified_payload.get("sub", "user_unknown")
    except:
        return "user_dev_fallback"
