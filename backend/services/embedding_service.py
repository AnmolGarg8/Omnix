import voyageai
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")

async def generate_embedding(text: str) -> list[float]:
    """
    Generate embedding vector for result text using Voyage AI.
    """
    vo = voyageai.Client(api_key=VOYAGE_API_KEY)
    # Note: Voyage AI SDK might be synchronous, using run_in_executor if needed,
    # but let's see if there's an async client.
    # Standard use: result = vo.embed([text], model="voyage-3.5")
    
    try:
        # voyageai.Client is sync.
        # Use asyncio.to_thread for long running sync tasks in FastAPI
        import asyncio
        result = await asyncio.to_thread(vo.embed, [text], model="voyage-3.5")
        return result.embeddings[0]
    except Exception as e:
        print(f"Embedding Generation Error: {e}")
        # Fallback to zero vector if failed
        return [0.0] * 1024 

def compute_similarity(vec1: list[float], vec2: list[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    """
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    
    if np.all(v1 == 0) or np.all(v2 == 0):
        return 0.0
        
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    
    return dot_product / (norm_v1 * norm_v2)
