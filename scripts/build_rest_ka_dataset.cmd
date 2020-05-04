@echo off
echo %time%
FOR /L %%i IN (1, 1, 10) DO (
    echo Run: %%i
    npm run rest_client_ka
    timeout 2 > NUL
)
echo %time%
