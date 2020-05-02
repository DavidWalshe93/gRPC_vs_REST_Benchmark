// David Walshe
// 02/05/2020

// Include local modules.
const app = require("./app")

// Setup PORT
const PORT = process.env.REST_PORT || 3001;

// Start express server.
app.listen(PORT, () => {
    const MODE =
    console.log("App now running in %s mode on port %d", "DEV", PORT);
})