import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  CheckCircle,
} from 'lucide-react'

export function generateStaticParams() {
  const slugs = [
    'enterprise-automation-platform',
    'devops-transformation',
    'cloud-migration',
  ]
  return slugs.map(slug => ({
    slug: slug,
  }))
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('caseStudyDetails')

  // Check if the slug exists in our translations
  const caseStudyExists = t.has(`cases.${slug}.title`)

  if (!caseStudyExists) {
    notFound()
  }

  const caseStudy = {
    slug,
    title: t(`cases.${slug}.title`),
    client: t(`cases.${slug}.client`),
    industry: t(`cases.${slug}.industry`),
    duration: t(`cases.${slug}.duration`),
    date: t(`cases.${slug}.date`),
    overview: t(`cases.${slug}.overview`),
    challenge: t(`cases.${slug}.challenge`),
    solution: t(`cases.${slug}.solution`),
    technologies: t.raw(`cases.${slug}.technologies`) as string[],
    results: t.raw(`cases.${slug}.results`) as Array<{
      metric: string
      description: string
    }>,
    testimonial: {
      text: t(`cases.${slug}.testimonial.text`),
      author: t(`cases.${slug}.testimonial.author`),
      role: t(`cases.${slug}.testimonial.role`),
    },
    // Static image URLs - these could also be moved to translations if needed
    image:
      slug === 'enterprise-automation-platform'
        ? 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center'
        : slug === 'devops-transformation'
          ? 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
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
            {t('backToList')}
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
                  <span>
                    {caseStudy.duration} • {caseStudy.date}
                  </span>
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
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                {t('challenge')}
              </h2>
              <p className="text-lg text-secondary-600 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                {t('solution')}
              </h2>
              <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                {caseStudy.solution}
              </p>

              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {t('technologiesUsed')}
                </h3>
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
                &ldquo;{caseStudy.testimonial.text}&rdquo;
              </blockquote>
              <div>
                <div className="font-semibold">
                  {caseStudy.testimonial.author}
                </div>
                <div className="text-primary-200">
                  {caseStudy.testimonial.role}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Results */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                {t('keyResults')}
              </h3>
              <div className="space-y-6">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {result.metric}
                      </div>
                      <div className="text-secondary-600">
                        {result.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-secondary-900 mb-6">
                {t('projectInfo')}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">
                    {t('industry')}
                  </div>
                  <div className="text-secondary-900">{caseStudy.industry}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">
                    {t('duration')}
                  </div>
                  <div className="text-secondary-900">{caseStudy.duration}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-500 uppercase tracking-wider">
                    {t('year')}
                  </div>
                  <div className="text-secondary-900">{caseStudy.date}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-secondary-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">{t('cta.title')}</h3>
              <p className="text-secondary-300 mb-6">{t('cta.description')}</p>
              <Link
                href="/#contact"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {t('cta.button')}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
