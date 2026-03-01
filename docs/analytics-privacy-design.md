# Analytics Privacy Design

> [!IMPORTANT]
>
> **Hashed IP storage is DISABLED.**
>
> The `storeHashedIP` gate in
> `app/api/analytics/blog-read/route.ts` is set to `false`.
> No pseudonymized visitor IDs are stored. All analytics data is
> currently **fully anonymous** and falls outside GDPR scope.
> The hashing infrastructure is retained so it can be re-enabled
> if unique-visitor counting is needed in the future. See the
> "IP Hashing Mechanism" section below for technical details.
>
> **To re-enable**, make the following changes:
>
> 1. Set `const storeHashedIP = true` in
>    `app/api/analytics/blog-read/route.ts`
> 2. Change `purposeKey` for the `cf-analytics` entry in
>    `lib/cookie-consent.ts` from `'cookies.cfAnalytics.purpose'`
>    to `'cookies.cfAnalytics.purposeWithVisitorId'`
> 3. Both translation keys already exist in `messages/en.json`
>    and `messages/sv.json` under `cookieConsent.cookies.cfAnalytics`

## Overview

The blog-read analytics endpoint (`app/api/analytics/blog-read/route.ts`)
collects visitor metrics for content optimization while preserving user privacy.
Raw IP addresses are **never stored**. Instead, they are one-way hashed into
pseudonymized visitor IDs using HMAC-SHA-256.

## IP Hashing Mechanism

The `hashIP()` function in the analytics route implements the following scheme:

1. **Secret key** — loaded from the `ANALYTICS_HASH_SECRET` environment
   variable. The HMAC key is cached in memory and re-imported only when the
   secret rotates.
2. **Daily-rotating salt** — the current date (`YYYY-MM-DD`) is prepended to the
   IP address before hashing. This limits the window during which the same
   visitor produces the same hash, further reducing re-identification risk.
3. **HMAC-SHA-256** — the salted value is signed with `crypto.subtle.sign`,
   producing a one-way hash. The result is stored as a hex string in the
   Cloudflare Analytics Engine data point (`blob7`).
4. **Fallback** — if the IP header is missing, the string `'anonymous'` is
   stored instead.

### Why re-identification is possible

The daily salt is the calendar date (`YYYY-MM-DD`). It is deterministic and
easy to reproduce for any day, so it does not provide secrecy. Its purpose is
only to prevent the same IP address from producing the same hash across
different days.

Re-identification is possible if a party has:

1. The HMAC secret (`ANALYTICS_HASH_SECRET`)
2. A candidate IP address
3. The date

With those inputs, they can recompute the hash and check whether it matches the
stored value for that day.

Because reproduction is possible with additional information (secret + IP +
date), this data is **pseudonymized** under GDPR, not anonymized. This is why
the cookie consent text in `lib/cookie-consent.ts` uses the term
**"pseudonymized visitor ID"**.

### Pseudonymized visitor ID

Under GDPR terminology the hashed visitor ID is classified as **pseudonymized**
data. **Pseudonymization** is defined in Article 4(5) as:

> Processing personal data in such a way that it can no longer be
> attributed to a specific data subject without the use of additional
> information.
>
> — GDPR Article 4(5)

The visitor ID has undergone processing so that it can no longer be
attributed to a specific person without additional information (here: the
HMAC secret and the raw IP). It is still considered personal data under GDPR
but benefits from reduced obligations.

## Purpose Limitation and Lawful Basis (Articles 5 and 6)

Pseudonymization supports using data for secondary purposes — especially
research and statistics — and helps demonstrate compliance with the data
minimization principle. However, two obligations remain:

1. **A lawful basis is still required** — pseudonymized data is still
   personal data, so processing must be grounded in one of the lawful
   bases in Article 6(1).
2. **Purpose limitation still applies** — the data may only be used for
   the purposes specified at the time of collection, unless a
   compatibility assessment under Article 6(4) permits further
   processing.

The following table maps these requirements to the current
implementation.

<!-- markdownlint-disable MD013 -->
| Requirement | Implementation |
| --- | --- |
| Lawful basis | Processing is based on **consent** (Article 6(1)(a)). The cookie consent banner requires explicit opt-in for the analytics category before any data is collected. |
| Specified purpose | Data is collected solely for **content optimization** — understanding which blog posts are read, how far, and for how long. This purpose is stated in the cookie consent description. |
| Data minimization | Only the minimum fields needed for content analytics are collected (see data table below). IP addresses are pseudonymized; no account, email, or directly identifying data is stored. |
| Secondary use | No secondary processing is performed. If analytics data were to be used for research or statistics in the future, a compatibility assessment under Article 6(4) would be required, taking into account that pseudonymization is applied. |
<!-- markdownlint-enable MD013 -->

### Research and statistical use (Article 89)

Article 89 provides safeguards for processing personal data for
scientific research, historical research, and statistical purposes.
Pseudonymization is strongly recommended for these activities and
is considered a key technical safeguard.

When data is processed under Article 89, organizations must implement
appropriate safeguards including:

- **Pseudonymization** or other technical measures to minimize the
  risk to data subjects
- **Data minimization** — ensuring no more data is processed than
  necessary for the research or statistical purpose
- Respect for derogations that Member States may provide regarding
  data subject rights (e.g., limiting access or erasure rights when
  it would seriously impair the research objective)

The current analytics implementation already applies pseudonymization
(HMAC-SHA-256 hashed visitor IDs) and collects only the minimum fields
needed for content analytics. If the data were to be repurposed for
research or statistics, these existing safeguards would satisfy the
Article 89 requirements. A separate compatibility assessment under
Article 6(4) would still be needed before any secondary use begins.

