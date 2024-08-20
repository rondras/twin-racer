# Verwenden Sie ein Nginx-Image als Basis
FROM nginx:latest

# Kopiere die HTML-Dateien in das Standard-Nginx-Verzeichnis
COPY www /usr/share/nginx/html

# Expose Port 80 (HTTP)
EXPOSE 80