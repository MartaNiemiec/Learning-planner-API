const handleProfileGet = (req, res, database) => {
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
}

module.exports = {
  handleProfileGet: handleProfileGet
}