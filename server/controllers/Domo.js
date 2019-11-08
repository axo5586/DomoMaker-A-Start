const models = require('../models');
const Domo = models.Domo;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level ) {
    return res.status(400).json({ error: 'RAWR! Name, age, and level are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  let domoPromise = newDomo.save();

  domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const addDomoLevel = (req, res) => {
  if (!req.query.name || !req.query.level) {
    return res.json({ error: 'Name and levels to add are required' });
  }
  
  return Domo.findByName(req.query.name, (err, doc) => {
    if (err) {
      res.json({ err });
      return;
    }

    if (!doc) {
      res.json({ error: 'No domos found!' });
      return;
    }

    // eslint workaround
    const data = doc;

    data.level += req.query.level;
    data.save();
    return res.json({ error: 'added' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.addDomoLevel = addDomoLevel;
module.exports.make = makeDomo;
