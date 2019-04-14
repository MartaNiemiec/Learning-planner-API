const handleAllTasks = (req, res, database) => {
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
}

module.exports = {
  handleAllTasks: handleAllTasks
}