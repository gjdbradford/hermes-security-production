export default function DestinyPhilosophySection() {
  return (
    <section className='py-24 bg-background'>
      <div className='container mx-auto px-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              <span className='text-accent-security'>Our Calling</span>
            </h2>
          </div>

          {/* Main Content */}
          <div className='prose prose-lg max-w-none'>
            <p className='text-xl text-muted-foreground leading-relaxed mb-8'>
              We aren't in this to chase the next dollar; we're here because we genuinely{' '}
              <strong>love the craft</strong>. More importantly, we believe in building a{' '}
              <strong>better, safer world</strong>—a place where our kids (and yours) can grow up
              without the fear of the next digital threat. This mission is our true currency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
