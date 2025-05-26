'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BlogPage = () => {
  const featuredPost = {
    title: "The Future of Infrastructure Automation: Trends for 2025",
    excerpt: "Explore the latest trends in infrastructure automation, from AI-driven deployments to GitOps practices that are reshaping how we manage modern applications.",
    author: "Johan Ljunggren",
    date: "2024-12-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center",
    category: "Automation",
    slug: "future-infrastructure-automation-2025"
  }

  const blogPosts = [
    {
      title: "PowerShell DSC Best Practices for Enterprise Environments",
      excerpt: "Learn the essential best practices for implementing PowerShell Desired State Configuration in large-scale enterprise environments.",
      author: "Johan Ljunggren",
      date: "2024-12-10",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&h=250&fit=crop&crop=center",
      category: "PowerShell",
      slug: "powershell-dsc-best-practices"
    },
    {
      title: "Building Resilient CI/CD Pipelines with Azure DevOps",
      excerpt: "Discover how to create robust, scalable CI/CD pipelines that can handle enterprise workloads while maintaining security and compliance.",
      author: "Johan Ljunggren",
      date: "2024-12-05",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center",
      category: "DevOps",
      slug: "resilient-cicd-azure-devops"
    },
    {
      title: "Open Source Contribution: Why It Matters for Your Career",
      excerpt: "Understanding the professional and personal benefits of contributing to open source projects, and how to get started effectively.",
      author: "Johan Ljunggren",
      date: "2024-11-28",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop&crop=center",
      category: "Open Source",
      slug: "open-source-contribution-career"
    },
    {
      title: "Kubernetes Automation: From Manual to GitOps",
      excerpt: "A comprehensive guide to transitioning from manual Kubernetes management to fully automated GitOps workflows.",
      author: "Johan Ljunggren",
      date: "2024-11-20",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
      category: "Kubernetes",
      slug: "kubernetes-automation-gitops"
    },
    {
      title: "Infrastructure as Code: Terraform vs Pulumi vs CDK",
      excerpt: "An in-depth comparison of popular Infrastructure as Code tools, helping you choose the right solution for your organization.",
      author: "Johan Ljunggren",
      date: "2024-11-15",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop&crop=center",
      category: "Infrastructure",
      slug: "iac-terraform-pulumi-cdk-comparison"
    },
    {
      title: "Monitoring and Observability in Modern DevOps",
      excerpt: "Essential strategies for implementing comprehensive monitoring and observability in your DevOps workflows and infrastructure.",
      author: "Johan Ljunggren",
      date: "2024-11-08",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
      category: "Monitoring",
      slug: "monitoring-observability-devops"
    }
  ]

  const categories = [
    "All",
    "Automation", 
    "PowerShell", 
    "DevOps", 
    "Open Source", 
    "Kubernetes", 
    "Infrastructure", 
    "Monitoring"
  ]

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Insights & <span className="text-gradient">Knowledge</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Stay updated with the latest trends, best practices, and insights in 
              automation, DevOps, and open-source development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-8">Featured Article</h2>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center text-secondary-500 text-sm mb-4">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author}
                    <span className="mx-3">•</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                    <span className="mx-3">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPost.readTime}
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    category === "All"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-secondary-500 text-xs mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                  
                  <h3 className="text-lg font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium group"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="btn-primary">
              Load More Articles
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPage
