# railtech.uz — one entry point for people, agents and CI (docs/ARCHITECTURE.md §6).
# `make help` lists the targets. Every check that CI runs is available locally.

PW_CHROMIUM_PATH ?= $(wildcard /opt/pw-browsers/chromium)
export PW_CHROMIUM_PATH

.PHONY: help install dev build test e2e check content cms og ci clean

help: ## Show targets
	@grep -E '^[a-z0-9-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*## "}{printf "  make %-9s %s\n", $$1, $$2}'

install: ## Install dependencies (npm ci)
	npm ci

dev: ## Dev server: http://localhost:4321/rt-corporate-website/
	npx astro dev --port 4321

cms: ## Validate the CMS schema against the data (public/admin/config.yml)
	node scripts/validate-cms-config.mjs

content: ## Content rules: translations stage, glossary, positioning, links, media
	node scripts/check-content.mjs

test: ## Unit and data-contract tests (Vitest)
	npx vitest run

build: ## astro check + build + audit of dist/ (SEO, i18n, links, redirects, positioning)
	npm run build

e2e: build ## Browser tests of the built site, desktop + phone (Playwright)
	npx playwright test

check: cms content test build ## Everything except the browser tests

ci: check e2e ## Everything CI runs

og: ## Regenerate the social preview image public/og-cover.png
	node scripts/generate-og-png.mjs

clean: ## Remove build and test output
	rm -r -f dist .astro test-results playwright-report
