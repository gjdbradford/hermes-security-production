import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Mail, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Use - Hermes Security</title>
        <meta
          name='description'
          content='Terms of Use for Hermes Security - AI-driven penetration testing services with human oversight.'
        />
        <meta name='robots' content='index, follow' />
      </Helmet>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <Header />

        {/* Breadcrumbs */}
        <div className='pt-20 pb-4'>
          <div className='container mx-auto px-4'>
            <nav className='flex items-center space-x-2 text-sm text-gray-600'>
              <Link to='/' className='flex items-center hover:text-primary transition-colors'>
                <Home className='w-4 h-4 mr-1' />
                Home
              </Link>
              <ChevronRight className='w-4 h-4' />
              <span className='text-gray-900'>Terms of Use</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='py-12'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <Card>
              <CardHeader className='text-center'>
                <div className='mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  <FileText className='w-8 h-8 text-blue-600' />
                </div>
                <CardTitle className='text-3xl font-bold text-accent-security'>
                  Terms of Use
                </CardTitle>
                <p className='text-gray-600 mt-2'>
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardHeader>

              <CardContent className='prose prose-lg max-w-none'>
                <div className='space-y-8'>
                  {/* Introduction */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      1. Introduction
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      Welcome to Hermes Security. These Terms of Use ("Terms") govern your use of
                      our website and services. By accessing or using our services, you agree to be
                      bound by these Terms.
                    </p>
                    <p className='text-gray-700 leading-relaxed mt-4'>
                      Hermes Security provides AI-driven penetration testing services with human
                      oversight, specializing in cybersecurity assessments for European enterprises.
                    </p>
                  </section>

                  {/* Company Information */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      2. Company Information
                    </h2>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <p className='text-gray-700'>
                        <strong>Company:</strong> Hermes Security
                      </p>
                      <p className='text-gray-700'>
                        <strong>Data Steward:</strong> Graham John
                      </p>
                      <p className='text-gray-700'>
                        <strong>Contact Email:</strong> graham@hermessecurity.io
                      </p>
                      <p className='text-gray-700'>
                        <strong>Jurisdiction:</strong> European Union
                      </p>
                    </div>
                  </section>

                  {/* Services */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      3. Services
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      Hermes Security provides the following services:
                    </p>
                    <ul className='list-disc list-inside text-gray-700 mt-4 space-y-2'>
                      <li>Web Application Penetration Testing</li>
                      <li>API Security Testing</li>
                      <li>Mobile Application Security Testing</li>
                      <li>Cloud Infrastructure Security Assessment</li>
                      <li>Network Security Testing (External & Internal)</li>
                      <li>Vulnerability Scanning and Assessment</li>
                      <li>AI/LLM Security Testing</li>
                      <li>Compliance and Regulatory Support</li>
                    </ul>
                  </section>

                  {/* User Obligations */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      4. User Obligations
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      By using our services, you agree to:
                    </p>
                    <ul className='list-disc list-inside text-gray-700 mt-4 space-y-2'>
                      <li>Provide accurate and complete information</li>
                      <li>Use our services only for legitimate business purposes</li>
                      <li>Not attempt to compromise or interfere with our systems</li>
                      <li>Respect intellectual property rights</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Maintain confidentiality of any sensitive information disclosed</li>
                    </ul>
                  </section>

                  {/* Service Level Agreement */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      5. Service Level Agreement
                    </h2>
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <h3 className='font-semibold text-blue-900 mb-2'>Response Times</h3>
                      <ul className='text-blue-800 space-y-1'>
                        <li>• Initial response: Within 24 hours</li>
                        <li>• Project initiation: Within 48 hours</li>
                        <li>• Report delivery: Within 5-10 business days</li>
                        <li>• Emergency support: Within 4 hours</li>
                      </ul>
                    </div>
                  </section>

                  {/* Payment Terms */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      6. Payment Terms
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      Payment terms will be specified in individual service agreements. Generally:
                    </p>
                    <ul className='list-disc list-inside text-gray-700 mt-4 space-y-2'>
                      <li>Payment is due within 30 days of invoice date</li>
                      <li>Late payments may incur additional charges</li>
                      <li>All prices are exclusive of applicable taxes</li>
                      <li>Refunds are subject to our refund policy</li>
                    </ul>
                  </section>

                  {/* Intellectual Property */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      7. Intellectual Property
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      All content, methodologies, and intellectual property developed by Hermes
                      Security remain our exclusive property. Clients receive usage rights for
                      delivered reports and recommendations as specified in service agreements.
                    </p>
                  </section>

                  {/* Limitation of Liability */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      8. Limitation of Liability
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      Hermes Security's liability is limited to the value of services provided. We
                      are not liable for indirect, consequential, or punitive damages. Our services
                      are provided "as is" and we make no warranties beyond those explicitly stated
                      in service agreements.
                    </p>
                  </section>

                  {/* Termination */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      9. Termination
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      Either party may terminate services with 30 days written notice. Immediate
                      termination may occur for breach of these Terms or non-payment. Upon
                      termination, all outstanding obligations remain in effect.
                    </p>
                  </section>

                  {/* Governing Law */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      10. Governing Law
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      These Terms are governed by the laws of the European Union. Any disputes will
                      be resolved through binding arbitration or in the courts of competent
                      jurisdiction within the EU.
                    </p>
                  </section>

                  {/* Changes to Terms */}
                  <section>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      11. Changes to Terms
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      We reserve the right to modify these Terms at any time. Changes will be posted
                      on this page with an updated revision date. Continued use of our services
                      constitutes acceptance of modified Terms.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section className='bg-gray-50 p-6 rounded-lg'>
                    <h2 className='text-2xl font-semibold text-accent-security mb-4'>
                      12. Contact Information
                    </h2>
                    <p className='text-gray-700 leading-relaxed mb-4'>
                      For questions about these Terms of Use, please contact us:
                    </p>
                    <div className='flex items-center space-x-2 text-gray-700'>
                      <Mail className='w-5 h-5' />
                      <span>graham@hermessecurity.io</span>
                    </div>
                    <p className='text-sm text-gray-600 mt-4'>
                      We will respond to all inquiries within 24 hours during business days.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
