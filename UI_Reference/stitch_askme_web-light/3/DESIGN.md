# Design System Specification: The Editorial Academic

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Modern Curator."** 

We are moving away from the rigid, boxed-in feel of traditional Material Design and toward a high-end editorial experience. This system is designed for focus, deep work, and scholarly precision. It treats the UI not as a software interface, but as a digital workspace for the intellect. 

To break the "template" look, we prioritize **Intentional Asymmetry**. Instead of centering everything, use the `24 (6rem)` and `20 (5rem)` spacing tokens to create wide, breathable gutters that push content into focused columns. Overlap elements slightly—such as a floating `surface_container_lowest` card encroaching on a `display-md` headline—to create a sense of curated, physical layers.

## 2. Colors & Tonal Logic
The color philosophy is rooted in "Chromatic Focus." We use a refined deep purple (`primary: #6750a5`) as our intellectual anchor, supported by a vast, nuanced landscape of off-whites and soft lavenders.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For example, a side navigation panel should use `surface_container_low`, while the main workspace uses `surface`. This creates a sophisticated, "borderless" environment that feels modern and expansive.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine papers. 
*   **Base:** `surface` (#fbf8fc)
*   **Sectioning:** `surface_container` (#efedf3) for secondary content areas.
*   **Interactive Elements:** `surface_container_lowest` (#ffffff) for the highest visual "lift" (cards, active inputs).
*   **Nesting Logic:** To create depth, place a `surface_container_lowest` element inside a `surface_container_high` section. This creates natural contrast without a single drop shadow.

### Signature Textures & Glassmorphism
To avoid a flat, "out-of-the-box" feel, use a subtle linear gradient for primary CTAs: `primary` (#6750a5) to `primary_dim` (#5b4497) at a 135-degree angle. 
For floating navigation bars or overlays, use **Glassmorphism**: Apply the `surface` color at 70% opacity with a `20px` backdrop-blur. This allows the content below to bleed through subtly, maintaining a sense of place.

## 3. Typography: The Manrope Scale
We use **Manrope** for its technical precision and humanist warmth. It feels scholarly yet contemporary.

*   **Display (lg/md):** Use these sparingly for high-impact editorial moments. Letter spacing should be set to `-0.02em` to feel tighter and more premium.
*   **Headlines (sm/md):** These are the anchors of your hierarchy. Use `on_surface` for maximum readability.
*   **Title (md/lg):** Use for card headers or section starts. These convey the "Professional" personality.
*   **Body (lg):** The workhorse. Always use `on_surface_variant` (#5e5e65) for long-form reading to reduce eye strain, reserving `on_surface` for emphasis.
*   **Labels (sm/md):** All-caps with `+0.05em` letter spacing for technical metadata or categories.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

### The Layering Principle
Rather than using elevation shadows for everything, use the surface tokens to "stack" importance. A `surface_container_lowest` card on a `surface_container` background provides a clean, tactile lift that feels intentional and quiet.

### Ambient Shadows
When an element must float (e.g., a modal or a primary action button), use **Ambient Shadows**:
*   **Color:** `on_surface` (#313238) at 6% opacity.
*   **Blur:** Extra-diffused (24px to 40px).
*   **Offset:** 8px to 12px Y-axis.
Avoid "drop shadows" that look like dark outlines; the goal is a soft, natural glow.

### The "Ghost Border" Fallback
If an element (like an input field) risks disappearing into the background, use a **Ghost Border**. Use the `outline_variant` (#b2b1b8) at 15-20% opacity. It should be just visible enough to define a boundary, never enough to distract.

## 5. Components

### Buttons
*   **Primary:** Linear gradient (`primary` to `primary_dim`). `8px` roundness. `1rem` horizontal padding.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. No background, `on_surface` text, with a `surface_variant` hover state.

### Cards & Lists
*   **Rule:** Forbid all divider lines. 
*   **Execution:** Separate list items using `spacing-3` (0.75rem). Use alternating background tints (`surface` vs `surface_container_low`) for complex data sets. Cards should use `surface_container_lowest` and an 8px (`DEFAULT`) corner radius.

### Input Fields
*   **Style:** Filled, not outlined. 
*   **Color:** `surface_container_high`. On focus, the background shifts to `surface_container_lowest` with a subtle `primary` ghost border (20% opacity).

### Chips
*   **Action Chips:** `surface_container_highest` with `label-md` typography. 
*   **Selection:** Use `primary_container` with `on_primary_container` text to indicate the active scholarly focus.

### Annotations (Contextual Component)
Given the "Scholarly" personality, use a custom **Annotation** component: Small, italicized `body-sm` text in `tertiary` (#7b5270) placed in the margins (asymmetric) to provide "meta" commentary on the data.

## 6. Do's and Don'ts

### Do:
*   **Do** use the `12 (3rem)` and `16 (4rem)` spacing tokens to create dramatic whitespace between major sections.
*   **Do** use `primary_fixed_dim` for subtle highlights in text-heavy documents.
*   **Do** prioritize typographic hierarchy over color to show importance.

### Don't:
*   **Don't** use 100% opaque `outline` colors for borders. It breaks the "Editorial" flow.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#313238).
*   **Don't** crowd the edges. If a container feels tight, increase the internal padding using the `6 (1.5rem)` token.
*   **Don't** use traditional "Material Blue" for links. Use the `primary` purple to maintain the signature visual identity.