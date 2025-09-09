import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Mail, Shield, Eye, Database, Lock, UserCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Hermes Security</title>
        <meta name="description" content="Privacy Policy for Hermes Security - Data processing and protection policies." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="pt-20 pb-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="flex items-center hover:text-primary transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Privacy Policy</span>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-accent-security">
                  Privacy Policy
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Last updated: {new Date().toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </CardHeader>
              
              <CardContent className="prose prose-lg max-w-none">
                <div className="space-y-8">
                  
                  {/* Introduction */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">1. Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Hermes Security is committed to protecting your privacy and personal data in accordance 
                      with applicable data protection laws and best practices.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      This Privacy Policy explains how we collect, use, store, and protect your personal 
                      information when you use our services or visit our website.
                    </p>
                  </section>

                  {/* Data Controller */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">2. Data Controller</h2>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Contact Information</h3>
                      <p className="text-blue-800"><strong>Company:</strong> Hermes Security</p>
                      <p className="text-blue-800"><strong>Data Steward:</strong> Graham John</p>
                      <p className="text-blue-800"><strong>Email:</strong> graham@hermessecurity.io</p>
                      <p className="text-blue-800"><strong>Jurisdiction:</strong> European Union</p>
                    </div>
                  </section>

                  {/* Data We Collect */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">3. Personal Data We Collect</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Contact Form Data</h3>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Name (first and last)</li>
                          <li>• Email address</li>
                          <li>• Phone number</li>
                          <li>• Country of residence</li>
                          <li>• Company information</li>
                          <li>• Security requirements description</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Technical Data</h3>
                        <ul className="text-gray-700 space-y-1">
                          <li>• IP address</li>
                          <li>• Browser type and version</li>
                          <li>• Device information</li>
                          <li>• Website usage analytics</li>
                          <li>• Cookies and similar technologies</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Legal Basis */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">4. Legal Basis for Processing</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We process your personal data based on the following legal grounds:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li><strong>Consent:</strong> When you provide explicit consent for data processing</li>
                      <li><strong>Contract Performance:</strong> To provide requested services</li>
                      <li><strong>Legitimate Interest:</strong> For business operations and service improvement</li>
                      <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
                    </ul>
                  </section>

                  {/* Purposes */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">5. Purposes of Data Processing</h2>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Primary Purposes</h3>
                      <ul className="text-green-800 space-y-1">
                        <li>• Sales and business development</li>
                        <li>• Client onboarding and service delivery</li>
                        <li>• Communication and support</li>
                        <li>• Service improvement and development</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      <strong>Important:</strong> We use your data for sales and onboarding purposes only. 
                      We do not use your personal data for any other purposes without your explicit consent.
                    </p>
                  </section>

                  {/* Data Sharing */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">6. Data Sharing and Transfers</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We do not sell, rent, or share your personal data with third parties except:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                      <li>Service providers who assist in our operations (under strict data protection agreements)</li>
                      <li>Legal authorities when required by law</li>
                      <li>Business partners with your explicit consent</li>
                    </ul>
                    <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                      <p className="text-yellow-800">
                        <strong>Data Transfers:</strong> Any international transfers are protected by 
                        appropriate safeguards including Standard Contractual Clauses (SCCs) and 
                        adequacy decisions.
                      </p>
                    </div>
                  </section>

                  {/* Data Retention */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">7. Data Retention</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Retention Periods</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Contact form data: 3 years from last contact</li>
                        <li>• Service-related data: Duration of service + 7 years</li>
                        <li>• Marketing data: Until consent is withdrawn</li>
                        <li>• Technical/log data: 12 months maximum</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Data is automatically deleted after the retention period unless legal obligations 
                      require longer storage.
                    </p>
                  </section>

                  {/* Your Rights */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">8. Your Data Protection Rights</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Right of Access</h3>
                        <p className="text-blue-800 text-sm">Request copies of your personal data</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Right to Rectification</h3>
                        <p className="text-blue-800 text-sm">Correct inaccurate or incomplete data</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-900 mb-2">Right to Erasure</h3>
                        <p className="text-red-800 text-sm">Request deletion of your data</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Right to Restriction</h3>
                        <p className="text-blue-800 text-sm">Limit how we process your data</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Right to Portability</h3>
                        <p className="text-blue-800 text-sm">Receive your data in a structured format</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Right to Object</h3>
                        <p className="text-blue-800 text-sm">Object to processing based on legitimate interests</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg mt-4">
                      <h3 className="font-semibold text-green-900 mb-2">How to Exercise Your Rights</h3>
                      <p className="text-green-800">
                        Contact us at <strong>graham@hermessecurity.io</strong> with your request. 
                        We will respond within 30 days and may require identity verification.
                      </p>
                    </div>
                  </section>

                  {/* Data Security */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">9. Data Security</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Security Measures</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Encryption of data in transit and at rest</li>
                        <li>• Access controls and authentication</li>
                        <li>• Regular security assessments</li>
                        <li>• Staff training on data protection</li>
                        <li>• Incident response procedures</li>
                        <li>• Regular backups and recovery testing</li>
                      </ul>
                    </div>
                  </section>

                  {/* Cookies */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">10. Cookies and Tracking</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We use cookies and similar technologies to improve your experience. You can control 
                      cookie settings through your browser preferences.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Cookie Types</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• <strong>Essential:</strong> Required for website functionality</li>
                        <li>• <strong>Analytics:</strong> Help us understand website usage</li>
                        <li>• <strong>Marketing:</strong> Only with your consent</li>
                      </ul>
                    </div>
                  </section>

                  {/* Data Breach */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">11. Data Breach Notification</h2>
                    <p className="text-gray-700 leading-relaxed">
                      In the unlikely event of a data breach that poses a risk to your rights and freedoms, 
                      we will notify you and the relevant authorities as required by applicable laws.
                    </p>
                  </section>

                  {/* Supervisory Authority */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">12. Supervisory Authority</h2>
                    <p className="text-gray-700 leading-relaxed">
                      You have the right to lodge a complaint with your local data protection supervisory 
                      authority if you believe we have not handled your personal data in accordance with applicable laws.
                    </p>
                  </section>

                  {/* Changes */}
                  <section>
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">13. Changes to This Policy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Privacy Policy from time to time. Changes will be posted on this 
                      page with an updated revision date. We will notify you of significant changes via email 
                      or website notice.
                    </p>
                  </section>

                  {/* Contact */}
                  <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-accent-security mb-4">14. Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      For any questions about this Privacy Policy or to exercise your data protection rights:
                    </p>
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <Mail className="w-5 h-5" />
                      <span>graham@hermessecurity.io</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 mb-4">
                      <UserCheck className="w-5 h-5" />
                      <span>Graham John, Data Steward</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      We will respond to all privacy-related inquiries within 30 days.
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