## Data Collected per Analytics Event

| Field            | Stored in   | Description                               |
| ---------------- | ----------- | ----------------------------------------- |
| slug             | `blob1`     | Blog post slug                            |
| title            | `blob2`     | Blog post title                           |
| category         | `blob3`     | Blog post category                        |
| country          | `blob4`     | Cloudflare-detected country code          |
| user agent       | `blob5`     | Browser user-agent string                 |
| event type       | `blob6`     | `page-view`, `read-progress`, or `exit`   |
| pseudonymized ID | `blob7`     | HMAC-SHA-256 hashed IP (daily salt)       |
| read progress    | `double1`   | Percentage of article read (0–100)        |
| time spent       | `double2`   | Seconds spent on the page                 |

## GDPR Data Subject Rights

Because the hashed visitor ID is pseudonymized personal data, GDPR data
subject rights still apply. The table below describes each right, what it
means for the user, and how it can be upheld.

<!-- markdownlint-disable MD013 -->

| Right | What it means for the user | How we uphold it |
| --- | --- | --- |
| **Access** (Art. 15) | A user may request a copy of all personal data held about them. | Requires the user to provide their IP address(es) and approximate visit dates. We recompute the HMAC hash for each date and query Cloudflare Analytics Engine for matching `blob7` records. Due to dynamic IPs and daily salt rotation, a complete match cannot be guaranteed. |
| **Rectification** (Art. 16) | A user may request correction of inaccurate personal data. | Analytics data reflects observed behavior (page views, read progress, time spent) and request metadata (country, user agent). These are factual server-side observations, so rectification is not practically applicable. If a user disputes a record, it can be annotated or deleted. |
| **Erasure** (Art. 17) | A user may request deletion of their personal data ("right to be forgotten"). | Same identification process as access. Matched records can be excluded from future queries; however, Cloudflare Analytics Engine has fixed retention periods and may not support individual record deletion. Rotating the `ANALYTICS_HASH_SECRET` effectively breaks the link between stored hashes and any real IP, providing a bulk pseudonymization reset. |
| **Restriction** (Art. 18) | A user may request that processing of their data is limited. | Withdrawing analytics consent via the cookie consent banner immediately stops future data collection. For already-stored data, the same identification-and-exclusion process as erasure applies. |
| **Objection** (Art. 21) | A user may object to processing of their personal data. | The cookie consent banner provides an opt-out mechanism. When analytics consent is withdrawn, no further analytics data is collected. No server-side processing occurs for opted-out visitors. |

<!-- markdownlint-enable MD013 -->

### Practical limitations

- **Identification difficulty** — the daily-rotating salt and dynamic
  residential IPs make it very hard to locate all historical records
  for a specific user. The user must supply their IP(s) and visit
  dates to enable lookup.
- **Analytics Engine constraints** — Cloudflare Analytics Engine has
  a fixed retention window and may not support per-record deletion.
  Excluding matched records from query results is the primary
  mechanism.
- **Path to full anonymization** — dropping the hashed visitor ID
  entirely (replacing it with `'anonymous'` or a random per-request
  UUID) would make all analytics data truly anonymous, removing it
  from GDPR scope and eliminating data subject rights obligations.
  The trade-off is losing per-day unique visitor counting.

## Security Requirements (Article 32)

GDPR Article 32 requires organizations to implement appropriate technical
and organizational measures. Pseudonymization is specifically mentioned as
an appropriate security measure. The following table maps each requirement
to how this project addresses it.

<!-- markdownlint-disable MD013 -->
| Requirement | Implementation |
| --- | --- |
| Technical safeguards (encryption, hashing, tokenization) | HMAC-SHA-256 hashing of IP addresses with a server-side secret key and daily-rotating salt. |
| Access controls | The `ANALYTICS_HASH_SECRET` is stored as a Cloudflare environment variable, accessible only to the production runtime — not committed to source control. |
| Separation of identifying data from pseudonymized data | Raw IP addresses are never stored. The only persisted form is the one-way HMAC hash in Cloudflare Analytics Engine, which is separated from any directly identifying information. |
| Protection of the re-identification key | The HMAC secret is managed via Cloudflare Workers secrets. Rotating the secret breaks the link between stored hashes and any real IP address. |
<!-- markdownlint-enable MD013 -->

### Key separation requirements

GDPR requires that additional information needed for re-identification
(such as a key, mapping table, or code book) must be:

1. **Kept separately** from the pseudonymized data
2. **Protected with technical and organizational measures** to prevent
   re-identification of the data subject

The following table maps these requirements to the current implementation.

<!-- markdownlint-disable MD013 -->
| Requirement | Implementation |
| --- | --- |
| Separate storage | The HMAC secret (`ANALYTICS_HASH_SECRET`) is stored in Cloudflare Workers secrets, completely separate from the pseudonymized hashes in Analytics Engine. There is no mapping table or code book — only the secret key enables hash verification. |
| Technical protection | The secret is never committed to source control, not included in build artifacts, and only accessible at runtime by the Workers process. Access is controlled by Cloudflare's IAM permissions on the account. |
| Organizational protection | Only authorized team members with Cloudflare dashboard access can view or rotate the secret. Secret rotation is documented as the mechanism to break the link between stored hashes and real IPs. |
<!-- markdownlint-enable MD013 -->

## References

<!-- markdownlint-disable MD013 -->

- [`app/api/analytics/blog-read/route.ts`](../app/api/analytics/blog-read/route.ts) —
  `hashIP()` implementation and `writeDataPoint` call

<!-- markdownlint-enable MD013 -->
- [`lib/cookie-consent.ts`](../lib/cookie-consent.ts) — cookie registry entry
  for `cf-analytics`
