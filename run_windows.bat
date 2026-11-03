@echo off
setlocal
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo Creating virtual environment...
  py -m venv .venv
  if errorlevel 1 goto failed
)
echo Installing STEMPROOF dependencies...
.venv\Scripts\python.exe -m pip install --upgrade pip
if errorlevel 1 goto failed
.venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 goto failed
echo.
echo Starting STEMPROOF API at http://127.0.0.1:8000
start "STEMPROOF API" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:8000/docs"
.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000
if errorlevel 1 goto failed
goto end
:failed
echo Setup or startup failed. Review the error above and README.md.
pause
:end
endlocal
