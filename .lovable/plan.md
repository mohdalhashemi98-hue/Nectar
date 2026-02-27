

# Full Visual Overhaul: Apply US4LESS Design to Stack

## Design Analysis

The US4LESS app features a clean, professional design with these key visual characteristics:

- **Dark navy backgrounds** for hero/header sections (#1e293b / #0f172a range)
- **Amber/gold accent** (#E8A838) for highlighted text and key CTAs
- **Blue primary** buttons (clean, flat blue -- similar hue but less gradient-heavy)
- **Light gray page background** (#f8fafc)
- **Moderate border radius** (rounded-xl / rounded-2xl instead of the current rounded-3xl everywhere)
- **Cleaner cards** with subtle borders, less shadow, more whitespace
- **Labels above inputs** with clean bordered fields (no heavy background fill)
- **Minimal gradients** -- mostly solid colors with occasional subtle gradient
- **Clean typography** -- Inter/system font, bold headings, high contrast

The current Stack app uses very rounded corners (rounded-3xl), heavy gradients, golden/shimmer effects, and a blue-heavy palette. The overhaul will tone these down to match the US4LESS aesthetic while keeping all functionality intact.

## Implementation Plan

### Phase 1: Update Design Tokens (index.css)

Update the CSS custom properties to match the US4LESS palette:
- Adjust `--background` to a lighter gray (#f8fafc)
- Adjust `--card` to pure white
- Add an `--amber` accent color variable for gold/amber highlights
- Update gradient definitions to be more subtle and use amber accents
- Reduce `--radius` from 1rem to 0.75rem
- Update shadow values to be softer/more subtle
- Update dark mode variables to use the US4LESS dark navy tones
- Replace the gradient-golden and gradient-hero with amber-accented versions
- Update component classes (btn-primary, card-elevated, card-interactive, etc.) to use less rounding and cleaner styles
- Update input-modern to have bordered style instead of filled background

### Phase 2: Update Component Styles

**Button component (button.tsx)**
- Reduce rounding from rounded-3xl to rounded-xl
- Add amber/gold gradient variant
- Simplify the gradient variant to use amber accent

**Card component (card.tsx)**
- Reduce rounding to rounded-xl

**BottomNav**
- Update to match cleaner aesthetic with less rounding

### Phase 3: Update Key Screens

**WelcomeScreen**
- Keep dark background but add amber accent color for highlighted text (like "Ship to Your Door" in US4LESS)
- Update CTA buttons to use amber accent for primary action
- Reduce corner rounding on buttons and cards
- Cleaner stat badges

**LoginScreen**
- Match US4LESS login/signup design: centered card on light background
- Clean form inputs with labels above
- Blue primary CTA button
- Less gradient, more clean solid colors

**ConsumerHomeScreen**
- Update header to cleaner style
- Cards with less rounding, cleaner borders
- Amber accent for rewards/points badges
- Cleaner category grid

**VendorHomeScreen**
- Update gradient header to use amber accents
- Cleaner stat cards with less rounding
- Priority action cards with amber highlights

**Other screens** (Messages, Jobs, Profile, etc.)
- Will inherit most changes from the CSS tokens update
- Minor adjustments to match the cleaner aesthetic

### Files to Modify

1. `src/index.css` -- Design tokens, component classes, utility classes
2. `src/components/ui/button.tsx` -- Reduce rounding, add amber variant
3. `src/components/ui/card.tsx` -- Reduce rounding
4. `src/components/stack/screens/WelcomeScreen.tsx` -- Amber accents, cleaner layout
5. `src/components/stack/screens/LoginScreen.tsx` -- Clean card-on-light-bg design
6. `src/components/stack/screens/ConsumerHomeScreen.tsx` -- Cleaner cards and header
7. `src/components/stack/screens/VendorHomeScreen.tsx` -- Amber accents, cleaner metrics
8. `src/components/stack/BottomNav.tsx` -- Reduce rounding, cleaner style
9. `src/components/stack/ScreenWrapper.tsx` -- Minor padding adjustments
10. `src/components/stack/AvailabilityToggle.tsx` -- Match new style
11. `src/components/stack/PointsBadge.tsx` -- Amber accent
12. `tailwind.config.ts` -- Add amber color to theme

### Key Design Decisions

- **Amber accent (#E8A838)** replaces the current blue-only palette for highlights, CTAs, and badges
- **Border radius reduced** from 1.5rem/rounded-3xl to 0.75rem/rounded-xl globally
- **Gradients minimized** -- solid amber for CTAs, subtle navy gradients for headers
- **Form inputs** switch from filled-background to bordered style
- **Shadows softened** to match US4LESS's more subtle elevation
- **All existing functionality preserved** -- only visual styling changes

