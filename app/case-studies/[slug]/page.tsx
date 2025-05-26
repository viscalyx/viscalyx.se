'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, ExternalLink, CheckCircle } from 'lucide-react'

const caseStudies = [
  {
    slug: 'enterprise-automation-platform',
    title: 'Enterprise Automation Platform',
    client: 'Fortune 500 Financial Services',
    industry: 'Financial Services',
    duration: '6 months',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center',
    overview: 'Complete automation of manual processes across multiple departments, reducing operational costs by 60% and improving efficiency.',
    challenge: 'The client was struggling with manual, time-consuming processes across their operations, compliance, and reporting departments. This led to high operational costs, human errors, and delayed reporting cycles.',
    solution: 'We implemented a comprehensive automation platform using PowerShell DSC, Azure DevOps, and custom workflows to automate infrastructure provisioning, compliance checking, and report generation.',
    technologies: ['PowerShell DSC', 'Azure DevOps', 'Azure Automation', 'Power Platform', 'REST APIs'],
    results: [
      { metric: '60%', description: 'Reduction in operational costs' },
      { metric: '90%', description: 'Decrease in manual errors' },
      { metric: '75%', description: 'Faster reporting cycles' },
      { metric: '40', description: 'Hours saved per week' }
    ],
    testimonial: {
      text: "Viscalyx transformed our operations completely. The automation platform they built has saved us hundreds of hours and significantly reduced our operational costs.",
      author: "Sarah Johnson",
      role: "Director of Operations"
    }
  },
  {
    slug: 'devops-transformation',
    title: 'DevOps Transformation',
    client: 'Healthcare Technology Startup',
    industry: 'Healthcare Technology',
    duration: '4 months',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center',
    overview: 'Complete DevOps transformation enabling faster deployments, improved reliability, and scalable infrastructure.',
    challenge: 'A growing healthcare startup needed to scale their development operations while maintaining HIPAA compliance and ensuring zero-downtime deployments.',
    solution: 'We implemented a complete CI/CD pipeline with automated testing, compliance checks, and blue-green deployments using Azure DevOps and PowerShell DSC.',
    technologies: ['PowerShell DSC', 'Azure DevOps', 'Docker', 'Kubernetes', 'Terraform'],
    results: [
      { metric: '10x', description: 'Faster deployment cycles' },
      { metric: '99.9%', description: 'System uptime achieved' },
      { metric: '100%', description: 'HIPAA compliance maintained' },
      { metric: '50%', description: 'Reduction in deployment issues' }
    ],
    testimonial: {
      text: "The DevOps transformation Viscalyx delivered exceeded our expectations. We went from weekly deployments to multiple deployments per day with zero downtime.",
      author: "Dr. Michael Chen",
      role: "CTO"
    }
  },
  {
    slug: 'cloud-migration',
    title: 'Cloud Migration & Modernization',
    client: 'Manufacturing Corporation',
    industry: 'Manufacturing',
    duration: '8 months',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
    overview: 'Successful migration of legacy systems to Azure cloud with automated scaling and disaster recovery.',
    challenge: 'Legacy on-premises infrastructure was limiting scalability and increasing maintenance costs. The client needed a modern, scalable solution.',
    solution: 'We designed and implemented a phased migration to Azure with automated infrastructure provisioning, monitoring, and disaster recovery using PowerShell DSC and Azure Resource Manager.',
    technologies: ['PowerShell DSC', 'Azure Resource Manager', 'Azure Monitor', 'Logic Apps', 'SQL Database'],
    results: [
      { metric: '45%', description: 'Reduction in infrastructure costs' },
      { metric: '3x', description: 'Improved application performance' },
      { metric: '24/7', description: 'Automated monitoring implemented' },
      { metric: '99.95%', description: 'Disaster recovery SLA achieved' }
    ],
    testimonial: {
      text: "Viscalyx made our cloud migration seamless. Their expertise in automation ensured minimal downtime and maximum efficiency.",
      author: "Jennifer Rodriguez",
      role: "IT Director"
    }
  }
]

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export default function CaseStudyDetail({ params }: { params: { slug: string } }) {
  const caseStudy = caseStudies.find(study => study.slug === params.slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-secondary-600 mb-6">
                {caseStudy.overview}
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center text-secondary-600">
                  <User className="w-5 h-5 mr-2" />
                  <span>{caseStudy.client}</span>
                </div>
                <div className="flex items-center text-secondary-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{caseStudy.duration} • {caseStudy.date}</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src={caseStudy.image}
                alt={caseStudy.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge */}
            <section>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">The Challenge</h2>
              <p className="text-lg text-secondary-600 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Our Solution</h2>
              <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                {caseStudy.solution}
              </p>

              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {caseStudy.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <blockquote className="text-xl italic mb-6">
                "{caseStudy.testimonial.text}"
              </blockquote>
              <div>
                <div className="font-semibold">{caseStudy.testimonial.author}</div>
                <div className="text-primary-200">{caseStudy.testimonial.role}</div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Results */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">Key Results</h3>
              <div className="space-y-6">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{result.metric}</div>
                      <div className="text-secondary-600">{result.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-secondary-900 mb-6">Project Info</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Industry</div>
                  <div className="text-secondary-900">{caseStudy.industry}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Duration</div>
                  <div className="text-secondary-900">{caseStudy.duration}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Year</div>
                  <div className="text-secondary-900">{caseStudy.date}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-secondary-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Transform Your Business?</h3>
              <p className="text-secondary-300 mb-6">
                Let's discuss how we can help automate your processes and drive results.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Get Started
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
