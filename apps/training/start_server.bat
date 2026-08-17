@echo off
echo ========================================
echo ClinicalNexus AI - Inference Server
echo ========================================
echo.
echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo.
echo Starting inference server...
echo Server will run on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
python inference_server.py
pause
