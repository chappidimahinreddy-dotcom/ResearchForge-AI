-- ==============================================================================
-- ResearchForge AI: Migration 001 - Initial Schema & Vector Engine
-- Extensions: pgcrypto, vector (768 dimensions for Gemini text-embedding-004)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Profiles Table (User settings, privacy flags, auth representation)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    ai_training_opt_out BOOLEAN NOT NULL DEFAULT true,
    ephemeral_mode BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    objective TEXT,
    research_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    mode TEXT NOT NULL DEFAULT 'discover' CHECK (mode IN ('discover', 'upload', 'explore')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Folders Table (Hierarchical organization)
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Uploaded Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT,
    total_pages INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Document Chunks Table (Vector embeddings 768d)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    page_number INT NOT NULL DEFAULT 1,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    token_count INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Discovered Sources Table (Academic & Web APIs)
CREATE TABLE IF NOT EXISTS discovered_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    authors JSONB NOT NULL DEFAULT '[]'::jsonb,
    published_date TEXT,
    source_type TEXT,
    publisher TEXT,
    url TEXT,
    doi TEXT,
    external_id TEXT,
    abstract TEXT,
    content TEXT,
    content_level TEXT NOT NULL DEFAULT 'abstract_only' CHECK (content_level IN ('full_text', 'abstract_only', 'metadata_only')),
    retrieval_status TEXT NOT NULL DEFAULT 'success' CHECK (retrieval_status IN ('success', 'failed', 'partial')),
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    saved BOOLEAN NOT NULL DEFAULT false,
    citation_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Website Sources Table (SSRF-safe scraped articles)
CREATE TABLE IF NOT EXISTS website_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    author TEXT,
    published_date TEXT,
    content TEXT,
    content_level TEXT NOT NULL DEFAULT 'full_text' CHECK (content_level IN ('full_text', 'abstract_only', 'metadata_only')),
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Website Chunks Table (Vector embeddings 768d)
CREATE TABLE IF NOT EXISTS website_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES website_sources(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Source Tags Junction Table
CREATE TABLE IF NOT EXISTS source_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Research Discussion',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    citations JSONB NOT NULL DEFAULT '[]'::jsonb,
    statement_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Research Summaries Table
CREATE TABLE IF NOT EXISTS research_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL DEFAULT 'multi-source',
    source_id UUID,
    title TEXT NOT NULL,
    style TEXT NOT NULL DEFAULT 'detailed' CHECK (style IN ('short', 'detailed', 'technical', 'beginner')),
    executive_summary TEXT,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Research Comparisons Table
CREATE TABLE IF NOT EXISTS research_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    matrix JSONB NOT NULL,
    similarities JSONB NOT NULL DEFAULT '[]'::jsonb,
    contradictions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. Research Gap Analyses Table
CREATE TABLE IF NOT EXISTS research_gap_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
    limitations JSONB NOT NULL DEFAULT '[]'::jsonb,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    disclaimer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. Knowledge Entities Table
CREATE TABLE IF NOT EXISTS knowledge_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    source_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. Knowledge Relationships Table
CREATE TABLE IF NOT EXISTS knowledge_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    source_entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
    target_entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    evidence TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. Research Reports Table
CREATE TABLE IF NOT EXISTS research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'academic' CHECK (type IN ('academic', 'literature_review', 'technical', 'comparative', 'market', 'general_summary')),
    content TEXT NOT NULL,
    references_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. Report Versions Table
CREATE TABLE IF NOT EXISTS report_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES research_reports(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content TEXT NOT NULL,
    references_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    summary_of_changes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE AND ISOLATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_project_id ON folders(project_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_project_id ON tags(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_doc_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_project_id ON document_chunks(project_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_discovered_sources_project_id ON discovered_sources(project_id);
CREATE INDEX IF NOT EXISTS idx_discovered_sources_user_id ON discovered_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_website_sources_project_id ON website_sources(project_id);
CREATE INDEX IF NOT EXISTS idx_website_sources_user_id ON website_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_website_chunks_source_id ON website_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_website_chunks_project_id ON website_chunks(project_id);
CREATE INDEX IF NOT EXISTS idx_website_chunks_user_id ON website_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_research_summaries_project_id ON research_summaries(project_id);
CREATE INDEX IF NOT EXISTS idx_research_comparisons_project_id ON research_comparisons(project_id);
CREATE INDEX IF NOT EXISTS idx_research_gap_analyses_project_id ON research_gap_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_entities_project_id ON knowledge_entities(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_project_id ON knowledge_relationships(project_id);
CREATE INDEX IF NOT EXISTS idx_research_reports_project_id ON research_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_report_versions_report_id ON report_versions(report_id);

-- HNSW Vector Indexes for Fast Cosine Similarity
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw 
ON document_chunks USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_website_chunks_embedding_hnsw 
ON website_chunks USING hnsw (embedding vector_cosine_ops);

-- ==============================================================================
-- VECTOR SEARCH FUNCTION: match_chunks
-- Strictly filters by project_id and user_id to prevent multi-tenant data leaks
-- Combines document_chunks and website_chunks
-- ==============================================================================
CREATE OR REPLACE FUNCTION match_chunks(
    query_embedding vector(768),
    p_project_id UUID,
    p_user_id UUID,
    match_count INT DEFAULT 8,
    similarity_threshold FLOAT DEFAULT 0.0
)
RETURNS TABLE (
    id UUID,
    parent_id UUID,
    source_type TEXT,
    source_title TEXT,
    page_number INT,
    chunk_index INT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH combined_chunks AS (
        -- Document Chunks
        SELECT 
            dc.id,
            dc.document_id AS parent_id,
            'document'::TEXT AS source_type,
            d.title AS source_title,
            dc.page_number,
            dc.chunk_index,
            dc.content,
            1 - (dc.embedding <=> query_embedding) AS similarity
        FROM document_chunks dc
        JOIN documents d ON d.id = dc.document_id
        WHERE dc.project_id = p_project_id 
          AND dc.user_id = p_user_id
          AND dc.embedding IS NOT NULL

        UNION ALL

        -- Scraped Website Chunks
        SELECT 
            wc.id,
            wc.source_id AS parent_id,
            'website'::TEXT AS source_type,
            ws.title AS source_title,
            1 AS page_number,
            wc.chunk_index,
            wc.content,
            1 - (wc.embedding <=> query_embedding) AS similarity
        FROM website_chunks wc
        JOIN website_sources ws ON ws.id = wc.source_id
        WHERE wc.project_id = p_project_id 
          AND wc.user_id = p_user_id
          AND wc.embedding IS NOT NULL
    )
    SELECT 
        cc.id,
        cc.parent_id,
        cc.source_type,
        cc.source_title,
        cc.page_number,
        cc.chunk_index,
        cc.content,
        cc.similarity::FLOAT
    FROM combined_chunks cc
    WHERE cc.similarity >= similarity_threshold
    ORDER BY cc.similarity DESC
    LIMIT match_count;
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables with explicit deny-by-default
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_gap_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_versions ENABLE ROW LEVEL SECURITY;

