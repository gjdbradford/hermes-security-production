import { Helmet } from "react-helmet-async";
import OptimizedImage from "@/components/ui/optimized-image";
import { getImagePath } from "@/utils/imageUtils";

export default function TestImage() {
  return (
    <>
      <Helmet>
        <title>Test Images - Hermes Security</title>
        <meta name="description" content="Test page for image loading and display" />
      </Helmet>

      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Image Test Page</h1>
            
            <div className="space-y-12">
              {/* Logo Test */}
              <section className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-6">Logo Test</h2>
                <div className="flex items-center gap-4">
                  <OptimizedImage 
                    src={getImagePath("images/logos/logo.svg")}
                    alt="Hermes Security Logo"
                    className="h-16 w-auto"
                    loading="eager"
                  />
                  <div>
                    <p className="text-muted-foreground">Path: {getImagePath("images/logos/logo.svg")}</p>
                    <p className="text-sm text-muted-foreground">This should display the Hermes Security logo</p>
                  </div>
                </div>
              </section>

              {/* Hero Background Test */}
              <section className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-6">Hero Background Test</h2>
                <div className="space-y-4">
                  <OptimizedImage 
                    src={getImagePath("images/backgrounds/hero-bg.jpg")}
                    alt="Hero Background"
                    className="w-full h-64 object-cover rounded-lg"
                    loading="eager"
                  />
                  <p className="text-muted-foreground">Path: {getImagePath("images/backgrounds/hero-bg.jpg")}</p>
                </div>
              </section>

              {/* Case Study Images Test */}
              <section className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-6">Case Study Images Test</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <OptimizedImage 
                      src={getImagePath("images/case-studies/api-attack-path.svg")}
                      alt="API Attack Path"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">API Attack Path</p>
                  </div>
                  <div>
                    <OptimizedImage 
                      src={getImagePath("images/case-studies/cloud-lateral-movement.svg")}
                      alt="Cloud Lateral Movement"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Cloud Lateral Movement</p>
                  </div>
                  <div>
                    <OptimizedImage 
                      src={getImagePath("images/case-studies/mobile-security.svg")}
                      alt="Mobile Security"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Mobile Security</p>
                  </div>
                  <div>
                    <OptimizedImage 
                      src={getImagePath("images/case-studies/web-security.svg")}
                      alt="Web Security"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Web Security</p>
                  </div>
                  <div>
                    <OptimizedImage 
                      src={getImagePath("images/case-studies/network-security.svg")}
                      alt="Network Security"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Network Security</p>
                  </div>
                </div>
              </section>

              {/* Error Handling Test */}
              <section className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-6">Error Handling Test</h2>
                <div className="space-y-4">
                  <OptimizedImage 
                    src={getImagePath("images/nonexistent-image.jpg")}
                    alt="Non-existent Image"
                    className="w-full h-32 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <p className="text-muted-foreground">Path: {getImagePath("images/nonexistent-image.jpg")} (should show fallback)</p>
                </div>
              </section>

              {/* Environment Info */}
              <section className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-6">Environment Information</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
                  <p><strong>Base URL:</strong> {import.meta.env.BASE_URL}</p>
                  <p><strong>Deploy Environment:</strong> {import.meta.env.VITE_DEPLOY_ENV || 'Not set'}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
