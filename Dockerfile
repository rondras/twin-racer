

#Serve the App with Nginx
FROM nginx:alpine

# Install Certbot
RUN apk add --no-cache certbot certbot-nginx

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build from stage 1
COPY ./www /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and 443
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

