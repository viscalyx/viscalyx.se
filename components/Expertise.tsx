'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Terminal,
  Cloud,
  Database,
  Shield,
  Code,
  Settings,
  TrendingUp,
  Layers
} from 'lucide-react'
import Image from 'next/image'

const Expertise = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const technologies = [
    { name: "PowerShell", level: 95, icon: Terminal, color: "bg-blue-500" },
    { name: "PowerShell DSC", level: 92, icon: Settings, color: "bg-indigo-500" },
    { name: "Azure DevOps", level: 88, icon: Cloud, color: "bg-sky-500" },
    { name: "Docker", level: 85, icon: Layers, color: "bg-cyan-500" },
    { name: "Git & GitHub", level: 90, icon: Code, color: "bg-gray-700" },
    { name: "SQL Server", level: 82, icon: Database, color: "bg-red-500" },
    { name: "Security", level: 86, icon: Shield, color: "bg-green-500" },
    { name: "Performance", level: 89, icon: TrendingUp, color: "bg-purple-500" }
  ]

  const certifications = [
    "Microsoft Certified: Azure Administrator",
    "PowerShell DSC Specialist",
    "DevOps Foundation Certified",
    "ITIL v4 Foundation"
  ]

  return (
    <section id="expertise" className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-lg">Technical Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
            Deep Technical Knowledge
            <span className="text-gradient block">Proven Results</span>
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Years of hands-on experience with cutting-edge technologies and methodologies,
            combined with a commitment to continuous learning and industry best practices.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Technologies & Skills */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-8">Core Technologies</h3>
              <div className="space-y-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${tech.color} text-white group-hover:scale-110 transition-transform`}>
                          <tech.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-secondary-900">{tech.name}</span>
                      </div>
                      <span className="text-secondary-600 font-medium">{tech.level}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${tech.level}%` } : {}}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${tech.color} relative`}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6"
            >
              <h4 className="text-xl font-bold text-secondary-900 mb-4">Certifications & Credentials</h4>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                    <span className="text-secondary-700">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual & Experience */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                  alt="Developer workspace with multiple monitors"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Floating Experience Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-secondary-100 z-20"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">5+</div>
                  <div className="text-sm text-secondary-600">Years Experience</div>
                  <div className="text-xs text-secondary-500 mt-1">in Automation</div>
                </div>
              </motion.div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-2xl blur-3xl transform scale-110 -z-10" />
            </div>

            {/* Experience Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="bg-white border border-secondary-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 mb-1">50+</div>
                <div className="text-sm text-secondary-600">Projects Completed</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
                className="bg-white border border-secondary-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 mb-1">100%</div>
                <div className="text-sm text-secondary-600">Client Satisfaction</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
                className="bg-white border border-secondary-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 mb-1">24/7</div>
                <div className="text-sm text-secondary-600">System Uptime</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
                className="bg-white border border-secondary-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 mb-1">∞</div>
                <div className="text-sm text-secondary-600">Open Source</div>
              </motion.div>
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white rounded-2xl p-6"
            >
              <blockquote className="text-lg font-medium leading-relaxed">
                "Automation isn't just about saving time—it's about enabling teams to focus on what truly matters:
                innovation and strategic growth."
              </blockquote>
              <div className="mt-4 text-primary-100">— Viscalyx Philosophy</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Expertise
