const express = require('express');
const mysql = require('mysql2/promise');

const { dbConfig } = require('../../config');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute('SELECT * FROM medications');
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data not passed' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).send({ err: 'incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO medications (name, description) VALUES (
      ${mysql.escape(req.body.name)}, 
      ${mysql.escape(req.body.description)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

module.exports = router;
