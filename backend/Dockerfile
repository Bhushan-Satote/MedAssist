# Use the official PHP image with FPM for Laravel
FROM php:8.2-fpm

# Install system dependencies and PHP extensions required by Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app only from the backend folder
COPY backend/ ./

# Install Laravel dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Configure Nginx directly
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /var/www/html/public; \
    index index.php index.html; \
    error_log /dev/stdout info; \
    access_log /dev/stdout; \
    location ~* \.(env|git) { deny all; return 403; } \
    location / { try_files $uri $uri/ /index.php?$query_string; } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
    location ~* \.(jpg|jpeg|gif|png|css|js|ico|webp|svg)$ { \
        expires 5d; \
    } \
}' > /etc/nginx/sites-available/default

# Create startup script
RUN echo '#!/bin/bash \n\
php-fpm -D \n\
nginx -g "daemon off;" & \n\
php artisan config:cache \n\
php artisan queue:work --sleep=3 --tries=3 & \n\
while true; do \n\
    php artisan schedule:run >> /dev/stdout 2>&1 \n\
    sleep 60 \n\
done' > /start.sh \
    && chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]
