# averlyn-vaccine

Pure static SPA on GitHub Pages. Vaccine data baked into `src/data/{baby,vaccines}.ts`. **2026-06 deliberately reverted from FastAPI + Supabase + Vercel — do not suggest adding a backend, auth, or live DB back unless the user explicitly asks.**

Pages `build_type` must stay `workflow` (not `legacy` / Deploy from a branch). If it gets switched back: `gh api repos/tankfinal/averlyn-vaccine/pages -X PUT -f build_type=workflow`.

Update flow: edit `src/data/vaccines.ts` + `LAST_UPDATED` in `src/components/Header.tsx` → push → CI deploys.
