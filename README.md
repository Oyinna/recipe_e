## Recipes
This is a simple recipe RESTful service
### Features
* Users can log in.
* Users can create recipe.
* Users can view all recipes.
* Users can view a particular recipes.
* Users can search for recipes.
* Users can delete recipe.
* Users can Update recipe.
* Users can rate recipe.
### API Documentation
The API Documentation for this project is found on [api documentation](https://documenter.getpostman.com/view/12192132/TVev5jrY) .
### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
#### Prerequisites
You need to have mongodb, nodejs and npm installed on your local machine.
* [ Download and install Nodejs here](https://nodejs.org/en/download/)
* [Download and install MongoDB](https://www.mongodb.com/)

Run the following commands to confirm installations.
```
node -v
```
* should display Node version
```
npm -v
```
* should display npm version
```
mongo --version
```
* should display mongdb version
#### Installing
* Clone the repository ```https://github.com/Oyinna/recipes.git ```
* Navigate to the location of the folder
* Run ``` npm install ``` to install dependencies
* Rename ``` .env.example ``` to ``` .env ``` and update the variables accordingly
* Run ``` npm run start ``` to get the app started on your development environment
#### Seed Data to Database
To seed data to database run the command ```npm run seed```, and to rollback run ```npm run seed:rollback```. After seeding, you can login with the follow details:
``` username: admin, password: okay ```
##### Running the tests
To run the tests, run the command
``` npm run test ```

The tests, test the api endpoints to ensure that they work and return the required response. The output of the tests also shows the code coverage.
#### Built With
* [Nodejs](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [MongoDB](https://www.mongodb.com/) - MongoDB is a cross-platform document-oriented database program
* [JWT](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token for aunthentication
### Authors
* **Chinyelu Ibute**