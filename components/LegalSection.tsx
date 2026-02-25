/**
 * Safely casts a `t.raw()` result to a string array.
 * Returns an empty array if the value is not an array.
 */
export const safeTranslationArray = (raw: unknown): string[] =>
  Array.isArray(raw)
    ? raw.filter((item): item is string => typeof item === 'string')
    : []

interface ComponentProps {
  description: string
  items?: string[]
  title: string
}

const LegalSection = ({ title, description, items }: ComponentProps) => (
  <>
    <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
      {title}
    </h2>
    <p
      className={`text-secondary-600 dark:text-secondary-400 ${items && items.length > 0 ? 'mb-6' : 'mb-8'}`}
    >
      {description}
    </p>
    {items && items.length > 0 && (
      <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </>
)

export default LegalSection
