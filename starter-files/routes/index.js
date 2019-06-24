const express = require('express');
const router = express.Router();

// Do work here. req has all the info, res has all the methods
// for sending the data back.
router.get('/', (req, res) => {
  // 'hello' is a pug file, a template
  res.render('hello', {
    name: 'bruh',
    dog: req.query.dog,
  })
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
})

module.exports = router;
