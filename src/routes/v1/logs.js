const express = require('express');
const mysql = require('mysql2/promise');

const { dbConfig } = require('../../config');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      'SELECT logs.id, logs.description, logs.status, pets.name, pets.dob, pets.client_email FROM logs LEFT JOIN pets ON logs.pet_id = pets.id',
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data not passed' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.pet_id || !req.body.description || !req.body.status) {
    return res.status(400).send({ err: 'incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO logs (pet_id, description, status) VALUES (
      ${mysql.escape(req.body.pet_id)}, 
      ${mysql.escape(req.body.description)}, 
      ${mysql.escape(req.body.status)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

module.exports = router;
