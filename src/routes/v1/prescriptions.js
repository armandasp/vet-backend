const express = require('express');
const mysql = require('mysql2/promise');

const { dbConfig } = require('../../config');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      'SELECT * FROM prescriptions LEFT JOIN pets ON prescriptions.pet_id = pets.id LEFT JOIN medications ON prescriptions.medication_id = medications.id',
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data not passed' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.medication_id || !req.body.pet_id || !req.body.comment) {
    return res.status(400).send({ err: 'incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO prescriptions (medication_id, pet_id, comment) VALUES (
      ${mysql.escape(req.body.medication_id)}, 
      ${mysql.escape(req.body.pet_id)}, 
      ${mysql.escape(req.body.comment)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

module.exports = router;
