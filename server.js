const express = require('express');
const bodyParser = require('body-parser');  // when we're sending data from the front-end and it's using JSON, we need to parse it because Express doesn't know what we just sent over;in order to be able to use 'req.body()'  we need to use body-parser
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); // additionally 'npm install pg'

const database = knex({
  client: 'pg', // pg = postgress
  connection: {
    host : '127.0.0.1',
    user : 'marta',
    password : 'marta',
    database : 'planner'
  }
});

database.select('*').from('users').then(data => {
  // console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

const db = {
  users: [
    
    {
      id: '123',
      name: 'john',
      email: 'john@gmail.com',
      password: 'cookies',
      // tasks: [{task: "costam"}],
      allTasks: {
        dailyTasks: [], 
        weeklyTasks: [], 
        monthlyTasks: []
      },
      skills: [],
      registered: new Date()
    },
    {
      id: '124',
      name: 'sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      // tasks: [{task: "costam"}],
      allTasks: {
        dailyTasks: [], 
        weeklyTasks: [], 
        monthlyTasks: []
      },
      skills: [],
      registered: new Date()
    }
  ],
  login: [
    {
      id: '999',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (req, res) => {
  res.send(db.users)
})


app.post('/signin', (req, res) => {

    // Load hash from your password DB.
  bcrypt.compare("apple", "$2a$10$9eBsCQ7w8nG0XWFamAvZb.HqJMIDaJwxorjL7XTm7XmcREeiWNLKC", function(err, res) {
    // res == true
    // console.log('first' ,res);
  });
  bcrypt.compare("veggies", "$2a$10$9eBsCQ7w8nG0XWFamAvZb.HqJMIDaJwxorjL7XTm7XmcREeiWNLKC", function(err, res) {
    // res = false
    // console.log("second", res);
  });

  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password) {
    // res.json('success')
    res.json(db.users[0])
  } else {
    // console.log(req.body.email);
    // console.log(req.body.password);
    res.status(400).json('error logging in')
  }
})


app.post('/register', (req, res) => {
  //get information from the req.body
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
  });
  // push the user into database
  database('users')
  .returning('*')
  .insert({
    name: name,
    email: email,
    allTasks: {},
    skills: [],
    registered: new Date()
  }).then(user => {
    res.json(user[0])
  }).catch(err => res.status(400).json('unable to register'))
})


app.get('/profile/:id', (req, res) => {
  const { id } = req.params;  // params from the link

  database.select('*').from('users').where({
    id: id
  }).then(user => {
    //if user exist so it isn't an ampty array
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('Not found');
    }
  })
  .catch(err => res.status(400).json('error getting user'))
})


app.put('/alltasks', (req, res) => {
  const { id } = req.body;  
  const { dailyTasks, weeklyTasks, monthlyTasks, skills } = req.body;

  let found = false;

  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.allTasks = {};
      user.allTasks.dailyTasks = dailyTasks;
      user.allTasks.weeklyTasks = weeklyTasks;
      user.allTasks.monthlyTasks = monthlyTasks;
      user.skills = skills;
      return res.json(user);
    } 
  })
  if (!found) {
    res.status(400).json('not found user with tasks');
  }
});







app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = succcess/fail
/register --> POST = user
/profile/userId --> GET = user
/allTasks --> PUT --> user (???) update user's tasks 
*/