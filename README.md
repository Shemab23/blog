<div align="center">
  <img src="./public/images/logo.svg" alt="Shema Solution" width="45" />
  <h1>Shema Docs | notes & tutorials </h1>
</div>

A personal, self-owned knowledge base built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**. Designed as a distraction-free reading environment pairing structured multi-chapter technical notes with companion YouTube walkthroughs and study materials.

---

## Core Architecture

- **Registry-Driven Content (`src/data/`)**: Self-registering modules for **Notes (`BlogRegistry`)**, **Video Walkthroughs (`TutorialRegistry`)**, and **Study Materials (`MaterialRegistry`)** without external CMS or database dependencies.
- **Interactive Chapter Reader (`src/components/reader/`)**:
  - Viewport scroll-tracking (`IntersectionObserver`) with live `Chapter / Sub-topic` header breadcrumbs.
  - Deep keyword search across chapter summaries that filters the Table of Contents and highlights matching sub-topics.
  - Cross-note recommendations and mobile drawer navigation.
- **Theme & Typography (`src/app/globals.css`)**: Warm terracotta/amber (`#ba6e30`) palette paired with warm paper (Light Mode) and soft charcoal (Dark Mode) surfaces using **Plus Jakarta Sans** and **JetBrains Mono**.
- **Direct Reader Feedback (`ContactSection`)**: Topic recommendation and chapter error-reporting form routing directly to WhatsApp or Email.
- **Future-Ready Materials Hooks**: Access-control metadata (`isOpen`, `accessTier`, `externalProductId`) structured for future integration with external storefronts or Cloudflare-gated assets.

---

## Project Structure

```text
src/
├── app/
│   ├── [blog]/           # Dynamic note reader route
│   ├── materials/        # Curated books, ebooks & resources
│   ├── notes/            # Full searchable archive of all technical notes
│   ├── tutorials/        # Companion YouTube video walkthroughs
│   ├── globals.css       # Semantic typography rules & theme tokens
│   ├── layout.tsx        # Root layout, fonts & AppProvider
│   └── page.tsx          # Landing page (Hero, Featured Notes, Contact)
├── components/
│   ├── home/             # Hero, FeaturedBlogsSection, ContactSection
│   ├── reader/           # BlogSidebar, BlogMainView
│   ├── BlogReaderSkeleton.tsx
│   ├── Footer.tsx
│   └── Header.tsx
├── context/
│   ├── AppContext.ts     # Global context interface
│   └── AppProvider.tsx   # Central registration hub
├── data/
│   ├── BlogRegistry.ts
│   ├── MaterialRegistry.ts
│   ├── TutorialRegistry.ts
│   ├── HomeData.ts       # Site copy, navigation & contact config
│   ├── materials/        # Material entries
│   └── tutorials/        # Tutorial entries
├── utils/
│   └── blogReaderUtils.ts # TOC search filtering & breadcrumb resolution
└── views/                # Modular chapter & sub-topic components
```

---

## Content Workflow

### Adding a New Technical Note
1. Create modular chapter and sub-topic components inside `src/views/<TopicName>/`.
2. Register the entry in `src/data/<TopicName>.ts` via `registerBlog({ ... })` with unique UUIDs linking `tableOfContents` and `summary.sections`.
3. Import the registration file inside `src/context/AppProvider.tsx` (and `src/app/[blog]/page.tsx` for static params).

### Adding Tutorials or Materials
1. Add a new entry file inside `src/data/tutorials/` or `src/data/materials/` calling `registerTutorial(...)` or `registerMaterial(...)`.
2. Import it inside `src/context/AppProvider.tsx`.

---

## Deployment & Environment

- **Hosting**: Deployed via Vercel from the private Git repository.
- **Environment Variable**:
  - `NEXT_PUBLIC_SHOW_THEME_TOGGLE` (`"true"` / `"false"`): Controls visibility of the floating theme toggle outside development builds.

---

## Notice

Private repository. All written notes, walkthroughs, and guides are self-owned personal study archives with no third-party vendor affiliations.
