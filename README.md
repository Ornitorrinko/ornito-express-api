## OrnitoJS
Command line interface to start a new nodejs API based on express framework with Ornito structure defined from past projects.
- async await functions
- email builder using sendgrid service
- jobs using cronjob
- resources creation from command line
- relational and non-relational databases
- eslint
- tests

## Setup

**`Ornito JS`** allow you to easily start an API and code oriented to modules. strives to be an easily embeddable and beautiful command line interface for [Node.js](https://nodejs.org/).

**`Ornito JS`** needs the following tools/techonologies to be able to start up.
- Nodejs > 7.6.0
- Postgres
- Mongodb (if you're going to use it)
- Redis (if you're going to use it)

> **Note:** **`Ornito CLI`** is still in active development, we want to deliver more features like eslint, iugu integration and more.

## Command line
``` shell
npm install -g ornitojs
ornito start
```

## Running
``` shell
npm start
npm test
npm run linter
```

### Creating a new module
``` shell
ornito module user
```

### 🔧 Module structure
* **user**
    * **__tests__**
      * **user.spec.js**
    * **user.model.js**
    * **user.persistence.js**
    * **user.schema.js**
    * **user.service.js**

### 💬 Structure description
* **__tests__:** We are using [Jest](https://facebook.github.io/jest/) to test our models, but you can test endpoints, services and schema validations in this folder. The test suit is called from `npm test`
* **model:** Our entities represented by javascript classes and we call some database actions here, it might be mongoose calls or relational database calls
* **persistence:** Here you're able to require your database driver and start querying and inserting data to your choosen database. 
* **schema:** We're using [Joi](https://github.com/hapijs/joi) to validate our models, so when we receive a request, if the payload validation is not correct, we throw an error.
* **service:** We can validate params, integrate with 3rd part services, create rules, call our models, etc.

### 💡 To do:

* create database if does not exist (node-postgres)
* show eslint options (standard, standard2, airbnb...)
* create job from CLI
* option to inform database settings while creating structure (user, password, host)
* implicit filters on routes
