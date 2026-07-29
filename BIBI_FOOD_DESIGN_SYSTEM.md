# BIBI FOOD — BRAND IDENTITY & DESIGN SYSTEM MANUAL
**Document Version:** 1.0.0  
**Phase:** 2 — Visual Identity & Component Guidelines  
**Status:** Approved for Implementation  
**Audience:** Product Designers, Frontend Engineers, Brand Managers, Creative Leads  

---

## 1. Brand Strategy & Core Philosophy

### 1.1 Brand Positioning
Bibi Food occupies the intersection of **culinary mastery** and **hyper-efficient logistics**. We do not operate as an open bazaar or a marketplace of varied kitchens. Bibi Food is the sole curator, producer, and distributor of its meals. 

This single-point ownership of the culinary chain allows us to position our visual identity around the concept of **Operational Precision & Culinary Craft**. The brand is engineered to look less like a local diner and more like a high-growth tech startup—clean, structured, highly reliable, and visually delicious.

### 1.2 Core Brand Pillars
*   **The Golden Speed (Velocity):** Hungry users crave certainty. Our visual brand utilizes directionality, clean motion vectors, and crisp, bold UI states to convey momentum and rapid delivery.
*   **Thermal Integrity (Quality):** Food is delivered at its optimal eating temperature. Our design elements highlight warmth, culinary freshness, and tactile, high-grade materials.
*   **Frictionless Trust (Simplicity):** The process is straightforward and predictable. The UI utilizes clear grid structures, ample negative space, and large, comfortable interactive zones.
*   **Premium Hospitality (Modern Luxury):** Eating with Bibi Food is an elevated experience. Deep, organic charcoal colors are contrasted with high-vibrancy culinary accents.

### 1.3 Tone of Voice & Personality
*   **Confident, Not Cocky:** We speak with authoritative knowledge about nutrition, cooking, and delivery logistics, but we remain humble and service-oriented.
*   **Energetic, Not Exhausting:** Copy is punchy and direct. We value the user’s time and avoid unnecessarily flowery jargon.
*   **Culinary & Technical:** We treat food like a science and delivery like a mathematical equation. We describe ingredients with precise names (e.g., *"Hickory-Smoked Slow-Braised Angus"*, not just *"beef"*).

---

## 2. Logo Design Concept & Guidelines

The Bibi Food logo is built around simplicity, speed, and culinary delight. It is designed to be instantly recognizable, whether rendered as a tiny 16x16 pixel app icon, embroidered on a rider’s jacket, or printed on a large-format billboard.

```
                  THE BIBI "B-WING" ICON CONCEPT

                     * * * * * *
                   *             *
                 *    +-------+    *
                *     |  \ \  |     *   <-- Sleek Forward-Slanted "Wings"
               *      |  B B  |      *      representing speed and momentum.
               *      +-------+      *
                *                   *
                 *    /\     /\    *    <-- Subtle Fork/Knife Prongs or
                   *   \ \_/ /   *          Steam Waves integrated into
                     *   \_/   *            the negative space.
                       * * *
```

### 2.1 Logo Marks
1.  **The Master Brandmark:** The word "Bibi" in customized lowercase geometric letterforms paired with "Food" in modern, tracking-expanded sans-serif typography.
2.  **The App Icon (The "B-Wing"):** A single stylized uppercase "B" composed of two sleek, forward-slanted wings. The negative space inside the "B" forms clean steam waves or fork prongs, symbolizing fast delivery of hot meals.
3.  **The Monogram:** Used for favicon/avatar contexts where space is extremely limited. A clean, high-contrast interlocking double-B.

### 2.2 Clear Space & Sizing Rules
*   **Minimum Clear Space:** The logo must always be surrounded by an exclusion zone equal to the height of the letter "B" in the wordmark. No text, imagery, or border lines can enter this zone.
*   **Minimum Digital Size:**
    *   *Wordmark:* 120px wide (at 72 dpi) to protect text legibility.
    *   *App Icon:* 24px wide (at 72 dpi).
*   **Minimum Print Size:**
    *   *Wordmark:* 1.5 inches (38mm) wide.
    *   *App Icon:* 0.4 inches (10mm) wide.

