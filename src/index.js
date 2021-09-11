const cors = require('cors');
const express = require('express');

const { port } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ msg: 'version 1.0.0' });
});

app.get('*', (req, res) => {
  res.status(404).send({ err: 'page not found' });
});

app.listen(port, console.log(`server is running on port ${port}`));
