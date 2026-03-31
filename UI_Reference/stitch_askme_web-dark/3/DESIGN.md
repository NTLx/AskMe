# Design System Specification: The Intellectual Canvas

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

This design system moves away from the "chat-bot-as-a-toy" aesthetic toward a high-end, editorial experience. It envisions the AI not as a machine, but as a thoughtful, intellectual guide. The visual language rejects the rigid, boxy constraints of traditional Material Design in favor of **Organic Layering** and **Asymmetric Balance**. 

We achieve a "bespoke" feel by leveraging deep tonal depths and intentional negative space. The goal is to make the user feel as though they are interacting with a living document—an environment that breathes, thinks, and guides through sophisticated visual hierarchy rather than loud UI signals.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the "Midnight Violet" spectrum, utilizing the Material 3 tonal system to create a sense of infinite depth.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** In this system, 1px solid borders are strictly prohibited for sectioning. Use background shifts to define boundaries.
- A `surface-container-low` (#141317) sidebar sitting against a `background` (#0e0e11) main stage provides all the definition needed.
- For high-priority focus areas, use a `surface-bright` (#2d2b33) fill rather than an outline.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of smoked glass. 
- **Layer 0 (Base):** `surface` (#0e0e11) — The foundation.
- **Layer 1 (Navigation/Sidebar):** `surface-container-low` (#141317) — Recessed utility.
- **Layer 2 (Content Cards):** `surface-container` (#1a191e) — The primary interactive plane.
- **Layer 3 (Modals/Popovers):** `surface-container-highest` (#26252c) — Closest to the user.

### The "Glass & Gradient" Rule
To add "soul" to the AI experience:
- **Hero Actions:** Use a subtle linear gradient for `primary` elements, transitioning from `primary` (#ddccff) to `primary_dim` (#c3aef0) at a 135-degree angle.
- **Floating Elements:** Any element that overlaps content (e.g., a floating "Stop Generating" button) must use a `surface_variant` (#26252c) with an 80% opacity and a `20px` backdrop-blur to create a "frosted violet" effect.

---

## 3. Typography: The Editorial Voice
We employ a dual-font strategy to balance intellectual authority with modern utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-editorial" feel. Use `display-lg` for welcome states to create an immediate sense of scale and importance.
*   **Body & Interface (Inter):** The workhorse. `body-md` (0.875rem) is the standard for AI responses. Its high x-height ensures readability during long-form intellectual inquiries.

**Hierarchy as Brand:** Use `title-lg` (#ddccff) for AI-generated headers within the chat to distinguish the "voice" of the AI from the user's queries, which should remain in `body-lg` (#e8e4ee).

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for a "thoughtful" brand. We use light to imply distance.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#000000) input field placed inside a `surface-container` (#1a191e) card creates a natural "in-set" look that feels premium and tactile.
*   **Ambient Shadows:** For floating dialogs, use a 32px blur with 4% opacity, using the `primary` (#ddccff) color as the shadow tint. This mimics a soft violet glow rather than a muddy grey shadow.
*   **The Ghost Border:** If a boundary is required for accessibility (e.g., input focus), use `outline-variant` (#49474f) at 20% opacity. 

---

## 5. Components: The Signature Kit

### Chat Bubbles (The Dialogue Stream)
*   **AI Message:** No container. Uses `body-lg` text directly on the `background`. Use a `tertiary_fixed` (#fec5d6) vertical 2px accent bar to the left of the text to mark the AI's "thought line."
*   **User Message:** A `surface-container-high` (#201f25) capsule with `xl` (1.5rem) roundedness. Positioned slightly off-center to maintain asymmetry.

### Scenario Cards
*   **Layout:** Use `surface-container` (#1a191e) with `lg` (1rem) corner radius. 
*   **Interaction:** On hover, do not lift the card. Instead, transition the background color to `surface-bright` (#2d2b33) and shift the `primary` icon 4px to the right.

### Sidebar Navigation
*   **Structure:** Transparent background. Active states are indicated by a `primary_container` (#d1bcff) pill behind the icon, with the text switching to `on_primary_container` (#47366f). 
*   **Typography:** Use `label-md` for secondary navigation items to maintain a clean, minimalist sidebar.

### Input Fields (The Inquiry Bar)
*   **Default State:** `surface-container-lowest` (#000000) fill, `full` (9999px) roundedness, no border.
*   **Focus State:** A subtle 1px "Ghost Border" using `primary` at 20% opacity and a soft `primary` outer glow (4px blur).

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use the `24` (6rem) spacing token for top-level section margins to let the layout "breathe."
*   **Do** use `tertiary` (#ffd9e3) sparingly for "Insight" moments or "Aha!" highlights within the AI text.
*   **Do** embrace asymmetry. If a list of scenario cards is 3 columns, let the 4th card take up 2 columns to break the "grid-template" feel.

### Don’t:
*   **Don’t** use dividers. Use a `12` (3rem) vertical gap to separate conversation blocks.
*   **Don’t** use pure white (#ffffff) for text. Always use `on_surface` (#e8e4ee) to reduce eye strain in the default dark mode.
*   **Don’t** use "hard" animations. All transitions (color shifts, card hovers) must use a `300ms cubic-bezier(0.4, 0, 0.2, 1)` easing to feel fluid and sophisticated.