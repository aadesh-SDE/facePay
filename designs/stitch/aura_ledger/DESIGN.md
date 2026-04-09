# Design System Strategy: The Architectural Calm

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Vault of Serenity"**

This design system moves beyond the cold, sterile nature of traditional fintech. While most financial apps rely on rigid grids and heavy borders to convey security, this system establishes trust through **Spatial Authority**. By leveraging expansive white space (the "luxury of room") and sophisticated tonal layering, we create an environment that feels both impenetrable and effortless. 

We break the "template" look by avoiding the standard boxy layouts of 2010s SaaS. Instead, we use **Intentional Asymmetry** and **Micro-Depth**. Elements aren't just "placed" on a screen; they are choreographed. We prioritize the "Mobile-First Editorial" approach—treating the 390px viewport like a premium magazine spread where typography and color shifts do the heavy lifting, not lines and dividers.

---

## 2. Colors: Tonal Architecture
The palette is rooted in the psychological stability of Deep Teal. However, the execution must remain "airy."

### Core Palette
*   **Primary (`#00535b`)**: Used for brand-defining moments and high-level navigation.
*   **Primary Container (`#006d77`)**: Our "Deep Teal" anchor. Used for immersive headers and primary action backgrounds.
*   **Secondary (`#236863`)**: For secondary interactions and supporting information.
*   **Surface (`#f8f9fa`)**: The "Pale Gray" canvas. This is the foundation of our "Calm" aesthetic.

### The "No-Line" Rule
**Lines are a failure of hierarchy.** In this system, 1px solid borders are strictly prohibited for sectioning. To separate content, use:
1.  **Background Shifts:** Transition from `surface` to `surface-container-low`.
2.  **Negative Space:** Increase the vertical padding between logical groups.
3.  **Tonal Transitions:** Use subtle shifts in container color to define boundaries.

### The "Glass & Gradient" Rule
To elevate the "Premium" feel, use **Glassmorphism** for floating elements (e.g., bottom navigation bars or sticky headers). Use `surface_container_lowest` with a 70% opacity and a `20px` backdrop-blur. 
*   **Signature Texture:** Apply a subtle linear gradient to main CTAs (Primary → Primary Container) at a 135-degree angle. This adds a "jewel-like" depth that feels intentional and custom.

---

## 3. Typography: Editorial Authority
We use **Manrope** (an evolution of the Poppins request) for its superior legibility in financial data and its more sophisticated, geometric character.

*   **Display Scales (`3.5rem` to `2.25rem`)**: These are your "Editorial Hooks." Use these for account balances or welcoming headlines. They should feel bold and authoritative.
*   **Headline & Title (`2rem` to `1rem`)**: These organize the user's journey. Ensure high contrast against the `on-surface` color.
*   **Body & Labels (`1rem` to `0.6875rem`)**: These handle the "work" of the app. 
*   **Hierarchy Note:** Always pair a `headline-sm` with a `body-md` in a lighter weight or `on-surface-variant` color to create a clear informational scent.

---

## 4. Elevation & Depth: The Layering Principle
Forget traditional drop shadows. We create depth through **Tonal Stacking**.

*   **Stacking Logic:** 
    *   **Level 0 (Base):** `surface` (`#f8f9fa`)
    *   **Level 1 (Sections):** `surface-container-low` (`#f3f4f5`)
    *   **Level 2 (Interactive Cards):** `surface-container-lowest` (`#ffffff`)
*   **Ambient Shadows:** When an element must float (like a FAB or a modal), use a "Whisper Shadow": `y: 8px, blur: 24px, color: on-surface (opacity 6%)`. This mimics natural light rather than a digital effect.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary in low-contrast scenarios, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Refined Interaction

### Buttons
*   **Primary:** High-gloss. Gradient from `primary` to `primary-container`. `xl` (1.5rem) roundedness. No border.
*   **Secondary:** `surface-container-high` background with `on-surface` text.
*   **Tertiary:** Ghost style. No background. `primary` text color.

### Input Fields
*   **Style:** Avoid the "box" look. Use a `surface-container-highest` background with a subtle bottom-heavy padding. 
*   **States:** On focus, the `outline` token should be applied at 40% opacity—never a 100% solid, thick line.

### Cards & Lists
*   **Rule:** **Zero Dividers.** Lists should be separated by 16px or 24px of vertical space. 
*   **Structure:** Use `surface-container-lowest` (#FFFFFF) for cards. Apply a `lg` (1rem) corner radius for a friendly, modern feel.
*   **Interaction:** On tap/hover, transition the card background to `surface-container-high` rather than using a shadow lift.

### Biometric Authenticator (Specialty Component)
*   Since this is for a "FacePay" context, the scanning UI should use a `backdrop-blur` overlay (Glassmorphism) with the `primary_fixed` color for the scanning frame to signify "Safe & Secure."

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme whitespace (32px+) between major functional groups.
*   **Do** use `primary-container` for backgrounds of high-importance "Hero" cards (e.g., current balance).
*   **Do** use the `9999px` (full) roundedness for chips and status indicators to contrast the `lg` card corners.

### Don't
*   **Don't** use pure black (#000000) for text. Always use `on-surface` to maintain the "Calm" tone.
*   **Don't** use standard Material Design "Drop Shadows." They are too aggressive for this identity.
*   **Don't** use lines to separate list items. If the content feels cluttered, increase the padding.
*   **Don't** use "Alert Red" for everything. Use `error_container` with `on_error_container` text for a softer, more professional warning.