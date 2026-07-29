# BIBI FOOD — PRODUCT REQUIREMENTS DOCUMENT (PRD) & TECHNICAL BLUEPRINT
**Document Version:** 1.0.0  
**Status:** Approved for Development  
**Author:** Founding Product & Architecture Team  

---

## 1. Product Vision

### 1.1 Mission
To elevate the modern food delivery experience by offering a single, uncompromising, high-quality culinary brand delivered directly to customers’ doors with absolute precision, elegant packaging, and seamless digital interaction.

### 1.2 Vision
To become the definitive standard of modern, single-brand food tech by proving that controlling the entire value chain—from sourcing premium ingredients and cooking under unified culinary standards to proprietary last-mile logistics—results in an unmatched, premium customer experience superior to generic multi-restaurant marketplaces.

### 1.3 Value Proposition
*   **Unified Quality Control:** No variance in quality or hygiene; every meal is prepared by Bibi Food's executive chefs in state-of-the-art dark/cloud kitchens.
*   **Predictable Logistics:** Dynamic routing and dedicated riders ensure hot, premium food arrives within a narrow, guaranteed delivery window.
*   **Curated Gastronomy:** A streamlined menu focusing on flavor, nutrition, and premium presentation, avoiding the cognitive overload of massive marketplace apps.
*   **Frictionless Transaction:** A simplified, native-feeling, mobile-first ordering workflow backed by transparent billing and direct bank transfers.

### 1.4 Business Goals
*   **Establish Brand Authority:** Achieve a 92%+ customer retention rate within the first six months of operation.
*   **Operational Excellence:** Maintain an average kitchen-to-door delivery time of under 35 minutes across all covered states.
*   **Unit Economic Viability:** Prove contribution margin profitability within Year 1 by optimizing inventory management, minimizing waste, and utilizing efficient proprietary rider grouping.
*   **Scalability Foundation:** Build a modular, decoupled digital architecture that easily exposes APIs for native iOS, Android, and smart-device endpoints.

---

## 2. User Personas

| Attribute | Persona A: The Busy Academic (Student) | Persona B: The High-Performing Executive (Professional) | Persona C: The Modern Household (Family) | Persona D: The Office Operations Lead (Corporate) |
| :--- | :--- | :--- | :--- | :--- |
| **Name** | Tobi Adebayo | Sarah Jenkins | The Obi Family (Nkem & Emeka) | Clara Sterling |
| **Age / Role** | 22 / Graduate Student | 31 / Senior Consultant | Mid-30s / Dual-income parents | 42 / Office Admin & Ops Director |
| **Location** | Campus Hub | Metropolitan Financial District | Premium Suburbs | City Tech Corridor |
| **Income / Budget**| Moderate / Budget-conscious but values quality | High / Value-driven; premium-oriented | Upper-Middle / Prefers value-packed family bundles | Tiered corporate budget / Value for money |
| **Core Needs** | Fast, late-night hot meals; reliable study fuel; simple payment confirmation. | Ultra-reliable lunchtime delivery; healthy, macro-balanced choices; premium packaging suitable for desk eating. | Healthy, crowd-pleasing dinners; portion sizes that satisfy children and adults; scheduling capabilities. | Group orders; tax-compliant invoices; multi-item coordination; recurring corporate event catering. |
| **Frustrations** | Hidden service fees; cold delivery; tedious bank transfer verification delays. | Delayed deliveries during back-to-back meetings; low-quality ingredients; messy packaging leaks. | Spending 2 hours cooking/cleaning after 9-to-5; picky eaters rejecting complex menus; inconsistent delivery times. | Manual split bills; missed order items; lack of formal receipts; riders calling repeatedly for directions. |
| **Bibi Food Value** | Direct, clear pricing; prompt delivery; direct bank transfer uploads with automatic recognition. | Precision delivery window; premium heat-retaining containers; clean, gourmet aesthetic. | "Family Feast" meal bundles; advanced scheduling (order by 3 PM for 7 PM delivery); kid-friendly gourmet choices. | Corporate multi-cart dashboards; itemized receipts; dedicated business delivery couriers. |

---

## 3. Website Sitemap

