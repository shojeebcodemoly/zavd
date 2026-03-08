# Homepage Features - Glassmorphism Design

This directory contains all feature components for the redesigned homepage with a modern glassmorphism UI.

## 🎨 Design System

### Color Palette

- **Background**: `#0B1226` (Deep navy)
- **Primary**: `#7C3AED` (Indigo violet)
- **Accent**: `#6EE7B7` (Teal)
- **Glass Background**: `rgba(255, 255, 255, 0.06)`
- **Glass Border**: `rgba(255, 255, 255, 0.08)`
- **Neutrals**: Slate 50-900

### Typography

- **Display/Headings**: Geist Sans (variable)
- **Body**: Geist Sans (variable)
- **Monospace**: Geist Mono (variable)

### Motion

- **Duration**: 0.4s
- **Easing**: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Stagger**: 0.06s between children
- **Respects**: `prefers-reduced-motion`

## 📦 Components

### Hero (`hero.tsx`)

The main hero section with animated glass cards.

**Features:**

- Large display heading with gradient text
- Animated glass card cluster (desktop only)
- Primary and secondary CTAs
- Background gradient and blur effects
- Fully responsive layout

**Usage:**

```tsx
import { Hero } from "@/features/home/hero";

<Hero />
```

### Services (`services.tsx`)

Grid of service cards showcasing key benefits.

**Features:**

- 6 glass cards with icons
- Hover animations (lift effect)
- Staggered entrance animations
- Responsive grid (1/2/3 columns)

**Usage:**

```tsx
import { Services } from "@/features/home/services";

<Services />
```

**Customization:**
Edit the `services` array in the component to add/remove/modify services.

### Testimonials (`testimonials.tsx`)

Customer testimonials with trust indicators.

**Features:**

- 3 testimonial cards with ratings
- Trust metrics (500+ customers, 15+ years, 100% certified)
- Background decorative blur
- Responsive grid layout

**Usage:**

```tsx
import { Testimonials } from "@/features/home/testimonials";

<Testimonials />
```

**Customization:**
Edit the `testimonials` array to add real customer testimonials.

### ContactCTA (`contact-cta.tsx`)

Contact form with validation and submission.

**Features:**

- React Hook Form + Zod validation
- Glass card design
- Contact information display
- Success/error states
- API integration ready

**Usage:**

```tsx
import { ContactCTA } from "@/features/home/contact-cta";

<ContactCTA />
```

**Form Fields:**

- Name (min 2 characters)
- Email (valid email format)
- Message (min 10 characters)

**API Endpoint:**
Submits to `/api/contact/submit` (stub implementation included)

## 🛠️ Utilities

### Animations (`/lib/animations.ts`)

Framer Motion animation presets:

- `fadeUp` - Fade in while moving up
- `fadeIn` - Simple opacity transition
- `scaleIn` - Scale up from center
- `slideInLeft/Right` - Slide from sides
- `staggerContainer` - Stagger children
- `hoverLift` - Card hover effect
- `floating` - Continuous floating animation
- `defaultTransition` - Standard timing

### GlassCard (`/components/common/glass-card.tsx`)

Reusable glassmorphism card component.

**Props:**

- `variant`: "default" | "bordered" | "elevated"
- `hoverable`: boolean (enables hover effect)
- `padding`: "none" | "sm" | "md" | "lg"

**Example:**

```tsx
<GlassCard hoverable padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</GlassCard>
```

### Container (`/components/common/container.tsx`)

Responsive container with consistent padding.

**Props:**

- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
- `center`: boolean (default: true)
- `noPadding`: boolean (removes horizontal padding)

**Example:**

```tsx
<Container maxWidth="xl">
  <h1>Page Content</h1>
</Container>
```

## 🎯 Accessibility

All components follow accessibility best practices:

- ✅ Semantic HTML elements
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Screen reader friendly
- ✅ Respects `prefers-reduced-motion`

## 🚀 Performance

Optimizations implemented:

- ✅ Server components where possible
- ✅ Client components only for interactivity
- ✅ Lazy loading for non-critical content
- ✅ Optimized animations (GPU-accelerated)
- ✅ Minimal JavaScript bundle

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested across breakpoints.

## 🔧 Customization

### Changing Colors

Edit `/app/globals.css` CSS variables:

```css
:root {
  --bg: #0B1226;
  --primary: #7C3AED;
  --primary: #6EE7B7;
  /* ... */
}
```

### Modifying Animations

Edit `/lib/animations.ts` to adjust timing, easing, or create new presets.

### Adding New Sections

1. Create new component in `/features/home/`
2. Import and add to `/app/page.tsx`
3. Follow existing patterns for consistency

## 📝 Notes

- All components use TypeScript with strict mode
- Framer Motion is used for all animations
- Form validation uses Zod schemas
- API endpoint is a stub - implement email service in production
- Glass effects require backdrop-filter support (modern browsers)

## 🐛 Troubleshooting

**Glass effect not showing:**

- Check browser support for `backdrop-filter`
- Ensure parent has background content to blur

**Animations not working:**

- Verify Framer Motion is installed
- Check for `prefers-reduced-motion` setting

**Form not submitting:**

- Check console for validation errors
- Verify API endpoint is accessible
- Check network tab for request/response

## 📚 Further Reading

- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
