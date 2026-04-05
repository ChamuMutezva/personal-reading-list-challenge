# Editorial Archive Design System

## 1. Overview & Creative North Star
**Creative North Star: The Private Curator**
The Editorial Archive design system is inspired by the tactile and intellectual world of rare book collecting and archival scholarship. It moves away from the sterile, high-tech "SaaS" aesthetic toward a "Digital Sanctuary" that rewards deep focus and quiet contemplation.

This system rejects the rigid 1px grid of modern web apps, opting instead for **High-End Editorial** sensibilities. It prioritizes:
- **Intentional Asymmetry:** Layouts that breathe through varying gutter widths and staggered content blocks.
- **Tonal Depth:** Relying on ivory-to-stone background shifts rather than hard lines.
- **Typographic Authority:** A dramatic contrast between high-character serifs and technical, wide-tracked sans-serifs.

## 2. Colors
The palette is rooted in organic, archival tones—forest greens, aged paper, and deep umber.

- **Primary:** Deep Evergreen (#173628). Used for key brand moments and high-priority actions.
- **Secondary/Tertiary:** Earthy Mutes. Used for categorization and status indicators (e.g., Book Genres).
- **Surface Hierarchy:**
- **Surface (Base):** #FBF9F4 (Warm Paper)
- **Nesting:** Use `surface_container_low` for large content blocks and `surface_container_lowest` (Pure White) for white-space heavy widgets to create an "inset" effect.
- **The "No-Line" Rule:** Do not use 1px solid borders for sectioning. Contrast must be achieved via background color shifts (e.g., moving from `surface` to `surface_container_low`).
- **Glass & Gradient:** Navigation elements should utilize `backdrop-blur-xl` with 80% opacity (`#fbf9f4/80`) to suggest layers of translucent vellum.
- **Signature Textures:** For high-engagement areas like progress bars, use a subtle "asfalt" noise texture overlay at 20% opacity to mimic the feel of pressed paper or cloth-bound covers.

## 3. Typography
The system uses a dual-font strategy to balance character with utility.

- **Display & Headlines (Newsreader):** A sophisticated serif. Reference the screen's **3rem (48px)** and **1.875rem (30px)** italicized styles for headers to create a literary feel.
- **Body & Metadata (Manrope):** A clean, modern sans-serif.
- **The Typographic Scale:**
- **H1 (Display):** 3rem, Italic, Newsreader. Tracking: -0.025em.
- **H2 (Section):** 1.875rem, Italic, Newsreader.
- **H3 (Widget):** 1.25rem, Italic, Newsreader.
- **Label/Action:** 10px, Manrope, Bold, All-Caps, Tracking: 0.1em. This "micro-metadata" style is essential for the archival look.

## 4. Elevation & Depth
Depth is communicative, not just decorative.

- **The Layering Principle:** Construct the UI by stacking. A card in `surface_container_low` should sit on a background of `surface`.
- **Ambient Shadows:**
- **Small:** Subtle definition for widgets (used for the goal tracker).
- **Large:** Dramatic, soft-spread shadows (used for book covers and floating cards) to simulate physical objects on a desk.
- **The "Ghost Border":** When an edge is required (like avatar rings), use `outline_variant` at reduced opacity rather than solid black or primary.

## 5. Components
- **Buttons:**
- **Primary:** Rectangular with subtle rounding (4px-8px), using `primary` fill and `on_primary` text in all-caps Manrope.
- **Text Action:** Border-bottom of 1px using `primary/20`, transitioning to 100% on hover.
- **Cards:** No borders. Background shifts to `surface_container_high` on hover. Padding is generous (1.5rem to 2rem).
- **Progress Bars:** Use high-contrast pairing of `surface_variant` (track) and `primary` (fill), with a texture overlay.
- **Input Fields:** Pill-shaped with `surface_container` backgrounds. No borders until focused.

## 6. Do's and Don'ts
### Do:
- Use italics for emphasis in headlines.
- Use wide-tracked uppercase labels for all metadata.
- Embrace whitespace (spacing level 3) to allow content to "breathe" like a well-set page.

### Don't:
- Use bright, neon, or "digital" blue/purple colors.
- Use sharp 90-degree corners or perfectly circular "bubble" buttons (stick to roundedness 1 or 2).
- Use traditional "Sidebar/Header" borders. Let the background color define the regions.