Below is the complete map of views and sub-routes required for the MVP launch of Bibi Food, segmented by user access level:

```
[Customer Portal] (Public & Authenticated)
 ├── / (Homepage / Landing & Promo Showcase)
 ├── /menu (Interactive Menu, Dietary Filters & Detail Modals)
 ├── /cart (Order Review, Special Instructions, and Order Type Selection)
 ├── /checkout (Delivery Details, Address Selector, Payment Guide & Transfer Proof Upload)
 ├── /track/:orderId (Real-time Live Order Tracking & Dispatch Map)
 ├── /profile (Account Info, Saved Addresses, Order History)
 ├── /reviews (Public reviews & feedback portal)
 └── /auth (Unified, OTP/Passwordless Login & Signup)

[Rider Dashboard] (Role-Restricted: Riders Only)
 ├── /rider/login (Secure Rider Portal Access)
 ├── /rider/home (Status Toggle: Active/Inactive, Current Earnings, and Job Board)
 ├── /rider/jobs (Active Delivery Run, Navigation Map, Order Details)
 └── /rider/history (Completed Deliveries, Tips Tracker, Performance Metrics)

[Operations & Admin Console] (Role-Restricted: Admins Only)
 ├── /admin/login (Highly Secure Dual-Factor Login)
 ├── /admin/dashboard (High-level KPIs, Real-time Sales, Active Order Map)
 ├── /admin/orders (Live Order Queue, Status Control, Rider Dispatch Center)
 ├── /admin/menu (Inventory Status, Menu Item CRUD, Pricing, Category Setup)
 ├── /admin/users (Customer Directory, Review Management, Account Controls)
 ├── /admin/riders (Rider Onboarding, Performance Auditing, Payout Approvals)
 └── /admin/finance (Bank Transfer Ledger Verification, Discount Code Controls)
```

---

## 4. Information Architecture

The diagram below outlines the structural navigation flows and directional paths across Bibi Food's web endpoints:

```
                      +-------------------+
                      |   1. Homepage     | <------------------------------------+
                      +-------------------+                                      |
                                | (Browse/CTAs)                                  |
                                v                                                |
                      +-------------------+                                      |
                      |   2. Menu Grid    | <---------------+                    |
                      +-------------------+                 |                    |
                                | (Add to Cart)             | (Back to Menu)     | (Cancel / Return)
                                v                           |                    |
                      +-------------------+                 |                    |
                      |   3. Cart Page    | ----------------+                    |
                      +-------------------+                                      |
                                | (Proceed to Checkout)                          |
                                v                                                |
                      +-------------------+                                      |
                      | 4. Auth Gateway   | (Skip if already logged in)          |
                      +-------------------+                                      |
                                | (Authenticated)                                |
                                v                                                |
                      +-------------------+                                      |
                      |  5. Checkout      | -------------------------------------+
                      +-------------------+
                                | (Submit Bank Transfer & Proof)
                                v
                      +-------------------+
                      | 6. Confirmation   |
                      +-------------------+
                                | (Direct Redirect)
                                v
                      +-------------------+
                      | 7. Tracking Page  | (Polls state changes & Rider Location)
                      +-------------------+
```

---

## 5. Customer Journey

The table below outlines the end-to-end cognitive, behavioral, and physical steps a customer takes while engaging with the Bibi Food platform:

