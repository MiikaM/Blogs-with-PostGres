const express = require('express');
const readingListsRouter = express.Router()
const singleReadingListRouter = express.Router();

const UserReadings = require('../models/user_readings');
const { readingListFinder } = require('../utils/middleware');

readingListsRouter.post('/', async (request, response) => {
    const body = request.body;
    const readings = await UserReadings.create(body);
    response
        .status(200).send(readings.toJSON())
})

singleReadingListRouter.put('/', async (request, response, next) => {
    const body = request.body
    const dbReadingList = request.readingList;
    try {
        const updated = await dbReadingList.update(body);
        response.json(updated.toJSON()).status(204).end()

    } catch (error) {
        next(error)
    }
})
readingListsRouter.use('/:id', readingListFinder, singleReadingListRouter);

module.exports = readingListsRouter