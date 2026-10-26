.PHONY: install up down restart

install:
	docker compose up -d --build
	docker compose exec web chmod -R 755 /var/www/html

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart
