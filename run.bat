@echo off
title random number generator
python "%~dp0random_gen.py"
if %errorlevel% neq 0 (
    echo.
    echo [!] Application crashed or could not find Python.
    pause
)
