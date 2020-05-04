@echo off
echo %time%
FOR /L %%i IN (1, 1, 10) DO (
    echo Run: %%i
    npm run grpc_client
    timeout 2 > NUL
)
echo %time%