| Phase | Touchpoint | User Action | System Process | Desired Emotional State |
| :--- | :--- | :--- | :--- | :--- |
| **1. Discover** | Mobile/Desktop Web | Arrives on landing page; views high-res food graphics, meal options, and dynamic countdown to kitchen closing. | Initializes state; runs geolocation check to confirm delivery coverage; displays regional menus. | Intrigued, hungry, confident in coverage. |
| **2. Select** | Menu Page | Filters by preference (e.g., Spicy, Vegan, Low Carb); views descriptions, allergens, and live availability count. | Updates menu state dynamically; disables out-of-stock items; calculates bundle discounts in real-time. | Empowered, satisfied with options. |
| **3. Cart & Prep**| Cart Slider/Page | Confirms items, increases quantities, chooses delivery type (Home/Office/Pickup), and inputs kitchen notes. | Calculates delivery fees, dynamic rider matching premiums, and estimated preparation/transit intervals. | Organized, in control. |
| **4. Auth** | OTP Modal | Inputs phone number or email; receives and inputs 6-digit OTP code. | Authenticates or registers account silently in the background; restores saved delivery addresses. | Secure, friction-free. |
| **5. Checkout** | Checkout View | Selects a saved address or drops a map pin; copies Bibi Food’s bank details; uploads transfer receipt screenshot. | Holds items in temporary inventory; registers pending transaction; flags transaction on the admin dashboard. | Anticipant, reassured of payment safety. |
| **6. Track** | Order Tracking | Observes status changes: `Pending Verification` $\rightarrow$ `Preparing` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered`. | Updates Order State Engine; tracks dispatch and logs rider progress; pushes real-time WebSocket signals. | Excited, informed, relaxed. |
| **7. Devour** | Physical Doorstep | Receives premium thermal package; inputs delivery confirmation pin; rates the meal and delivery on the portal. | Completes order in DB; archives transaction; updates rider payout ledger; indexes customer rating metrics. | Extremely satisfied, loyal. |

---

## 6. Rider Journey

The delivery workflow is optimized for mobile-web efficiency, emphasizing quick actions and hands-free readability:

```
[1. Go Online]
  ├── Rider opens mobile view, logs in, and toggles status to "Online".
  └── System registers rider GPS coordinates and initializes active ping loop.
        │
        v
[2. Job Offer]
  ├── Order paid & prepared. Routing engine assigns order to the nearest available rider.
  └── Rider's screen vibrates with an overlay: Pickup Distance, Dropoff Distance, and Earnings.
  └── Action: Rider clicks "Accept Job" within 45 seconds (otherwise auto-reassigns).
        │
        v
[3. Kitchen Pickup]
  ├── GPS routes rider to Bibi Food Central Kitchen.
  ├── Rider arrives, clicks "Arrived at Kitchen", and presents the Order ID to dispatch.
  ├── Kitchen hand hands over thermal bag. Rider checks order tags.
  └── Rider clicks "Confirm Items & Dispatch".
        │
        v
[4. Transit Navigation]
  ├── System displays optimized routing map and customer's delivery notes.
  ├── Transit triggers real-time tracking updates for the waiting customer.
  └── System pings customer via automated SMS: "Your Rider is 5 mins away."
        │
        v
[5. Successful Delivery]
  ├── Rider arrives at dropoff location.
  ├── Rider hands over the premium thermal-packed meal.
  ├── Rider requests the 4-digit confirmation pin from the customer.
  └── Rider inputs the pin, hits "Complete Run," and immediately receives earnings update.
```

---

## 7. Admin Journey

The operational workflow for administrators is designed to maintain high throughput and minimize human error:

```
[1. Command Center Login]
  ├── Admin logs in with multi-factor authentication.
  └── Main screen loads with live counts: Pending Payments, Active Prep, Out for Delivery, Active Riders.
        │
        v
[2. Payment Reconciliation]
  ├── Admin opens "Pending Approvals" tab.
  ├── Side-by-side view: Customer-uploaded transfer proof (image) vs. Bank API ledger/manual statement check.
  ├── Match Confirmed: Admin clicks "Approve Order".
  └── System triggers automated SMS/push notification to customer and initiates kitchen ticket printing.
        │
        v
[3. Kitchen Throughput & Dispatch]
  ├── Order appears in the kitchen display queue.
  ├── Kitchen staff prepares, packs, and tags the order.
  ├── Staff marks "Ready for Dispatch".
  └── System's dispatch router immediately matches and notifies the best active rider.
        │
        v
[4. Performance & Inventory Auditing]
  ├── Admin monitors live analytics: Average Prep Time, Average Delivery Time, Active Heat Map.
  ├── Admin updates inventory: Toggles stock levels for specific meals to prevent over-selling.
  └── Admin exports financial reports, daily reconciliation sheets, and rider payouts spreadsheet.
