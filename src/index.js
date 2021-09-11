const cors = require('cors');
const express = require('express');

const { port } = require('./config');

const pets = require('./routes/v1/pets');
const medications = require('./routes/v1/medications');
const logs = require('./routes/v1/logs');
const prescriptions = require('./routes/v1/prescriptions');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/pets', pets);
app.use('/v1/medications', medications);
app.use('/v1/logs', logs);
app.use('/v1/prescriptions', prescriptions);

app.get('/', (req, res) => {
  res.send({ msg: 'version 1.0.0' });
});

app.get('*', (req, res) => {
  res.status(404).send({ err: 'page not found' });
});

app.listen(port, console.log(`server is running on port ${port}`));
