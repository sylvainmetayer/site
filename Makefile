.DEFAULT_GOAL := help

LABEL = jekyll_docker_sylvainmetayer

CONTAINER_NAME = jekyll_sylvainmetayer
CONTAINER_NAME_PROD = jekyll_sylvainmetayer_production

DOCKER_EXEC = docker exec
DOCKER_COMPOSE = docker-compose

containers := $$(docker ps -af label=$(LABEL) -q)
images     := $$(docker images -af label=$(LABEL) -q)

build: ## Build the application
	$(DOCKER_COMPOSE) build

up: build ## Start the development version
	$(DOCKER_COMPOSE) up -d

down: stop ## Stop and remove containers
	$(DOCKER_COMPOSE) down

stop: ## Stop 
	$(DOCKER_COMPOSE) stop

restart: ## Restart docker environment
	$(DOCKER_COMPOSE) restart

test: ## Run test inside docker development environment
	$(DOCKER_EXEC) $(CONTAINER_NAME) bundle exec rake test

help: ## Print help
	# $(DOCKER_EXEC) $(CONTAINER_NAME) jekyll help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

cleanup: ## Erase temporary data
	rm -rf _site .jekyll-metadata .sass-cache .git-metadata .jekyll-cache

clean: down ## Cleanup local data, including containers
	docker stop $(containers) || true
	docker rm -f $(containers) || true
	docker rmi -f $(images) || true
	rm -rf _site .jekyll-metadata .sass-cache .git-metadata .jekyll-cache

logs: ## Show logs
	docker logs $(CONTAINER_NAME) -f 

debug: ## Instanciate a new container to debug when things are wrong
	docker-compose run jekyll bash

logs-prod:  ## Show prod logs
	docker logs $(CONTAINER_NAME_PROD) -f 

shell: ## Get a shell inside the container
	docker exec -it ${CONTAINER_NAME} bash

shell_prod: ## Get a shell inside the production container
	docker exec -it ${CONTAINER_NAME} bash
