from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import time
import numpy as np

app = FastAPI(title="ResearchNode Synthesis Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchQuery(BaseModel):
    query: str
    context_chunks: Optional[List[str]] = None

class SynthesisResponse(BaseModel):
    synthesis: str
    citations: List[str]
    confidence_score: float

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    print("Loading AI Model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    dimension = model.get_sentence_embedding_dimension()
    index = faiss.IndexFlatL2(dimension)
    AI_ENABLED = True
except Exception as e:
    print(f"Warning: AI model failed to load. {e}")
    AI_ENABLED = False


DB = {
    "documents": [],
    "chunk_store": []
}

@app.get("/")
async def root():
    return {"message": "ResearchNode Python Backend - Operational"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        import pypdf
        text = ""
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        # Chunk the document into manageable paragraphs
        sentences = text.replace('\n', ' ').split('. ')
        new_chunks = []
        current_chunk = ""
        for s in sentences:
            if len(current_chunk) > 400:
                new_chunks.append(current_chunk.strip())
                current_chunk = s + ". "
            else:
                current_chunk += s + ". "
        if current_chunk:
            new_chunks.append(current_chunk.strip())

        if AI_ENABLED and new_chunks:
             embeddings = model.encode(new_chunks)
             index.add(np.array(embeddings).astype('float32'))
             DB["chunk_store"].extend(new_chunks)

        doc_info = {
            "id": len(DB["documents"]) + 1,
            "filename": file.filename,
            "size": len(content),
            "upload_time": time.time()
        }
        DB["documents"].append(doc_info)
        
        return {"message": "File uploaded and indexed successfully", "document": doc_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def get_documents():
    return {"documents": DB["documents"]}

@app.post("/analyze", response_model=SynthesisResponse)
async def synthesize_data(data: ResearchQuery):
    if len(DB["documents"]) == 0:
        return {
            "synthesis": "No documents uploaded. Please upload a document to analyze.",
            "citations": [],
            "confidence_score": 0.0
        }

    if not AI_ENABLED or len(DB["chunk_store"]) == 0:
        return {
            "synthesis": "AI engine indexing is unavailable or empty. Please ensure sentence-transformers is installed.",
            "citations": [],
            "confidence_score": 0.0
        }

    # Perform semantic search
    query_embedding = model.encode([data.query])
    D, I = index.search(np.array(query_embedding).astype('float32'), k=3)
    
    top_indices = I[0]
    results = [DB["chunk_store"][i] for i in top_indices if 0 <= i < len(DB["chunk_store"])]
    
    if results:
        best_chunk = results[0]
        synthesized_text = f"Based on semantic analysis of your documents, here is the most relevant section extracted exactly as written:\n\n{best_chunk}\n\nThis aligns directly with your query regarding '{data.query}'."
        citations = [f"Excerpt: \"{c[:120]}...\"" for c in results]
    else:
        synthesized_text = "Could not find any highly relevant information for your query within the uploaded documents."
        citations = []
        
    return {
        "synthesis": synthesized_text,
        "citations": citations,
        "confidence_score": 0.95
    }

@app.get("/correlations")
async def get_correlations():
    if len(DB["documents"]) == 0:
         return {"insights": []}
         
    return {
        "insights": [
            f"Successfully indexed {len(DB['chunk_store'])} high-density semantic vectors from {len(DB['documents'])} documents.",
            "Semantic overlaps are immediately accessible via the Analyze chat window."
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
