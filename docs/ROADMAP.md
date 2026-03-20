# Optimization Roadmap: Speed & SEO Enhancement

Project: **LOrdEnRYQuE Portfolio v2**
Objective: Achieving perfect performance scores and top-tier Google search visibility (GEO).

---

## 🛡️ Phase 1: SEO & Discoverability (GEO)
*   [ ] **Dynamic Domain**: Replace hardcoded `siteConfig.domain` with `process.env.NEXT_PUBLIC_APP_URL`.
*   [ ] **Canonical URLs**: Implement automatic canonical tag generation in `src/lib/seo.ts` to prevent duplicate content issues.
*   [ ] **Mobile Optimization (PWA)**: Create `manifest.json` and a full favicon/brand icon suite.
*   [ ] **Structured Data Breadcrumbs**: Enhance `JSONLD` to include BreadcrumbList for better search engine navigation display.
*   [ ] **Alt-Tag Audit**: Ensure all project images and dynamic banners have descriptive `alt` tags for accessibility and image search.

## ⚡ Phase 2: Performance & Speed Optimization
*   [ ] **Server-Side Hydration**: Migrate `HomePage` and `FeaturedProjects` to use **Server Components** for fetching Convex data.
    *   *Result:* Googlebot sees project content on the first byte, rather than a blank loader.
*   [ ] **Visual Placeholder Upgrade**: Replace text-based "initials" with optimized Next.js `Image` components and `blur` placeholders.
*   [ ] **Dynamic Component Loading**: Use `next/dynamic` for heavy visual components (Contact, Tooltips, Cookie Bar) to lower initial JS payload.
*   [ ] **Next.js Font Optimization**: Verify font-display swap and preload settings for Geist font to eliminate layout shift.

## 🛠️ Phase 3: Technical Integrity & UX
*   [ ] **Automatic Sitemap Generation**: Verify that `convex` dynamic pages are correctly reflected in `sitemap.ts`.
*   [ ] **Standard Error Boundaries**: Implement granular `loading.tsx` and `error.tsx` states to ensure the UI feels alive during data fetches.
*   [ ] **Logging Cleanup**: Remove unnecessary production console logs via `next.config.ts`.

---

## 📈 Success Metrics
- **Google Lighthouse**: 95+ Score across Performance, SEO, and Accessibility.
- **LCP (Largest Contentful Paint)**: Under 1.2s.
- **Search Presence**: Rich results (Sitelinks, Breadcrumbs) active in Google Search Console.
