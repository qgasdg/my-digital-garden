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

### [x] Phase 10: Post Thumbnail Support
**Goal:** Add thumbnail image support to blog posts for better visual appeal on the main page.

**Implementation:**
1. **Type System Updates:**
   - Added `thumbnail?: string` field to `Post` and `PostMetadata` interfaces
   - Updated all MDX parsing functions to read thumbnail from frontmatter

2. **Main Page UI:**
   - Implemented Next.js `Image` component for optimized thumbnail display
   - Added hover effect: image scales slightly on hover (scale-105)
   - Created elegant placeholder design for posts without thumbnails

3. **Placeholder Design (No Thumbnail):**
   - Warm gradient background using accent colors
   - Decorative circular pattern (3 overlapping circles, very subtle opacity)
   - Document icon representing editorial content
   - Displays first tag of the post for context

4. **Image Management:**
   - Created `public/images/` directory for thumbnail storage
   - Added thumbnail paths to existing blog posts' frontmatter

**Usage:**
```mdx
---
title: "Post Title"
date: "2024-12-20"
description: "Description"
tags: ["Tag1", "Tag2"]
thumbnail: "/images/your-image.jpg"
---
```

**Files Modified:**
- `lib/mdx.ts` (added thumbnail field to interfaces and parsing logic)
- `app/page.tsx` (thumbnail display with Image component + placeholder)
- `posts/hello-world.mdx` (added thumbnail field)
- `posts/understanding-transformers.mdx` (added thumbnail field)

**Files Created:**
- `public/images/` (directory for storing thumbnail images)

**Status:** ✅ Complete - Beautiful thumbnails with graceful fallback

---

### [x] Phase 11: Enhance Firefly Animation
**Goal:** Make firefly effects more visible and dynamic by increasing count and movement.

**Implementation:**
- Increased firefly count from 15 to 23 (1.5x)
- Doubled movement range from ±50px to ±100px (2x)
- Maintains same animation duration and easing for smooth motion

**Files Modified:**
- `components/firefly-background.tsx`

**Status:** ✅ Complete - More active and visible fireflies

---

### [x] Phase 12: Obsidian-Compatible Filename Handling
**Goal:** Support both .md and .mdx files with URL-safe slug generation for Obsidian workflow.

**Problem:**
- System only read `.mdx` files, ignored `.md` files
- Filenames with spaces and special characters (e.g., "KL, JS Divergence.mdx") caused broken links
- Obsidian users often use spaces and commas in filenames

**Implementation:**
1. **Slug Conversion Function (`filenameToSlug`):**
   - Converts filenames to URL-safe slugs
   - Removes file extensions (`.md`, `.mdx`)
   - Lowercases all characters
   - Removes commas and special characters
   - Replaces spaces with hyphens
   - Supports Korean characters (가-힣)
   - Examples:
     - "KL, JS Divergence.mdx" → `kl-js-divergence`
     - "Wasserstein Distance.mdx" → `wasserstein-distance`

2. **File Format Support:**
   - Updated `getAllPosts()` to accept both `.md` and `.mdx`
   - Updated `getAllPostSlugs()` for static generation
   - Modified `getPostBySlug()` to find files by matching slugs

3. **Backward Compatibility:**
   - Existing files like `hello-world.mdx` still work as before
   - Supports both filename formats: `hello-world.mdx` and `Hello World.mdx`

**Files Modified:**
- `lib/mdx.ts` (added `filenameToSlug()`, updated all file reading functions)

**Usage Example:**
```
Filename: "KL, JS Divergence.mdx"
→ URL: /blog/kl-js-divergence
→ Works seamlessly
```

**Status:** ✅ Complete - Full Obsidian compatibility with URL-safe slugs

---

### [x] Phase 13: LaTeX Math Equation Support
**Goal:** Enable LaTeX math rendering for mathematical and scientific content.

**Problem:**
- KLD and Wasserstein Distance posts contained LaTeX equations ($$ $$, $ $)
- MDX threw `ReferenceError: KL is not defined` - treating LaTeX as JavaScript
- No math rendering support by default

**Implementation:**
1. **Installed Math Packages:**
   - `remark-math`: Parses math syntax in Markdown
   - `rehype-katex`: Renders math with KaTeX

