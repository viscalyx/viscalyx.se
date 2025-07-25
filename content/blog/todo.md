# TODO

Fixa bilder

Here’s a consolidated list of all the email addresses and social/profile links used across the site.

Email addresses

info@viscalyx.se – general/site inquiries (footer) and code of conduct
johan.ljunggren@viscalyx.se – Johan Ljunggren (team member)
privacy@viscalyx.se – contact for Privacy Policy
legal@viscalyx.se – contact for Terms of Service

Social/Profile links

Company (footer)
• GitHub: https://github.com/viscalyx
• LinkedIn: https://linkedin.com/company/viscalyx
• X (Twitter): https://x.com/viscalyx
• Bluesky: https://bsky.app/profile/viscalyx.com
• Mastodon: https://mastodon.social/@viscalyx

Johan Ljunggren (team member)
• LinkedIn: https://linkedin.com/in/johlju
• Bluesky: https://bsky.app/profile/johlju.bsky.social
• Mastodon: https://mastodon.social/@johlju
• X (Twitter): https://twitter.com/johlju
• Discord: https://discord.com/users/562649782665871360
• GitHub: https://github.com/johlju

The page for terms, when is it necessary for a website, and is that applicable for this project, this website?

[Microsoft.Windows/WindowsPowerShell DSC Resource Reference](https://learn.microsoft.com/sv-se/powershell/dsc/reference/resources/microsoft/windows/windowspowershell)

Fix blog article for xplat Folder: https://github.com/gaelcolas/Sampler/tree/main/Sampler/Templates/MofResource

Python resource: https://gijsreijn.medium.com/building-microsoft-dsc-v3-resources-with-python-30d6171de995

Schema example Windows PowerShell: https://github.com/PowerShell/DSC/blob/main/dsc/examples/powershell.dsc.yaml

Schema examples: https://github.com/PowerShell/DSC/tree/main/dsc/examples

$desiredParameters = @{
InstanceName = 'Demo'
AcceptLicensingTerms = $true
Action = 'Install'
MediaPath = [System.IO.Path]::GetTempPath()
} | ConvertTo-Json -Compress

dsc resource get --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters
dsc resource get --resource SqlServerDsc/SqlRSSetup --output-format json --input '{"MediaPath":"/tmp/","AcceptLicensingTerms":true,"Action":"Install","InstanceName":"PBIRS"}'

dsc resource list --adapter Microsoft.Windows/WindowsPowerShell

## Older

Important color - in Components showcase (background color)
globals diff - removed stuff
Notification component, should be used by Send Message

Add background color (Components and Contact send):
bg-[#059669]/10 dark:bg-[#059669]/20 border border-success-dark/30 dark:border-success-dark/50'

In lib/colors.ts between lines 30 and 62, the primary and secondary color arrays
are hardcoded, which risks de-synchronization with the CSS custom properties in
globals.css. To fix this, refactor by extracting the color values into a shared
constant file (e.g., lib/theme-colors.ts) that exports a single source of truth
for colors. Then update getPrimaryColors and getSecondaryColors to reference
this shared constant. Alternatively, implement a build-time validation script to
compare CSS and TypeScript colors or modify the code to read CSS custom
properties dynamically via computed styles to ensure consistency.

For this site I'm having a problem with how I can manage the brand color palette used throughout the site. I do not want to use Tailwind CSS colors because if those hex values changes then the brand color palette will not match. I need a color palette that I can control, and when brand profile need to change there is a simple and clear way to change them (simple descriptive names for color and how they are used). Do you have suggestion how to do this?

---

- --font-sans: Inter, system-ui, sans-serif;

<!-- cspell:disable -->

- --font-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
<!-- cspell:enable -->

In app/globals.css around lines 33 to 34, the font stack for --font-sans is
minimal and lacks comprehensive fallbacks. Enhance the font stack by adding
additional system fonts and common fallbacks to improve cross-platform
consistency and ensure better font rendering across different devices and
operating systems.

---

Can you compare the colors used by the site and what is listed in the ./components/brandprofile and just list any colors that is diverted from brand profile

Add more advanced features like search, pagination, or category filtering

- Basic blockquote styling could be more visually appealing
  - Create more distinctive blockquote styles (with icons, gradients)
- Limited typography variations for different content types
  - Implement content type-specific styling (tutorials vs. guides vs. news)
- Implement functional social sharing
- Improve mobile reading experience
- Playwright

## Analyze Project Structure and Key Files

Okay, I've reviewed your project structure and some key files. Here are some suggestions for improving and customizing your blog post styling and layout, building on what you already have:

**Styling (Tailwind CSS & globals.css):**

- **Refine Typography in globals.css:**
  - You've defined basic prose styles. Consider expanding these for more granular control. For example, you could add specific styles for different heading levels within the `.prose` scope if the default Tailwind typography plugin styles aren't sufficient.
  - **Blockquotes:** The current style is a good start. You could experiment with different border styles, background colors, or even add a quotation mark icon for more visual flair.
  - **Links:** Ensure link styles are distinct and have clear hover/focus states for accessibility.
- **Leverage Tailwind CSS Theme (tailwind.config.js):**
  - **Custom Fonts:** You're using 'Inter'. If you want more unique branding, consider adding custom web fonts and defining them in your tailwind.config.js `theme.extend.fontFamily`.
  - **Spacing Scale:** Review Tailwind's default spacing scale. If you find yourself needing custom margin/padding values frequently, consider extending the spacing scale in your config for consistency.
  - **Color Palette:** Your primary and secondary color palettes are well-defined. Ensure they offer enough contrast for accessibility, especially for text against backgrounds.
- **Dark Mode Enhancements:**
  - You have dark mode set up. Thoroughly test all blog elements in dark mode to ensure readability and visual appeal. Pay attention to text contrast, image visibility, and how code blocks look.

**Layout (page.tsx):**

- **Hero Section:**
  - The current hero section with title, metadata, and category is clean.
  - **Author Image:** Instead of just "JL" in a circle for the author bio, consider allowing authors to have profile images. You could fetch this from a Gravatar, a local path, or a field in your blog data.
  - **Share Functionality:** The share button is present. Ensure it's functional and consider which social platforms are most relevant to your audience. You might want to use a library for more robust social sharing features (e.g., showing share counts).
- **Featured Image:**
  - The full-width featured image is impactful.
  - **Image Optimization:** Ensure images are optimized for the web (correct format, compression, responsive sizes using `next/image` `fill` and `object-cover` is good). Consider lazy loading for images below the fold if not already handled by `next/image`.
- **Main Content Area:**
  - **Table of Contents (ToC):**
    - The mobile ToC in a `<details>` element is a good solution for small screens.
    - The sticky ToC on larger screens is excellent for navigation. Ensure the `max-h-[calc(100vh-8rem)] overflow-y-auto` provides a good user experience and doesn't become too long or difficult to scroll on various screen heights.
    - **Active State:** Highlight the current section in the ToC as the user scrolls. This can be done with JavaScript by observing section visibility.
  - **Prose Styling:** The `prose prose-lg` classes from Tailwind's typography plugin are a great starting point. You've customized some aspects in globals.css. Continue to refine this.
  - **Image Handling within Content:** How are images within the Markdown content handled? Ensure they are responsive and perhaps have a consistent styling (e.g., centered, with captions). You might need to customize the Markdown renderer or add specific CSS for `img` tags within the `.markdown-content`.
  - **Call-to-Action (CTA):** Consider adding a CTA at the end of blog posts, such as a newsletter sign-up, a link to related services, or an invitation to comment.
- **Tags:**
  - The tag styling is good. Ensure the hover effect is noticeable and provides good feedback.
  - Consider making tags clickable, leading to a page that lists all blog posts with that tag.
- **Author Bio:**
  - This is a good standard author bio.
  - As mentioned, an author image would be a nice addition.
  - Ensure the social links are functional and open in a new tab.
- **Related Posts:**
  - Displaying related posts with images and titles is effective.
  - **Algorithm:** How are related posts determined? If it's by category or tags, that's a good start. More advanced methods could involve content similarity.
  - **Visuals:** The hover effect (scale on image) is a nice touch.

**Content (`.md` files):**

- **Markdown Structure:** Encourage consistent use of Markdown for headings, lists, code blocks, etc., to ensure the styling is applied correctly.
- **Image Alt Text:** Emphasize the importance of descriptive alt text for all images for accessibility and SEO.
- **Frontmatter:** Your frontmatter is comprehensive. Ensure all fields are consistently used.

**General & Advanced:**

- **Performance:**
  - Continuously monitor your Lighthouse scores or use other performance testing tools.
  - Optimize images, minify CSS/JS (Next.js handles much of this), and leverage browser caching.
- **Accessibility (a11y):**
  - Regularly test with screen readers and keyboard navigation.
  - Ensure sufficient color contrast.
  - Use semantic HTML.
- **Search Functionality:** (As mentioned in your `todo.txt`) This would be a significant improvement. You could implement this by:
  - Client-side search for smaller blogs (filtering your `blog-data.json`).
  - Server-side search or using a third-party search service (like Algolia) for larger blogs.
- **Pagination:** (As mentioned in your `todo.txt`) If your main blog listing page (`/blog`) shows many posts, pagination is crucial.
- **Category/Tag Filtering Pages:** Create dedicated pages that list all posts for a specific category or tag. This improves navigation and content discovery.
- **Comments Section:** Consider adding a comments section using a service like <!-- cspell:disable-next-line -->Disqus, Commento, or building your own.

By focusing on these areas, you can significantly enhance the visual appeal, user experience, and functionality of your blog posts. Prioritize based on what you feel will provide the most value to your readers.

```yaml
# yaml-language-server: $schema=https://aka.ms/configuration-dsc-schema/0.2
properties:
  assertions:
    - resource: Microsoft.Windows.Developer/OsVersion
      directives:
        description: Verify min OS version requirement
        allowPrerelease: true
      settings:
        MinVersion: '10.0.22000'
  resources:
    - resource: SqlServerDsc/SqlRSSetup
      id: installPBIRS
      directives:
        description: Deploy Power BI Report Server on a target machine.
        allowPrerelease: true
        securityContext: elevated
      settings:
        InstanceName: 'PBIRS'
        Action: 'Install'
        AcceptLicensingTerms: true
        MediaPath: 'C:\Users\sqladmin\AppData\Local\Temp\2\PowerBIReportServer.exe' #'path to media executable'
        Edition: 'Developer'
  configurationVersion: 0.2.0
```