### 2.3 Correct and Incorrect Usage
*   **Correct:** Rendering the primary logo in Deep Olive Charcoal on a Soft Alabaster background, or in Warm White on a Deep Olive Charcoal background.
*   **Incorrect (FORBIDDEN):**
    *   ❌ Distorting, stretching, or squeezing the proportions of the letterforms.
    *   ❌ Applying dropshadows, gradients, or heavy glows directly to the logo paths.
    *   ❌ Outlining the logo stroke instead of filling the shape.
    *   ❌ Placing the primary logo on busy, high-contrast meal photographs without a solid color container.

---

## 3. Color System & Swatch Specifications

Our colors are designed to promote appetite, convey operational speed, and project an elite, clean aesthetic. The system uses a high-contrast light theme as its primary format.

```
+--------------------------------------------------------------------------------+
|                             BIBI FOOD COLOR SPECS                              |
+--------------------------------------------------------------------------------+
|                                                                                |
|  █ PRIMARY: Deep Olive Charcoal   [#1C2A22]  - Organic base, prestige feel.    |
|  █ SECONDARY: Golden Saffron      [#F2A93B]  - Warmth, appetite, energy.       |
|  █ ACCENT: Electric Basil Green   [#32D74B]  - Speed, fresh delivery.          |
|                                                                                |
|  █ CANVAS: Soft Alabaster Cream   [#FAF8F5]  - Clean, soft, eye-safe background.|
|  █ SURFACE: Warm Pure White       [#FFFFFF]  - Content cards, input wrappers.  |
|  █ BORDER: Muted Slate Gray       [#E2E8F0]  - High-precision clean division.  |
|                                                                                |
|  █ SAGE SUCCESS                   [#2E7D32]  - Order complete / Verified.      |
|  █ OCHRE WARNING                  [#EF6C00]  - Preparing / Unpaid check.       |
|  █ CRIMSON ERROR                  [#C62828]  - Canceled / Insufficient funds.  |
+--------------------------------------------------------------------------------+
```

### 3.1 Color Role Allocation Matrix

| Color Name | Hex Code | Usage Scenario | Architectural Role |
| :--- | :--- | :--- | :--- |
| **Deep Olive Charcoal** | `#1C2A22` | Dominant text, navigation headers, primary buttons, branding boundaries. | Establishes prestige, anchor structure, and maximum contrast. |
| **Golden Saffron** | `#F2A93B` | Highlighting meal ratings, special promo cards, add-to-cart buttons, and important status indicators. | Drives visual attention, encourages appetite, and acts as the "hero" accent. |
| **Electric Basil Green** | `#32D74B` | Map route lines, "Rider is nearby" notifications, and active speed-oriented features. | Conveys speed, technology integration, and ecological freshness. |
| **Soft Alabaster Cream** | `#FAF8F5` | Default background canvas across all web and mobile-web screens. | Keeps the UI feeling soft, editorial, and clean. Far more premium than harsh `#FFF` or cool `#F1F5F9`. |
| **Warm Pure White** | `#FFFFFF` | Floating cards, detail dialogs, input fields, navigation sheets. | Creates layered depth, letting cards float naturally above the Alabaster canvas. |
| **Slate Gray (Dark)** | `#475569` | Body text, food descriptions, and secondary metadata labels. | Provides clean legibility with a softer contrast curve than pure black text. |

---

## 4. Typography Hierarchy & Guidelines

Bibi Food relies on a strong typographic system. It pairs a geometric, high-character display font for headings with a highly readable, clean sans-serif for body content, and a monospace font for functional and transactional metrics.

### 4.1 Font Families
*   **The Display Font: Space Grotesk**
    *   *Usage:* Heading levels H1 through H4, key call-to-actions, and main meal titles.
    *   *Why:* Its geometric, slightly mechanical curves reflect our tech-first approach, while maintaining a clean, open, and friendly appearance.
*   **The Sans-Serif Font: Inter**
    *   *Usage:* Body copy, input labels, ingredient listings, list items, and standard menus.
    *   *Why:* Engineered for screen legibility, maintaining an incredibly balanced x-height and clear character spacing across high-density layouts.
