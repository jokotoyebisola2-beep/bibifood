# BIBI FOOD — FRONTEND ARCHITECTURE & ENGINEERING FOUNDATION
**Document Version:** 1.0.0  
**Phase:** 2.6 — Frontend Engineering Architecture Blueprint  
**Status:** Approved for Implementation  
**Audience:** Software Architects, Engineering Managers, Frontend Web & Mobile Developers  

---

## 1. Professional Project Directory Structure

To ensure maximum decoupling, rapid developer onboarding, and seamless transition pathways to native applications (React Native / Capacitor), Bibi Food utilizes a highly modular **Feature-First Architecture** combined with unified global services.

```
/src/
 ├── app/                             # Next.js App Router Pages & Layouts (Routing Layer)
 │    ├── (public)/                   # Unauthenticated customer routes (Home, Menu, About)
 │    │    ├── page.tsx
 │    │    └── menu/page.tsx
 │    ├── (auth)/                     # Auth flow pages (Login, OTP, Signup)
 │    │    └── login/page.tsx
 │    ├── (customer)/                 # Protected customer dashboard pages
 │    │    └── dashboard/page.tsx
 │    ├── (rider)/                    # Protected rider dashboard pages
 │    │    └── rider/page.tsx
 │    ├── (admin)/                    # Protected operations and admin console
 │    │    └── admin/page.tsx
 │    ├── api/                        # Next.js Serverless API Routes (Internal Proxies)
 │    ├── layout.tsx                  # Global HTML wrapper, metadata, and analytics
 │    └── providers.tsx               # Consolidated global context providers
 │
 ├── components/                      # Global Reusable UI Components (Design System Tokens)
 │    ├── ui/                         # Base Shadcn/Radix components (Buttons, Inputs, Badges)
 │    ├── feedback/                   # Skeleton loaders, Error screens, Toast alerts
 │    ├── navigation/                 # Global Navbar, Mobile Navigation Bar, Footer
 │    └── data/                       # Tables, Charts, Map visualizers
 │
 ├── features/                        # Decoupled Feature Modules (Core Business Logic)
 │    ├── auth/                       # Credentials, OTP state, session check hooks
 │    ├── meals/                      # Menu rendering, ingredient modifiers, detail state
 │    ├── cart/                       # Items state, total calculations, sliding drawers
 │    ├── checkout/                   # Bank info, transfer proof uploader, forms
 │    ├── tracking/                   # Live maps routing, GPS coords subscriber, state logs
 │    ├── reviews/                    # Rating grids, meal feedbacks, comment submissions
 │    ├── notifications/              # Active SMS triggers, inside-app alert banners
 │    ├── admin/                      # Operations analytics, meal CRUD dialogs, admin boards
 │    └── rider/                      # Acceptance job controls, pin verifier panels
 │
 ├── hooks/                           # Shared Custom React Hooks (Client-Only Actions)
 │    ├── useGeolocation.ts           # Subscriber to active browser map coordinates
 │    ├── useMediaQuery.ts            # Screen responsive state calculator
 │    └── useLocalStorage.ts          # State synchronizer to local browser memory
 │
 ├── lib/                             # Third-party SDK initializations & Config Wrappers
 │    ├── supabase.ts                 # Supabase client setup
 │    ├── maps.ts                     # Google Maps client initializer
 │    └── utils.ts                    # Classnames merger (cn utility)
 │
 ├── services/                        # API Request & External Communication Layer
 │    ├── api.ts                      # Axios/Fetch base client with error interceptors
 │    └── notifications.ts            # SMS & Email dispatch services
 │
 ├── store/                           # State Stores (Zustand client-side state engines)
 │    ├── useCartStore.ts             # Cart item list, discount modifiers, delivery choices
 │    └── useNotificationStore.ts     # Active alert queues and custom banners
 │
 ├── contexts/                        # Light Context Providers
 │    └── AuthContext.tsx             # Active customer/admin session state wrapper
 │
 ├── styles/                          # Global CSS styles and Tailwind configurations
 │    └── globals.css                 # Base entry importing Tailwind and Fonts
 │
 ├── types/                           # Shared Global TypeScript Type Definitions
 │    ├── meal.ts
 │    ├── order.ts
 │    ├── user.ts
 │    └── tracking.ts
 │
 └── constants/                       # Shared Constants & Static Configuration Values
      └── config.ts                   # Opening hours, Delivery pricing parameters, URLs
```

---

## 2. Feature Module Boundaries

