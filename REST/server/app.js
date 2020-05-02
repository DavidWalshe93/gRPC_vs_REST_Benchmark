// David Walshe
// 02/05/2020

// NPM Modules
const express = require("express")

// Load local Data
const db = require("../../films.json")
const NUMBER_OF_FILMS = 100;

const film = db[0]
const films = () => {
    const films = [];
    for (let i = 0; i < NUMBER_OF_FILMS; i++) {
        films.push(db[0]);
    }

    return films;
}


// Create an express instance.
const app = express();

// Add middleware
app.use(express.json());


app.get("/empty", async (req, res) => {
    try {
        res.send(req.query);
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


app.get("/film", async (req, res) => {
    try {
        res.send({
            ...film,
            ...req.query
        });
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


app.get("/films", async (req, res) => {
    try {
        res.send({
            ...films,
            ...req.query
        });
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


module.exports = app;