*   **The Monospace Font: JetBrains Mono**
    *   *Usage:* Prices, delivery ETA timers, coordinates, transaction IDs, and receipt tallies.
    *   *Why:* Convey mathematical precision, making financial figures, countdown timers, and data tables highly readable.

### 4.2 Type Scale (Desktop & Mobile-First)

```
[H1]  Space Grotesk - Bold (700)
      ├── Desktop: 3.5rem (56px)  | Line Height: 1.15 | Tracking: -0.02em
      └── Mobile:  2.25rem (36px) | Line Height: 1.2  | Tracking: -0.01em

[H2]  Space Grotesk - SemiBold (600)
      ├── Desktop: 2.25rem (36px) | Line Height: 1.2  | Tracking: -0.01em
      └── Mobile:  1.75rem (28px) | Line Height: 1.25 | Tracking: -0.01em

[H3]  Space Grotesk - Medium (500)
      ├── Desktop: 1.5rem (24px)  | Line Height: 1.3  | Tracking: 0em
      └── Mobile:  1.25rem (20px) | Line Height: 1.3  | Tracking: 0em

[Body Large] Inter - Regular (400) / Medium (500)
      ├── Desktop: 1.125rem (18px)| Line Height: 1.6  | Tracking: 0em
      └── Mobile:  1.0rem (16px)  | Line Height: 1.5  | Tracking: 0em

[Body Regular] Inter - Regular (400)
      ├── Desktop: 0.875rem (14px)| Line Height: 1.5  | Tracking: 0.01em
      └── Mobile:  0.875rem (14px)| Line Height: 1.5  | Tracking: 0.01em

[Code Metric] JetBrains Mono - Medium (500)
      ├── Desktop: 0.75rem (12px) | Line Height: 1.4  | Tracking: 0.02em
      └── Mobile:  0.75rem (12px) | Line Height: 1.4  | Tracking: 0.02em
```

---

## 5. Iconography Principles

Icons should support comprehension and navigation, never acting as distracting decorations. We use a single, unified iconography style across the entire Bibi Food ecosystem.

```
       ICON STYLE EXAMPLES (ROUNDED, MODERN, WEIGHT-MATCHED)

          [Cart Icon]             [Clock Icon]            [Card Icon]
           _   _   _                  ,-'""`-.               .---------.
          ( `_` `_` )               ,'  _     `.             | [ ] [ ] |
           \  _ _  /               /   (_)      \            |---------|
            \ \_/ /               |     |        |           |  #3901  |
             \___/                 \    `--'    /            `---------'
                                    `.        ,'
                                      `-.__.-'
```

### 5.1 Icon Design Specifications
*   **Library Source:** `lucide-react` (or standard SVG paths matching Lucide styling).
*   **Stroke Weight:** Fixed at `2px` for normal interfaces, and `1.5px` for compact, dense mobile dashboards.
*   **Corner Radii:** Soft, rounded joints (`stroke-linejoin="round"`, `stroke-linecap="round"`). Completely sharp, angular corners are avoided.
*   **Size Standards:**
    *   *Standard Interactive:* `24px x 24px` within a bounded `44px` touch container.
    *   *Sub-Labels:* `16px x 16px` for nested, secondary elements.
    *   *Large Display/Status:* `48px x 48px` within empty state views.

---

## 6. Detailed UI Component Specifications

Every component is styled with precise Tailwind CSS parameters to maintain visual cohesion across all screens.

### 6.1 Buttons

```
 +-------------------------------------------------------------------+
 | [Action Label]  -> Primary: Olive Charcoal, Text Cream            |
 | [Action Label]  -> Secondary: Saffron Gold, Text Charcoal          |
 | [Action Label]  -> Ghost: Transparent, Text Slate                 |
 +-------------------------------------------------------------------+
