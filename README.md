<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy to Railway

This project is set up to be deployed on [Railway](https://railway.app/). This K-Group backend application includes multiple modules (accounting, clients, subscriptions, etc.) and requires a PostgreSQL database.

For a comprehensive, step-by-step deployment guide, see [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md).

### Quick Deployment

We've included helper scripts to make Railway deployment easier:

1. **Create a Railway project**:
   - Sign up or log in to [Railway](https://railway.app/)
   - Create a new project 
   - Add a PostgreSQL database plugin

2. **Configure environment variables**:
   ```bash
   npm run setup:railway-postgres
   ```
   This script will:
   - Extract database credentials from Railway's PostgreSQL plugin
   - Set up all necessary environment variables
   - Generate a secure JWT secret

3. **Deploy with a single command**:
   ```bash
   npm run deploy:railway
   ```
   This will:
   - Check for required environment variables
   - Build the application
   - Deploy it to Railway

4. **Verify database setup** (if you encounter database issues):
   ```bash
   npm run verify:railway-db
   ```
   This script will:
   - Check if all required tables exist
   - Help troubleshoot database initialization issues
   - Provide options to force table recreation if needed

### Manual Deployment

If you prefer to manually deploy, follow these steps:

1. **Create a Railway account and install the CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize your project**:
   ```bash
   railway init
   ```

4. **Link your project to an existing Railway project**:
   ```bash
   railway link
   ```

5. **Add a PostgreSQL plugin** to your project through the Railway dashboard

6. **Set up your environment variables** in the Railway dashboard or through the CLI:
   ```bash
   # Database settings
   railway variables set POSTGRESQL_HOST=your-postgres-host
   railway variables set POSTGRESQL_PORT=5432
   railway variables set POSTGRESQL_USER=your-postgres-user
   railway variables set POSTGRESQL_PASSWORD=your-postgres-password
   railway variables set POSTGRESQL_DB=your-postgres-db
   railway variables set POSTGRESQL_SSL=true
   railway variables set SYNC=true
   
   # Authentication 
   railway variables set JWT_SECRET=your-secret-key
   
   # Runtime settings
   railway variables set NODE_ENV=production
   
   # Frontend settings (replace with your frontend URL)
   railway variables set FRONTEND_URL=https://your-frontend-url.com
   ```

7. **Build and deploy your code**:
   ```bash
   npm run build
   railway up
   ```

8. **Open your project** in the browser:
   ```bash
   railway open
   ```

Once deployed, you can access:
- The Swagger API documentation at `YOUR_RAILWAY_URL/swagger`
- The health check endpoint at `YOUR_RAILWAY_URL/api/health`

### Troubleshooting Railway Deployment

If you encounter any issues with your K-Group application deployment, check the following:

1. **Verify health check endpoint**
   - The health check is configured to check `/api/health`
   - Make sure this endpoint returns a 200 status code
   - Use Railway logs to see if it's being reached

2. **Check Railway logs**
   - Railway dashboard provides logs that show startup errors
   - Look for database connection issues or TypeORM entity errors
   - Check for synchronization messages indicating table creation

3. **Environment variables**
   - Ensure all required environment variables are set in Railway
   - Database connection variables must match your PostgreSQL service
   - Verify SSL is enabled for database connections (POSTGRESQL_SSL=true)
   - Make sure SYNC=true to allow entity creation

4. **Database tables**
   - Check if all required tables are created:
     - client, subscription, program, service, accounting, payment tables
   - If tables are missing, try toggling SYNC to false then true again

5. **Entity relationships**
   - Many modules depend on relationships between entities
   - If you see foreign key errors, check entity definitions
   - You may need to manually create relationships if automatic sync fails

6. **Frontend connection**
   - If your frontend can't connect, verify CORS settings
   - Make sure FRONTEND_URL is set to your frontend's domain
   - Check for SSL/HTTPS issues in browser console

For more detailed troubleshooting steps, refer to the [Railway Troubleshooting Guide](RAILWAY_TROUBLESHOOTING.md) in this repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# koulis-group-front
