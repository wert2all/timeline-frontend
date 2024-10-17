#!/bin/sh
# to encript -
# gpg --symmetric --cipher-algo AES256 src/environments/environment.prod.ts

gpg --quiet --batch --yes --decrypt --passphrase="$ENV_DECODE_PASSPHRASE" \
  --output ./src/environments/environment.prod.ts ./src/environments/environment.prod.ts.gpg

cp ./src/environments/environment.prod.ts ./src/environments/environment.ts
