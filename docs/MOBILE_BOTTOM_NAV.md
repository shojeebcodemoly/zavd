# Mobile Bottom Navigation Bar

## Overview

A mobile-only bottom navigation bar that provides quick access to the main sections of the Synos Medical website. The navigation is fixed at the bottom of the viewport and only appears on mobile devices (screens < 768px).

## Features

### ✅ Design Requirements Met

-  **Synos Medical Design System**: Uses the warm beige/tan color palette with teal accent (#39898F)
-  **Mobile-Only Display**: Hidden on tablet (≥768px) and desktop devices using Tailwind's `md:hidden` utility
-  **Fixed Positioning**: Stays at the bottom of the viewport for easy thumb access
-  **Responsive Layout**: 4 evenly distributed navigation buttons across the full width
-  **Active State Indication**: Visual feedback showing the current page
-  **Smooth Transitions**: Hover and active states with smooth animations
-  **Accessibility**: Full keyboard navigation, ARIA labels, and focus states

### 🎨 Visual Design

-  **Background**: White with 95% opacity and backdrop blur for a modern glassmorphism effect
-  **Border**: Top border with subtle shadow for depth
-  **Icons**: Lucide React icons (Home, Package, GraduationCap, Phone)
-  **Active State**: Teal background (#39898F/10) with teal text color
-  **Inactive State**: Muted gray text with hover effect
-  **Typography**: Small (xs) font size with medium weight, bold when active

### 📱 Navigation Items

1. **🏠 Hem (Home)** - `/`
2. **📦 Utrustning (Equipment)** - `/produkter`
3. **🎓 Utbildning (Education)** - `/utbildningar`
4. **📞 Kontakt (Contact)** - `/kontakt`

## Technical Implementation

### Component Structure

```
components/layout/MobileBottomNav.tsx
```

**Key Features:**

-  Client component (`"use client"`) for pathname detection
-  Uses Next.js `usePathname()` hook for active state detection
-  Implements proper TypeScript types
-  Follows existing code patterns in the Synos project

### Integration

The component is integrated into the root layout (`app/layout.tsx`):

```tsx
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

console.logInside the layout
<div className="flex min-h-screen flex-col">
  <Navbar />
  <main className="flex-1 w-full">{children}</main>
  <Footer />
  <MobileBottomNav />
</div>
```

### Responsive Behavior

-  **Mobile (< 768px)**: Navigation bar is visible and fixed at the bottom
-  **Tablet & Desktop (≥ 768px)**: Navigation bar is completely hidden
-  **Content Spacing**: A spacer div (`h-20`) prevents content from being hidden behind the fixed nav on mobile

### Accessibility Features

-  **Semantic HTML**: Uses `<nav>` element with proper `aria-label`
-  **Keyboard Navigation**: Full keyboard support with visible focus states
-  **Screen Readers**: Proper ARIA attributes including `aria-current="page"` for active items
-  **Focus Management**: Custom focus ring using Tailwind's `focus-visible` utilities
-  **Icon Labels**: Icons are marked with `aria-hidden="true"` and accompanied by visible text labels

## Styling Details

### Color Scheme (Synos Medical Palette)

-  **Primary (Teal Accent)**: `#39898F` - Used for active state
-  **Secondary (Dark)**: `#2C2D38` - Not used in this component
-  **Background**: White with 95% opacity
-  **Muted Text**: Tailwind's `text-muted-foreground`
-  **Border**: Tailwind's `border-border`

### Spacing & Sizing

-  **Navigation Height**: 80px (h-20)
-  **Icon Size**: 24px × 24px (w-6 h-6)
-  **Button Min Width**: 70px
-  **Padding**: Horizontal 12px, Vertical 8px
-  **Gap**: 4px between icon and label

### Animations

-  **Transition Duration**: 200ms
-  **Icon Scale**: 110% when active
-  **Font Weight**: Semibold when active
-  **Background**: Smooth color transition on hover/active

## Testing

### Manual Testing Steps

1. **Open the website on a mobile device or use browser DevTools**

   -  Chrome DevTools: Toggle device toolbar (Cmd/Ctrl + Shift + M)
   -  Set viewport to mobile size (e.g., iPhone 12 Pro - 390px)

2. **Verify visibility**

   -  Navigation should be visible at the bottom on mobile
   -  Navigation should be hidden on tablet/desktop (≥768px)

3. **Test navigation**

   -  Click each navigation item
   -  Verify correct page navigation
   -  Check active state highlighting

4. **Test accessibility**

   -  Use keyboard (Tab key) to navigate
   -  Verify focus states are visible
   -  Test with screen reader

5. **Test responsive behavior**
   -  Resize browser window
   -  Verify navigation appears/disappears at correct breakpoint
   -  Check content doesn't overlap with navigation

### Browser Compatibility

-  ✅ Chrome/Edge (Chromium)
-  ✅ Safari (iOS & macOS)
-  ✅ Firefox
-  ✅ Samsung Internet

## Future Enhancements

Potential improvements for future iterations:

-  [ ] Add haptic feedback on mobile devices
-  [ ] Implement badge notifications for updates
-  [ ] Add smooth scroll-to-top on home icon double-tap
-  [ ] Consider adding a fifth item for user account/profile
-  [ ] Add animation when switching between pages
-  [ ] Implement gesture support (swipe to navigate)

## Files Modified

1. **Created**: `components/layout/MobileBottomNav.tsx` - Main component
2. **Modified**: `app/layout.tsx` - Added component import and integration

## Dependencies

-  `next/navigation` - For `usePathname()` hook
-  `next/link` - For client-side navigation
-  `lucide-react` - For icons
-  `@/lib/utils/cn` - For className merging

## Notes

-  The component uses the existing Tailwind configuration and design tokens
-  No additional dependencies were added
-  Follows the existing code style and patterns in the Synos project
-  Compatible with the current Next.js 16 App Router setup
