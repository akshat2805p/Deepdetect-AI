@echo off
echo =========================================
echo Starting DeepDetect AI - NLP Microservice
echo =========================================
echo.
echo Installing requirements...
pip install -r requirements.txt

echo.
echo Setting up Google Cloud Vision Auth...
set GOOGLE_APPLICATION_CREDENTIALS=vision-key.json

echo Starting Flask App...
python app.py
pause