Each module inside `/src/features/` must be entirely self-contained. It should only import from other directories via global utilities or clear interfaces. A feature module folder must conform to this schema:

```
/src/features/meals/
 ├── components/                      # Feature-specific sub-components (MealCard, CategoryFilter)
 ├── hooks/                           # React queries, meal detail fetchers (useMealsQuery)
 ├── services/                        # API route actions (fetchMeals, updateMealInventory)
 ├── types.ts                         # Specific TS interfaces for the meal domain
 └── index.ts                         # Public API exporting components and hooks
```

---

## 3. Global Component Architecture

UI elements are structured systematically following the **Atomic Design** philosophy:

1.  **Atoms (Shadcn Base Components):** Highly customizable primitive elements such as buttons, inputs, labels, and badges.
2.  **Molecules (Composite Components):** Standard elements like food cards, rating stars, custom selectors, search bars, and itemized rows.
3.  **Organisms (Complex Structural Layouts):** Features like cart slide-outs, checkout forms, live delivery map views, and admin analytics dashboards.
4.  **Templates (Layout Wrappers):** Unified structures like the public header, admin navigation panels, and the rider's mobile layout.

---

## 4. Routing Structure & Middleware

Bibi Food utilizes a directory-based App Router system to manage navigation:

```
/src/app/
 ├── (public)/
 │    ├── page.tsx                     # Landing Page & Area Check
 │    ├── menu/                        # Full Culinary Menu Page
 │    │    └── page.tsx
 │    ├── about/                       # Editorial About & Philosophy Page
 │    ├── faq/                         # Dynamic accordion FAQ
 │    └── checkout/                    # Checkout Page
 │         └── page.tsx
 │
 ├── (auth)/
 │    ├── login/                       # OTP Request Gateway
 │    └── verify/                      # OTP Input validation Page
 │
 ├── (customer)/
 │    └── dashboard/                   # Orders, Profile, Addresses, History
 │         └── page.tsx
 │
 ├── (rider)/
 │    └── rider/                       # Mobile-first available runs, Navigation & PIN verification
 │         └── page.tsx
 │
 └── (admin)/
      └── admin/                       # Operations Control, Payout approvals, Menu Manager
           ├── page.tsx
           ├── orders/
           └── inventory/
```

### 4.1 Secure Route Control via Middleware
A unified Next.js `middleware.ts` intercepts incoming requests, analyzes the session cookie, and checks authorizations before granting route access:

```typescript
// /src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('bibi_session')?.value;
  const path = request.nextUrl.pathname;

  // 1. Session Verification
  if (!token) {
    if (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/rider')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Decode Session (Hypothetical payload extraction)
  const userRole = request.cookies.get('bibi_role')?.value; // 'customer' | 'admin' | 'rider'

  // 3. Authorization Guards
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (path.startsWith('/rider') && userRole !== 'rider') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (path.startsWith('/dashboard') && userRole !== 'customer') {
    return NextResponse.redirect(new URL(`/${userRole}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/rider/:path*'],
};
```

---

## 5. State Management & Data Fetching

State management is split into three layers to ensure optimal rendering speed and avoid unnecessary re-renders:

```
                      +---------------------------------------+
                      |         STATE ARCHITECTURE            |
                      +---------------------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
         v                                v                                v
+------------------+             +------------------+             +------------------+
| Server-Side      |             | Client-Side      |             | Client-Side      |
| Cached State     |             | Global Stores    |             | Transient State  |
| (TanStack Query) |             | (Zustand Stores) |             | (React State)    |
| ---------------- |             | ---------------- |             | ---------------- |
| - Meal list.     |             | - Shopping Cart. |             | - Input fields.  |
| - Order history. |             | - Temp filters.  |             | - Modal open/    |
| - Rider locations|             | - Active alerts. |             |   close toggles. |
+------------------+             +------------------+             +------------------+
```

### 5.1 Data Fetching Strategy
*   **Static Rendering (SSG):** Used for public marketing assets, standard FAQs, and terms pages.
*   **Dynamic Server-Side Rendering (SSR):** Used to load the initial menu layout with real-time stock levels.
*   **Streaming & Suspense Loading:** Pages with heavy components (like live maps) stream content placeholders using custom skeleton UI fallbacks.
*   **Caching & Invalidation:**
    *   *Meals:* Cached for 5 minutes, invalidated immediately when an admin updates stock.
    *   *Orders:* Polled continuously using a 5-second interval during delivery tracking, and updated in real-time via WebSockets when status changes occur.

---

## 6. Request & API Gateway Layer

The API client manages HTTP requests, formats headers, and handles communication errors securely.

### 6.1 Unified Client Wrapper Design
```typescript
// /src/services/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach authentication token
apiClient.interceptors.request.use((config) => {
  const token = document.cookie.match(/bibi_session=([^;]+)/)?.[1];
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Manage errors and retries
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-Retry on network failures or transient server issues
    if (error.response?.status >= 502 && !originalRequest._retry) {
      originalRequest._retry = true;
      return new Promise((resolve) => {
        setTimeout(() => resolve(apiClient(originalRequest)), 2000);
      });
    }

    // Session Expiration Handling
    if (error.response?.status === 401) {
      window.location.href = '/login?expired=true';
    }

    return Promise.reject(error.response?.data || error.message);
  }
);
```

---

## 7. Form Architecture & Validation

All user forms use **React Hook Form** combined with **Zod Schema Validation** for robust, type-safe data handling.

```typescript
// /src/features/checkout/schemas.ts
import { z } from 'zod';

