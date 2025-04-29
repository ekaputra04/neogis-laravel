# script for production

chmod -R 777 storage
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh