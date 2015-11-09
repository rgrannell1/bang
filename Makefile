
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





SERVER_PATH = lib/
TEST_PATH   = test/all.js




eslint:
	$(ESLINT) $(ESLINT_FLAGS) $(SERVER_PATH)

test:
	$(NODE) $(TEST_PATH)
