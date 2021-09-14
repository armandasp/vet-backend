const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { dbConfig } = require('../../config');

const router = express.Router();

const presSchema = Joi.object({
  medication_id: Joi.number().required(),
  pet_id: Joi.number().required(),
  comment: Joi.string().trim().required(),
});

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
  let userInput = req.body;

  try {
    userInput = await presSchema.validateAsync(userInput);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO prescriptions (medication_id, pet_id, comment) VALUES (
      ${mysql.escape(userInput.medication_id)}, 
      ${mysql.escape(userInput.pet_id)}, 
      ${mysql.escape(userInput.comment)})`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'data not passed' });
  }
});

module.exports = router;
