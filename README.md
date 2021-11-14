# A production-grade, DX-optimized React starter for Supabase

Work in progress. What's done and what's left:

- [x] Idiomatic React
- [x] TypeScript
- [x] Sub-second refresh in dev with [Vite](https://vitejs.dev/)
- [x] TDD setup with [Jest](https://jestjs.io/) accelerated by [esbuild-jest](https://github.com/aelbore/esbuild-jest)
- [x] Component tests with [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/)
- [x] Declarative fetching and optimistic mutations with [react-query](https://react-query.tanstack.com/)
- [x] Magic link authentication
- [x] OAuth authentication
- [ ] Username/password authentication and recovery
- [x] A11y-friendly with [Chakra UI](https://chakra-ui.com/)
- [ ] User errors and messages surfaced via toasts
- [x] Routing with React Router
- [x] Dockerfile

## Quickstart

1. Create a project on supabase.io
1. In the dashboard, create an `items` table and add two columns: `title` (text) and `is_complete` (bool).
1. Add API key and URL to the [.env](.env) file
1. Start the development web server with `npm run dev` or `yarn dev`

## Notes

- react-query's devtools are enabled by default during development
- To use OAuth login, you must be enabled explicitly in the backend: https://supabase.io/docs/guides/auth#third-party-logins
