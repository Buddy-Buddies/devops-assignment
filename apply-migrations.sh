# apply-migrations.sh
#!/bin/bash

# Wait for the database to be ready
while ! nc -z database 3306; do
  sleep 1
done

# Apply Prisma migrations
npx prisma migrate deploy
