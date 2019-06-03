![Logo](/screenshots/aut-shuttle-app.png)

# AUT Shuttle App's API

## Scalable and Robust
Unit Testing | Description
:-------------------------:|:-------------------------:
![Unit Testing](/screenshots/unit-testing.png)  |  We follow a test-driven development process.
We send emails with MailGun.  |  ![MailGun](https://www.mailgun.com/wp-content/uploads/2018/08/mailgun-primary-no-tag.svg)
![MailGun](https://raw.githubusercontent.com/Marak/faker.js/master/logo.png)  |  We generate fake user data using Faker.js (for testing of course).
Our database enables efficiency and handles volume.  |  ![Database Schema](/screenshots/database-schema.png)
![PayPal](https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_960_720.png)  |  We enable account top-ups using PayPal.
We deploy to and host on Heroku.  |  ![Heroku Deploy](http://photos.prnewswire.com/prnfull/20110712/SF33967LOGO)

## Getting Started

### Prerequisites

To ensure you have the required dependencies installed, run:

```javascript
npm install
```

Be sure to create a `.env` file in the root directory with the configuration outlined in `.env.example`, **NEVER** check the `.env` file into GitHub.

### Formatting the Code

To format the code, run:

```javascript
npm run format
```

### Unit Testing the Code

To unit test the code, run:

```javascript
npm run test
```

### Starting (running) the API

To start (run) the API and handle requests in production, run:

```javascript
npm start
```
To start (run) the API and handle requests in development (with logging), run:
```javascript
npm run dev
```
