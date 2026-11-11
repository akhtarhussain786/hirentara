@echo off
title Overseas Services - Development Server
echo ====================================================
echo Starting Development Server (Vite + Express Backend) ...
echo Frontend: http://localhost:5173
echo Backend API: http://127.0.0.1:3000
echo ====================================================
start http://localhost:5173
npm run dev
pause

