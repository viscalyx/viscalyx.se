'use client'

import { motion } from 'framer-motion'
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'DevOps Engineer',
      company: 'TechCorp Solutions',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
      content:
        'Viscalyx transformed our deployment pipeline completely. What used to take hours now happens in minutes. Their automation expertise is unmatched.',
      rating: 5,
      project: 'CI/CD Pipeline Automation',
    },
    {
      name: 'Michael Chen',
      role: 'Senior Software Engineer',
      company: 'Innovation Labs',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      content:
        'The PowerShell DSC implementations by Viscalyx saved us months of manual configuration work. Incredible attention to detail and technical depth.',
      rating: 5,
      project: 'Infrastructure as Code',
    },
    {
      name: 'Emily Rodriguez',
      role: 'IT Director',
      company: 'Global Finance Inc',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
      content:
        "Working with Viscalyx was a game-changer. They didn't just deliver automation - they taught our team best practices that we continue to use today.",
      rating: 5,
      project: 'Enterprise Automation Platform',
    },
    {
      name: 'David Kim',
      role: 'Cloud Architect',
      company: 'StartupVenture',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
      content:
        'The open-source contributions and knowledge sharing approach of Viscalyx shows their commitment to the community. True professionals.',
      rating: 5,
      project: 'Cloud Migration Automation',
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry professionals
            say about working with Viscalyx.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 bg-primary-100 p-3 rounded-full">
              <Quote className="w-6 h-6 text-primary-600" />
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-secondary-700 leading-relaxed mb-8 italic">
              "{testimonials[currentIndex].content}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-secondary-600">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-primary-600 font-medium">
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="bg-primary-100 px-4 py-2 rounded-full">
                  <span className="text-sm text-primary-700 font-medium">
                    {testimonials[currentIndex].project}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-600" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600'
                      : 'bg-secondary-300 hover:bg-secondary-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 text-secondary-600" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: '50+', label: 'Happy Clients' },
            { number: '200+', label: 'Projects Delivered' },
            { number: '99%', label: 'Client Satisfaction' },
            { number: '24/7', label: 'Support Available' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-secondary-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
