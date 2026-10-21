# YMTA Dental Clinic — Local Skill Setup

Keep the existing root `README.md`. This file is separate setup documentation.

## Current status from the supplied terminal log
- 14 TasteSkill skills, Vercel `web-design-guidelines`, and Impeccable installed (16 total).
- GSAP 3.15.0 and Lenis 1.3.27 installed.
- Playwright MCP not configured because the `codex` command was not found.
- npm reported one high-severity vulnerability and a blocked `esbuild@0.28.2` postinstall script.

## Run
Place `setup.ps1` in the folder containing `package.json`, then use PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

The script checks existing installations before installing, runs a read-only npm audit and (if available) the production build. It does not overwrite `README.md`, modify UI files, automatically fix vulnerabilities, or silently approve installation scripts.

Optional flags:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1 -SkipAudit
powershell -ExecutionPolicy Bypass -File .\setup.ps1 -SkipBuild
```

## Important next actions

1. Run `npm audit` and inspect the affected package and remediation. Avoid `npm audit fix --force` without assessing breaking changes.
2. Run `npm run build`. If blocked esbuild install scripts cause failure, inspect `npm install-scripts ls` and review `npm install-scripts approve esbuild` before approving.
3. To configure Playwright MCP for Codex CLI (once `codex` is installed and available), run:
   ```powershell
   codex mcp add playwright npx "@playwright/mcp@latest"
   ```
   For Antigravity, configure the MCP server through its MCP settings; the local skills being installed does not automatically configure an MCP server.
4. Restart your agent/editor and verify `npx skills list` and `npm list gsap lenis`.

`references.md` is a list of design references, not an installer. Godly Design, Transitions.dev, Animos and Deck.gallery should be treated as reference sites unless verified installable packages are identified.
