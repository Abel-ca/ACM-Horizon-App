---
name: Winnerly Intelligence
colors:
  surface: '#0d112a'
  surface-dim: '#0d112a'
  surface-bright: '#343752'
  surface-container-lowest: '#080c25'
  surface-container-low: '#161a33'
  surface-container: '#1a1e37'
  surface-container-high: '#242842'
  surface-container-highest: '#2f334e'
  on-surface: '#dee0ff'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#dee0ff'
  inverse-on-surface: '#2b2f49'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#2e5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#124af0'
  secondary: '#c7fff0'
  on-secondary: '#00382f'
  secondary-container: '#00f2d1'
  on-secondary-container: '#006a5a'
  tertiary: '#ecb1ff'
  on-tertiary: '#520070'
  tertiary-container: '#b000ec'
  on-tertiary-container: '#feeaff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#26fedc'
  secondary-fixed-dim: '#00dfc1'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005144'
  tertiary-fixed: '#f9d8ff'
  tertiary-fixed-dim: '#ecb1ff'
  on-tertiary-fixed: '#320046'
  on-tertiary-fixed-variant: '#75009e'
  background: '#0d112a'
  on-background: '#dee0ff'
  surface-variant: '#2f334e'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style
The design system for Winnerly Intelligence establishes a vibrant, immersive, and highly creative workspace. Moving away from sterile corporate aesthetics, it embraces an "Electric Modernism" style—a fusion of **Glassmorphism** and **High-Contrast Bold** visuals. 

The brand personality is energetic, visionary, and technically advanced. The UI aims to evoke a sense of flow and deep focus through the use of rich, multi-layered blue environments and "living" backgrounds. Visual depth is created through atmospheric mesh gradients rather than flat surfaces, making the interface feel like a premium digital cockpit for high-level intelligence and creative strategy.

## Colors
This design system utilizes a dark-to-light blue spectrum to maintain immersion. The palette is anchored by **Deep Indigo** as the primary canvas, replacing traditional white or neutral grey backgrounds.

- **Primary:** Electric Blue (#2E5BFF) for core actions and brand presence.
- **Secondary:** Neon Teal (#00F5D4) for success states, growth metrics, and high-energy accents.
- **Tertiary:** Electric Purple (#BF00FF) for specialized features, creative tools, and highlights.
- **Neutral/Surface:** A range of semi-transparent Indigos.

Backgrounds must never be flat; they should utilize mesh gradients or transitions from midnight indigos to vibrant cyans to create a sense of infinite digital space.

## Typography
The typography is designed for high-impact clarity against rich, colored backgrounds.

- **Headlines:** Sora provides a futuristic, geometric weight that feels authoritative yet innovative.
- **Body:** Hanken Grotesk ensures maximum readability for complex data and workspace collaboration, offering a sharp, contemporary feel.
- **Labels:** JetBrains Mono is used for technical metadata, code snippets, and UI labels to reinforce the "intelligence" aspect of the platform.

Contrast is maintained by using pure white (#FFFFFF) or high-vibrancy tints for text, ensuring accessibility standards are met even against saturated blue gradients.

## Layout & Spacing
The layout follows a **fluid grid** model to support an expansive, multi-tasking workspace. 

- **Grid:** A 12-column system for desktop, transitioning to a single-column stack on mobile.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **White Space:** Generous gutters (24px) are used to prevent the vibrant color palette from feeling claustrophobic. 
- **Safe Areas:** High-level dashboards utilize 40px outer margins on desktop to let the background mesh gradients frame the content effectively.

## Elevation & Depth
Elevation in this design system is achieved through **Glassmorphism** and **Luminous Tones** rather than traditional drop shadows.

- **Surface Layers:** Containers use semi-transparent background blurs (`backdrop-filter: blur(20px)`) with a subtle 1px white or light-blue border at 10-15% opacity.
- **Glows:** Instead of black shadows, high-priority elements use "Outer Glows" tinted with the primary Electric Blue or secondary Neon Teal.
- **Z-Index:** Content is organized into three distinct planes: 
    1. **Atmospheric Background:** Mesh gradients.
    2. **Workspace Plane:** Semi-transparent glass cards.
    3. **Action Plane:** Solid, vibrant, high-contrast buttons and floating modals.

## Shapes
The shape language is defined by **Soft** aesthetics. All interactive components, containers, and cards utilize subtle corner radii to create a precise, structured, and modern interface that feels technically accurate while avoiding harsh sharp corners. 

- **Cards/Modals:** Use `rounded-lg` (0.5rem / 8px) or `rounded-xl` (0.75rem / 12px) to create a clean, modern frame for data.
- **Buttons/Inputs:** Use a soft 4px corner radius for a tactile, engineered feel.
- **Selection States:** Use consistent soft rounded corners to signify activity, ensuring the workspace feels refined and precise.

## Components
Consistent styling of workspace components ensures a cohesive creative experience:

- **Buttons:** Primary buttons feature a solid Electric Blue fill with a subtle Neon Teal outer glow on hover. Secondary buttons are "ghost" style with a 1.5px vibrant border.
- **Cards:** Glassmorphic panels with `backdrop-filter: blur(12px)`. The top-left corner should feature a very subtle light-blue "specular highlight" on the border to simulate physical glass.
- **Input Fields:** Deep indigo backgrounds (darker than the main canvas) with Electric Blue focus rings and white typography.
- **Chips:** Small, high-vibrancy capsules using the Tertiary Purple or Secondary Teal to categorize intelligence nodes.
- **Lists:** Items are separated by low-opacity light-blue lines (10% opacity) rather than heavy borders.
- **Intelligence Nodes:** A custom component representing data points, featuring a pulsing neon core and a frosted glass circular container.