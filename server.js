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


app.get('/', (req, res) => {
  // res.send(db.users)
})


app.post('/signin', (req, res) => {
  database.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if (isValid) {
      return database.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
        res.json(user[0])
      })
      .catch(err => res.status(400).json('unable to get user'))
    }
    else {
      res.status(400).json('wrong credentials')
    }
  })
  .catch(err => res.status(400).json('wrong credentials'))
})


app.post('/register', (req, res) => {
  //get information from the req.body
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  // push the user into database
  database.transaction(trx => { //transaction to do more than one thing at once; then "trx" is instead of "database" to do all operations
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')  // inserted hash and email into "login"
    .returning('email') // returned an email
    .then(loginEmail => { // used loginEmail to do another trx transaction to insert into the "users" all following informations 
      return trx('users')
      .returning('*')
      .insert({
        name: name,
        email: loginEmail[0],
        dailytasks: [],
        weeklytasks: [],
        monthlytasks: [],
        skills: [],
        registered: new Date()
      }).then(user => {
        res.json(user[0]);  // respond with json,
      })
    })
    .then(trx.commit) // trx.commit is for adding all above informations
    .catch(trx.rollback)  // trx.rollback when anything fails
  })

 
  .catch(err => res.status(400).json('unable to register'))
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
  const { dailytasks, weeklytasks, monthlytasks, skills } = req.body;

  database('users').where('id', '=', id)
    .update({
      dailytasks: dailytasks,
      weeklytasks: weeklytasks,
      monthlytasks: monthlytasks,
      skills: skills
    })
    .returning(['id','dailytasks', 'weeklytasks', 'monthlytasks', 'skills'])
    .then(data => {
      res.json(data[0]);
    })
    .catch(err => res.status(400).json('unable to get data'))
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