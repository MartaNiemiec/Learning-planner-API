const handleRegister = (req, res, database, bcrypt) => {
  //get information from the req.body
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submissin');
  }
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
}

module.exports = {
  handleRegister: handleRegister
}