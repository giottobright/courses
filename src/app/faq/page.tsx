'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How does Learnify work?',
        a: 'Learnify offers short, practical courses focused on solving real-life problems. Browse our catalog, enroll in courses that interest you, and learn at your own pace. Each course consists of bite-sized lessons (5-15 minutes) that you can complete whenever it suits you.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'You can browse courses without an account, but you\'ll need to sign up to enroll in courses, track your progress, and earn certificates. Creating an account is free and takes less than a minute.',
      },
      {
        q: 'Are the courses really short?',
        a: 'Yes! Most courses can be completed in 2-6 hours total, broken down into 5-15 minute lessons. We believe in respecting your time while delivering maximum value.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        q: 'How much do courses cost?',
        a: 'We offer both free and paid courses. Free courses give you access to all content without any payment. Paid courses typically range from $29 to $99, with occasional discounts.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes! We offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied for any reason, contact our support team for a full refund.',
      },
      {
        q: 'Can I access courses after purchasing?',
        a: 'Absolutely! Once you purchase a course, you have lifetime access to all course materials, including any future updates.',
      },
    ],
  },
  {
    category: 'Certificates',
    questions: [
      {
        q: 'Will I receive a certificate?',
        a: 'Yes! Most courses offer a certificate of completion. Once you finish all lessons, you can download your certificate as a PDF or share it on LinkedIn.',
      },
      {
        q: 'Are certificates verified?',
        a: 'Yes, each certificate includes a unique verification code. Anyone can verify your certificate on our website by entering the code.',
      },
      {
        q: 'Do certificates expire?',
        a: 'No, your certificates are valid forever. They\'re proof of the skills you\'ve learned and can be used in your portfolio or resume.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What devices can I use?',
        a: 'Learnify works on all devices - desktop computers, laptops, tablets, and smartphones. Our platform is fully responsive and optimized for mobile learning.',
      },
      {
        q: 'Do I need to download anything?',
        a: 'No downloads required! All courses are accessible directly in your web browser. However, you can download course resources and certificates.',
      },
      {
        q: 'Can I download videos for offline viewing?',
        a: 'Currently, we don\'t offer offline video downloads. However, you can access transcripts and downloadable resources for each lesson.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
      >
        <span className="font-semibold text-lg pr-4">{question}</span>
        <ChevronDown
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Everything you need to know about Learnify
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card>
                  <h2 className="text-2xl font-display font-bold mb-6 text-primary-700">
                    {category.category}
                  </h2>
                  <div>
                    {category.questions.map((faq, faqIndex) => (
                      <FAQItem
                        key={faqIndex}
                        question={faq.q}
                        answer={faq.a}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-warm text-white text-center">
              <h3 className="text-2xl font-display font-bold mb-4">
                Still have questions?
              </h3>
              <p className="text-white/90 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a
                href="mailto:support@learnify.com"
                className="inline-block px-8 py-3 bg-white text-neutral-dark font-semibold rounded-full hover:shadow-lg transition-shadow"
              >
                Contact Support
              </a>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