```

---

## 8. Functional Requirements

### 8.1 Customer Features
*   **No-Password Authentication (OTP):** Secure phone-number or email verification without requiring customers to manage password credentials.
*   **Dynamic Interactive Menu:** Browse categories, toggle dietary restrictions, view meal cards showing dynamic inventories, and open detailed nutrition drawers.
*   **Advanced Address Engine:** Saved address profiles with distinct icons (Home, Work, Other), combined with Google Maps integration to allow precise map pin drops.
*   **Special Instructions Interface:** Fields for specific dietary preparation notes and rider delivery instructions ("Leave at front desk", "Don't ring bell").
*   **Bank Transfer Checkout Portal:** Seamless checkout displaying dynamic bank account details, quick "Copy Account Number" clipboard controls, and an interactive file uploader for uploading screenshots of payment proofs.
*   **Real-time Progress Tracker:** Animated tracking screen that keeps the user updated on the exact step of their order (Verification $\rightarrow$ Preparation $\rightarrow$ Courier Assigned $\rightarrow$ Arrived).
*   **Review and Rating Portal:** Post-delivery modal allowing customers to leave 1-to-5 star ratings and written reviews for both the meal quality and rider performance.

### 8.2 Rider Features
*   **Dedicated Mobile Console:** A responsive layout designed for one-handed operation on mobile devices.
*   **Active/Inactive Toggle:** A switch that registers the rider as available or unavailable for the system's dispatch algorithm.
*   **Interactive Delivery Cards:** Clean cards displaying order IDs, pickup addresses, dropoff instructions, and calculated delivery payouts.
*   **Real-time GPS Tracking:** Background coordinate reporting to ensure customers can see their delivery courier's location in real-time.
*   **Secure Pin Verification:** A system that requires the rider to collect a unique 4-digit pin from the customer upon delivery to mark the run as completed, preventing fraud.

### 8.3 Admin & Operational Features
*   **Live Operations Console:** A unified control panel showing real-time metrics, active orders, and kitchen preparation stages.
*   **One-Click Payment Reconciler:** A side-by-side interface displaying the user's uploaded payment proof and order information, allowing admins to approve orders and trigger kitchen ticket printing in a single click.
*   **Menu & Inventory Manager:** A standard CRUD interface to manage categories, items, pricing, images, nutritional tags, and live inventory levels.
*   **Rider Operations Center:** A dashboard to monitor rider locations, manage payouts, review performance ratings, and override dispatch assignments if necessary.
*   **Dynamic Coupon & Discount Engine:** A tool to create and manage percentage or flat-rate discount codes, set expiration dates, define minimum order limits, and restrict code usage per customer.

---

## 9. Non-Functional Requirements

### 9.1 Performance
*   **Initial Page Load:** Under 1.5 seconds on a standard 3G/4G connection (optimized assets, code splitting, lazy loading).
*   **API Response Time:** All database-backed endpoints must return data in less than 200ms.
*   **Real-Time Sync:** Real-time order tracking updates must be pushed with a maximum latency of 1 second via WebSockets or high-performance Server-Sent Events (SSE).

### 9.2 Security
*   **Data in Transit:** Enforced TLS 1.3 encryption across all communication routes.
*   **Data at Rest:** Database storage encrypted with AES-256.
*   **Secure API Architecture:** State-managed server-side API routes to prevent the exposure of secrets, API keys, or database credentials to client browsers.

### 9.3 Scalability
*   **Decoupled Architecture:** Separated React client-side SPA from the Express backend, allowing independent scaling of the API and asset delivery networks.
*   **Database Scalability:** Database schema designed to utilize indexes on query-intensive fields like `user_id`, `order_status`, and `rider_id` to handle rapid transaction spikes.

### 9.4 Reliability
*   **High Availability:** Target 99.9% uptime for the application services.
*   **Graceful Degradation:** If the live tracking system fails, the application should automatically fall back to standard, low-overhead HTTP polling.

### 9.5 Accessibility
*   **Compliance:** Adherence to WCAG 2.1 AA standards.
*   **Visual Design:** Ensure a minimum color contrast ratio of 4.5:1 for all text.
*   **Usability:** Design interactive elements with a minimum touch target size of 44px x 44px on mobile views.

### 9.6 SEO (Search Engine Optimization)
*   **Metadata Integration:** Clean, semantic HTML tags, pre-configured open-graph tags for social media sharing, and structural JSON-LD schema describing the business and meals.

### 9.7 Maintainability
*   **Linting & Quality Control:** Strictly configured TypeScript parameters paired with automated lint checks to prevent code regression.
*   **Clean Architecture:** Strict separation of data-access, business logic, and UI rendering layers.

---

## 10. Database Planning

### 10.1 High-Level Entity Relationship Diagram (ERD) Schema

```
 +------------------+           +------------------+          +------------------+
 |    Customers     | 1       * |    Addresses     |          |    Categories    |
 | ---------------- |-----------| ---------------- |          | ---------------- |
 | - customer_id    |           | - address_id     |          | - category_id    |
 | - phone          |           | - customer_id    |          | - name           |
 | - email          |           | - street_address |          | - description    |
 | - full_name      |           | - latitude       |          +------------------+
 +------------------+           | - longitude      |                    | 1
          | 1                   +------------------+                    |
          |                                                             | *
          | *                                                           v
 +------------------+           +------------------+          +------------------+
 |      Orders      | *       1 |     Payments     |          |      Meals       |
 | ---------------- |-----------| ---------------- |          | ---------------- |
 | - order_id       |           | - payment_id     |          | - meal_id        |
 | - customer_id    |           | - order_id       |          | - category_id    |
 | - status         |           | - method (Bank)  |          | - name           |
 | - total_amount   |           | - proof_url      |          | - price          |
 | - address_id     |           | - status         |          | - stock_count    |
 | - rider_id       |           +------------------+          +------------------+
 +------------------+                                                   | 1
   | 1        | 1                                                       |
   |          +--------------------------+                              |
   | *                                   | *                            | *
 +------------------+           +------------------+                    |
 |   Order_Items    | *       * |     Reviews      | <------------------+
 | ---------------- |-----------| ---------------- |
 | - item_id        |           | - review_id      |
 | - order_id       |           | - customer_id    |
 | - meal_id        |           | - order_id       |
 | - quantity       |           | - meal_rating    |
 | - unit_price     |           | - rider_rating   |
 +------------------+           +------------------+
