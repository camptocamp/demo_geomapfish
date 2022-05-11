from sqlalchemy.orm import configure_mappers

# Run ``configure_mappers`` after defining all of the models to ensure
# all relationships can be setup.
configure_mappers()
