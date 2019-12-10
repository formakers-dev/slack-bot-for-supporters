const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('서포터즈를 위한 포메스가 열일 중 🏃‍♀️🏃‍♂️')
});

module.exports = router;
