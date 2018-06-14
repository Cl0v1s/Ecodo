@echo off

echo "Appuie sur T"

copy .\..\FuitePWA\index.html Netfuite\assets\www
xcopy .\..\FuitePWA\static Netfuite\assets\www\static /E /I

jar -cMf Netfuite.zip -C Netfuite Netfuite\* Netfuite\AndroidManifest.xml

move Netfuite.zip Netfuite.apk

echo "Mot de passe: &Topkapi2019"

jarsigner -verbose  -sigalg MD5withRSA -digestalg SHA1 -keystore Fernandez NetFuite.apk tit

echo "Tu peux maintenant mettre l'application sur le store et/ou ton téléphone"
pause