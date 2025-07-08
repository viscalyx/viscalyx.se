'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

const Contact = () => {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: t('info.email.title'),
      details: t('info.email.details'),
      description: t('info.email.description'),
    },
    {
      icon: Phone,
      title: t('info.phone.title'),
      details: t('info.phone.details'),
      description: t('info.phone.description'),
    },
    {
      icon: MapPin,
      title: t('info.location.title'),
      details: t('info.location.details'),
      description: t('info.location.description'),
    },
    {
      icon: Clock,
      title: t('info.responseTime.title'),
      details: t('info.responseTime.details'),
      description: t('info.responseTime.description'),
    },
  ]

  return (
    <section
      id="contact"
      className="section-padding bg-white dark:bg-secondary-900"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
            {t('title')}{' '}
            <span className="text-gradient">{t('titleHighlight')}</span>
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary-50 dark:bg-secondary-800 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {t('form.title')}
            </h3>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#059669]/10 dark:bg-[#059669]/20 border border-[#86efac]/30 dark:border-[#86efac]/50 rounded-lg p-4 mb-6 flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-[#86efac] dark:text-[#86efac] mr-3" />
                <span className="text-[#86efac] dark:text-[#86efac]">
                  {t('form.successMessage')}
                </span>
              </motion.div>
            )}

            <form
              data-testid="contact-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                  >
                    {t('form.fields.name.label')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    autoComplete="name"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-secondary-900 dark:text-secondary-100"
                    placeholder={t('form.fields.name.placeholder')}
                  />
                </div>
                <div>
                  {' '}
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                  >
                    {t('form.fields.email.label')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    autoComplete="email"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-secondary-900 dark:text-secondary-100"
                    placeholder={t('form.fields.email.placeholder')}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  {t('form.fields.company.label')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  autoComplete="organization-name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-secondary-900 dark:text-secondary-100"
                  placeholder={t('form.fields.company.placeholder')}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  {t('form.fields.message.label')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-secondary-900 dark:text-secondary-100"
                  placeholder={t('form.fields.message.placeholder')}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                {t('form.submitButton')}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center"
                alt={t('consultation.imageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-primary-800/80" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                <div>
                  <h4 className="text-2xl font-bold mb-2">
                    {t('consultation.title')}
                  </h4>
                  <p className="text-primary-100">
                    {t('consultation.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white dark:bg-secondary-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg">
                    <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                      {item.details}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center"
            >
              <h4 className="text-xl font-bold mb-3">{t('quickCall.title')}</h4>
              <p className="text-primary-100 mb-6">
                {t('quickCall.description')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                {t('quickCall.button')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