```

### 10.2 Entity Definitions & Relationships

1.  **Customers:** Holds primary identity information (phone, email, names, role indicators).
    *   *Relationship:* One-to-Many with `Addresses`, One-to-Many with `Orders`, One-to-Many with `Reviews`.
2.  **Addresses:** Holds geolocation details, delivery notes, and primary flags.
    *   *Relationship:* Many-to-One with `Customers`.
3.  **Meals:** Contains product configurations (name, description, pricing, thermal packaging specs, stock level, preparation time, and allergen details).
    *   *Relationship:* Many-to-One with `Categories`, One-to-Many with `Order_Items`.
4.  **Categories:** Logical groupings (e.g., Breakfast, Salads, Local Delights, Gourmet Drinks).
    *   *Relationship:* One-to-Many with `Meals`.
5.  **Orders:** The core transactional entity containing the current status (`pending_payment`, `preparing`, `in_transit`, `delivered`, `canceled`), payment reference pointers, and calculated delivery fees.
    *   *Relationship:* Many-to-One with `Customers`, Many-to-One with `Addresses`, Many-to-One with `Riders`, One-to-Many with `Order_Items`, One-to-One with `Payments`.
6.  **Order_Items:** A junction table recording specific quantities and historical purchase prices of meals in an order.
    *   *Relationship:* Many-to-One with `Orders`, Many-to-One with `Meals`.
7.  **Payments:** Tracks transaction validations, bank reference numbers, and uploaded screenshot assets.
    *   *Relationship:* One-to-One with `Orders`.
8.  **Riders:** Stores courier details, vehicle category, active geolocation, status, and earnings ledger.
    *   *Relationship:* One-to-Many with `Orders`.
9.  **Reviews:** Captures post-order consumer sentiment ratings (1-5 scales) and commentary.
    *   *Relationship:* Many-to-One with `Customers`, Many-to-One with `Orders`.
10. **Coupons:** Stores promotional codes, rules (e.g., minimum cart value), active dates, and limits.
    *   *Relationship:* Many-to-Many with `Orders` (via tracking tables).

---

## 11. Security Planning

### 11.1 Authentication & Registration
*   **OTP-First Access:** The system completely avoids standard, insecure passwords. Users input their email or phone number and receive a secure, short-lived 6-digit OTP code to authenticate.
*   **JSON Web Tokens (JWT):** Once validated, the server issues a signed, secure, HTTP-only cookie containing a JWT, protecting the session from XSS and CSRF attacks.

### 11.2 Role-Based Access Control (RBAC)
The system enforces strict access policies at the API gateway level:

```
                  +--------------------------------+
                  |       Incoming API Request     |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |  Token Verification Middleware |
                  +--------------------------------+
                                  |
               +------------------+------------------+
               |                  |                  |
               v                  v                  v
     [Role: CUSTOMER]       [Role: RIDER]       [Role: ADMIN]
     - Read/Write Own Profile   - Update Active Location - Full Access (CRUD)
     - Create Orders & Review   - Claim Delivery Jobs    - Manual Dispatch
     - Cancel Own Unpaid Orders - Confirm Deliveries     - Approve Bank Receipts
