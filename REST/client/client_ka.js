// David Walshe
// 02/05/2020

// Core Modules
const http = require("http");

// NPM Modules
const request = require("request");

// Local Modules
const csv_writer = require("../../utils/csv_writer")

// Constaints
const SCRIPT_START_TIME = process.hrtime()
const NUMBER_OF_REQUESTS = 1

// Timing Capture variables.
const emptyTimings = []
const singleTimings = []
const multiTimings = []


http.globalAgent.keepAlive = false;

const SERVER_IP = process.env.SERVER_IP || "http://localhost";
const PORT = process.env.PORT || "3001"

const SERVER_URL = `${SERVER_IP}:${PORT}`;
console.log("SERVER_IP: ", SERVER_URL)


const sendRequest = async (endpoint, timing_list) => {
    const timestamp = Number(process.hrtime.bigint())
    const ENDPOINT = `${SERVER_URL}${endpoint}?timestamp=${timestamp}`;
    request(`${SERVER_URL}${endpoint}?timestamp=${timestamp}`,(err, res) => {
        if (!err) {
            let timestamp = Number(JSON.parse(res.body).timestamp);
            const RTT = Number(process.hrtime.bigint()) - timestamp;
            timing_list.push(RTT)
        } else {
            console.log(err);
        }
    })
};


const timeIt = async (endpoint, timing_list) => {
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        await sendRequest(endpoint, timing_list);
    }
}

// Client entry point.
(async () => {
    await timeIt("/empty", emptyTimings)
    await timeIt("/film", singleTimings)
    await timeIt("/films", multiTimings)
})();


// Exit Hook, Save findings to CSV
process.on("exit", () => {
    console.log(emptyTimings.length)
    console.log(singleTimings.length)
    console.log(multiTimings.length)
    csv_writer.write_out_results("rest_ka.csv", emptyTimings, singleTimings, multiTimings, NUMBER_OF_REQUESTS)
})