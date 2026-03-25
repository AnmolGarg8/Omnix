from fastapi import Request, HTTPException
import os
from clerk_backend_api import Clerk

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
clerk_client = Clerk(bearer_auth=CLERK_SECRET_KEY) if CLERK_SECRET_KEY else None

async def get_user_id(request: Request) -> str:
    """
    Verifies Clerk JWT and returns the User ID.
    If no token is provided or invalid, raises 401.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        # For development, allow fallback if no secret key is set
        if not CLERK_SECRET_KEY:
            return "user_agentforit_master"
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = auth_header.split(" ")[1]
    
    try:
        # In a real Clerk SDK implementation, we verify the token
        # For now, we interact with the SDK to get the user context if needed
        # Or just trust the token if it's a pass-through in this simplified phase
        # The Clerk SDK can verify tokens.
        request_state = clerk_client.authenticate_request(request)
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return request_state.user_id
    except Exception as e:
        print(f"Auth Error: {e}")
        # Fallback to hardcoded user if validation fails in development
        # return "user_agentforit_master"
        raise HTTPException(status_code=401, detail="Invalid token")

