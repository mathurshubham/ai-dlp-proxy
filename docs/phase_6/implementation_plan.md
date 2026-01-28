# Implementation Plan - UI Overhaul & Bug Fixes

## Goal Description
Polish the Sentinel AI Privacy Proxy frontend for a more "premium" feel using Shadcn/ui. Resolve technical issues including hydration mismatches and fetching errors.

## Proposed Changes

### Frontend (`/frontend`)

#### [MODIFY] [layout.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/app/layout.tsx)
- Add `suppressHydrationWarning` to `<html>` to fix extension-related hydration errors.
- Update metadata title/description.

#### [MODIFY] [globals.css](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/app/globals.css)
- Configure Tailwind 4 theme for Shadcn/ui compatibility.
- Define necessary CSS variables for the "premium" dark/light mode.

#### [NEW] Shadcn Components
- Install and initialize `shadcn-ui`.
- Add `Card`, `Table`, `Badge`, `Skeleton`, and `Button` components.

#### [MODIFY] [page.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/app/page.tsx)
- Rewrite the dashboard using Shadcn components.
- Improve error handling for the `fetch` calls.
- Add "Empty State" and "Loading State" (Skeletons).

## Verification Plan
### Automated Tests
- Build and run the docker environment.
- Use `browser_subagent` to verify the new UI and ensure the console is clear of fetch/hydration errors.

### Manual Verification
- Visual inspection of the dashboard for "appeal" and "functional excellence".
