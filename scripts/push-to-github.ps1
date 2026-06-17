# CampfireV4 — subir a GitHub (Windows)
# Ejecuta en PowerShell: .\scripts\push-to-github.ps1

$gh = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $gh)) {
    Write-Host "GitHub CLI no encontrado. Instalalo con: winget install GitHub.cli" -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot\..

Write-Host "1) Iniciando sesion en GitHub..." -ForegroundColor Cyan
& $gh auth login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Login cancelado o fallido." -ForegroundColor Red
    exit 1
}

Write-Host "2) Creando repo y subiendo codigo..." -ForegroundColor Cyan
& $gh repo create campfire-v4 --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Listo! Repo creado y codigo subido." -ForegroundColor Green
    & $gh repo view --web
} else {
    Write-Host ""
    Write-Host "Si el repo ya existe, prueba:" -ForegroundColor Yellow
    Write-Host '  git remote add origin https://github.com/TU_USUARIO/campfire-v4.git'
    Write-Host '  git push -u origin main'
}
