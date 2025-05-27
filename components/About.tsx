'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Users, Lightbulb, Award } from 'lucide-react'
import Image from 'next/image'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const values = [
    {
      icon: Target,
      title: 'Precision & Excellence',
      description:
        'Every automation solution is crafted with meticulous attention to detail and tested thoroughly.',
    },
    {
      icon: Users,
      title: 'Client-Centric Approach',
      description:
        'Understanding your unique challenges to deliver tailored solutions that fit your workflow.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description:
        'Leveraging cutting-edge technologies and best practices to solve complex problems.',
    },
    {
      icon: Award,
      title: 'Open Source Commitment',
      description:
        'Actively contributing to the community and sharing knowledge through open-source projects.',
    },
  ]

  return (
    <section
      id="about"
      className="section-padding bg-white dark:bg-secondary-900"
      ref={ref}
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-primary-600 dark:text-primary-400 font-semibold text-lg"
              >
                About Viscalyx
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mt-2"
              >
                Empowering Organizations Through
                <span className="text-gradient block">Smart Automation</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              Viscalyx is a specialized consulting company dedicated to
              transforming how developers and IT professionals work. As a sole
              proprietorship, we provide personalized, high-quality automation
              solutions that eliminate repetitive tasks and streamline complex
              workflows.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              Our expertise spans PowerShell Desired State Configuration (DSC),
              DevOps automation, and contributing to open-source projects that
              benefit the entire development community. We believe in building
              solutions that not only solve immediate problems but also create
              lasting value.
            </motion.p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                      {value.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop"
                  alt="Developer working on automation"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      98%
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      Task Reduction
                    </div>
                  </div>
                  <div className="w-px h-12 bg-secondary-200 dark:bg-secondary-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      24/7
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      Automation
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Background Element */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 dark:from-primary-900/20 to-secondary-100/30 dark:to-secondary-800/20 rounded-2xl blur-3xl transform scale-110 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
