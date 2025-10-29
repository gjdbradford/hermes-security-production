import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ImpactTrustHeroSection() {
  return (
    <section className='relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-800/20'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]'></div>
        <div className='absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent_50%)]'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-6xl mx-auto px-6 py-24 text-center'>
        {/* Impact & Trust Badge */}
        <div className='flex items-center justify-center mb-8'>
          <div className='flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20'>
            <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
              <svg
                className='w-4 h-4 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                  transform='translate(8,0)'
                />
              </svg>
            </div>
            <span className='text-white font-semibold text-sm tracking-wider uppercase'>
              IMPACT & TRUST
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight'>
          <span className='block'>AI + Human Expertise</span>
          <span className='block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white'>
            = Impact.
          </span>
        </h1>

        {/* Description */}
        <p className='text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed'>
          Our hybrid approach validates real attack paths, confirms fixes, and strengthens your
          security posture — so you stay{' '}
          <span className='font-bold text-white'>compliant, secure, and breach-free.</span>
        </p>

        {/* CTA Button */}
        <div className='flex justify-center'>
          <Button
            size='lg'
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
          >
            Book Your Pen Test Today
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
      <div className='absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000'></div>
      <div className='absolute bottom-40 left-20 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-500'></div>
      <div className='absolute bottom-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700'></div>
    </section>
  );
}
