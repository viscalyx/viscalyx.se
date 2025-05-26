'use client'

import { motion } from 'framer-motion'
import { Github, Star, Users, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const OpenSource = () => {
  const contributions = [
    {
      name: "PowerShell DSC Community",
      description: "Active contributor to PowerShell Desired State Configuration resources and modules",
      language: "PowerShell",
      stars: "2.5k",
      link: "https://github.com/dsccommunity",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "DSC Resource Kit",
      description: "Comprehensive collection of DSC resources for Windows configuration management",
      language: "PowerShell",
      stars: "1.8k",
      link: "https://github.com/PowerShell/DscResources",
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Automation Toolkits",
      description: "Modern automation tools and frameworks for DevOps professionals",
      language: "TypeScript",
      stars: "892",
      link: "#",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=center"
    }
  ]

  const stats = [
    { label: "Open Source Projects", value: "50+" },
    { label: "GitHub Stars", value: "5.2k" },
    { label: "Community Members", value: "12k+" },
    { label: "Years Contributing", value: "8+" }
  ]

  return (
    <section id="open-source" className="section-padding bg-secondary-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Open Source <span className="text-gradient">Contributions</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We believe in giving back to the community. Our active contributions to open-source
            projects help advance automation and DevOps practices worldwide.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-secondary-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contributions.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Github className="w-5 h-5 text-secondary-700" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center text-secondary-500 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {project.stars}
                  </div>
                </div>

                <p className="text-secondary-600 mb-4">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-sm text-secondary-600">{project.language}</span>
                  </div>

                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Open Source Community
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Collaborate with us on cutting-edge automation tools and contribute to
              projects that impact thousands of developers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://github.com/viscalyx"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50 flex items-center justify-center"
              >
                <Github className="w-5 h-5 mr-2" />
                Follow on GitHub
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600 flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Collaborate With Us
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OpenSource
