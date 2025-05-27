'use client'

import { motion } from 'framer-motion'
import {
  Building,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const CaseStudiesPage = () => {
  const caseStudies = [
    {
      title: 'Global E-commerce Platform Automation',
      client: 'Fortune 500 Retail Company',
      industry: 'E-commerce',
      challenge:
        'Manual deployment processes causing 4-hour downtimes during peak shopping seasons, leading to significant revenue loss and customer dissatisfaction.',
      solution:
        'Implemented a comprehensive CI/CD pipeline with automated testing, blue-green deployments, and automated rollback capabilities using Azure DevOps and Kubernetes.',
      results: [
        '99.9% uptime improvement during Black Friday',
        '4 hours to 15 minutes deployment time',
        '80% reduction in deployment errors',
        '$2M annual savings in operational costs',
        '50% faster time-to-market for new features',
      ],
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&crop=center',
      technologies: [
        'Azure DevOps',
        'PowerShell DSC',
        'Kubernetes',
        'Terraform',
        'Docker',
      ],
      duration: '6 months',
      teamSize: '8 people',
      slug: 'global-ecommerce-automation',
    },
    {
      title: 'Healthcare Data Processing Automation',
      client: 'Regional Healthcare Network',
      industry: 'Healthcare',
      challenge:
        'Manual patient data processing taking 8 hours daily, with high risk of errors in critical patient information and compliance issues.',
      solution:
        'Built an automated data pipeline with real-time processing, HIPAA compliance controls, and automated data validation using Python and Apache Airflow.',
      results: [
        '95% processing time reduction',
        '100% HIPAA compliance maintained',
        'Zero data loss incidents',
        '24/7 automated monitoring',
        '99.99% data accuracy improvement',
      ],
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop&crop=center',
      technologies: [
        'Python',
        'Apache Airflow',
        'PostgreSQL',
        'Docker',
        'Kubernetes',
      ],
      duration: '4 months',
      teamSize: '5 people',
      slug: 'healthcare-data-automation',
    },
    {
      title: 'Financial Services Infrastructure Modernization',
      client: 'Investment Management Firm',
      industry: 'Financial Services',
      challenge:
        'Legacy infrastructure limiting scalability, high operational costs, and difficulty meeting regulatory compliance requirements.',
      solution:
        'Migrated to cloud-native architecture with automated compliance checks, infrastructure as code, and comprehensive monitoring solutions.',
      results: [
        '10x infrastructure scalability',
        '60% cost reduction',
        'Automated compliance reporting',
        '99.99% availability SLA',
        '75% faster incident response',
      ],
      image:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop&crop=center',
      technologies: ['AWS', 'Terraform', 'Jenkins', 'Ansible', 'Prometheus'],
      duration: '8 months',
      teamSize: '12 people',
      slug: 'financial-infrastructure-modernization',
    },
    {
      title: 'Manufacturing IoT Automation Platform',
      client: 'Global Manufacturing Corporation',
      industry: 'Manufacturing',
      challenge:
        'Disconnected IoT devices, manual data collection, and lack of real-time insights into production processes.',
      solution:
        'Developed a comprehensive IoT automation platform with real-time data collection, predictive analytics, and automated quality control.',
      results: [
        '40% increase in production efficiency',
        'Real-time monitoring of 10,000+ devices',
        '90% reduction in quality defects',
        '$5M annual cost savings',
        'Predictive maintenance capabilities',
      ],
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop&crop=center',
      technologies: ['Node.js', 'MongoDB', 'InfluxDB', 'Grafana', 'Azure IoT'],
      duration: '10 months',
      teamSize: '15 people',
      slug: 'manufacturing-iot-automation',
    },
    {
      title: 'Educational Platform Scalability Solution',
      client: 'Online Learning Platform',
      industry: 'Education',
      challenge:
        "Platform couldn't handle traffic spikes during enrollment periods, causing system crashes and lost revenue.",
      solution:
        'Implemented auto-scaling infrastructure, load balancing, and performance optimization with comprehensive monitoring.',
      results: [
        '500% traffic handling capacity',
        '99.9% uptime during peak periods',
        '50% faster page load times',
        'Zero revenue loss during enrollment',
        'Automated scaling based on demand',
      ],
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop&crop=center',
      technologies: [
        'React',
        'Node.js',
        'AWS Lambda',
        'CloudFront',
        'DynamoDB',
      ],
      duration: '5 months',
      teamSize: '7 people',
      slug: 'education-platform-scalability',
    },
    {
      title: 'Retail Chain Inventory Automation',
      client: 'National Retail Chain',
      industry: 'Retail',
      challenge:
        'Manual inventory tracking across 200+ stores, frequent stockouts, and overstock situations leading to lost sales.',
      solution:
        'Created an automated inventory management system with real-time tracking, predictive restocking, and supply chain optimization.',
      results: [
        '85% reduction in stockouts',
        '30% inventory carrying cost reduction',
        'Real-time visibility across all stores',
        '$3M increase in annual revenue',
        'Automated supplier integration',
      ],
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&crop=center',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'RabbitMQ', 'React'],
      duration: '7 months',
      teamSize: '10 people',
      slug: 'retail-inventory-automation',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              Success <span className="text-gradient">Stories</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              Discover how we've helped organizations across industries
              transform their operations with intelligent automation solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <div className="grid gap-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="relative h-96 rounded-2xl overflow-hidden group">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Floating Stats */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Building className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.industry}
                          </div>
                        </div>
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.duration}
                          </div>
                        </div>
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Users className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.teamSize}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                    {study.title}
                  </h2>

                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-6">
                    {study.client}
                  </p>

                  {/* Challenge & Solution */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        Challenge
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                        {study.challenge}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        Solution
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Key Results */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                      Key Results
                    </h3>
                    <div className="grid gap-2">
                      {study.results.slice(0, 3).map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-secondary-700 dark:text-secondary-300 text-sm">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
                  >
                    Read Full Case Study
                    <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary-50 dark:bg-secondary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                Every successful automation journey starts with understanding
                your unique challenges. Let's discuss how we can help you
                achieve similar results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50"
                >
                  Start Your Project
                </motion.a>
                <motion.a
                  href="/blog"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600"
                >
                  Learn More
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CaseStudiesPage
