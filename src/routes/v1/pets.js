const express = require('express');
const mysql = require('mysql2/promise');

const { dbConfig } = require('../../config');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      'SELECT * FROM pets WHERE archived = false',
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data not passed' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.name || !req.body.dob || !req.body.client_email) {
    return res.status(400).send({ err: 'incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
    INSERT INTO pets (name, dob, client_email) VALUES (
    ${mysql.escape(req.body.name)}, 
    ${mysql.escape(req.body.dob)}, 
    ${mysql.escape(req.body.client_email)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
    UPDATE pets SET archived = true WHERE id = ${req.params.id}`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not deleted' });
  }
});

module.exports = router;
