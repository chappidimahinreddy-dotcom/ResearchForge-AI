# ResearchForge AI - Implementation Progress & Checklist

Hackathon Theme: **AI for Research & Knowledge Discovery**  
Tagline: *From Scattered Information to Actionable Intelligence.*

---

## Master Checklist

- [x] **Phase 1: Foundation & Scaffold**
  - [x] Create root `.gitignore` (blocking all `.env*` except `.env.example`, build, logs, modules, temp)
  - [x] Set up `PROGRESS.md`
  - [x] Initialize backend (`package.json`, Express, Helmet, CORS, Rate Limit, Zod config validation, Supabase client, Health check)
  - [x] Initialize frontend (Vite + React, Tailwind CSS, Lucide icons, Axios, React Router, UI shell)
  - [x] Write Supabase migrations in `supabase/migrations/` (pgvector 768d, RLS, all schemas, match_chunks SQL function)
  - [x] Create sanitized `.env.example` files (root, backend, frontend)
  - [x] Configure `render.yaml` and `frontend/vercel.json`
  - [x] Verification: Health check responds cleanly

- [ ] **Phase 2: Authentication & Project Isolation**
  - [ ] Backend: bcrypt password hashing (cost >= 12), JWT generation/verification, auth middleware
  - [ ] Backend: User registration, login, `/api/auth/me`
  - [ ] Backend: Projects CRUD + Archive (`GET /api/projects`, `POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`)
  - [ ] Frontend: AuthContext, Login, Register, Forgot Password (with honest mailer state), Protected Routes
  - [ ] Frontend: Dashboard overview, stats, recent projects, Project Management ("My Research")
  - [ ] Verification: Registration, token issuance, multi-user project isolation

- [ ] **Phase 3: Discover Mode (Real Academic & Web Retrieval)**
  - [ ] Backend: Gemini query generation (3-6 queries from user topic)
  - [ ] Backend: OpenAlex integration (reconstruct abstract from inverted index, rate limit backoff)
  - [ ] Backend: Crossref integration (DOI metadata, authors, publication dates)
  - [ ] Backend: Semantic Scholar integration (citations, paper details, 429 backoff)
  - [ ] Backend: Pluggable web search provider (Tavily implementation with graceful fallback)
  - [ ] Backend: Deduplication engine (DOI, normalized title, URL) and content-level labeling (`full_text`, `abstract_only`, `metadata_only`)
  - [ ] Backend: Save/remove discovered sources to project
  - [ ] Frontend: Discover Research interface, live query preview, source cards with metadata badges, save action
  - [ ] Verification: Real topic discovery, provider failure resilience, deduplication

- [ ] **Phase 4: Document Upload & Vector Processing Pipeline**
  - [ ] Backend: Multer in-memory storage (Render ephemeral disk compliant)
  - [ ] Backend: File validation (MIME, magic bytes, extension, 15MB limit)
  - [ ] Backend: Page-aware extraction for PDF (`pdf-parse`/`pdfjs-dist`), DOCX (`mammoth`), TXT/MD
  - [ ] Backend: Text chunker (~800-1000 chars, overlap, document/page/chunk metadata)
  - [ ] Backend: Gemini embedding service (`text-embedding-004`, 768 dimensions, retry backoff)
  - [ ] Backend: Supabase storage upload + `document_chunks` insertion
  - [ ] Backend: Document preview, status tracking (`pending` -> `processing` -> `ready` | `failed`), document deletion
  - [ ] Frontend: Document management UI, drag-and-drop upload modal, status indicators, text preview modal
  - [ ] Verification: PDF/DOCX/TXT processing with preserved page numbers and vector embeddings

- [ ] **Phase 5: Explore Mode & SSRF-Safe Web Extraction**
  - [ ] Backend: Explore brainstorming endpoints (`/api/explore/topics`, `/api/explore/questions`)
  - [ ] Backend: SSRF-safe URL scraping service (DNS check, blocking localhost, private, 169.254, IPv6 loopback, redirects validation, timeouts)
  - [ ] Backend: Web source chunking and vector storage
  - [ ] Frontend: Explore Mode ideation canvas with 1-click conversion to Discover project
  - [ ] Frontend: Add Web Source URL modal with SSRF error handling
  - [ ] Verification: Explore suggestions convert to project; SSRF defenses block unauthorized targets

