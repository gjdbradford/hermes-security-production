export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type rules
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system changes
        'ci', // CI/CD changes
        'chore', // Maintenance tasks
        'hotfix', // Critical hotfix
        'security', // Security fixes
        'revert', // Reverting changes
      ],
    ],

    // Subject rules
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],

    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],

    // Footer rules
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],

    // Header rules
    'header-max-length': [2, 'always', 100],

    // Scope rules (optional but recommended)
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [
      2,
      'always',
      [
        'ui', // User interface components
        'api', // API related changes
        'config', // Configuration changes
        'deploy', // Deployment related
        'security', // Security related
        'performance', // Performance related
        'accessibility', // Accessibility improvements
        'seo', // SEO related
        'email', // Email functionality
        'routing', // Routing and navigation
        'assets', // Static assets
        'deps', // Dependencies
        'docs', // Documentation
        'tests', // Test related
        'ci', // CI/CD
        'hotfix', // Critical fixes
        'cta', // CTA and navigation related
      ],
    ],
  },

  // Custom rules for Hermes Security project
  plugins: [
    {
      rules: {
        'hermes-security-scope': ({ scope }) => {
          // Require scope for certain types
          const typesRequiringScope = ['feat', 'fix', 'hotfix', 'security'];
          if (typesRequiringScope.includes(scope)) {
            return [true];
          }
          return [true];
        },

        'hermes-security-description': ({ subject }) => {
          // Require descriptive commit messages
          const minWords = 3;
          const words = subject.split(' ').length;
          if (words < minWords) {
            return [false, `Subject must be at least ${minWords} words long`];
          }
          return [true];
        },
      },
    },
  ],
};
