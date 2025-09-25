import { useEffect, useState } from 'react';

const SkipLink = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href='#main-content'
      className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-security focus:text-accent-security-foreground focus:rounded-md focus:font-medium focus:outline-none focus:ring-2 focus:ring-accent-security focus:ring-offset-2'
      onClick={() => setIsVisible(false)}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
