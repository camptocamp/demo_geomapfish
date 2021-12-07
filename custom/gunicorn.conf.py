import os

accesslog = "-"
access_log_format = '%(H)s %({Host}i)s %(m)s %(U)s?%(q)s "%(f)s" "%(a)s" %(s)s %(B)s %(D)s %(p)s'

environ = [(k, v.replace("%", "%%")) for k, v in os.environ.items()]
raw_paste_global_conf = [f"{k}={v}" for k, v in environ]
