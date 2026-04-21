import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Non-source trees excluded from lint scan (tests, scripts, infra,
      // generated files). Some of these also live in iCloud-evicted paths
      // that cause ESLint's readFile to time out if walked.
      "docs/**",
      "tests/**",
      "scripts/**",
      "supabase/**",
      "public/**",
      "styles/**",
      "Fonts/**",
      "**/*.md",
    ],
  },
];

export default eslintConfig;