2. **MDX Configuration (app/blog/[slug]/page.tsx):**
   - Added `remarkMath` to `remarkPlugins`
   - Added `rehypeKatex` to `rehypePlugins` (before code highlighting)
   - Proper plugin order: math → katex → syntax highlighting

3. **Styling (app/layout.tsx):**
   - Imported `katex/dist/katex.min.css` for proper math rendering

4. **Content Fix:**
   - Fixed `<br>` tags in tables → `<br/>` (self-closing)
   - MDX requires proper HTML in table cells

**Supported Math Syntax:**
```markdown
Inline: $E = mc^2$
Block: $$\int_0^\infty f(x)dx$$
```

**Files Modified:**
- `app/blog/[slug]/page.tsx` (added math plugins)
- `app/layout.tsx` (imported KaTeX CSS)
- `posts/Wasserstein Distance.mdx` (fixed table BR tags)
- `package.json` (added remark-math, rehype-katex)

**Status:** ✅ Complete - Full LaTeX math rendering support

---

### [x] Phase 14: Fix MDX Heading Styles (Server/Client Component Split)
**Goal:** Apply custom serif heading styles to MDX content by fixing RSC component compatibility.

**Problem:**
- Custom heading components (H1-H6) in `mdx-components.tsx` were not being applied
- The file had `"use client"` directive, making ALL components client-side
- `next-mdx-remote/rsc` (React Server Components) couldn't properly use client components
- The `Pre` component needed client features (useState), forcing the entire file to be client-only

**Root Cause:**
When a file has `"use client"`, the entire module becomes a Client Component. The RSC version of MDXRemote has compatibility issues when receiving a client component object, causing it to ignore custom component mappings.

**Implementation:**
1. **Split Components into Two Files:**
   - Created `components/mdx-heading-components.tsx` - Server Components (H1-H6, no "use client")
   - Kept `components/mdx-components.tsx` - Client Component (Pre with useState/onClick)

2. **Updated Import Strategy (app/blog/[slug]/page.tsx):**
   - Import `Pre` from `mdx-components.tsx`
   - Import `H1-H6` from `mdx-heading-components.tsx`
   - Pass as inline object to MDXRemote: `components={{ h1: H1, h2: H2, ... }}`

3. **Heading Styles Applied:**
   - H1: `!text-4xl !font-bold !font-serif`
   - H2: `!text-3xl !font-semibold !font-serif`
   - H3: `!text-2xl !font-semibold !font-serif`
   - H4-H6: Progressively smaller with serif styling
   - Used `!` prefix (Tailwind important) to override prose defaults

**Debugging Method:**
- Used "Red Test" (inline styles with red color/border) to verify component connection
- Confirmed that splitting resolved the issue

**Files Created:**
- `components/mdx-heading-components.tsx` (Server Components)

**Files Modified:**
- `app/blog/[slug]/page.tsx` (split imports, inline component object)
- `components/mdx-components.tsx` (kept only Pre component)

**Technical Insight:**
React Server Components (RSC) and Client Components have different serialization boundaries. When passing components to `next-mdx-remote/rsc`, they must be serializable in the server context. Client Components break this contract, causing the custom component mapping to fail silently.

**Status:** ✅ Complete - Headings now display with proper editorial serif styling

---

### [x] Phase 15: Adjust Typography Scale & Layout Width
**Goal:** Refine visual proportions for better reading experience.

**User Feedback:**
- Headings were too large, overwhelming the content
- Page width was too narrow, creating cramped layout

**Implementation:**
1. **Reduced Heading Sizes (~25%):**
   - H1: `text-4xl` → `text-3xl` (1.875rem)
   - H2: `text-3xl` → `text-2xl` (1.5rem)
   - H3: `text-2xl` → `text-xl` (1.25rem)
   - H4: `text-xl` → `text-lg` (1.125rem)
   - H5: `text-lg` → `text-base` (1rem)
   - H6: `text-base` → `text-sm` (0.875rem)

2. **Increased Page Width (~35%):**
   - Article container: `max-w-3xl` (768px) → `max-w-5xl` (1024px)
   - Provides more breathing room for content and code blocks

**Visual Impact:**
- More balanced typography hierarchy
- Better proportion between headings and body text
- Wider layout reduces line breaks in code examples
- Improved overall reading comfort