- [ ] **Phase 6: RAG Engine & Grounded Chat with Verified Citations**
  - [ ] Backend: Hybrid retrieval (query embedding, pgvector similarity in `match_chunks`, keyword fallback)
  - [ ] Backend: Strict project + user filtering in vector search
  - [ ] Backend: Grounded Gemini prompt (strict answerability from retrieved chunks, refusal if insufficient)
  - [ ] Backend: Citation verification (drops any citation not present in retrieved chunks)
  - [ ] Backend: Statement labeling (Directly supported / AI interpretation / Hypothesis / Recommendation)
  - [ ] Backend: Conversation and message persistence with citations JSON
  - [ ] Frontend: AI Research Chat UI with message history, inline `[1][2]` badges, live right-hand Source & Citation drawer
  - [ ] Verification: Chat grounded in documents and discovered sources, accurate inline badges, honest refusal when unsupported

- [ ] **Phase 7: Deep Intelligence Engine**
  - [ ] Backend & Frontend: Structured Summaries (Executive summary, concepts, objectives, methods, findings, limitations)
  - [ ] Backend & Frontend: Research Comparison Matrix (structured comparison table with source references for every factual cell)
  - [ ] Backend & Frontend: Research Gap Finder (Flagship feature: unexplored areas, common limitations, conflicting findings with disclaimer)
  - [ ] Backend & Frontend: Evidence Explorer (table of claims, supporting passages, page numbers, claim types)
  - [ ] Backend & Frontend: Knowledge Map (entity and relationship extraction, interactive graph with node inspection & question asking)
  - [ ] Verification: Intelligence outputs grounded strictly in retrieved content

- [ ] **Phase 8: Research Reports, Rich Editor & Multi-Format Export**
  - [ ] Backend: Research report generator (Academic, Literature Review, Technical, Comparative, Market) with real source bibliography
  - [ ] Backend: Report versioning & rollback endpoints
  - [ ] Backend: Multi-format export service (PDF via `pdfkit`, DOCX via `docx`, Markdown, sanitized LaTeX)
  - [ ] Frontend: Reports dashboard, rich/markdown editor with AI assistance (Academic Tone, Expand, Insert Citations, Summarize)
  - [ ] Frontend: Version history timeline and rollback UI
  - [ ] Frontend: Direct file download triggers
  - [ ] Verification: Generation, editing, version rollback, and verified PDF/DOCX/MD/LaTeX exports

- [ ] **Phase 9: Privacy Controls & Security Audit**
  - [ ] Backend & Frontend: AI Model Training Opt-Out toggle (default ON/private)
  - [ ] Backend & Frontend: Ephemeral Research Session mode
  - [ ] Backend & Frontend: Purge All Workspace Data (`DELETE /api/settings/purge`) with typed confirmation modal
  - [ ] Automated Tests (Jest/Supertest suite covering auth, isolation, discovery, processing, chat, export)
  - [ ] Security Audit (`SECURITY_REPORT.md` covering secrets, isolation, input validation, SSRF, prompt injection, headers, dependencies)
  - [ ] Verification: Multi-user penetration tests, SSRF attack tests, full audit pass

- [ ] **Phase 10: Submission Pack, GitHub & Cloud Deployment**
  - [ ] `docs/ARCHITECTURE.md` (System design, data flows, security boundaries, RAG pipeline)
  - [ ] `docs/API_DOCUMENTATION.md` (Complete endpoint specifications with request/response schemas)
  - [ ] `docs/DEMO_SCRIPT.md` (Step-by-step 3-5 minute video script with timestamps)
  - [ ] `docs/SUBMISSION.md` (Official hackathon submission form)
  - [ ] `README.md` (Comprehensive documentation, architecture diagrams, local setup, deployment guide)
  - [ ] Git commit history in logical steps
  - [ ] GitHub repository & deployment configurations (Render + Vercel)
