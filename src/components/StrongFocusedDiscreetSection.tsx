import { Eye, Shield, Lock, CheckCircle } from 'lucide-react';

export default function StrongFocusedDiscreetSection() {
  return (
    <section className='py-24 bg-background'>
      <div className='container mx-auto px-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              <span className='text-accent-security'>Strong. Focused. Discreet.</span>
            </h2>
          </div>

          {/* Main Content */}
          <div className='prose prose-lg max-w-none mb-16'>
            <p className='text-xl text-muted-foreground leading-relaxed mb-8'>
              You won't find us boasting about our biggest wins on social media or showing off a
              long list of flashy logos like some of our competitors. That's just not our style.
            </p>

            <p className='text-xl text-muted-foreground leading-relaxed mb-8'>
              We are different. We work best{' '}
              <strong>in the background—strong and intensely focused.</strong> Once our{' '}
              <strong>NDAs are signed</strong>, we're happy to privately share the impressive,
              game-changing results we've achieved. Out of deep{' '}
              <strong>respect and responsibility</strong> to our previous customers, we keep their
              business confidential. Our success speaks in private results, not public noise. That's
              the <strong>Artem and Graham</strong> promise.
            </p>
          </div>

          {/* Values Grid */}
          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            <div className='bg-gradient-to-br from-accent-security/5 to-accent-security/10 rounded-xl p-8 border border-accent-security/20'>
              <div className='flex items-center gap-4 mb-6'>
                <Shield className='h-8 w-8 text-accent-security' />
                <h3 className='text-2xl font-bold'>Background Excellence</h3>
              </div>
              <p className='text-muted-foreground mb-4'>
                We work best in the background—strong and intensely focused on delivering results
                without the noise.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>Intensely focused approach</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>Results-driven methodology</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>No public boasting or noise</span>
                </li>
              </ul>
            </div>

            <div className='bg-gradient-to-br from-accent-security/5 to-accent-security/10 rounded-xl p-8 border border-accent-security/20'>
              <div className='flex items-center gap-4 mb-6'>
                <Lock className='h-8 w-8 text-accent-security' />
                <h3 className='text-2xl font-bold'>Confidential Excellence</h3>
              </div>
              <p className='text-muted-foreground mb-4'>
                Deep respect and responsibility to our clients means keeping their business
                confidential.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>NDA-protected engagements</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>Private results sharing</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-accent-security' />
                  <span className='text-sm'>Client confidentiality priority</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Promise Section */}
          <div className='bg-gradient-to-r from-accent-security/10 to-accent-security/5 rounded-2xl p-8 border border-accent-security/20'>
            <div className='text-center'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <Eye className='h-6 w-6 text-accent-security' />
                <span className='text-accent-security font-semibold text-lg'>
                  The Artem and Graham Promise
                </span>
              </div>
              <p className='text-lg text-muted-foreground font-medium'>
                Our success speaks in <strong>private results, not public noise</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
