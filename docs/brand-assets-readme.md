# Brand Assets & Guidelines

This directory contains all brand-related assets and documentation for Viscalyx.se.

## 📁 Directory Structure

```text
docs/
├── brand-style-guide.md     # Complete visual style guide
├── brand-assets-readme.md   # This file
└── examples/                # Usage examples and patterns
```

## 🎨 Brand Components

### Available Components

- **BrandShowcase** (`/components/BrandShowcase.tsx`) - Interactive style guide component
- **Header** - Navigation with logo and branding
- **Hero** - Hero section with brand messaging
- **Footer** - Footer with consistent branding

### Usage Examples

#### 1. Using Brand Colors

```tsx
// Primary brand colors
<div className="bg-primary-600 text-white">Main brand blue</div>
<div className="bg-secondary-900 text-white">Dark backgrounds</div>
<span className="text-primary-600">Brand blue text</span>

// Hover states
<button className="hover:bg-primary-700">Darker blue on hover</button>
<a className="hover:text-primary-600">Brand blue text on hover</a>
```

#### 2. Typography Patterns

```tsx
// Headings with brand gradient
<h1 className="text-gradient">Brand gradient text</h1>
<h1 className="text-4xl font-bold text-gradient">Large gradient heading</h1>

// Body text
<p className="text-secondary-700 dark:text-secondary-300">Standard body text</p>
<h2 className="text-secondary-900 dark:text-secondary-100">Heading text</h2>
```

#### 3. Component Patterns

```tsx
// Buttons
<button className="btn-primary">Primary button style</button>
<button className="btn-secondary">Secondary button style</button>

// Cards
<div className="card-hover">Card with hover effects</div>
<div className="bg-white dark:bg-secondary-800 rounded-lg p-6">Card base</div>

// Containers
<div className="container-custom">Max-width container</div>
<section className="section-padding">Standard section padding</section>
```

## 🎯 Brand Guidelines

### Logo Usage

- Always use the favicon as the brand mark
- Pair with "Viscalyx" wordmark in brand font
- Maintain proper spacing and contrast
- Use the gradient text effect for the brand name

### Color Guidelines

- **Primary Blue**: Use for CTAs, links, and brand elements
- **Secondary Gray**: Use for text, backgrounds, and neutral elements
- **Accent Colors**: Use sparingly for status indicators and highlights
- **Dark Mode**: All colors have dark mode variants

### Typography Guidelines

- **Font**: Inter (system-ui fallback)
- **Hierarchy**: Use consistent font sizes and weights
- **Contrast**: Ensure WCAG AA compliance
- **Line Height**: 1.5 for body text, 1.2 for headings

### Animation Guidelines

- **Subtle**: Prefer subtle animations over dramatic ones
- **Purposeful**: Animations should enhance UX
- **Performance**: Use CSS transforms and opacity
- **Accessibility**: Respect `prefers-reduced-motion`

## 📋 Quick Reference

### CSS Classes

```css
/* Brand Colors */
.text-primary-600        /* Brand blue text */
.bg-primary-600          /* Brand blue background */
.text-gradient           /* Brand gradient text */

/* Layout */
.container-custom        /* Max-width container */
.section-padding         /* Standard section padding */

/* Components */
.btn-primary             /* Primary button */
.btn-secondary           /* Secondary button */
.card-hover              /* Card with hover effects */

/* Utilities */
.gradient-bg             /* Brand gradient background */
```

### Color Variables

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-600: #2563eb; /* Main brand color */
--primary-700: #1d4ed8;

/* Secondary Colors */
--secondary-100: #f1f5f9;
--secondary-700: #334155;
--secondary-900: #0f172a;
```

## 🔧 Development

### Adding New Brand Components

1. Follow existing component patterns
2. Use TypeScript interfaces for props
3. Include proper accessibility attributes
4. Add responsive design considerations
5. Include dark mode support
6. Add tests for new components

### Testing Brand Components

```bash
# Run brand component tests
npm test -- --testPathPattern=Brand

# Run all component tests
npm test components
```

### Building Brand Assets

```bash
# Build and optimize assets
npm run build

# Generate style guide
npm run dev
# Visit /brand-showcase
```

## 📖 Resources

### Internal Documentation

- [Complete Style Guide](./brand-style-guide.md)
- [Component Library](/components/)
- [Tailwind Config](/tailwind.config.js)

### External Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://rsms.me/inter/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🚀 Live Examples

### Brand Showcase

Visit `/brand-showcase` to see the interactive brand guide with:

- Color palette demonstrations
- Typography examples
- Component showcases
- Animation patterns
- Accessibility features

### Production Examples

- Header navigation with logo
- Hero section with brand messaging
- Footer with brand consistency
- Button components with brand styles
- Card components with hover effects

## 📝 Contribution Guidelines

When contributing to brand assets:

1. **Consistency**: Follow existing patterns and guidelines
2. **Documentation**: Update this README and style guide
3. **Testing**: Add tests for new components
4. **Accessibility**: Ensure WCAG compliance
5. **Performance**: Optimize for speed and efficiency
6. **Responsiveness**: Test on multiple device sizes

## 🔍 Maintenance

### Regular Reviews

- [ ] Color contrast compliance
- [ ] Typography hierarchy
- [ ] Component consistency
- [ ] Animation performance
- [ ] Accessibility standards
- [ ] Brand guideline adherence

### Update Process

1. Review brand requirements
2. Update components and styles
3. Test across all breakpoints
4. Update documentation
5. Deploy changes

---

For questions about brand usage or guidelines, please refer to the [Complete Style Guide](./brand-style-guide.md) or contact the development team.
