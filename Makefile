.PHONY: install up down restart ssl

install:
	docker compose up -d --build
	docker compose exec web chmod -R 755 /var/www/html

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

ssl:
	docker compose exec web bash -c "mkdir -p /etc/apache2/ssl && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/halloween.key -out /etc/apache2/ssl/halloween.crt -subj '/CN=halloween.dev/O=DAWlloween' && apache2ctl graceful"