**Files Modified:**
- `components/mdx-heading-components.tsx` (updated all heading sizes)
- `app/blog/[slug]/page.tsx` (changed article max-width)

**Status:** ✅ Complete - Refined typography and layout proportions

---

### [x] Phase 16: Interactive Firefly Effects
**Goal:** Make fireflies more visible and add mouse interaction for engaging user experience.

**User Requirements:**
- Increase firefly visibility (count and brightness by ~35%)
- Add mouse avoidance effect with local interaction radius

**Implementation:**
1. **Visual Enhancements (+35%):**
   - Increased count: 23 → 31 fireflies
   - Increased brightness: opacity `[0.2, 0.4, 0.3, 0.2]` → `[0.3, 0.5, 0.4, 0.3]`
   - More visible and atmospheric presence

2. **Mouse Avoidance Effect:**
   - 120px interaction radius (local, not global)
   - Calculates distance from mouse to each firefly
   - Applies repulsion force: `strength = (1 - distance/radius) * 50px`
   - Fireflies smoothly move away when cursor approaches
   - Repulsion added to base animation keyframes

3. **Performance Optimizations:**
   - Pre-generated animation keyframes (avoid recalculation)
   - Throttled mouse tracking (~60fps with requestAnimationFrame)
   - Separate `FireflyParticle` component for cleaner render logic
   - Container rect cached and updated only on resize

**Technical Details:**
```typescript
// Repulsion calculation
const dx = fireflyX - mouseX;
const dy = fireflyY - mouseY;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < 120px) {
  const strength = (1 - distance / 120) * 50;
  const angle = Math.atan2(dy, dx);
  repulsion = { x: cos(angle) * strength, y: sin(angle) * strength };
}
```

**User Experience:**
- More vibrant and noticeable firefly atmosphere
- Subtle, playful interaction on mouse movement
- Smooth, non-jarring animations
- No performance degradation (throttled updates)

**Files Modified:**
- `components/firefly-background.tsx` (complete refactor with mouse interaction)

**Status:** ✅ Complete - Enhanced visual presence with interactive mouse avoidance

---

### [x] Phase 17: Physics-Based Firefly Movement (No Elastic Snap-Back)
**Goal:** Replace elastic "rubber band" behavior with realistic physics where fireflies permanently move to new locations.

**Problem:**
- Previous implementation used Framer Motion with offset-based positioning
- Fireflies would "snap back" to origin when mouse moved away (elastic behavior)
- User wanted realistic physics like billiard balls or real insects

**Solution - Velocity-Based Physics:**
1. **Removed Origin Dependency:**
   - Position is now absolute (x, y in pixels), not `origin + offset`
   - Fireflies never "remember" where they started

2. **Added Velocity System:**
   - Each firefly has velocity vector (vx, vy)
   - Mouse repulsion applies force to **velocity**, not position
   - Position updates based on velocity: `x += vx`, `y += vy`

3. **Physics Forces:**
   - **Repulsion Force:** `force = (1 - distance/radius) * 0.8`
   - **Random Drift:** `vx += random(-0.08, 0.08)` for natural floating
   - **Friction/Damping:** `vx *= 0.97` to prevent flying off forever
   - **Velocity Cap:** `maxSpeed = 4px/frame` to prevent extreme speeds

4. **Boundary Handling:**
   - Wrapping at screen edges (fireflies teleport to opposite side)
   - 20px buffer zone for smooth transitions
   - No fireflies lost off-screen

5. **Performance Optimization:**
   - Removed Framer Motion dependency (heavy library)
   - Direct DOM manipulation via `element.style.transform`
   - No React re-renders on every frame (60fps)
   - Uses `requestAnimationFrame` for smooth animation

**Physics Equation:**
```typescript
// Apply mouse repulsion to velocity
if (distance < 120px) {
  force = (1 - distance/120) * 0.8
  vx += cos(angle) * force
  vy += sin(angle) * force
}

// Apply friction
vx *= 0.97
vy *= 0.97

// Update position
x += vx
y += vy
```

**User Experience:**
- Fireflies drift naturally like real insects
- When pushed by mouse, they fly to new locations and continue floating there
- No "snap back" or elastic behavior
- Smooth, realistic physics simulation
- More organic and less "programmed" feeling

