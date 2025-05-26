'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BlogPost = ({ params }: { params: { slug: string } }) => {
  // Mock blog post data - in a real app, this would come from a CMS or API
  const post = {
    title: "The Future of Infrastructure Automation: Trends for 2025",
    content: `
# The Future of Infrastructure Automation: Trends for 2025

As we advance through 2025, the landscape of infrastructure automation continues to evolve at an unprecedented pace. Organizations worldwide are adopting more sophisticated automation strategies to manage complex, multi-cloud environments while maintaining security, compliance, and cost efficiency.

## Key Trends Shaping Infrastructure Automation

### 1. AI-Driven Infrastructure Management

Artificial Intelligence is no longer just a buzzword in infrastructure automation. We're seeing practical implementations where AI algorithms can:

- **Predictive Scaling**: Automatically adjust resources based on predicted demand patterns
- **Anomaly Detection**: Identify unusual behavior in infrastructure components before they cause issues
- **Self-Healing Systems**: Automatically remediate common infrastructure problems without human intervention

### 2. GitOps Everywhere

GitOps has moved beyond Kubernetes deployments and is now being applied to:

- **Infrastructure Provisioning**: Using Git repositories as the single source of truth for infrastructure state
- **Security Policy Management**: Version-controlled security policies that automatically deploy across environments
- **Configuration Management**: Declarative configuration that ensures consistency across all systems

### 3. Platform Engineering Renaissance

The rise of platform engineering teams is creating:

- **Developer Self-Service**: Internal platforms that allow developers to provision resources independently
- **Standardized Workflows**: Consistent deployment patterns across all applications
- **Improved Developer Experience**: Reduced cognitive load on development teams

## PowerShell DSC in Modern Automation

PowerShell Desired State Configuration continues to play a crucial role in Windows-centric environments:

\`\`\`powershell
Configuration WebServerConfig {
    Node 'WebServer' {
        WindowsFeature IIS {
            Ensure = 'Present'
            Name = 'Web-Server'
        }
        
        File WebContent {
            Ensure = 'Present'
            DestinationPath = 'C:\\inetpub\\wwwroot\\index.html'
            Contents = '<h1>Automated Deployment Success!</h1>'
        }
    }
}
\`\`\`

## Challenges and Solutions

### Challenge: Multi-Cloud Complexity
**Solution**: Adopt cloud-agnostic tools and standardized APIs

### Challenge: Security at Scale
**Solution**: Implement policy-as-code and automated compliance checking

### Challenge: Skills Gap
**Solution**: Invest in training and adopt declarative tools that reduce complexity

## Looking Ahead

The future of infrastructure automation lies in:

1. **Increased Abstraction**: Higher-level tools that hide complexity
2. **Better Integration**: Seamless workflows across the entire SDLC
3. **Enhanced Observability**: Better insights into automated systems
4. **Sustainable Practices**: Automation that optimizes for environmental impact

## Conclusion

Infrastructure automation in 2025 is about more than just efficiency—it's about creating resilient, scalable, and sustainable systems that can adapt to changing business needs. Organizations that embrace these trends will find themselves better positioned to compete in an increasingly digital world.

The key is to start small, focus on high-impact areas, and gradually expand automation coverage while maintaining security and reliability standards.
`,
    author: "Johan Ljunggren",
    date: "2024-12-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&crop=center",
    category: "Automation",
    tags: ["Infrastructure", "Automation", "AI", "GitOps", "DevOps"],
    slug: "future-infrastructure-automation-2025"
  }

  const relatedPosts = [
    {
      title: "PowerShell DSC Best Practices for Enterprise Environments",
      slug: "powershell-dsc-best-practices",
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=300&h=200&fit=crop&crop=center"
    },
    {
      title: "Building Resilient CI/CD Pipelines with Azure DevOps",
      slug: "resilient-cicd-azure-devops",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop&crop=center"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
            
            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                {post.title}
              </h1>
              
              <div className="flex items-center text-secondary-600 mb-8">
                <div className="flex items-center mr-6">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center mr-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-secondary-600">Share:</span>
                <button className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow">
                  <Share2 className="w-4 h-4 text-secondary-600" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative h-96 md:h-[500px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-secondary-700 leading-relaxed">
                  {post.content}
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-secondary-200">
                <div className="flex items-center flex-wrap gap-3">
                  <Tag className="w-4 h-4 text-secondary-500" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Author Bio */}
              <div className="mt-12 p-8 bg-secondary-50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    JL
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Johan Ljunggren</h3>
                    <p className="text-secondary-600 mb-4">
                      Founder and Lead Consultant at Viscalyx. Johan is a passionate automation expert 
                      with over 8 years of experience in DevOps, PowerShell DSC, and open-source development. 
                      He's an active contributor to the PowerShell DSC Community and helps organizations 
                      worldwide streamline their infrastructure management.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-primary-600 hover:text-primary-700">LinkedIn</a>
                      <a href="#" className="text-primary-600 hover:text-primary-700">GitHub</a>
                      <a href="#" className="text-primary-600 hover:text-primary-700">Twitter</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              {/* Table of Contents */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-secondary-600 hover:text-primary-600">Key Trends Shaping Infrastructure</a></li>
                  <li><a href="#" className="text-secondary-600 hover:text-primary-600">PowerShell DSC in Modern Automation</a></li>
                  <li><a href="#" className="text-secondary-600 hover:text-primary-600">Challenges and Solutions</a></li>
                  <li><a href="#" className="text-secondary-600 hover:text-primary-600">Looking Ahead</a></li>
                </ul>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="flex space-x-3 group"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPost
