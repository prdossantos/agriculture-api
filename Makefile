# -----------------------------------------------------
#    General variables (adjust as needed)
# -----------------------------------------------------
SHELL := /bin/bash
DOCKER_COMPOSE := docker-compose
APP_SERVICE := api         # Name of the service in docker-compose.yml
DB_SERVICE := postgres      # Name of the Postgres service in docker-compose.yml
DB_NAME := agriculture
DB_USER := postgres
DB_HOST := postgres
REDIS_HOST := redis
ENV_EXAMPLE := .env.example
ENV_FILE := .env

# -----------------------------------------------------
#    Primary help target: shows available commands
# -----------------------------------------------------
help:
	@echo "===================== HELP ====================="
	@echo " make install        -> Copies .env.example to .env, installs dependencies"
	@echo " make docker-up      -> Brings containers up in detached mode"
	@echo " make docker-down    -> Brings containers down (keeps volume)"
	@echo " make docker-restart -> Restarts containers"
	@echo " make create-db      -> Creates the database if it doesn't exist"
	@echo " make migrate        -> Runs migrations"
	@echo " make start          -> Starts app in dev mode"
	@echo " make build          -> Compiles the project (prod)"
	@echo " make start-prod     -> Starts the app in production mode"
	@echo " make test           -> Runs unit tests"
	@echo " make lint           -> Runs the linter"
	@echo " make logs           -> Shows logs for the application container"
	@echo " make clean          -> Removes containers, volumes, images, and networks"
	@echo "================================================"
	@echo "Example: make install && make docker-up"
	@echo "================================================"

# -----------------------------------------------------
#    1. Copy .env.example -> .env and install dependencies
# -----------------------------------------------------
install:
	if [ ! -f $(ENV_FILE) ]; then \
		cp $(ENV_EXAMPLE) $(ENV_FILE); \
		echo "Created .env from $(ENV_EXAMPLE)."; \
	fi
	@echo "Installing dependencies..."
	npm install

# -----------------------------------------------------
#    2. Docker Compose: up, down, and restart
# -----------------------------------------------------
docker-up:
	@echo "Bringing containers up in detached mode..."
	$(DOCKER_COMPOSE) up -d

docker-down:
	@echo "Bringing containers down..."
	$(DOCKER_COMPOSE) down

docker-restart: docker-down docker-up
	@echo "Containers have been restarted."

# -----------------------------------------------------
#    3. Wait for Redis to be ready
# -----------------------------------------------------
wait-redis:
	@echo "Waiting for Redis to be ready..."
	@$(DOCKER_COMPOSE) exec -T redis sh -c 'until redis-cli ping | grep -q PONG; do echo "Redis is not ready. Retrying in 2 seconds..."; sleep 2; done'
	@echo "Redis is ready!"

# -----------------------------------------------------
#    4. Manage the database
# -----------------------------------------------------
create-db:
	@echo "Waiting for Postgres to accept connections..."
	@docker-compose exec -T postgres bash -c '\
      for i in {1..30}; do \
        pg_isready -U postgres -h localhost && break || (echo "waiting for the database..." && sleep 2); \
      done \
    '
	@echo "Checking if the $(DB_NAME) database exists..."
	@docker-compose exec -T postgres \
	  psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$(DB_NAME)'" \
	  | grep -q 1 || \
	  docker-compose exec -T postgres \
	    psql -U postgres -c "CREATE DATABASE $(DB_NAME)"

drop-db:
	@echo "Dropping database $(DB_NAME) if it exists..."
	$(DOCKER_COMPOSE) exec -T $(DB_SERVICE) \
	  psql -U $(DB_USER) -c "DROP DATABASE IF EXISTS \"$(DB_NAME)\";"

# -----------------------------------------------------
#    5. Run migrations
# -----------------------------------------------------
migrate:
	@echo "Running migrations..."
	npx typeorm migration:run -d ./dist/config/data-source.js

# -----------------------------------------------------
#    6. Start the application
# -----------------------------------------------------
start:
	@echo "Starting application in development mode..."
	npm run start:dev

build:
	@echo "Compiling TypeScript project for production..."
	npm run build

start-prod: build
	@echo "Starting application in production mode..."
	npm run start:prod


# -----------------------------------------------------
#    9. Full cleanup (containers, volumes, build history, networks)
# -----------------------------------------------------
clean: drop-db
	@echo "Stopping containers and removing volumes, build history, and networks..."
	$(DOCKER_COMPOSE) down -v --remove-orphans \
	&& echo "Removing unused networks for the project..." \
	&& docker network prune --filter label=project=agriculture-api -f \
	&& echo "Removing Docker builder cache for the project..." \
	&& docker builder prune --filter label=project=agriculture-api -f \
	&& echo "Removing files..." \
	&& rm -rf dist node_modules .env logs coverage


# -----------------------------------------------------
#    Shortcut: run all basic setup steps
#    Example: make setup
# -----------------------------------------------------
setup: install docker-up create-db wait-redis build migrate
	@echo "Setup complete: containers online, database and Redis ready, migrations run."
