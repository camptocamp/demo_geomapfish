ALIAS /${instanceid}/tiles /var/sig/tiles

<Location /${instanceid}/tiles>
    Header set Cache-Control "max-age=864000, public"
</Location>
