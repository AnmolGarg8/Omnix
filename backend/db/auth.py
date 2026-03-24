from fastapi import Request

async def get_user_id(request: Request) -> str:
    """
    Permissive Auth: Returns a static User ID to bypass Clerk requirement.
    In the final product, this would verify a JWT from Clerk.
    """
    return "user_agentforit_master"
