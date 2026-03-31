# Design System Strategy: The Intellectual Atelier

## 1. Overview & Creative North Star
This design system moves beyond the "utility" of AI to create a space for reflection. Our Creative North Star is **"The Digital Curator."** 

We are not building a chat-bot; we are designing a modern, high-end editorial experience that feels like a private library or a high-end architectural studio. To achieve this, we break the "template" look of standard Material 3 through **Intentional Asymmetry** and **Tonal Depth**. By utilizing wide margins, varying typographic scales, and layered surfaces, we guide the user’s focus toward deep thought rather than rapid-fire consumption.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the "Deep Teal" of wisdom and the "Soft Amber" of insight. However, the sophistication of this system lies in how we manage the neutral space.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. 
Boundaries must be created through background shifts. For example:
- A `surface-container-low` (#f3f4f5) message card sitting on a `surface` (#f8f9fa) background.
- Structural separation is achieved via the **Spacing Scale** (e.g., `8` (2.75rem) gaps) rather than lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
- **Base Layer:** `surface` (#f8f9fa)
- **Primary Content Area:** `surface-container-lowest` (#ffffff) to provide a "bright" focus area for reading.
- **Secondary UI (Sidebar/History):** `surface-container` (#edeeef) to provide a grounded, recessed feel.

### The "Glass & Gradient" Rule
To elevate the "Soft Amber" (#FFBF00) from a flat utility color to a "guiding light," use subtle linear gradients. 
*   **Hero CTAs:** Transition from `primary` (#004f51) to `primary_container` (#00696b) at a 135-degree angle.
*   **Floating Elements:** Use Glassmorphism for the Navigation Drawer and Top App Bar. Apply `surface_container_lowest` at 85% opacity with a `20px` backdrop blur to allow content colors to bleed through softly.

---

## 3. Typography: The Editorial Voice
We pair the architectural strength of **Manrope** (Headlines) with the technical clarity of **Inter** (Body).

*   **Display & Headline (Manrope):** These are our "anchors." Use `display-lg` for welcome states to create an authoritative, "magazine-cover" feel. Ensure letter-spacing is set to `-0.02em` for headlines to feel premium and tight.
*   **Body (Inter):** Comfort is paramount. All `body-lg` text must utilize a spacious line-height (1.6 to 1.8) to prevent eye fatigue during long AI explanations.
*   **Labels:** Use `label-md` in `on_surface_variant` (#3e4949) for metadata. This keeps the secondary information present but visually "quiet."

---

## 4. Elevation & Depth
We eschew "Material Shadows" in favor of **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** If a Floating Action Button (FAB) or Modal requires a shadow, use a custom diffuse shadow: `box-shadow: 0 12px 32px -4px rgba(0, 79, 81, 0.08)`. Note the tint of `primary` in the shadow; never use pure black or grey.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### The Conversational Interface
*   **AI Message Bubbles:** Use `primary_container` (#00696b) with `on_primary` text. Apply `rounded-xl` (1.5rem) to all corners except the bottom-left to create a signature "leaf" shape.
*   **User Message Bubbles:** `surface_container_lowest` (#ffffff) with a 15% `outline_variant` ghost border. This distinguishes the user’s input as "active thought" vs. the AI's "grounded wisdom."

### Buttons & Actions
*   **Primary FAB (New Session):** Use `secondary_container` (#ffbf00). It must sit as a beacon of "Insight." Use `rounded-full` and the "Material Symbols" (Thin weight) for the plus icon.
*   **Action Chips:** Use `tertiary_fixed_dim` (#9fd1b8) for "Sage Green" reinforcement. These should have 0px borders and `0.5rem` padding.

### Navigation & Cards
*   **The Sidebar:** Should be a full-height `surface_container` with a `24px` right-margin from the main content. No vertical divider line.
*   **Scenario Cards:** Use `surface_container_low`. On hover, transition the background to `surface_container_highest` and increase the "Ghost Border" opacity to 30%. Do not move the card's Y-axis; visual feedback should be tonal, not kinetic.

---

## 6. Do’s and Don'ts

### Do
*   **DO** use white space as a structural element. If a section feels crowded, double the spacing token (e.g., move from `4` to `8`).
*   **DO** use "Thin" or "Light" weights for Material Symbols to match the sophisticated typography.
*   **DO** use the `secondary` Soft Amber sparingly—only for "Eureka" moments or primary calls to action.

### Don't
*   **DON'T** use 100% opaque black (#000000) for text. Use `on_surface` (#191c1d) to maintain a soft, high-end paper look.
*   **DON'T** use standard M3 "Elevated" cards with heavy shadows. Always default to "Tonal" or "Outlined" (Ghost style).
*   **DON'T** clutter the reading environment. The sidebar should auto-hide on smaller viewports to prioritize the "Deep Thinking" body text.