export const checkoutSchema = z.shape({
  deliveryOption: z.enum(['home', 'office', 'pickup']),
  addressId: z.string().min(1, 'Please select a delivery address'),
  specialInstructions: z.string().max(250, 'Instructions must be under 250 characters').optional(),
  proofOfPayment: z
    .any()
    .refine((file) => file && file.size <= 5000000, 'Proof screenshot must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
      'Only JPEG, PNG, or WEBP images are supported'
    ),
});
```

---

## 8. Performance Optimization Strategy

*   **Image Management:** Every meal image is served in modern formats like WebP or AVIF. Layout placeholders utilize precise aspect ratios (`aspect-video`, `aspect-square`) to prevent layout shifts.
*   **Lazy Loading & Code Splitting:** Heavy administrative widgets, metrics dashboards, and the interactive Google Maps interface are dynamically imported on-demand.
*   **Resource Prefetching:** Hovering over menu links or cards initiates a prefetch for the destination routes to ensure instantaneous transitions.

---

## 9. Error Handling & Fail-safe Ecosystem

We handle errors gracefully using standard recovery screens:
*   **Operational 404 (Not Found):** Custom-designed page matching our brand's styling, featuring a search bar to help users quickly return to the active menu.
*   **API Recovery (500 Server Errors):** Dedicated error boundaries providing clear troubleshooting steps and a retry button to resume execution.
*   **Offline Mode Detector:** Pings an offline status bar (`bg-slate-900 text-white`) when the internet connection is lost, and saves active cart selections locally.

---

## 10. Security Implementation Blueprint

```
+-----------------------------------------------------------------------------+
|                            FRONTEND SECURITY SHIELD                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ Auth Tokens ]     ==>  Stored exclusively in Secure, HTTP-Only cookies   |
|                           to prevent XSS token theft.                       |
|                                                                             |
|  [ Input Sanitation ] ==>  Zod schema filters sanitize data before it reaches  |
|                           API endpoints.                                    |
|                                                                             |
|  [ Content Security ] ==> Header configurations strictly restrict active      |
|                           scripts to verified, trusted CDNs.                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

*   **Input Sanitation:** Sanitization filters remove potential scripts from inputs to prevent Cross-Site Scripting (XSS).
*   **Storage Guidelines:** Avoid storing sensitive customer information in local storage, restricting user identities to secure session parameters.

---

## 11. Testing Protocol Framework

To ensure the system's ongoing reliability, we run a multi-layered testing workflow:

```
                  +-----------------------------------------+
                  |         BIBI FOOD TESTING SUITE         |
                  +-----------------------------------------+
                                       |
        +------------------+-----------+-----------+------------------+
        |                  |                       |                  |
        v                  v                       v                  v
  [1. Unit Tests]   [2. Component Tests]     [3. E2E Tests]     [4. Visual Audits]
  - Vitest / Jest   - React Test Library     - Playwright       - Axe Engine
  - Utility logic   - User input forms,      - Checkout flows,  - Color contrast,
    & calculation     modular buttons,         admin processes,   interactive touch
    engines.          custom list items.       and rider tasks.   target checks.
```

---

## 12. Conclusion & Phase 3 Readiness

This Frontend Engineering Architecture blueprint establishes the technical structures, state models, folder paths, and validation layers for Bibi Food. With the visual and technical guidelines in place, development can proceed cleanly and consistently across subsequent implementation phases.
