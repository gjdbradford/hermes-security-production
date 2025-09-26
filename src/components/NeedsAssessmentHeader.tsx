import { useNavigate } from 'react-router-dom';
import OptimizedImage from '@/components/ui/optimized-image';
import { IMAGE_PATHS } from '@/utils/imageUtils';

export default function NeedsAssessmentHeader() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Navigate to homepage and scroll to top
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className='fixed top-0 w-full backdrop-blur-md text-white z-50 border-b shadow-sm'
      style={{ backgroundColor: '#001428', borderColor: '#002244' }}
    >
      <nav className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-start'>
          {/* Logo */}
          <div className='flex items-center justify-center'>
            <button
              onClick={handleLogoClick}
              className='flex items-center gap-2 hover:opacity-80 transition-opacity'
            >
              {/* Mobile: Use favicon with text */}
              <div className='flex items-center gap-2 md:hidden'>
                <OptimizedImage
                  src={IMAGE_PATHS.favicon()}
                  alt='Hermes Security'
                  className='h-8 w-8 mt-1'
                  loading='eager'
                />
                <span className='text-xl font-bold text-white mt-0.5'>HERMES SECURITY</span>
              </div>
              {/* Desktop: Use full logo */}
              <OptimizedImage
                src={IMAGE_PATHS.logo()}
                alt='Hermes Security Logo'
                className='h-8 w-auto hidden md:block'
                loading='eager'
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
