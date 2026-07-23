@echo off
chcp 65001 >nul & color 0A
echo.
echo  ╔══════════════════════════════════╗
echo  ║   BookAI v2.0 - Dang khoi dong  ║
echo  ╚══════════════════════════════════╝
echo.

:: Kiem tra Node.js
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [LOI] Chua cai Node.js!
    echo  Dang mo trang tai...
    start https://nodejs.org
    pause & exit /b
)
for /f "tokens=*" %%v in ('node --version') do set VER=%%v
echo  [OK] Node.js %VER%

:: Kiem tra API Key
findstr /C:"PASTE_KEY_HERE" .env >nul 2>&1
if not errorlevel 1 (
    color 0E
    echo.
    echo  [!] CHUA CO API KEY!
    echo.
    echo  1. Vao: https://aistudio.google.com/apikey
    echo  2. Dang nhap Google -> "Create API key"
    echo  3. Copy key roi dan vao file .env
    echo     (Thay dong: VITE_GEMINI_API_KEY=PASTE_KEY_HERE)
    echo.
    start https://aistudio.google.com/apikey
    timeout /t 2 /nobreak >nul
    start notepad .env
    echo  Sau khi luu .env, dong Notepad va chay lai file nay.
    pause & exit /b
)
echo  [OK] API Key da san sang

:: Cai thu vien lan dau
if not exist node_modules (
    echo.
    echo  [*] Lan dau khoi dong - Dang cai thu vien...
    echo      Vui long doi 2-3 phut
    npm install --silent
    if errorlevel 1 (
        color 0C
        echo  [LOI] Cai dat that bai!
        echo  Kiem tra ket noi internet va thu lai.
        pause & exit /b
    )
    echo  [OK] Cai dat hoan tat!
)

echo.
echo  ╔══════════════════════════════════╗
echo  ║  Mo trinh duyet: localhost:3000  ║
echo  ║  Nhan Ctrl+C de tat             ║
echo  ╚══════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3000
npm run dev
pause
