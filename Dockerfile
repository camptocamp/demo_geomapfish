FROM tianon/true

COPY nginx /etc/nginx/cond.d
VOLUME /etc/nginx/cond.d
