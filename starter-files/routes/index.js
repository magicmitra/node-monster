const express = require('express');
const router = express.Router();

// Do work here. req has all the info, res has all the methods
// for sending the data back.
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
})

module.exports = router;