```

*   **Primary Action Button:**
    *   *Tailwind:* `bg-[#1C2A22] text-[#FAF8F5] font-display font-semibold py-4 px-8 rounded-2xl shadow-md transition-all duration-300 hover:bg-[#131E18] hover:scale-[0.98] active:scale-[0.95] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed`
    *   *Usage:* Checkout submission, login confirmation, primary add-to-cart.
*   **Secondary Accent Button:**
    *   *Tailwind:* `bg-[#F2A93B] text-[#1C2A22] font-display font-semibold py-4 px-8 rounded-2xl shadow-sm transition-all duration-300 hover:bg-[#E0982C] hover:scale-[0.98] active:scale-[0.95]`
    *   *Usage:* Interactive modifiers, promo selection, secondary path choices.
*   **Outlined Button:**
    *   *Tailwind:* `border-2 border-[#1C2A22] bg-transparent text-[#1C2A22] font-display font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-[#1C2A22] hover:text-[#FAF8F5]`
    *   *Usage:* Cancel actions, viewing history details, optional steps.

### 6.2 Cards & Food Cards
Cards utilize a Warm White base floating cleanly above the Alabaster Cream canvas:
*   **Container Card:**
    *   *Tailwind:* `bg-[#FFFFFF] border border-[#1C2A22]/5 rounded-3xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg`
*   **Meal Grid Card:**
    *   *Tailwind Layout:* Contains an upper image window, a details zone, and an action tray.
    *   *Image Window:* Rounded top container (`rounded-2xl`) featuring a subtle zoom effect on hover (`group-hover:scale-105 duration-500`).
    *   *Details Zone:* Clean category tag using JetBrains Mono (`text-[10px] tracking-wider uppercase text-slate-500`), a bold meal title (`font-display text-lg text-[#1C2A22] mt-1`), and a short description.
    *   *Action Tray:* Price displayed in monospace (`font-mono text-base font-semibold text-[#1C2A22]`), paired with a direct, circular add button (`rounded-full w-10 h-10 bg-[#1C2A22] text-white flex items-center justify-center hover:bg-[#F2A93B] hover:text-[#1C2A22] transition-colors`).

### 6.3 Forms & Inputs
*   **Text/Phone Input Field:**
    *   *Tailwind:* `w-full bg-[#FFFFFF] border-2 border-slate-200 text-slate-800 font-sans px-5 py-4 rounded-2xl transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-[#1C2A22] focus:ring-1 focus:ring-[#1C2A22] disabled:bg-slate-50 disabled:text-slate-400`
*   **Validation Error State:**
    *   *Tailwind:* Input borders change to `border-[#C62828]`, with an error sub-label displayed below the input (`text-xs font-sans text-[#C62828] mt-1.5 ml-1`).

### 6.4 Filters & Navigation
*   **Dietary Pill Filter (Unselected):**
    *   *Tailwind:* `bg-white border border-slate-200 text-slate-600 font-sans text-sm py-2 px-5 rounded-full cursor-pointer transition-all hover:bg-slate-50`
*   **Dietary Pill Filter (Selected):**
    *   *Tailwind:* `bg-[#1C2A22] border border-[#1C2A22] text-[#FAF8F5] font-sans text-sm py-2 px-5 rounded-full cursor-pointer transition-all shadow-sm`

### 6.5 Order Status Indicators
Status indicators use a clear visual hierarchy based on colors and monospace typography:
*   *Pending Review:* `bg-[#EF6C00]/10 text-[#EF6C00] font-mono text-xs px-3.5 py-1.5 rounded-full border border-[#EF6C00]/20`
*   *Preparing:* `bg-[#1C2A22]/5 text-[#1C2A22] font-mono text-xs px-3.5 py-1.5 rounded-full border border-[#1C2A22]/10`
*   *In Transit:* `bg-[#32D74B]/10 text-[#2E7D32] font-mono text-xs px-3.5 py-1.5 rounded-full border border-[#32D74B]/20`
*   *Delivered / Success:* `bg-[#2E7D32]/10 text-[#2E7D32] font-mono text-xs px-3.5 py-1.5 rounded-full border border-[#2E7D32]/20`

---

## 7. Spacing, Layout, & Responsive Breakpoints

Visual structure is maintained by aligning components to an explicit, proportional grid.

### 7.1 Structural Grid System
We implement a flexible responsive layout strategy:
*   **Mobile (< 640px):** Single-column layout, `16px` outer page margin, standard gaps of `16px`.
*   **Tablet (640px - 1024px):** 2-to-3 column layouts, `24px` outer page margin, gaps of `24px`.
*   **Desktop (1024px+):** 4-column item grids, `32px` outer margins, `24px` or `32px` layout gaps.
*   **Container Constraint:** A maximum content width container of `w-full max-w-7xl mx-auto` prevents layout stretching on wider desktop screens.

### 7.2 Corner Radii (Modern Smooth curves)
Our styling avoids sharp, boxy angles:
*   `rounded-sm` (4px): Checkboxes, small tag elements.
*   `rounded-md` (8px): Inner components, badges.
*   `rounded-xl` (12px): Image frames, inner cards.
*   `rounded-2xl` (16px): Input fields, buttons, small menus.
*   `rounded-3xl` (24px): Primary modal structures, page containers, food cards.

---

## 8. Imagery & Photography Style

### 8.1 Food Photography Style
*   **Authentic & Vibrant:** No heavy artificial staging, glossy glazes, or clinical white backdrops. Food should be photographed in warm, natural morning or afternoon sunlight.
*   **Steam & Freshness:** Highlight thermal freshness with visible steam or melting details (e.g., warm sauces, fresh herbs).
*   **Depth of Field:** Soft background blurs focus all attention on the textures of the meal.

### 8.2 Vector & Illustration Style
*   **Minimalist Line-Art:** Keep illustrations simple and clean. Avoid complex, colorful cartoon graphics.
*   **Monochromatic Duotones:** Illustrations should use our brand colors, primarily `Deep Olive Charcoal` and `Golden Saffron`, on clean white backdrops to maintain a professional look.

---

## 9. Motion & Animation Design

Animations should support navigation and make the experience feel premium, without slowing down user tasks.

```
                  MICRO-INTERACTION MOTION PATHS

          [Modal Entry]                      [Cart Add Ripple]
            (Screen)                           (Meal Card)
         +------------+                     +---------------+
         |     /\     |  Fly-in / Dampened  |   +-------+   |
         |     ||     |  Spring transition. |   |   +   |---|--> (Pulse Out)
         |  [Modal]   |                     |   +-------+   |
         +------------+                     +---------------+
```

### 9.1 Core Motion Parameters
*   **Eases:** Use a clean cubic-bezier transition for natural momentum: `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-custom ease-out).
*   **Standard Durations:**
    *   *Micro-Interactions (Hovers, Clicks):* `150ms` to `200ms`.
    *   *Page transitions / Slider Panels:* `300ms` to `400ms`.

### 9.2 Motion Behaviors
1.  **Page Transitions:** A clean horizontal slide combined with a subtle opacity fade-in to create a clear sense of progression.
2.  **Add-To-Cart:** Click actions trigger a soft scale animation (`scale-95` on click, springing back to scale-100), paired with a brief badge counter pulse in the navigation bar.
3.  **Order Tracking Steps:** Status steps pulse gently with an ambient ring transition, providing real-time feedback when the order progress state advances.

---

## 10. Accessibility Compliance

The design system meets WCAG 2.1 AA requirements to ensure an inclusive experience:

*   **Color Contrast:** All body text maintains a minimum contrast ratio of `4.5:1` against the soft alabaster background. Important headers and actions maintain a contrast ratio of `7:1` or higher.
*   **Touch Targets:** Interactive elements like buttons and icons have a minimum touch target size of `44px x 44px` on mobile screens to prevent misclicks.
*   **Keyboard Navigation:** Interactive components support clear `:focus-visible` outline styles (`outline: 2px solid #F2A93B` with a `2px` offset) to allow easy keyboard-only navigation.
*   **Assistive Labels:** Icons and buttons include clear screen reader labels (`aria-label`) to ensure a smooth experience for users utilizing screen readers.

---

## 11. Delivery & Implementation

This Brand Identity and Design System Manual is ready for implementation. The specified colors, typography scales, spacing rules, and component styles should be used consistently to ensure a high-quality, professional, and visually cohesive user experience across all Bibi Food platforms.