```

### 11.3 Data Protection
*   **In-Transit:** Every API endpoint, static asset request, and background tracking update runs strictly over HTTPS with mandatory HSTS headers.
*   **At-Rest:** Encryption of critical fields (e.g., customer phone numbers, delivery instructions, and payment receipts) using authenticated AES-256 encryption within the data storage layers.

### 11.4 Payment Security (Bank Transfer Verification)
*   **Sandboxed Storage:** Uploaded screenshots of bank transfers are stored in secure, private directories with randomized, non-sequential filenames.
*   **Access Control:** Pointers to payment screenshots are only accessible to verified administrators and the respective customer, protected behind JWT validation.

### 11.5 Audit Logging
*   All high-privilege operations (e.g., marking payments as approved, updating meal pricing, deleting categories, modifying rider details, and initiating payouts) are recorded in an immutable, append-only system database table tracking:
    *   `timestamp`
    *   `admin_user_id`
    *   `action_type`
    *   `target_entity_id`
    *   `original_state`
    *   `new_state`

---

## 12. Technical Architecture

A highly modular and decoupled architecture is recommended to support robust performance and ensure readiness for future native mobile app integrations:

```
 +-----------------------------------------------------------------------------------------+
 |                                    FRONTEND LAYER                                       |
 |                                                                                         |
 |  +--------------------------------+  +-------------------------------+                  |
 |  |  Customer Portal               |  |  Rider Portal                 |                  |
 |  |  - React 19 / Vite / Tailwind  |  |  - React 19 / Mobile-first    |                  |
 |  |  - Motion (Fluid animations)   |  |  - Direct GPS Reporting Engine|                  |
 |  +--------------------------------+  +-------------------------------+                  |
 |                                  \    /                                                 |
 |                                   v  v                                                  |
 |                        +------------------------+                                       |
 |                        |   Admin Console UI     |                                       |
 |                        |   - React 19 / Tailwind|                                       |
 |                        +------------------------+                                       |
 +-------------------------------------+---------------------------------------------------+
                                       |
                                       | (REST APIs / WebSocket Events)
                                       v
 +-----------------------------------------------------------------------------------------+
 |                                    BACKEND SERVICES                                     |
 |                                                                                         |
 |   +---------------------------------------------------------------------------------+   |
 |   |   Express Application Server (Node.js & TypeScript)                            |   |
 |   |                                                                                 |   |
 |   |   ├── API Gateway & Auth Guard (OTP Verification & Token Validation)             |   |
 |   |   ├── Menu & Inventory Engine (In-Stock/Out-of-Stock Logic)                     |   |
 |   |   ├── Order Processing Service (Appends, Updates, Status State-machine)         |   |
 |   |   ├── Routing & Dispatch Manager (Rider Coordinate Proximity Calculator)        |   |
 |   |   └── Real-time WebSocket Manager (Coordinates active map synchronization)      |   |
 |   +---------------------------------------------------------------------------------+   |
 +-------------------------------------+---------------------------------------------------+
                                       |
                                       +-------------------+
                                       |                   |
                                       v                   v
 +-----------------------------------------+   +-------------------------------------------+
 |             DATA STORAGE                |   |              EXTERNAL SERVICES            |
 |                                         |   |                                           |
 |   +---------------------------------+   |   |   +-----------------------------------+   |
 |   |  Relational Database            |   |   |   |  Google Maps Platform             |   |
 |   |  - Cloud SQL / PostgreSQL       |   |   |   |  - Autocomplete & Distance Matrix |   |
 |   |  - Managed schemas & migrations |   |   |   +-----------------------------------+   |
 |   +---------------------------------+   |   |   +-----------------------------------+   |
 |   +---------------------------------+   |   |   |  SMS / Email Gateway              |   |
 |   |  Secure Binary Storage          |   |   |   |  - Secure verification OTP sends  |   |
 |   |  - Receipt Proof Storage        |   |   |   +-----------------------------------+   |
 |   +---------------------------------+   |   +-------------------------------------------+
 +-----------------------------------------+
