import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/structured-data'

export default function Head() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationJsonLd())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getWebSiteJsonLd())}
      </script>
    </>
  )
}
