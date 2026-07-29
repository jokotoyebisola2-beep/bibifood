# BIBI FOOD — HIGH-FIDELITY UI/UX DESIGN SPECIFICATIONS
**Document Version:** 1.0.0  
**Phase:** 2.5 — Interface Layouts, Interaction Specs & Flow Wireframes  
**Status:** Approved for Implementation  
**Audience:** Product Designers, UI/UX Engineers, Frontend Web Developers  

---

## 1. Design Rationale & Global Layout Rules

### 1.1 The Golden Ratio & Spatial Grid
All Bibi Food screen designs are built around a strict **8px structural grid** (using margins/padding increments of 4px, 8px, 12px, 16px, 24px, 32px, 48px, and 64px) to ensure visual consistency and balance:
*   **The Desktop Canvas:** Locked to a maximum of `1280px` (`w-full max-w-7xl mx-auto`), keeping the content organized on wide displays.
*   **The Tablet Canvas:** Uses a fluid `100%` width with `24px` side padding, maintaining visual balance on mid-sized screens.
*   **The Mobile Canvas:** Employs a single-column layout with `16px` side padding and touch targets of `48px` or greater to ensure easy tap interactions.

### 1.2 Layout Hierarchy & Layering Depth
We define four distinct vertical layers to organize our screens:
1.  **Base Layer (Level 0):** The `Soft Alabaster Cream` background canvas (`#FAF8F5`).
2.  **Surface Layer (Level 1):** Floating layout cards and input modules using `Warm Pure White` (`#FFFFFF`) with a subtle `shadow-sm`.
3.  **Elevation Layer (Level 2):** Modals, interactive dropdowns, and fly-out drawers using `#FFFFFF` with a rich `shadow-lg` and an overlay backdrop of `rgba(28, 42, 34, 0.4)`.
4.  **Notification Layer (Level 3):** Fixed toast alerts, status banners, and floating active carts positioned above all other elements.

---

## 2. Public Website Screen Specs

### 2.1 The Dynamic Landing Page & Homepage

```
+-----------------------------------------------------------------------------------+
|  [B-Wing Logo]   Menu   About   FAQ                  [ Cart (0) ]  [ Log In/OTP ] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|     Gourmet Meals Prepared with Precision,                                        |
|     Delivered Straight to Your Door.                                              |
|                                                                                   |
|     [ Enter Delivery Address / Geolocation ]   ==>   [ Check Delivery Area ]      |
|                                                                                   |
|     Kitchen Status: [ ● OPENING ]  -  Guaranteed Delivery in under 35 Mins.       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  [ Active Promos Grid ]        [ Live Top Sellers ]        [ Interactive Reviews ]|
+-----------------------------------------------------------------------------------+
```

*   **Purpose:** Capture user intent, run immediate coverage checks, display culinary authority, and route users directly to the interactive menu.
*   **Desktop Layout:**
    *   **Hero Section:** A split layout featuring bold headings on the left and a high-resolution, steaming meal photograph on the right.
    *   **Interactive Address Bar:** Centered call-to-action input field with a locator button (`MapPin` icon) and a primary action button.
    *   **Real-time Kitchen Status Tracker:** A floating indicator bar showing the kitchen's current capacity and opening hours (`7:00 AM – 10:00 PM`).
*   **Mobile Adaptations:** Converts the split layout into a single, stacked column. The address bar stays pinned above the fold to keep the focus on checking delivery coverage.
*   **Component States:**
    *   *Loading (Address Verification):* The address field is disabled, and the button changes to a rotating loader indicator.
    *   *Coverage Failed:* A soft toast banner appears (`bg-rose-50 text-rose-800 border-rose-200`) offering to notify the user via SMS when service becomes available in their area.

### 2.2 Corporate About Page
*   **Purpose:** Explain Bibi Food's unique single-brand operational model and showcase our culinary hygiene standards.
*   **Layout:** A premium, single-column editorial layout with large headings and custom-aligned photos of our central kitchen.
*   **Key Components:**
    *   *The Value Chain Timeline:* An interactive section tracing our complete process: ingredient sourcing $\rightarrow$ precision cooking $\rightarrow$ temperature-controlled packaging $\rightarrow$ proprietary rider delivery.

