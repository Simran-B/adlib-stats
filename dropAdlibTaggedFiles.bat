@echo off
cd /d %~dp0
node tagCounts.js %*
pause