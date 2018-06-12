@echo off
echo "Ouvrir NetFuite.apk avec WinRar, supprimer le dossier META-INF, mettre à jour le fichier index.html et le dossier static situé dans le dossier assets" 
echo "Quand t'es prêt appuie sur entrer"
pause
echo "Mot de passe: &Topkapi2019"

jarsigner -verbose  -sigalg MD5withRSA -digestalg SHA1 -keystore Fernandez app-debug.apk tit

echo "Tu peux maintenant mettre l'application sur le store et/ou ton téléphone"