**Files Modified:**
- `components/firefly-background.tsx` (complete rewrite - removed Framer Motion, added physics engine)

**Status:** ✅ Complete - Realistic physics-based movement with permanent displacement

---

### [x] Phase 18: Fix Firefly Initialization Bug & Gentle Physics
**Goal:** Fix (0,0) clumping on page refresh and make mouse interaction gentler.

**Bug Report:**
- On page refresh (F5), all fireflies spawned clustered at top-left corner (0,0)
- Interaction was too aggressive - fireflies shot away like bullets
- Interaction radius was too wide

**Root Cause Analysis:**
1. **Initial Render Problem:**
   - Render happened before initialization effect completed
   - Fallback object had `x: 0, y: 0`, causing clumping
   - No guard to wait for valid window dimensions

2. **Timing Issue:**
   - `firefliesRef.current[i]` was undefined during first render
   - Component rendered before `useEffect` populated positions

**Solution:**
1. **Added Initialization Guard:**
   - New `initialized` state tracks when fireflies are ready
   - Don't render until `initialized === true`
   - Prevents rendering with invalid/missing data

2. **Dimension Validation:**
   ```typescript
   if (typeof window === 'undefined') return;
   if (width === 0 || height === 0) return;
   ```
   - Only initialize when window dimensions are valid
   - Prevents `Math.random() * 0 = 0` bug

3. **Initial Position Rendering:**
   - Set `transform` and `opacity` in initial style
   - Uses actual firefly data, not fallback
   - Ensures correct positioning from first frame

4. **Physics Adjustments (50% Gentler):**
   - Interaction radius: 120px → 60px
   - Repulsion force: 0.8 → 0.4
   - Mouse must be closer to affect fireflies
   - Push effect is more subtle and gentle

**Code Changes:**
```typescript
// Before: immediate render with fallback
{Array.from({ length: count }, (_, i) => {
  const firefly = firefliesRef.current[i] || { x: 0, y: 0 }; // Bug!
  ...
})}

// After: wait for initialization
if (!initialized) return <div />;
{firefliesRef.current.map((firefly, i) => (
  <div style={{ transform: `translate(${firefly.x}px, ${firefly.y}px)` }} />
))}
```

**User Experience:**
- Fireflies spawn evenly distributed across entire screen immediately
- No clumping at (0,0) even on hard refresh
- Gentler, more subtle mouse interaction
- Cursor must be closer to push fireflies away
- Push effect feels natural, not violent

**Files Modified:**
- `components/firefly-background.tsx` (added initialization guard, reduced physics parameters)

**Status:** ✅ Complete - Clean initialization and gentler interactions

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
│   ├── mdx-components.tsx     # MDX client components (Pre)
│   └── mdx-heading-components.tsx # MDX server components (H1-H6)
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

## Workflow Protocol (STRICT)

1.  **One Phase, One Commit:** Never combine multiple phases into a single commit.
2.  **The Loop:**
    -   Step 1: Implement the requested Phase.
    -   Step 2: Verify the feature works.
    -   Step 3: Update `CLAUDE.md` (mark the phase as `[x]` and add details).
    -   Step 4: **STOP** and propose a git commit immediately using the convention below.
3.  **Approval:** Wait for user confirmation before starting the next Phase.

---

## Git Commit Convention

Follow the **Conventional Commits** pattern: `type: subject`

- **feat:** New feature or major component (e.g., `feat: Add About page`, `feat: Implement dark mode`)
- **fix:** Bug fix (e.g., `fix: Resolve hydration mismatch`, `fix: Prevent ENOENT error`)
- **style:** CSS/Design changes that don't affect logic (e.g., `style: Adjust firefly opacity`, `style: Update font family`)
- **refactor:** Code restructuring without behavior change (e.g., `refactor: Clean up mdx.ts`)
- **content:** Content updates (e.g., `content: Add new blog post`, `content: Fix typo in About me`)
- **chore:** Config, build, or tool changes (e.g., `chore: Update tailwind config`, `chore: Add lucide-react`)
- **docs:** Documentation updates (e.g., `docs: Update README`, `docs: Update CLAUDE.md`)

---

Last Updated: 2025-12-22
