'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Cog,
  Server,
  GitBranch,
  Shield,
  Zap,
  Database,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      icon: Cog,
      title: "Task Automation",
      description: "Eliminate repetitive manual processes with intelligent automation solutions tailored to your specific workflow needs.",
      features: ["Custom PowerShell Scripts", "Workflow Optimization", "Process Documentation", "Error Handling & Logging"],
      color: "primary"
    },
    {
      icon: Server,
      title: "DevOps Solutions",
      description: "Streamline your development pipeline with modern DevOps practices and infrastructure automation.",
      features: ["CI/CD Pipeline Setup", "Infrastructure as Code", "Container Deployment", "Monitoring & Alerting"],
      color: "secondary"
    },
    {
      icon: GitBranch,
      title: "PowerShell DSC",
      description: "Implement Desired State Configuration for consistent and reliable system management across your infrastructure.",
      features: ["Configuration Management", "Compliance Monitoring", "Drift Detection", "Automated Remediation"],
      color: "primary"
    },
    {
      icon: Shield,
      title: "Security Automation",
      description: "Enhance your security posture with automated security checks, compliance monitoring, and threat response.",
      features: ["Security Scanning", "Compliance Auditing", "Vulnerability Assessment", "Incident Response"],
      color: "secondary"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Automate data processing, backup strategies, and database maintenance tasks for improved reliability.",
      features: ["Automated Backups", "Data Migration", "Database Optimization", "Reporting Automation"],
      color: "primary"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Identify bottlenecks and implement solutions to dramatically improve system and application performance.",
      features: ["Performance Analysis", "Resource Optimization", "Scalability Planning", "Monitoring Setup"],
      color: "secondary"
    }
  ]

  return (
    <section id="services" className="section-padding gradient-bg" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-lg">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
            Comprehensive Automation
            <span className="text-gradient block">Solutions</span>
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            From simple task automation to complex DevOps pipelines, we deliver solutions that transform
            how your team works and scales your operations efficiently.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-secondary-100"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl mb-6 ${
                service.color === 'primary'
                  ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
                  : 'bg-secondary-100 text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white'
              } transition-all duration-300`}>
                <service.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-secondary-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) + 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
                    <span className="text-secondary-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-secondary-50 hover:bg-primary-600 text-secondary-700 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group/btn"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can automate your most time-consuming tasks and streamline your operations.
              Get a free consultation to explore the possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center justify-center"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.a
                href="#expertise"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center justify-center"
              >
                View Our Expertise
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
