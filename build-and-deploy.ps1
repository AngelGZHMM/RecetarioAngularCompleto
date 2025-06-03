# Script para buildear Angular y desplegarlo en el backend
Write-Host "🔧 Iniciando proceso de build y deploy..." -ForegroundColor Green

# Navegar al directorio del frontend
Set-Location "frontend\frontrecetario"

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🏗️ Buildeando aplicación Angular para producción..." -ForegroundColor Yellow
ng build --configuration=production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completado exitosamente" -ForegroundColor Green
    
    Write-Host "🗑️ Limpiando archivos anteriores del backend..." -ForegroundColor Yellow
    Remove-Item -Path "..\..\backend\public\*" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "📁 Copiando archivos al backend..." -ForegroundColor Yellow
    Copy-Item -Path "dist\frontrecetario\browser\*" -Destination "..\..\backend\public\" -Recurse
    
    Write-Host "✅ Deploy completado! Tu aplicación está lista." -ForegroundColor Green
    Write-Host "🚀 Ahora puedes iniciar tu servidor backend con: npm start" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
}

# Volver al directorio raíz
Set-Location "..\..\"

Write-Host "📋 Archivos en backend/public:" -ForegroundColor Blue
Get-ChildItem "backend\public\" | Select-Object Name
