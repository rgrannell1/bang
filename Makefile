
BIN        = ./node_modules/.bin





NODE       = node
NODE_FLAGS = --harmony_destructuring --harmony_rest_parameters

# -- Mocha.

MOCHA       = $(BIN)/mocha
MOCHA_FLAGS = $(NODE_FLAGS)

# -- Bunyan.
BUNYAN       = $(BIN)/bunyan

# -- eslint

ESLINT       = $(BIN)/eslint
ESLINT_FLAGS = --config config/eslint-config.json

## -- Docker

DOCKER         = docker
CONTAINER_NAME = bang_server

REMAPPED_PORT  = 8125
DEFAULT_PORT   = 8025


SERVER_PATH = bang/
TEST_PATH   = test/all.js




eslint:
	$(ESLINT) $(ESLINT_FLAGS) $(SERVER_PATH)

test:
	$(NODE) $(TEST_PATH)

docker-build:
	$(DOCKER) build --tag=$(CONTAINER_NAME) .

docker-cleanbuild:
	$(DOCKER) build --no-cache=true --tag=$(CONTAINER_NAME) .

docker-run:
	$(DOCKER) run -p $(REMAPPED_PORT):$(DEFAULT_PORT) $(CONTAINER_NAME)