### 2.3 Interactive FAQ Page
*   **Purpose:** Address user questions regarding payment methods, coverage areas, food allergies, and deliveries.
*   **Layout:** Centered search bar paired with dynamic, interactive question categories.
*   **Components:** Accordion lists styled with simple hover transitions (`hover:bg-slate-50`).

### 2.4 Customer Support & Contact Portal
*   **Purpose:** Provide direct access to customer care for quick issue resolution.
*   **Layout:** Split layout featuring a contact form on the left and direct support details on the right.
*   **Forms:** Complete input fields with real-time verification indicators.

### 2.5 Careers Portal
*   **Purpose:** Attract culinary talent and professional dispatch riders.
*   **Layout:** Job search filters paired with an easy job application uploader.

### 2.6 Legal Policies (Privacy, Terms, Refunds)
*   **Purpose:** Deliver clear, readable, and legally compliant terms of service.
*   **Layout:** A single-column editorial layout using premium typography to ensure high readability.

---

## 3. Food Ordering & Checkout Flows

### 3.1 The Interactive Menu Grid

```
+-----------------------------------------------------------------------------------+
|  [ Search Meals... ]   [ All ]  [ Vegan ]  [ High-Protein ]  [ Spicy ]  [ Sort ]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +------------------------+  +------------------------+  +------------------------+  |
|  | [ Meal Image Window ]  |  | [ Meal Image Window ]  |  | [ Meal Image Window ]  |  |
|  |                        |  |                        |  |                        |  |
|  | Classic Saffron Rice   |  | Charcoal-Grilled Steak |  | Lemon Herb Chicken     |  |
|  | N3,500    [ ADD + ]    |  | N6,500    [ ADD + ]    |  | N4,200    [ ADD + ]    |  |
|  +------------------------+  +------------------------+  +------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

*   **Purpose:** Display current meal options, allow easy filtering, and provide quick add-to-cart actions.
*   **Layout:**
    *   **Filter Bar:** Pinned horizontal scrolling bar containing rounded filter buttons.
    *   **Meal Grid:** Responsive grid adjusting from 1 column on mobile to 3 columns on tablet and 4 columns on desktop.
*   **Visual Indicators:**
    *   *Low Stock Alert:* A small monospace badge (`JetBrains Mono`, `text-amber-600`) appears when an item's stock drops below 10 units.
    *   *Out of Stock:* The card is styled with a soft desaturated overlay, the price is muted, and the add button is replaced with an "Out of Stock" indicator.

### 3.2 Food Details Modal Drawer
*   **Purpose:** Display complete meal details, nutritional information, allergens, and preparation customizer options.
*   **Layout:** A slide-up bottom drawer on mobile and a centered modal on desktop views.
*   **Components:**
    *   *Dynamic Ingredient Toggles:* Interactive selectors for adding or removing ingredients.
    *   *Nutritional Chart:* A clean table showing calorie counts and macronutrient breakdowns.

### 3.3 Shopping Cart Sidebar Drawer
*   **Purpose:** Review selected meals, adjust item quantities, and select the preferred delivery method.
*   **Layout:** A slide-out panel on the right side of the screen over an semi-transparent backdrop.
*   **Interactive Components:**
    *   *Quantity Selector:* A premium three-state control (`[-] [Qty] [+]`). Clicking the minus button when quantity is 1 triggers a delete transition.

### 3.4 Bank Transfer Checkout Portal
*   **Purpose:** Enter delivery addresses, review final pricing, display payment details, and accept screenshots of bank transfer receipts.
*   **Layout:** Split layout:
    *   *Left Side (Billing & Logistics):* Address selector card, special delivery notes field, and the secure bank transfer information box.
    *   *Right Side (Order Breakdown):* Detailed order totals, coupon input field, and the upload zone for the transfer receipt screenshot.
*   **Visual Components:**
    *   *Interactive Screenshot Uploader:* A drag-and-drop file uploader with a progress bar and file upload success states.

### 3.5 Real-Time Order Progress & Live Tracking Map

```
+-----------------------------------------------------------------------------------+
|  ORDER STATUS: OUT FOR DELIVERY                                                   |
|  ETA: 12 MINUTES  |  Rider: Babajide O.                                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                             [ LIVE MAP INTERFACE ]                                |
|                                                                                   |
|           ( Central Kitchen ) ==========> [ Rider Icon ] ========> ( Your Home )   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  [X] Order Confirmed      [X] Meal Prepared      [X] Out for Delivery    [ ] Arrived|
+-----------------------------------------------------------------------------------+
```

*   **Purpose:** Provide clear, real-time updates on active deliveries and map coordinates.
*   **Layout:**
    *   **Upper Section:** Interactive map view showing the path between the kitchen, the rider, and the delivery address.
    *   **Lower Section:** A clean status tracking bar displaying active, completed, and pending steps.
*   **Interactive Features:**
    *   *Rider Contact Button:* A quick button to call or message the assigned delivery courier.
    *   *Pin Code Badge:* A secure 4-digit code displayed in bold monospace text (`JetBrains Mono`, `tracking-widest`, `text-lg`) for the customer to present to the rider upon delivery.

---

## 4. Customer Account Panel Specs

### 4.1 OTP Authentication Gateway
*   **Purpose:** Secure, passwordless login using phone-number or email verification.
*   **Layout:** Clean, centered modal with a 6-digit verification code input.
*   **Interaction State:** The input automatically advances focus to the next box as digits are entered.

### 4.2 Customer Activity Dashboard
*   **Purpose:** View active orders, access past delivery history, manage saved addresses, and update account settings.
*   **Layout:** Responsive sidebar navigation on desktop, converting to a clean bottom navigation bar on mobile.
*   **Interactive Sections:**
    *   *Quick Reorder:* A carousel of previously ordered meals, allowing users to re-add entire past orders to their cart in a single click.

---

## 5. Operations & Admin Management Console

### 5.1 Main Admin Overview Dashboard

```
+-----------------------------------------------------------------------------------+
|  [ADMIN] BIBI FOOD                                     [ Notifications ] [ Avatar] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  REVENUE (TODAY)         ACTIVE KITCHEN RUNS     DELIVERY ETA (AVG)   RIDERS LIVE |
|  N184,500 [ +12% ]       28 Active Orders        29.4 Mins            14 Online   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  [ Live Order Stream ]                            [ Bank Transfer Verifications ] |
|  #1042 - N4,500 - Preparing [Assign Rider]        #1041 - N8,200   [Approve] [Reject] |
|  #1043 - N3,800 - Pending   [Approve Payment]     #1040 - N12,500  [Approve] [Reject] |
+-----------------------------------------------------------------------------------+
```

*   **Purpose:** Provide administrators with real-time operational metrics, financial data, and order management tools.
*   **Layout:**
    *   **Top Bar:** High-level metrics showing revenue, active orders, average delivery time, and online riders.
    *   **Left Column (Orders Queue):** Real-time list of incoming orders.
    *   **Right Column (Payment Review):** Side-by-side comparison of bank transfer screenshots and corresponding order details.

### 5.2 Real-time Operations & Active Dispatch Map
*   **Purpose:** Monitor rider locations and manually coordinate dispatch tasks.
*   **Layout:** Full-screen interactive map showing delivery coverage areas, kitchen hubs, and live rider locations.

### 5.3 Meal Creator & Inventory Console
*   **Purpose:** Add, edit, and update meals, categories, and live ingredient levels.
*   **Layout:** Data table featuring bulk actions and item edit drawers.

### 5.4 Coupons & Discounts Dashboard
*   **Purpose:** Create and manage promotional discount codes.
*   **Layout:** Coupon list showing active codes, discount values, expiration dates, and usage counters.

---

## 6. Rider Mobile Web Portal Specs

### 6.1 Available Jobs Board
*   **Purpose:** View and accept active delivery tasks.
*   **Layout:** High-contrast list containing simple, finger-friendly action buttons.
*   **Data Cards:** Display order IDs, calculated delivery fees, pickup addresses, and dropoff locations.

### 6.2 Active Navigation & Delivery Panel

```
+-----------------------------------------------------------------------------------+
|  ACTIVE RUN: #1042                                        [ Call Client ] [ SOS ] |
+-----------------------------------------------------------------------------------+
|  PICKUP: Bibi Food Central Kitchen                                                |
|  DROPOFF: 14 Broad Street, Marina, Lagos                                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                         [ COMPACT NAVIGATION INTERFACE ]                          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  CLIENT PIN: [ _ ] [ _ ] [ _ ] [ _ ]                    ==>   [ COMPLETE RUN ]    |
+-----------------------------------------------------------------------------------+
```

*   **Purpose:** Guide riders along active routes, facilitate communication with clients, and securely complete deliveries.
*   **Layout:** Simplified, high-contrast interface designed for outdoor readability.
*   **Key Controls:**
    *   *Big Action Button:* Large swipeable button to confirm order pick-ups.
    *   *PIN Verification Form:* A simple 4-digit input field to verify the customer's PIN and complete the run.

---

## 7. Component Interaction Specifications

To ensure a seamless user experience, interactive components follow strict motion and visual behavior guidelines:

| Component Type | Default Style | Hover State | Click/Tap Interaction | Focus-Visible State |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Buttons** | Soft Alabaster text on a Deep Olive Charcoal background. | Background shifts to `#131E18` with a subtle scale-down (`scale-98`). | Background shifts to `#0A100C` with a physical scale-down (`scale-95`). | A bold border (`outline-2px`) in Golden Saffron with a `2px` offset. |
| **Interactive Cards** | Warm Pure White background with a very fine border and soft shadows. | Shifts to a deeper shadow (`shadow-md`) and moves slightly upwards (`-translate-y-1`). | Returns to default height with a brief scale reduction (`scale-99`). | Adds a subtle border outline in Deep Olive Charcoal. |
| **Text Inputs** | Crisp border in slate-200 with soft placeholder text. | Border darkens to slate-400. | Border transitions to Deep Olive Charcoal with an active shadow glow. | Adds a clean, glowing outline in Golden Saffron. |
| **Dietary Pills** | Standard white background with slate-600 text. | Background shifts to slate-100 with a slight scale-up. | Background changes to Deep Olive Charcoal with text in soft cream. | Adds a fine, dotted outline in Deep Olive Charcoal. |

