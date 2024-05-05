#!/bin/bash

domainName=$1

sed -i "s/<yourDomain>/${domainName}/g" nginx/conf/app.conf