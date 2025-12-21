# Digital Garden - Project Context

## Overview
A modern editorial-style digital archive blog built with Next.js 16, featuring warm aesthetic design, MDX content support, and atmospheric UI effects.

## Tech Stack
- **Framework:** Next.js 16.1.0 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Shadcn UI (Radix UI + CVA)
- **Content:** MDX with next-mdx-remote
- **Animations:** Framer Motion
- **Syntax Highlighting:** rehype-pretty-code + Shiki
- **Icons:** Lucide React
- **Fonts:** Playfair Display (Serif), Geist Sans, Geist Mono

## Design Philosophy
- **Warm Editorial Aesthetic:** Paper-like textures, warm off-white backgrounds
- **Atmospheric Effects:** Firefly particles, subtle animations
- **Dual Theme Support:** Light (warm paper) and Dark (atmospheric mystery)
- **Typography-First:** Serif headings, generous line-height, readable prose
- **Performance-Focused:** Static Site Generation, optimized loading

## Completed Phases

### [x] Phase 1: Fix Hydration Mismatch Error
**Goal:** Prevent "Text content does not match server-rendered HTML" error in Firefly component.

**Implementation:**
- Refactored `FireflyBackground` component to use `useState` + `useEffect`
- Moved `Math.random()` calls from render to client-side effect
- Server renders empty array, client generates particles after hydration

**Files Modified:**
- `components/firefly-background.tsx`

**Status:** ✅ Complete - No more hydration mismatches

---

### [x] Phase 2: Remove Folded Paper Corner Effect
**Goal:** Simplify design by removing skeuomorphic paper corner curl effect.

**Implementation:**
- Removed `.paper-corner` CSS classes and pseudo-elements
- Cleaned up `::before` and `::after` shadow effects
- Removed class references from page layouts
- Preserved paper texture and firefly effects

**Files Modified:**
- `app/globals.css` (removed lines 352-396)
- `app/page.tsx` (removed `paper-corner` class)
- `app/blog/[slug]/page.tsx` (removed `paper-corner` class)

**Status:** ✅ Complete - Clean, flat design

---

### [x] Phase 6: Performance Optimization & Loading UI
**Goal:** Implement Static Site Generation and improve loading UX with Skeleton UI.

**Implementation:**
1. **SSG (Already Implemented):**
   - `generateStaticParams()` in `app/blog/[slug]/page.tsx`
   - All blog posts pre-rendered at build time

2. **Skeleton Loading UI:**
   - Created `app/blog/[slug]/loading.tsx`
   - Used Shadcn `Skeleton` component
   - Matches article structure (tags, title, description, content blocks)

3. **Server-Side Optimization:**
   - Verified MDX compilation runs on server only
   - Heavy `rehype-pretty-code` processing happens at build time

**Files Created:**
- `app/blog/[slug]/loading.tsx`
- `components/ui/skeleton.tsx` (Shadcn)

**Performance Impact:**
- First load: ~11s (compile + render)
- Cached load: ~146-320ms
- Production: Instant (pre-generated static pages)

**Status:** ✅ Complete - Fast, smooth loading

---

### [x] Phase 8: Custom 404 & Error Pages
**Goal:** Replace default Next.js error pages with warm, poetic editorial designs.

**Implementation:**
1. **404 Not Found (`app/not-found.tsx`):**
   - Large faint "404" background text (opacity 3%)
   - `FileQuestion` icon from Lucide React
   - Message: "This page seems to be missing from the archive"
   - Framer Motion entrance animation
   - "Return Home" button

2. **Error Boundary (`app/error.tsx`):**
   - Large faint "Error" background text
   - `AlertTriangle` icon (warm accent, not red)
   - Message: "Something went wrong, but it's not your fault"
   - "Try Again" + "Return Home" buttons
   - Dev-only error details accordion

**Design Features:**
- Centered layout with generous whitespace
- Warm color palette (no harsh reds)
- Firefly background effects
- Smooth fade-in/slide-up animations
- Responsive (mobile-optimized)
- Dark/Light mode support

**Files Created:**
- `app/not-found.tsx`
- `app/error.tsx`

**Dependencies Added:**
- `lucide-react` (icon library)

**Status:** ✅ Complete - Calm, poetic error experience

---

### [x] Phase 9: Fix ENOENT Error on Missing Posts
**Goal:** Prevent server crash when accessing non-existent blog posts.

**Implementation:**
- Added `fs.existsSync()` guard in `getPostBySlug()` function
- Check file existence before attempting `fs.readFileSync()`
- Return `null` immediately if file doesn't exist (no error thrown)
- `notFound()` function called in page component when post is null

**Flow:**
1. User visits `/blog/does-not-exist`
2. `getPostBySlug("does-not-exist")` called
3. `fs.existsSync()` returns `false` → return `null`
4. Page component checks `!post` → calls `notFound()`
5. Custom 404 page rendered (no error overlay)

**Files Modified:**
- `lib/mdx.ts` (added guard clause in `getPostBySlug`)

**Status:** ✅ Complete - No ENOENT errors, graceful 404

---

## Pending Phases
(Add future phases here as they are planned)

---

## File Structure
```
Blog/
├── app/
│   ├── blog/[slug]/
│   │   ├── page.tsx           # Blog post page (SSG)
│   │   ├── loading.tsx        # Skeleton loading UI
│   │   └── article-wrapper.tsx # Framer Motion wrapper
│   ├── globals.css            # Global styles + design system
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (post listing)
│   ├── not-found.tsx          # Custom 404 page
│   └── error.tsx              # Custom error page
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── separator.tsx
│   │   └── skeleton.tsx
│   ├── firefly-background.tsx # Atmospheric particle effect
│   ├── theme-toggle.tsx       # Dark/Light mode switcher
│   └── mdx-components.tsx     # MDX custom components
├── lib/
│   ├── mdx.ts                 # MDX file reading/parsing
│   ├── mdx-config.ts          # Rehype/Remark config
│   └── utils.ts               # Utility functions
├── posts/                     # MDX blog posts
│   ├── hello-world.mdx
│   └── understanding-transformers.mdx
└── CLAUDE.md                  # This file
```

---

## Development Commands
```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Build for production (SSG all posts)
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Key Design Variables (CSS)
```css
/* Light Mode */
--background: #FAF8F5        /* Warm off-white */
--foreground: #2D2D2D        /* Dark gray text */
--accent: #8B7355            /* Warm editorial brown */
--firefly-color: rgba(255, 200, 87, 0.3)

/* Dark Mode */
--background: #1A1816        /* Deep warm tone */
--foreground: #E8E5E0        /* Light warm text */
--accent: #D4A574            /* Warm amber/gold */
--firefly-color: rgba(255, 215, 110, 0.4)
```

---

## Notes for AI Assistants
- Always preserve the warm editorial aesthetic
- Avoid harsh colors (especially reds in errors)
- Keep animations smooth and subtle (700ms transitions)
- Maintain firefly effects and paper textures
- Use serif fonts for headings, sans for body
- Optimize for both dark and light modes
- Test on mobile (responsive design critical)

---

Last Updated: 2025-12-22
