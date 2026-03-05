# dev.ps1 - Start backend and frontend dev servers in separate terminals (Windows PowerShell)
# Usage: .\dev.ps1

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'M:/My projects/Issue tracker/backend'; & 'M:/My projects/Issue tracker/backend/venv/Scripts/Activate.ps1'; python app.py"

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'M:/My projects/Issue tracker'; npm start"

Write-Host "Launched backend and frontend in separate PowerShell windows."
