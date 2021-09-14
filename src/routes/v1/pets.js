const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { dbConfig } = require('../../config');

const router = express.Router();

const petSchema = Joi.object({
  name: Joi.string().alphanum().trim().required(),
  dob: Joi.date().greater('2000-01-01').less('now').required(),
  client_email: Joi.string().trim().lowercase().required(),
});

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
  let userInput = req.body;

  try {
    userInput = await petSchema.validateAsync(userInput);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
    INSERT INTO pets (name, dob, client_email) VALUES (
    ${mysql.escape(userInput.name)}, 
    ${mysql.escape(userInput.dob)}, 
    ${mysql.escape(userInput.client_email)})`);
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
