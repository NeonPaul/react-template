import express from 'express'
import bodyParser from 'body-parser'

const api = express.Router()

api.use(bodyParser.json())

let counter = 0;

api.post('/', (req, res) => {
  counter += parseInt(req.body.step, 10);
  res.send(String(counter))
})

api.get('/', (req, res) => {
  res.send(String(counter || 0))
})

export default api;
