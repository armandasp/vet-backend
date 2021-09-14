const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { dbConfig } = require('../../config');

const router = express.Router();

const logSchema = Joi.object({
  pet_id: Joi.number().required(),
  description: Joi.string().trim().required(),
  status: Joi.string().trim().required(),
});

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
  let userInput = req.body;

  try {
    userInput = await logSchema.validateAsync(userInput);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO logs (pet_id, description, status) VALUES (
      ${mysql.escape(userInput.pet_id)}, 
      ${mysql.escape(userInput.description)}, 
      ${mysql.escape(userInput.status)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

module.exports = router;
