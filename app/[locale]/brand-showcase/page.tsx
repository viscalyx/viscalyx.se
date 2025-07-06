import { Metadata } from 'next'
import { BrandShowcase } from '../../../components/brandprofile'

export const metadata: Metadata = {
  title: 'Brand Showcase - Viscalyx',
  description: 'Visual style guide and component library for Viscalyx.se',
}

export default function BrandShowcasePage() {
  return <BrandShowcase />
}
