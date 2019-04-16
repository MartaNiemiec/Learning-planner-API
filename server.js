const express = require('express');
const bodyParser = require('body-parser');  // when we're sending data from the front-end and it's using JSON, we need to parse it because Express doesn't know what we just sent over;in order to be able to use 'req.body()'  we need to use body-parser
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); // additionally 'npm install pg'

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const alltasks = require('./controllers/alltasks');

const database = knex({
  client: 'pg', // pg = postgress
  connection: {
    // host : 'postgresql-amorphous-74083',
    // user : 'marta',
    // password : 'marta',
    // database : 'planner'
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

database.select('*').from('users').then(data => {
  // console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(('it is working'))
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, database, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, database, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, database))

app.put('/alltasks', (req, res) => alltasks.handleAllTasks(req, res, database));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

/*
/ --> res = this is working
/signin --> POST = succcess/fail
/register --> POST = user
/profile/userId --> GET = user
/allTasks --> PUT --> user (???) update user's tasks 
*/