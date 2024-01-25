## Configuration Management App

This is a full-stack web application that allows users to manage a project's configuration parameters. The application has a configuration management panel where users can log in and update, delete, or add parameters to a project. There is also division of data storage between different country codes, so that users can see, or update parameters for one selected country. 
This application is built using the Vue3JS framework for front-end and uses a Firestore Database to store the project's parameters. The application also has a REST API for serving these configuration parameters. The authentication is handled by Firebase Authentication. For mobile users and a pre-defined api token is specified for fetching parameter values. Backend is built using NodeJS and ExpressJS. 

**The project is already set up and hosted in the following URL:** https://config-update-app-frontend.vercel.app/

**The authenticated account:** email: user1@example.com  password: password1

### Project setup in local
Create a firebase project and add a firestore database to it.
From the authentication tab, enable email/password authentication.

From certain tabs of firebase, find and store the following information:
1. From the project settings, add a web app and copy the firebaseConfig object.
2. From the project settings, add a service account and download the json file. (Click on generate new private key) 

#### Backend setup
Go to the backend directory and run the following command:
```
npm install
```

Then, inside the /backend directory, create a .env file with the following variables:
```
PORT=<port number>
SERVICE_ACCOUNT_KEY=<Reduce key object into a single line string and put it here>
API_TOKEN=<api token>
```
You can generate the api token using the following command:
```
npm run token-create
```
A token will be generated and printed in the console. Copy the token and put it in the .env file.

Then, inside the /backend directory, run the following command:
```
npm run db-init
```
This will initialize the database with some sample data. This will also authenticate some dummy users who can log into the app. Check initialize-database.cjs to see details.

Finally, inside the /backend directory, open index.cjs file. 
Comment out the following line:
```javascript
module.exports = app;
```
And uncomment the following lines:
```javascript
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
```

Now, the backend is ready to run. Run the following command inside the /backend directory to start the backend server:
```
npm start
```

#### Frontend setup
Go to the frontend directory and run the following command:
```
npm install
```

Then, inside the /frontend directory, create a .env file with the following variables:
```
VITE_SERVER_URL=<backend server url>
VITE_FIREBASE_CONFIG=<Reduce firebaseConfig object into a single line string and put it here>
```

Now, the frontend is ready to run. Run the following command inside the /frontend directory to start the frontend server:
```
npm run dev
```
