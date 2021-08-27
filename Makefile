.PHONY: analyze init up down clean flyway flyway-clean flyway-migrate flyway-info flyway-repair flyway-baseline

TARGET=
OUT=./out/csv
RANGE="1 months ago"

analyze:
	npm install && npm run start --  --target $(TARGET) --out $(OUT) --range $(RANGE)

init: analyze
	docker-compose exec mysql sh -c  'mysqlimport git /tmp/csv/git_log.csv --fields-terminated-by=","'
up:
	docker-compose up -d
down:
	docker-compose down
stop:
	docker-compose stop
clean: flyway-clean flyway-migrate

FLYWAY_SALES_CMD=docker-compose run --rm flyway -url="jdbc:mysql://mysql/git?useSSL=false" -user="root" -password=""
.PHONY: flyway flyway-clean flyway-migrate flyway-info flyway-repair flyway-baseline
flyway-clean:
	${FLYWAY_SALES_CMD} clean
flyway-migrate:
	${FLYWAY_SALES_CMD} migrate
flyway-info:
	${FLYWAY_SALES_CMD} info
flyway-repair:
	${FLYWAY_SALES_CMD} repair
flyway-baseline:
	${FLYWAY_SALES_CMD} baseline
