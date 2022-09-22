.PRONY: build
build:
	docker-compose build

.PRONY: down
down:
	docker-compose down

.PRONY: evaluate
evaluate:
	make down && make build && docker-compose run --rm evaluator