```

### 12.1 Technology Stack Rationales

1.  **Frontend: React 19 + TypeScript + Vite + Tailwind CSS**
    *   *Why:* Vite offers near-instant development builds and compile-time optimization. Tailwind CSS ensures clean, modular styling with zero stylesheet bloat. React 19 supports robust hook states and server rendering capabilities, while TypeScript guarantees complete static type-safety across the front-end layout.
2.  **Animations: Motion (`motion/react`)**
    *   *Why:* Deliver native-app grade, smooth layout animations, staggered menu entries, and gesture-driven transition states that elevate the branding and professional feel of the interface.
3.  **Icons: Lucide React**
    *   *Why:* A comprehensive, ultra-clean vector icon pack that provides high visual quality and keeps bundle sizes minimal.
4.  **Backend: Express (TypeScript + Node.js)**
    *   *Why:* Highly performant, widely supported, lightweight, and easily integrated with WebSocket servers.
5.  **Database: Cloud SQL / PostgreSQL (with Drizzle ORM)**
    *   *Why:* Highly scalable relational architecture capable of managing complex transactions with strict constraints and structured relational joins.
6.  **Real-Time Data: Socket.io / WebSockets**
    *   *Why:* Delivers bidirectional, low-latency communication channels necessary for updating orders and coordinating live rider location tracking on maps.

---

## 13. Design System

To establish Bibi Food as a highly polished, modern, premium food-tech startup, the design system utilizes an elegant, high-contrast palette combined with spacious typography and subtle animations.

### 13.1 Brand Color Palette

```
  Primary / Brand Action:
  █ Deep Olive Charcoal   [#1C2A22]  - Reflects premium organic culinary quality.
  █ Golden Saffron        [#F2A93B]  - Warm, energetic accent representing gourmet cooking and appetite.

  Supporting Canvas Tones:
  █ Soft Alabaster Cream  [#FAF8F5]  - Primary page canvas color. Minimalist, premium, and clean.
  █ Warm Pure White       [#FFFFFF]  - Background for active cards, details drawers, and input panels.
  █ Slate Muted Gray      [#64748B]  - Used for secondary labels, descriptions, and metadata.

  Feedback Status Colors:
  █ Sage Success Green    [#2E7D32]  - Order Confirmed, Payment Validated, Delivered.
  █ Ochre Amber Warning   [#EF6C00]  - Pending Payment Review, Kitchen Preparing.
  █ Crimson Error Red     [#C62828]  - Order Canceled, Transaction Declined, Server Error.
```

### 13.2 Typography & Hierarchy
*   **Display / Headings (Hero, Titles):** `Space Grotesk` or `Outfit` (sans-serif)
    *   *Usage:* Bold, confident, modern tech-forward appearance.
*   **Body Copy (Descriptions, Lists):** `Inter` (sans-serif)
    *   *Usage:* Highly legible, clean, and professional.
*   **Metadata, Prices, & Status:** `JetBrains Mono` (monospace)
    *   *Usage:* Reflects operational precision, clear pricing, and technical alignment.

```css
/* Tailwind Font Variables */
@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### 13.3 Spacing Scale
The spacing system uses a strict 8px grid to ensure visual balance and clean hierarchy:
*   `xs` (4px): Inner-element padding (text-to-icon distance).
*   `sm` (8px): Button labels, small text groupings, badge elements.
*   `md` (16px): Input fields, meal card inner padding, standard gaps.
*   `lg` (24px): Card margins, sectional grid gaps, mobile page side offsets.
*   `xl` (32px / 48px): Hero section offsets, footer boundaries, wide page spacing.

### 13.4 Component Design Standards
*   **Primary Action Button:** Full background Primary Green (`#1C2A22`), text in Alabaster Cream (`#FAF8F5`), heavy font-weight, subtle letter-tracking, and a soft hover transition (`scale-98` with a deep inset shadow).
*   **Interactive Cards:** Rounded, borderless cards utilizing a flat background of Warm Pure White (`#FFFFFF`) with a very fine border (`1px solid rgba(28, 42, 34, 0.05)`).
*   **Border Radius:** Standard elements (buttons, inputs) utilize a highly polished, modern `rounded-2xl` (16px) curvature. Food and layout cards utilize `rounded-3xl` (24px) curves for a soft, premium aesthetic.
*   **Shadows:** Soft, ambient shadows mimicking real-world depth rather than harsh, dark edges:
    *   `shadow-sm`: `0 2px 8px -1px rgba(28, 42, 34, 0.03)`
    *   `shadow-md`: `0 8px 24px -4px rgba(28, 42, 34, 0.06)`
    *   `shadow-lg`: `0 16px 48px -8px rgba(28, 42, 34, 0.08)`

---

## 14. Success Metrics (KPIs)

To evaluate the operational health and customer satisfaction of Bibi Food, five core Key Performance Indicators (KPIs) will be continuously tracked:

```
                  +-----------------------------------------+
                  |       BIBI FOOD KPI ENGINE              |
                  +-----------------------------------------+
                                       |
        +------------------+-----------+-----------+------------------+
        |                  |                       |                  |
        v                  v                       v                  v
  [1. Completion Rate] [2. Transit Time]     [3. CSAT Index]   [4. Repeat Order %]
  - Target: >= 98.5%   - Target: <= 35m      - Target: >= 4.75  - Target: >= 60%
  - Goal: Minimize     - Goal: Maximize      - Goal: Premium    - Goal: Sustainable
    cancelations.        courier efficiency.   quality control.   customer LTV.
```

### 14.1 Key Performance Indicator Framework

| Metric Name | Calculation Method | Target Performance Level | Operational Priority |
| :--- | :--- | :--- | :--- |
| **1. Order Completion Rate** | $\left( \frac{\text{Successfully Delivered Orders}}{\text{Total Placed Orders}} \right) \times 100$ | **$\ge$ 98.5%** | Track kitchen throughput, reduce delivery cancellations, and prevent meal inventory errors. |
| **2. Average Delivery Time** | $\sum \frac{\text{Order Handover Time} - \text{Order Placement Time}}{\text{Total Orders}}$ | **$\le$ 35 Minutes** | Maximize dispatch routing efficiency, optimize central kitchen pacing, and maintain optimal rider volumes. |
| **3. Customer Satisfaction (CSAT)** | $\frac{\sum \text{Customer Meal \& Rider Ratings}}{\text{Total Customer Ratings}}$ | **$\ge$ 4.75 / 5.0** | Maintain high culinary execution quality, ensure excellent packaging standards, and audit courier delivery behaviors. |
| **4. Repeat Customers (LTV)** | $\left( \frac{\text{Active Customers with } > 2 \text{ Purchases in 30 Days}}{\text{Total Active Customers}} \right) \times 100$ | **$\ge$ 60%** | Optimize retention campaigns, launch dynamic discount programs, and deliver excellent service quality. |
| **5. Daily Revenue Growth** | $\left( \frac{\text{Daily Revenue}_{T} - \text{Daily Revenue}_{T-1}}{\text{Daily Revenue}_{T-1}} \right) \times 100$ | **Steady MoM growth ($\ge$ 15%)** | Ensure optimal operational scaling, scale delivery coverage, and coordinate targeted marketing campaigns. |

---

## 15. Execution & Next Steps

This blueprint establishes a solid, high-fidelity foundation for the development of Bibi Food. With the visual guidelines, database schemas, security flows, and architecture maps finalized, subsequent phases can proceed to implement individual services cleanly and efficiently.
