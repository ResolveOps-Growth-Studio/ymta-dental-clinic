# YMTA Dental Clinic - Safe, repeatable development setup
# Run from the project root: powershell -ExecutionPolicy Bypass -File .\setup.ps1
# Does NOT overwrite README.md, change your UI, or auto-fix audit findings.
param(
    [switch]$SkipBuild,
    [switch]$SkipAudit
)

$ErrorActionPreference = 'Stop'
$failed = @()
$warnings = @()

function Step([string]$message) { Write-Host "`n==> $message" -ForegroundColor Cyan }
function Warn([string]$message) { Write-Host "WARNING: $message" -ForegroundColor Yellow; $script:warnings += $message }
function Run([string]$program, [string[]]$arguments) {
    & $program @arguments
    if ($LASTEXITCODE -ne 0) { throw "$program $($arguments -join ' ') failed (exit $LASTEXITCODE)" }
}
function TryStep([string]$label, [scriptblock]$action) {
    try { & $action }
    catch {
        Write-Host "FAILED: $label - $($_.Exception.Message)" -ForegroundColor Red
        $script:failed += $label
    }
}
function HasPackage([string]$package) {
    & npm ls $package --depth=0 --parseable *> $null
    return ($LASTEXITCODE -eq 0)
}
function InstallSkillIfMissing([string]$name, [string]$source, [string[]]$extra) {
    $skillFile = Join-Path (Join-Path (Join-Path (Get-Location).Path '.agents') 'skills') (Join-Path $name 'SKILL.md')
    if (Test-Path $skillFile) {
        Write-Host "SKIP skill: $name already installed" -ForegroundColor DarkGreen
        return
    }
    Step "Install skill: $name"
    Run 'npx' (@('--yes', 'skills', 'add', $source, '--agent', 'codex', '--agent', 'antigravity', '-y') + $extra)
}

Step 'Check project root and tools'
if (-not (Test-Path '.\package.json')) {
    Write-Host 'ERROR: package.json not found. Run this script from the YMTA project root.' -ForegroundColor Red
    exit 1
}
foreach ($tool in @('node','npm','npx')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: $tool not found. Install Node.js LTS and restart your terminal." -ForegroundColor Red
        exit 1
    }
}
Write-Host "Node: $(& node --version) | npm: $(& npm --version)"

Step 'Project dependencies'
if (Test-Path '.\node_modules') {
    Write-Host 'SKIP npm install: node_modules exists. Run npm install manually after dependency changes.' -ForegroundColor DarkGreen
} else {
    TryStep 'npm install' { Run 'npm' @('install') }
}

Step 'GSAP and Lenis'
foreach ($package in @('gsap','lenis')) {
    if (HasPackage $package) {
        Write-Host "SKIP: $package already installed" -ForegroundColor DarkGreen
    } else {
        $p = $package
        TryStep "Install $p" { Run 'npm' @('install', $p) }
    }
}

Step 'Agent skills'
# TasteSkill installs its bundled skills. Skip when the core skill is present.
TryStep 'TasteSkill' { InstallSkillIfMissing 'gpt-taste' 'tasteskill/tasteskill' @() }
TryStep 'Vercel web-design-guidelines' { InstallSkillIfMissing 'web-design-guidelines' 'vercel-labs/agent-skills' @('--skill', 'web-design-guidelines') }
TryStep 'Impeccable' { InstallSkillIfMissing 'impeccable' 'pbakaus/impeccable' @() }

Step 'Playwright MCP status'
if (Get-Command 'codex' -ErrorAction SilentlyContinue) {
    Write-Host 'Codex CLI detected. To configure Playwright MCP (if not already configured):'
    Write-Host '  codex mcp add playwright npx "@playwright/mcp@latest"'
} else {
    Warn 'Codex CLI is not on PATH. Playwright MCP is NOT configured by this script. Configure it in Antigravity MCP settings, or install Codex CLI first.'
}

if (-not $SkipAudit) {
    Step 'Security audit (read-only; no automatic fixes)'
    & npm audit
    if ($LASTEXITCODE -ne 0) { Warn 'npm audit reported vulnerabilities. Inspect the report before updating dependencies.' }
}

if (-not $SkipBuild) {
    Step 'Production build check'
    $packageJson = Get-Content '.\package.json' -Raw | ConvertFrom-Json
    if ($packageJson.scripts -and $packageJson.scripts.build) {
        TryStep 'npm run build' { Run 'npm' @('run','build') }
    } else {
        Write-Host 'SKIP: no build script defined in package.json.'
    }
}

Step 'Final verification'
TryStep 'skills list' { Run 'npx' @('--yes','skills','list') }
Write-Host "`nManual review if esbuild install scripts are blocked:" -ForegroundColor Yellow
Write-Host '  npm install-scripts ls'
Write-Host '  npm install-scripts approve esbuild   # only after reviewing the script'
Write-Host "`nREADME.md and references.md have NOT been modified."
Write-Host "Failed steps: $($failed.Count) | Warnings: $($warnings.Count)"
if ($failed.Count -gt 0) { exit 1 }
exit 0
