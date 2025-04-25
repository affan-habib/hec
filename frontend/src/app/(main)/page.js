'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FiBook, FiMessageSquare, FiAward, FiArrowRight } from 'react-icons/fi';

export default function LandingPage() {
  // Animation controls
  const controls = {
    hero: useAnimation(),
    features: useAnimation(),
    cta: useAnimation()
  };
  
  // Refs for scroll animations
  const refs = {
    hero: useRef(null),
    features: useRef(null),
    cta: useRef(null)
  };
  
  // Check if sections are in view
  const inView = {
    hero: useInView(refs.hero, { once: true }),
    features: useInView(refs.features, { once: true }),
    cta: useInView(refs.cta, { once: true })
  };

  // Trigger animations when sections come into view
  useEffect(() => {
    if (inView.hero) controls.hero.start('visible');
    if (inView.features) controls.features.start('visible');
    if (inView.cta) controls.cta.start('visible');
  }, [inView, controls]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={refs.hero} 
        className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950"
      >
        {/* Korean-inspired decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-200 dark:bg-pink-900 opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-200 dark:bg-purple-900 opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-12"
            initial="hidden"
            animate={controls.hero}
            variants={staggerChildren}
          >
            <motion.div className="md:w-1/2 text-center md:text-left" variants={fadeInUp}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                <span className="block">안녕하세요!</span>
                <span className="block mt-2">Hello English</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
                Begin your English learning journey with personalized coaching, interactive diaries, and real-time tutor feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Start Learning
                  </motion.button>
                </Link>
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-full text-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative"
              variants={fadeInUp}
            >
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src="/korean-lantern.png"
                  alt="Korean-inspired English Learning"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={refs.features}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={controls.features}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-purple-600 dark:text-purple-400">Key Features</span> of Our Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Designed to make your language learning journey effective, engaging, and enjoyable.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={controls.features}
            variants={staggerChildren}
          >
            {/* Feature 1 */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <FiBook className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Interactive Diaries
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Document your learning journey with multimedia diaries that receive personalized feedback from tutors.
              </p>
              <Link href="/main/features/diary" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-6">
                <FiMessageSquare className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Real-time Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect with your dedicated tutor through our real-time messaging system for immediate assistance.
              </p>
              <Link href="/main/features/chat" className="inline-flex items-center text-pink-600 dark:text-pink-400 font-medium">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <FiAward className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Achievement System
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Stay motivated with our gamified learning approach, earning awards and tracking your progress.
              </p>
              <Link href="/main/features/awards" className="inline-flex items-center text-yellow-600 dark:text-yellow-400 font-medium">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={refs.cta}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-pink-500 dark:from-purple-900 dark:to-pink-800"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate={controls.cta}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your English Journey?
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students who are improving their English skills with our personalized coaching platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-full text-lg font-medium hover:shadow-lg transition-all duration-300">
                  Get Started Today
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