---

## 8. Micro-Interactions & Animation Guidelines

```
             DAMPENED SPRING TRANSITION FOR DRAWER ENTRANCES

        (Off-Screen)                         (Active Viewport)
         +----------+                         +------------------+
         |          | ======================> |                  | [Rest Point]
         +----------+   Velocity: 1.2 m/s     |  Content Drawer  | (Soft overshoot,
                        Elasticity: 0.8       |                  |  bounces back to
                                              +------------------+  100% size)
```

1.  **Add-to-Cart Feedback:** Adding an item triggers a brief pulse animation on the main navigation's cart badge (`scale-125` for 150ms before returning to scale-100), with a sliding notification toast appearing at the bottom of the screen.
2.  **Slide-Out Drawer Transitions:** Navigation sidebars and cart drawers enter using a natural ease-out cubic bezier curve (`cubic-bezier(0.16, 1, 0.3, 1)`) over `350ms`, providing a responsive and fluid feel.
3.  **Loading Skeleton Pulses:** Placeholder skeletons use a soft opacity pulse (`opacity-40` to `opacity-80` over `1.5s`) to keep users engaged while content is loading.

---

## 9. Accessibility & Inclusivity Standards

*   **Keyboard Navigation:** All interactive elements utilize logical tab indices and clear focus indicators to support keyboard-only users.
*   **Screen Reader Labels:** Form elements include descriptive labels, and vector icon graphics are paired with clear alternative text (`aria-label`) to ensure compatibility with screen readers.
*   **Contrast Compliance:** All text styles and colors meet or exceed WCAG 2.1 AA requirements, ensuring high readability across different screen conditions.
*   **Interactive Targets:** Interactive buttons, inputs, and selectors maintain a minimum touch target size of `44px x 44px` on mobile screens to prevent accidental taps.

---

## 10. Summary & Design Hand-off

This UI/UX Design Specification Manual establishes the complete visual guidelines and interaction principles for Bibi Food. By adhering to the specified grid structures, component styles, states, and responsive layouts, development can proceed with a clear roadmap for building a cohesive, premium, and professional user experience across all digital platforms.
