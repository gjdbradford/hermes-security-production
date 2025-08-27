# Asset Management Guide

## Overview
This document outlines the asset management structure and best practices for the Hermes Security website.

## Asset Structure

```
public/
├── images/
│   ├── logos/
│   │   └── logo.svg
│   ├── backgrounds/
│   │   └── hero-bg.jpg
│   ├── case-studies/
│   │   ├── api-attack-path.svg
│   │   ├── cloud-lateral-movement.svg
│   │   ├── mobile-security.svg
│   │   ├── web-security.svg
│   │   └── network-security.svg
│   └── icons/
│       ├── favicon.svg
│       └── placeholder.svg
├── favicon.ico
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

## Asset Categories

### Logos (`/images/logos/`)
- **Purpose**: Brand identity and navigation
- **Formats**: SVG (preferred), PNG
- **Usage**: Header, footer, branding elements

### Backgrounds (`/images/backgrounds/`)
- **Purpose**: Hero sections and large background images
- **Formats**: JPG, WebP (for better performance)
- **Usage**: Hero sections, page backgrounds

### Case Studies (`/images/case-studies/`)
- **Purpose**: Visual content for case study sections
- **Formats**: SVG, PNG, JPG
- **Usage**: Case study cards and detailed views

### Icons (`/images/icons/`)
- **Purpose**: UI icons and favicons
- **Formats**: SVG (preferred), ICO
- **Usage**: Favicon, UI elements, placeholders

## Best Practices

### 1. File Naming
- Use kebab-case for file names: `api-attack-path.svg`
- Include descriptive names that indicate content
- Use appropriate file extensions

### 2. Image Optimization
- Use SVG for logos and icons when possible
- Compress JPG/PNG files before adding to the project
- Consider using WebP format for better performance
- Implement lazy loading for non-critical images

### 3. Path References
- Always use relative paths starting with `/images/`
- Use the `OptimizedImage` component for better error handling
- Implement fallback images for better UX

### 4. Component Usage

```tsx
import OptimizedImage from "@/components/ui/optimized-image";

// Basic usage
<OptimizedImage
  src="/images/logos/logo.svg"
  alt="Hermes Security Logo"
  className="h-8 w-auto"
  loading="eager"
/>

// With fallback
<OptimizedImage
  src="/images/case-studies/api-attack-path.svg"
  alt="API Attack Path"
  fallback="/images/icons/placeholder.svg"
  className="w-full h-64 object-cover rounded-lg"
/>
```

## Adding New Assets

1. **Place in appropriate folder** based on asset type
2. **Use descriptive filename** following naming conventions
3. **Optimize the asset** for web use
4. **Update references** in components using the new path
5. **Test in development** and production builds

## Troubleshooting

### Common Issues

1. **404 Errors**: Check that the asset path is correct and the file exists
2. **Build Issues**: Ensure assets are in the `public/` folder
3. **Performance**: Use appropriate image formats and sizes

### Debugging

- Check browser console for 404 errors
- Verify file paths in the built `dist/` folder
- Use the `OptimizedImage` component for better error handling

## Performance Considerations

- **Lazy Loading**: Use `loading="lazy"` for images below the fold
- **Preloading**: Preload critical images like the logo
- **Caching**: Ensure proper cache headers for static assets
- **Compression**: Use compressed image formats when possible

## Future Improvements

- Implement responsive images with different sizes
- Add WebP format support with fallbacks
- Consider using a CDN for better global performance
- Implement image optimization pipeline in the build process
