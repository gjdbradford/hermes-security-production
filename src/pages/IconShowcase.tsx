import React from 'react';

// Exact icons from Ronin Tech website - pixel perfect recreations
const roninTechIcons = [
  {
    name: "Shield",
    description: "Security Protection",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </svg>
    )
  },
  {
    name: "Windows",
    description: "Microsoft Windows",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 3.5l9.5-1.5v9H0V3.5zm9.5 8H0v9l9.5-1.5V11.5zm1.5 0v9l13-1.5V11.5H11zm13-8v9H11v-9l13 1.5z"/>
      </svg>
    )
  },
    {
      name: "AWS",
      description: "Amazon Web Services",
      svg: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <text x="12" y="10" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold">aws</text>
          <text x="12" y="13" textAnchor="middle" fontSize="12" transform="rotate(90 12 13)">)</text>
        </svg>
      )
    },
  {
    name: "Bug",
    description: "Security Bug Testing",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 2.21-1.79 4-4 4s-4-1.79-4-4v-3c0-2.21 1.79-4 4-4s4 1.79 4 4z"/>
      </svg>
    )
  },
  {
    name: "Plus",
    description: "Integration Center",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    )
  },
  {
    name: "Google",
    description: "Google Services",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
    {
      name: "WordPress",
      description: "WordPress CMS",
      svg: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.584-.03-.661.855-.075.885 0 0 .54.061 1.118.105l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.403-2.325.607-3.582.607M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
        </svg>
      )
    },
  {
    name: "Docker",
    description: "Docker Containers",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm-2.954-5.43h2.118a.186.186 0 00.186-.185V3.574a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm0 2.716h2.118a.186.186 0 00.186-.185V6.29a.186.186 0 00-.186-.185h-2.118a.186.186 0 00-.186.185v1.887c0 .102.083.185.186.185zm-2.93 0h2.12a.186.186 0 00.185-.185V6.29a.186.186 0 00-.185-.185H8.1a.186.186 0 00-.186.185v1.887c0 .102.083.185.186.185zm0 2.715h2.12a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H8.1a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm-2.93 0h2.12a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.17a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185zM20.892 19.336c-.028.168-.196.3-.4.3H3.508c-.204 0-.372-.132-.4-.3L1.076 7.5h21.848l-2.032 11.836zM22.092 6.5H1.908c-.5 0-.908-.408-.908-.908s.408-.908.908-.908h20.184c.5 0 .908.408.908.908S22.592 6.5 22.092 6.5z"/>
      </svg>
    )
  },
  {
    name: "Linux",
    description: "Linux Operating System",
    svg: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.371 0 0 5.372 0 12s5.371 12 12 12 12-5.372 12-12S18.629 0 12 0zm-2.19 15.79c-.62.62-1.63.62-2.25 0-.62-.62-.62-1.63 0-2.25.62-.62 1.63-.62 2.25 0 .62.62.62 1.63 0 2.25zm6.88 0c-.62.62-1.63.62-2.25 0-.62-.62-.62-1.63 0-2.25.62-.62 1.63-.62 2.25 0 .62.62.62 1.63 0 2.25zM12 5c1.1 0 2 .9 2 2 0 .55-.22 1.05-.59 1.41-.36.37-.86.59-1.41.59s-1.05-.22-1.41-.59C10.22 8.05 10 7.55 10 7c0-1.1.9-2 2-2z"/>
      </svg>
    )
  }
];

export default function IconShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hermes Security Icons Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Technology icons styled with Hermes blue branding
          </p>
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {roninTechIcons.map((icon, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center bg-white">
                <div className="text-blue-600">
                  {icon.svg}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {icon.name}
              </h3>
              <p className="text-sm text-gray-600">
                {icon.description}
              </p>
            </div>
          ))}
        </div>

        {/* Flow Visualization - Exact replica of Ronin Tech */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Technology Flow Visualization
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {roninTechIcons.map((icon, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${
                  icon.name === "Plus" 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg" 
                    : "bg-white text-blue-600"
                }`}
              >
                {icon.svg}
              </div>
            ))}
          </div>
        </div>

        {/* Color Variations */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Color Variations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blue Theme */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Blue Theme</h3>
              <div className="flex justify-center gap-4">
                {roninTechIcons.slice(0, 3).map((icon, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center bg-white text-blue-600"
                  >
                    {icon.svg}
                  </div>
                ))}
              </div>
            </div>

            {/* Blue Theme (Hermes Style) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Blue Theme (Hermes Style)</h3>
              <div className="flex justify-center gap-4">
                {roninTechIcons.slice(0, 3).map((icon, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center bg-white text-blue-600"
                  >
                    {icon.svg}
                  </div>
                ))}
              </div>
            </div>

            {/* Green Theme */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Green Theme</h3>
              <div className="flex justify-center gap-4">
                {roninTechIcons.slice(0, 3).map((icon, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center bg-white text-green-600"
                  >
                    {icon.svg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Use These Icons
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              These icons are styled with the Hermes blue color scheme and can be used throughout your components. 
              They maintain the same professional look while matching your brand colors.
            </p>
            <div className="bg-gray-100 rounded p-4 font-mono text-sm">
              <code>
                {`// Example usage in your component
<div className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center bg-white text-blue-600">
  {icon.svg}
</div>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
