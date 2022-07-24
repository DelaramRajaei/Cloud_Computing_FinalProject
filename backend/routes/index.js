const express = require('express');
const router = express.Router();
const redis = require('redis')
const uuid = require('uuid');
const { route } = require('../app');

const redisClient = redis.createClient({
  url: process.env.DB_URL
    .replace('{DB_USER}', process.env.DB_USER)
    .replace('{DB_PASSWORD}', process.env.DB_PASSWORD)
});
redisClient.connect()
  .then(_ => {
    console.log('connected to DB successfully!')
  })
  .catch(err => {
    console.error(err);
  })
const TTL = process.env.URL_EXP;

router.post('/add', (req, res, next) => {
  const text = req.body.text;
  const id = uuid.v1();
  redisClient.SETEX(id, TTL, String(text));
  res.send({ noteId: id });
})

router.delete('/:noteId', async (req, res, next) => {
  const noteId = req.params['noteId'];
  await redisClient.DEL(noteId);
  res.sendStatus(204);
})

router.get('/:noteId', async (req, res, next) => {
  const noteId = req.params['noteId'];
  const note = await redisClient.GET(noteId);
  if (note == null) {
    return res.status(404).send('NOT FOUND!')
  }
  res.send({ text: note });
})

module.exports = router;
