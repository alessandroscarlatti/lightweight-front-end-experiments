echo hello world!
(timeout /t 5 || >nul ping -n 2 localhost ) 2>nul
echo stuff
exit /b 12345