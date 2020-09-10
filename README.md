<h1 align="center">
  <img
    alt="Logo"
    src="https://res.cloudinary.com/dixtjpk8s/image/upload/v1599651606/Goldman/logo_g6tawl.png" width="300px"
  />
</h1>

<h3 align="center">
  Express Application for a Goldman Web App
</h3>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/felipeDS91/goldman-backend?color=%23fbc131">

  <a href="https://www.linkedin.com/in/felipe-douglas-dev/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-felipe%20douglas-%23fbc131">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/felipeDS91/goldman-backend?color=%23fbc131">

  <a href="https://github.com/felipeDS91/goldman-backend/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/felipeDS91/goldman-backend?color=%23fbc131">
  </a>

  <a href="https://github.com/felipeDS91/goldman-backend/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/felipeDS91/goldman-backend?color=%23fbc131">
  </a>

  <a href="https://travis-ci.com/felipeDS91/goldman-backend">
    <img alt="Build Status" src="https://travis-ci.com/felipeDS91/goldman-backend.svg?branch=master">
  </a>
  
  <a href='https://coveralls.io/github/felipeDS91/goldman-backend?branch=master'>
    <img src='https://coveralls.io/repos/github/felipeDS91/goldman-backend/badge.svg?branch=master' alt='Coverage Status' />
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/felipeDS91/goldman-backend?color=%23fbc131">
</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p id="insomniaButton" align="center">
  <a href="https://insomnia.rest/run/?label=Goldman&uri=https%3A%2F%2Fgithub.com%2FfelipeDS91%2Fgoldman-backend%2Fblob%2Fmaster%2FInsomnia.json" target="_blank">
    <img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia">
  </a>
</p>

## 👨🏻‍💻 About the project

Goldman is a web software develop to help companies of jewels. Thinking about helping them, I developed this API so the company can have a simple and easy way to control and visualize the orders.

The company can register customers, payment types, statuses, materials, carriers and types of freight to manage their orders.

To see the **web client**, click here: [Goldman Frontend](https://github.com/felipeDS91/goldman-frontend)<br />

## 🚀 Technologies

Technologies that I used to develop this api

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Sequelize](https://sequelize.org/v5/manual/getting-started.html)
- [Yup](https://github.com/jquense/yup)
- [JWT-token](https://jwt.io/)
- [MySQL](https://dev.mysql.com/doc/)
- [Date-fns](https://date-fns.org/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [Faker](https://www.npmjs.com/package/faker)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Getting started

Import the `Insomnia.json` on Insomnia App or click on [Run in Insomnia](#insomniaButton) button

### Requirements

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)

**Clone the project and access the folder**

```bash
$ git clone https://github.com/felipeDS91/goldman-backend.git && cd goldman-backend
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables
$ cp .env.example .env

# Creates a docker container (changes the password)
$ docker run --name "goldman"  -e MYSQL_ROOT_PASSWORD="mysql_password" -p 3306:3306 -d mysql:5.7.30

# Creates a new mysql user (changes the username and password)
# To connect with mysql database you can use a tool like DBeaver for example
$ CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

# Once the services are running, let's find the CONTAINER_ID
$ docker ps
# And then replace it into the command to enter in Linux bash
$ docker exec -it [CONTAINER_ID] /bin/bash

# Once in the linux bash, run the migrations
$ yarn sequelize db:migrate

# So, run the seeds to create admin user and some data
$ yarn sequelize db:seed:all

# Credentials:
# email: admin@goldman.com.br
# password: 123456

# Well done, project is started!
```

## 🤔 How to contribute

- **Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork felipeDS91/goldman-backend
```

```bash
# Clone your fork
$ git clone your-fork-url && cd goldman-backend

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜&nbsp; by Felipe Douglas 👋 [See my linkedin](https://www.linkedin.com/in/felipe-douglas-dev/)
