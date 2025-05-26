'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

const CaseStudies = () => {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    // Check if it's a section link (starts with #)
    if (href.startsWith('#')) {
      // If we're not on the home page, navigate to home first
      if (pathname !== '/') {
        router.push(`/${href}`)
      } else {
        // We're already on home page, just scroll to section
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // Regular page navigation
      router.push(href)
    }
  }
  const caseStudies = [
    {
      title: "Global E-commerce Platform Automation",
      client: "Fortune 500 Retail Company",
      industry: "E-commerce",
      challenge: "Manual deployment processes causing 4-hour downtimes",
      solution: "Implemented CI/CD pipeline with automated testing and rollback capabilities",
      results: [
        "99.9% uptime improvement",
        "4 hours to 15 minutes deployment time",
        "80% reduction in deployment errors",
        "$2M annual savings"
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center",
      technologies: ["Azure DevOps", "PowerShell DSC", "Kubernetes", "Terraform"],
      duration: "6 months",
      teamSize: "8 people"
    },
    {
      title: "Healthcare Data Processing Automation",
      client: "Regional Healthcare Network",
      industry: "Healthcare",
      challenge: "Manual patient data processing taking 8 hours daily",
      solution: "Built automated data pipeline with compliance and security controls",
      results: [
        "95% processing time reduction",
        "100% HIPAA compliance maintained",
        "Zero data loss incidents",
        "24/7 automated monitoring"
      ],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center",
      technologies: ["Python", "Apache Airflow", "PostgreSQL", "Docker"],
      duration: "4 months",
      teamSize: "5 people"
    },
    {
      title: "Financial Services Infrastructure Modernization",
      client: "Investment Management Firm",
      industry: "Financial Services",
      challenge: "Legacy infrastructure limiting scalability and compliance",
      solution: "Migrated to cloud-native architecture with automated compliance checks",
      results: [
        "10x infrastructure scalability",
        "60% cost reduction",
        "Automated compliance reporting",
        "99.99% availability SLA"
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center",
      technologies: ["AWS", "Terraform", "Jenkins", "Ansible"],
      duration: "8 months",
      teamSize: "12 people"
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Real results from real clients. See how we've helped organizations
            transform their operations through intelligent automation.
          </p>
        </motion.div>

        <div className="space-y-20">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative h-96 rounded-2xl overflow-hidden group">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-secondary-900">{study.duration}</div>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-secondary-900">{study.teamSize}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {study.industry}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-secondary-900 mb-4">
                  {study.title}
                </h3>

                <p className="text-lg text-secondary-600 mb-6">
                  <strong>Client:</strong> {study.client}
                </p>

                {/* Challenge & Solution */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">Challenge</h4>
                    <p className="text-secondary-600">{study.challenge}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">Solution</h4>
                    <p className="text-secondary-600">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                    Key Results
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {study.results.map((result, resultIndex) => (
                      <motion.div
                        key={resultIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: resultIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-secondary-700 text-sm">{result}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your organization with
              intelligent automation solutions tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleNavigation('#contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50"
              >
                Start Your Project
              </motion.button>
              <motion.button
                onClick={() => handleNavigation('/case-studies')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600"
              >
                View All Case Studies
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudies
