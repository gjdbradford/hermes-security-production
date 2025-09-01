import { useState, useEffect } from "react";

export default function IdentifyAndEliminateSection() {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    projects: 0,
    clients: 0,
    vulnerabilities: 0,
    hackers: 0
  });

  // Animation hook for counting up numbers
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animateNumbers = () => {
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedNumbers({
          projects: Math.floor(78 * progress),
          clients: Math.floor(102 * progress),
          vulnerabilities: Math.floor(200 * progress),
          hackers: Math.floor(10 * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          // Set final values
          setAnimatedNumbers({
            projects: 78,
            clients: 102,
            vulnerabilities: 200,
            hackers: 10
          });
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    // Start animation after a short delay
    const timer = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timer);
  }, []);

  const icons = [
    {
      name: "Security",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        </svg>
      )
    },
    {
      name: "Windows",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 3.5l9.5-1.5v9H0V3.5zm9.5 8H0v9l9.5-1.5V11.5zm1.5 0v9l13-1.5V11.5H11zm13-8v9H11v-9l13 1.5z"/>
        </svg>
      )
    },
    {
      name: "AWS",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.763 10.036c0 1.216.936 2.216 2.136 2.216 1.176 0 2.112-.976 2.112-2.216 0-1.24-.936-2.24-2.112-2.24-1.2 0-2.136 1-2.136 2.24zm2.136-1.04c.576 0 1.04.464 1.04 1.04 0 .576-.464 1.04-1.04 1.04-.576 0-1.04-.464-1.04-1.04 0-.576.464-1.04 1.04-1.04zm4.272 1.04c0 1.216.936 2.216 2.136 2.216 1.176 0 2.112-.976 2.112-2.216 0-1.24-.936-2.24-2.112-2.24-1.2 0-2.136 1-2.136 2.24zm2.136-1.04c.576 0 1.04.464 1.04 1.04 0 .576-.464 1.04-1.04 1.04-.576 0-1.04-.464-1.04-1.04 0-.576.464-1.04 1.04-1.04z"/>
        </svg>
      )
    },
    {
      name: "Bug",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 2.21-1.79 4-4 4s-4-1.79-4-4v-3c0-2.21 1.79-4 4-4s4 1.79 4 4z"/>
        </svg>
      )
    },
    {
      name: "Plus",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      )
    },
    {
      name: "Google",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    },
    {
      name: "WordPress",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-3-3 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      )
    },
    {
      name: "Docker",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm-2.954-5.43h2.118a.186.186 0 00.186-.185V3.574a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm0 2.716h2.118a.186.186 0 00.186-.185V6.29a.186.186 0 00-.186-.185h-2.118a.186.186 0 00-.186.185v1.887c0 .102.083.185.186.185zm-2.93 0h2.12a.186.186 0 00.185-.185V6.29a.186.186 0 00-.185-.185H8.1a.186.186 0 00-.186.185v1.887c0 .102.083.185.186.185zm0 2.715h2.12a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H8.1a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm-2.93 0h2.12a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.17a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185zM20.892 19.336c-.028.168-.196.3-.4.3H3.508c-.204 0-.372-.132-.4-.3L1.076 7.5h21.848l-2.032 11.836zM22.092 6.5H1.908c-.5 0-.908-.408-.908-.908s.408-.908.908-.908h20.184c.5 0 .908.408.908.908S22.592 6.5 22.092 6.5z"/>
        </svg>
      )
    },
    {
      name: "Linux",
      svg: (
        <svg className="w-8 h-8 text-accent-security" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-3-3 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      )
    }
  ];

  const stats = [
    { icon: "projects", number: "78", label: "Successful Projects" },
    { icon: "clients", number: "102+", label: "Clients Protection" },
    { icon: "vulnerabilities", number: "200+", label: "Vulnerabilities reported" },
    { icon: "hackers", number: "10+", label: "Professional Hackers" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-900 leading-tight">
            Identify and eliminate every vulnerability with our comprehensive, real-world pentesting approach
          </h2>

          {/* Icons Row */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
            {icons.map((iconData, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
              >
                {iconData.svg}
              </div>
            ))}
          </div>

          {/* Descriptive Paragraph */}
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Penetration Testing (Pentest) is a systematic approach to strengthening your security by detecting and addressing weaknesses in your digital systems. It mimics real cyberattacks to uncover vulnerabilities, assess their potential impact, and prioritize fixes. Our testing combines automated tools with hands-on expertise for thorough and reliable results.
            </p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-accent-security rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 text-white">
                    {stat.icon === "projects" && (
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    {stat.icon === "clients" && (
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                      </svg>
                    )}
                    {stat.icon === "vulnerabilities" && (
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 2.21-1.79 4-4 4s-4-1.79-4-4v-3c0-2.21 1.79-4 4-4s4 1.79 4 4z"/>
                      </svg>
                    )}
                    {stat.icon === "hackers" && (
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {animatedNumbers[stat.icon as keyof typeof animatedNumbers]}
                  {stat.icon === "clients" || stat.icon === "vulnerabilities" || stat.icon === "hackers" ? "+" : ""}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
