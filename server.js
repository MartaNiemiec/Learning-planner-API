const express = require('express');
const bodyParser = require('body-parser');  // when we're sending data from the front-end and it's using JSON, we need to parse it because Express doesn't know what we just sent over;in order to be able to use 'req.body()'  we need to use body-parser
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


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
  db.users.push({
    id: '125',
    name: name,
    email: email,
    allTasks: {},
    registered: new Date()
  })
  // response with the new user = the last one in the database array
  res.json(db.users[db.users.length - 1])
})


app.get('/profile/:id', (req, res) => {
  const { id } = req.params;  // params from the link
  let found = false;

  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user) 
    } 
    if (!found) {
      res.status(400).json('not found');
    }
  })
})


app.put('/alltasks', (req, res) => {
  const { id } = req.body;  
  const { dailyTasks, weeklyTasks, monthlyTasks } = req.body;

  let found = false;

  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.allTasks = {};
      user.allTasks.dailyTasks = dailyTasks;
      user.allTasks.weeklyTasks = weeklyTasks;
      user.allTasks.monthlyTasks = monthlyTasks;
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