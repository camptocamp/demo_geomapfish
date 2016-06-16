#default environment variables used by the confd template files

export DB_CONNECTION=${"$"}{DB_CONNECTION:-"${mapserver_docker_dbconnection}"}
