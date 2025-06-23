# Alert Icons Implementation

This document describes the implementation of React-based alert icons for blog post blockquotes.

## Overview

The alert icon system has been migrated from external SVG files to React components that are dynamically injected into blog post content during runtime.

## Components

### AlertIcon Component (`components/BlogIcons.tsx`)

A unified component that renders different icon types based on the `type` prop:

```tsx
<AlertIcon type="note" className="w-5 h-5" />
<AlertIcon type="tip" className="w-5 h-5" />
<AlertIcon type="important" className="w-5 h-5" />
<AlertIcon type="warning" className="w-5 h-5" />
<AlertIcon type="caution" className="w-5 h-5" />
```

### AlertIconInjector Component (`components/AlertIconInjector.tsx`)

A client-side component that:

1. Searches for alert title elements with `data-alert-icon` attributes
2. Dynamically injects the appropriate React icon components
3. Prevents duplicate icons on re-renders

### Blockquote Plugin (`scripts/plugins/blockquote-types.js`)

Updated to add `data-alert-icon` attributes to alert titles, enabling the AlertIconInjector to identify which icons to inject.

## Usage in Blog Posts

Use GitHub-style alert syntax in markdown:

```markdown
> [!NOTE]
> This is a note with a blue info icon.

> [!TIP]
> This is a tip with a green lightbulb icon.

> [!IMPORTANT]
> This is important information with a purple speech bubble icon.

> [!WARNING]
> This is a warning with an orange triangle icon.

> [!CAUTION]
> This is a caution with a red octagon icon.
```

## Benefits

1. **Reduced Bundle Size**: No external SVG files needed
2. **Dynamic Rendering**: Icons are rendered as React components
3. **Theme Compatibility**: Icons automatically adapt to light/dark themes
4. **Maintainability**: All icon logic centralized in React components
5. **Accessibility**: Proper aria-labels and semantic HTML

## Files Modified

- `components/BlogIcons.tsx` - Added AlertIcon component and helper functions
- `components/AlertIconInjector.tsx` - Created client-side icon injection component
- `app/[locale]/blog/[slug]/page.tsx` - Integrated AlertIconInjector wrapper
- `scripts/plugins/blockquote-types.js` - Added data attributes for icon types
- `app/globals.css` - Removed CSS mask-image references for external SVGs
- Removed: `public/icons/*.svg` - External icon files no longer needed

## Testing

The AlertIcon component includes comprehensive unit tests that verify:

- Correct rendering for all icon types
- Custom className support
- Fallback behavior for invalid types
- Helper function functionality

Tests can be run with:

```bash
npm test -- --testNamePattern="AlertIcon"
```
