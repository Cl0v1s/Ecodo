rmdir /S /Q www
echo r | xcopy .\..\FuitePWA\index.html www /I 
xcopy .\..\FuitePWA\static www\static /E /I