#!/bin/bash

CRON_COMMAND="0 3 * * * ./updateSSL.sh"

echo "$CRON_COMMAND" | crontab -

crontab -l
