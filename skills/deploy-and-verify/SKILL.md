---
name: deploy-and-verify
description: Automates full verification, static build checks, git staging, and deployment to GitHub Pages.
---

# Deploy and Verify Skill

Use this skill when preparing and executing deployments of the RailTech portal to GitHub.

## Steps
1. Run `npm run build` to verify 0 errors and check generated pages in `dist/`.
2. Check `git status` to ensure all untracked files are staged or ignored.
3. Commit with a structured conventional commit message (`feat:`, `fix:`, `docs:`).
4. Push to remote: `git push origin main`.
5. Check GitHub Actions status on `nzulkaynarov/rt-corporate-website`.
