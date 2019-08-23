
reinit_getitfixed_db:
	docker-compose run --rm geoportal initialize_getitfixed_db c2cgeoportal://development.ini#app --force=1 --with-data=1

alembic_upgrade_getitfixed:
	docker-compose run --rm geoportal alembic -c getitfixed/alembic.ini -n getitfixed upgrade head
	