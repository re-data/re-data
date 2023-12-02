
# Maybe change this if you are not running on a Mac
CONTAINER_ARCH = linux/amd64 

.PHONY: help run-all-ci run-linters generate-docs generate-ui python-publish run-postgres setup-toy-shop copy-artifacts install-frontend run-frontend

help:
	$(info ${HELP_MESSAGE})
	@exit 0


# Run GitHub Actions CI jobs locally
run-all-ci: run-linters generate-docs generate-ui python-publish
	@echo "All CI steps completed."

run-linters:
	@echo "Running run-linters job..."
	act -j run-linters --container-architecture $(CONTAINER_ARCH)

generate-docs:
	@echo "Running generate-docs job..."
	act -j generate-docs --container-architecture $(CONTAINER_ARCH)

generate-ui:
	@echo "Running generate-ui job..."
	act -j generate-ui --container-architecture $(CONTAINER_ARCH)

python-publish:
	@echo "Running deploy job..."
	act -j deploy --container-architecture $(CONTAINER_ARCH)


# Run Toy Shop demo locally
run-postgres:
	@echo "Running Postgres locally using Docker..."
	docker run --name postgres-container \
		-e POSTGRES_PASSWORD=postgres \
		-p 5432:5432 \
		--health-cmd="pg_isready" \
		--health-interval=10s \
		--health-timeout=5s \
		--health-retries=5 postgres

setup-toy-shop:
	@echo "Filling Postgres local database with Toy Shop sample data..."
	( cd getting_started/toy_shop && pip install dbt-postgres && dbt deps && DBT_PROFILES_DIR="./" ./setup_toy_shop.sh toy_shop_postgres )


# Run UI locally
copy-artifacts:
	@echo "Copying re-data artifact files to frontend public folder..."
	cp getting_started/toy_shop/target/re_data/*.json re_data_ui/public/

install-frontend:
	@echo "Installing UI dependencies..."
	( cd re_data_ui && yarn install )

run-frontend: install-frontend
	@echo "Running RE Data UI..."
	( cd re_data_ui && npm start )

generate-docs:
	@echo "Generating docs..."
	( cd docs && yarn install && npm start )


define HELP_MESSAGE
Usage: $ make [TARGETS]

TARGETS
	help                    Shows this help message
	run-all-ci              Runs all CI steps
	run-linters             Runs run-linters job
	generate-docs           Runs generate-docs job
	generate-ui             Runs generate-ui job
	python-publish          Runs deploy job
	run-postgres            Run Postgres locally using Docker
	setup-toy-shop          Fill Postgres local database with Toy Shop sample data, requires make run-postgres first
	copy-artifacts          Copy re-data artifact files to frontend public folder
	install-frontend        Install UI dependencies
	run-frontend            Run RE Data UI
	generate-docs           Generate docs

endef
