---
agent: agent
description: 'Scaffold a React component (client/server) and related artifacts (tests, translations)'
---

# Create Component

Create `/components/ComponentName.tsx`:

```tsx
'use client' // Only if needed

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface ComponentNameProps {
  // props
}

const ComponentName = ({}: ComponentNameProps) => {
  const t = useTranslations('sectionName')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-900"
    >
      {t('key')}
    </motion.div>
  )
}

export default ComponentName
```

Also create:

1. Test: `/components/__tests__/ComponentName.test.tsx`
2. Translations in `messages/en.json` AND `messages/sv.json`
3. Ensure layout uses responsive Tailwind classes (mobile-first, no fixed widths, works on both mobile and desktop)
