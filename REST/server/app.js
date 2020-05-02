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


const PORT = 3001;

app.get("/empty", async (req, res) => {
    res.end();
})


app.get("/film", async (req, res) => {
    res.send(film);
})


app.get("/films", async (req, res) => {
    res.send(films);
})



module.exports = app;
