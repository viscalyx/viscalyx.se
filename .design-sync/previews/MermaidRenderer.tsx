import { MermaidRenderer } from 'viscalyx-site'
import guide from '../../public/blog-content/mermaid-diagrams-comprehensive-guide.json'

// MermaidRenderer renders nothing itself: it finds mermaid code blocks inside `.blog-content`
// (as the markdown pipeline emits them) and replaces them with rendered diagrams.
const blocks = [
  ...guide.content.matchAll(
    /<div class="code-block-wrapper mermaid-code-block"[\s\S]*?<\/pre><\/div>/g,
  ),
].map(m => m[0])
const pick = (keyword: string, nth = 0) =>
  blocks.filter(block => block.includes(keyword))[nth] ?? blocks[0]

const Diagram = ({ html }: { html: string }) => (
  <div className="blog-content prose max-w-2xl p-4">
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered post HTML from the repo */}
    <div dangerouslySetInnerHTML={{ __html: html }} />
    <MermaidRenderer contentLoaded />
  </div>
)

// Diagram types that label with SVG <text>. Flowchart/class/state labels live in <foreignObject>,
// which MermaidRenderer's SVG_SANITIZE_OPTIONS currently strips (labels render empty on the site too).
export const SequenceDiagram = () => (
  <Diagram html={pick('sequenceDiagram', 1)} />
)

export const Gantt = () => <Diagram html={pick('gantt')} />

export const Pie = () => <Diagram html={pick('Browser Market Share')} />
