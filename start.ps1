param(
    [switch]$Backend
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inicio automático - Frontend + ngrok  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# === BACKEND (opcional con -Backend) ===
if ($Backend) {
    Write-Host "`n[1/5] Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
    $backendDir = "C:\Users\olive\Documents\GitHub\TP_Final"
    Set-Location -LiteralPath $backendDir
    Start-Process -WindowStyle Normal -FilePath "cmd.exe" -ArgumentList "/c cd /d $backendDir && .\mvnw spring-boot:run"
    Write-Host "      Backend arrancando en http://localhost:8080" -ForegroundColor Green
    Start-Sleep -Seconds 5
} else {
    Write-Host "[1/5] Backend: saltado (ejecutalo desde VS Code)" -ForegroundColor DarkYellow
}

# === FRONTEND ===
Write-Host "[2/5] Matando procesos viejos..." -ForegroundColor Yellow
$frontendDir = "C:\Users\olive\Documents\GitHub\tp-final-frontend\gestion-mercado"
Get-Process -Name ngrok -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq "" } | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "[3/5] Iniciando Angular..." -ForegroundColor Yellow
Set-Location -LiteralPath $frontendDir
Start-Process -WindowStyle Normal -FilePath "cmd.exe" -ArgumentList "/c cd /d $frontendDir && ng serve --host 0.0.0.0 --proxy-config proxy.conf.json"
Start-Sleep -Seconds 20

Write-Host "[4/5] Iniciando ngrok..." -ForegroundColor Yellow
Start-Process -WindowStyle Hidden -FilePath "ngrok" -ArgumentList "http 4200"
Start-Sleep -Seconds 6

# === OBTENER URL ===
Write-Host "[5/5] Obteniendo URL..." -ForegroundColor Yellow
try {
    $tunnels = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $url = $tunnels.tunnels[0].public_url
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  TODO LISTO!" -ForegroundColor Green
    Write-Host "  Frontend:  $url" -ForegroundColor Green
    Write-Host "  Backend:   http://localhost:8080" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Start-Process $url
} catch {
    Write-Host "Error obteniendo URL. Ejecutá 'ngrok http 4200' manualmente." -ForegroundColor Red
}
