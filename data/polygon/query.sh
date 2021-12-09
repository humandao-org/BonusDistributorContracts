#!/bin/sh

curl 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2' \
  -H 'authority: api.thegraph.com' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'content-type: application/json' \
  -H 'accept: */*' \
  -H 'origin: https://thegraph.com' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://thegraph.com/' \
  -H 'accept-language: nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7' \
  --data-raw '{"query":"{\n\tswaps(where: { tokenOutSym_contains: \"HDAO\"}) {\n    tokenOutSym,\n    tokenInSym,\n    tokenAmountIn,\n    tokenAmountOut,\n    userAddress {\n      id\n    }\n  }\n}\n","variables":null}' \
  --compressed