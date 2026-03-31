```markdown
# Design System Specification: The Illuminated Scholar

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Digital Nocturne."** Unlike standard dark modes that feel like inverted light themes, this system is an intentional, editorial experience designed to evoke the quiet, focused atmosphere of a private library at midnight.

We break the "template" look by rejecting the rigid, boxed-in constraints of traditional Material Design. Instead, we use **intentional asymmetry** and **tonal depth** to guide the eye. This system isn't just a UI; it’s a high-contrast, intellectual canvas where information breathes through expansive whitespace and light is used sparingly—only to signal importance.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in a deep, ink-like slate, punctuated by the sharp intelligence of Teal (`primary`) and the warm, advisory glow of Amber (`secondary`).

### Surface Hierarchy & Nesting
We do not use borders to define containers. Depth is achieved through a "Layered Vellum" approach using the following tokens:
*   **Base Layer:** `surface` (#0b1326) — The vast, quiet background.
*   **Secondary Content:** `surface_container_low` (#131b2e) — Used for large, secondary sections.
*   **Interactive Cards:** `surface_container` (#171f33) — The standard container for grouped information.
*   **Elevated Focus:** `surface_container_highest` (#2d3449) — Used for elements that need to feel physically closer to the user.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. If a section needs to stand out from the `surface`, use `surface_container_low`. 

### The "Glass & Gradient" Rule
To add visual "soul," use a subtle **Linear Gradient** for hero sections or primary CTAs:
*   *From* `primary_container` (#2dd4bf) *to* `primary` (#57f1db) at a 135-degree angle.
*   For floating navigation or high-end modals, use **Glassmorphism**: Apply `surface_container` at 80% opacity with a `20px` backdrop-blur.

---

## 3. Typography: Editorial Authority
We utilize **Manrope** for its geometric clarity and modern, open apertures, which ensure legibility against dark backgrounds.

*   **Display (Display-LG/MD):** Use these for philosophical "hero" statements. Set with `tracking-tighter` (-0.02em) to create a sophisticated, dense editorial look.
*   **Headlines (Headline-SM):** Use `on_surface` (#dae2fd). These act as the clear anchors for your content blocks.
*   **Body (Body-LG):** Our primary reading grade. High contrast is maintained via `on_surface`, but for secondary metadata, drop to `on_surface_variant` (#bacac5) to reduce cognitive load.
*   **Labels (Label-MD):** Always uppercase with `tracking-widest` (0.1em) when used in buttons or overline headers to provide a "technical" contrast to the organic body text.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for an intellectual dark theme. We use light to create lift.

*   **The Layering Principle:** Place a `surface_container_lowest` (#060e20) card inside a `surface_container` (#171f33) area to create an "inset" or "carved" look. This reverses standard elevation expectations and creates a custom, premium feel.
*   **Ambient Shadows:** If a floating element is required, use a shadow color tinted with `#3cddc7` (10% opacity) with a `32px` blur and `16px` Y-offset. This mimics a teal-tinted glow rather than a grey "dirt" shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-glare environments), use `outline_variant` (#3c4a46) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Refined Interaction

### Buttons
*   **Primary:** A solid `primary` (#57f1db) fill with `on_primary` (#003731) text. Use `rounded-md` (0.75rem). No shadow; use a subtle `0 0 15px` outer glow on hover.
*   **Secondary:** An "Outline Ghost" style. Use `outline` (#859490) at 30% opacity for the stroke, with `secondary` (#ffb95f) text to draw the eye.
*   **Tertiary:** Pure text using `primary` with no background, reserved for low-priority actions like "Cancel" or "Learn More."

### Input Fields
*   **Style:** Filled containers using `surface_container_high` (#222a3d).
*   **Indicator:** A 2px bottom-bar using `primary` that animates from the center outward on focus. Forgo the 4-sided box for a more modern, "open" feel.

### Cards & Lists
*   **The Divider Ban:** Never use a horizontal rule `<hr>`. Separate list items using the `spacing-4` (1rem) scale and subtle background shifts.
*   **Asymmetric Cards:** For "Featured" content, use an intentional `rounded-xl` (1.5rem) on the top-left and bottom-right corners, leaving the other two at `rounded-sm` (0.25rem). This breaks the Material 3 "everything-is-a-pill" monotony.

### Signature Component: The "Reflection Chip"
A specialized chip for tags. Use a background of `primary` at 10% opacity, a `primary` text color, and a `px` border of `primary` at 20% opacity. It should look like a glowing gemstone embedded in the dark slate.

---

## 6. Do's and Don'ts

### Do
*   **DO** use `surface_bright` (#31394d) for hover states on dark containers.
*   **DO** embrace "negative space." Use `spacing-12` (3rem) and `spacing-16` (4rem) between major sections to let the intellectual content breathe.
*   **DO** use `secondary` (Amber) strictly for "Advisory" or "Highlight" moments—it is the spark in the dark.

### Don't
*   **DON'T** use pure black (#000000). It kills the "Ink Slate" depth and causes "smearing" on OLED screens.
*   **DON'T** use 100% opaque `outline` colors. It creates "visual noise" that contradicts the calm atmosphere.
*   **DON'T** use standard Material 3 "Full Rounding" for everything. Use the `md` (0.75rem) scale to maintain a sense of structural authority.

---
**Director's Final Note:** 
Remember, we are designing for a "Sage." The interface should feel like it is listening. Every interaction should be quiet, every transition smooth (use `300ms cubic-bezier(0.4, 0, 0.2, 1)`), and every visual element must earn its place on the slate.```