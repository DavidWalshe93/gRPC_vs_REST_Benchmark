// David Walshe
// 02/05/2020

// Core Modules
const http = require("http");

// NPM Modules
const request = require("request");

// Local Modules
const csv_writer = require("../../utils/csv_writer")

// Constants
const NUMBER_OF_REQUESTS = process.env.NUMBER_OF_REQUESTS || 1;
const PACKET_BURST_TIME = process.env.PACKET_BURST_TIME || 5000;
const BURSTS = process.env.BURSTS || 10;
const TOTAL_TIME = (PACKET_BURST_TIME * BURSTS) + (PACKET_BURST_TIME / 2)

// Timing Capture variables.
const emptyTimings = [];
const singleTimings = [];
const multiTimings = [];

let file_name = "";
if (process.argv[2] === "1") {
    http.globalAgent.keepAlive = true;
    file_name = "rest_ka";
} else {
    http.globalAgent.keepAlive = false;
    file_name = "rest";
}


const SERVER_IP = process.env.SERVER_IP || "localhost";
const PORT = process.env.PORT || "3001"

const SERVER_URL = `http://${SERVER_IP}:${PORT}`;
console.log("SERVER URL: ", SERVER_URL)

let error_count = 0;
const sendRequest = async (endpoint, timing_list) => {
    const timestamp = Number(process.hrtime.bigint())
    const ENDPOINT = `${SERVER_URL}${endpoint}?timestamp=${timestamp}`;

    request(ENDPOINT,(err, res) => {
        if (!err) {
            let timestamp = Number(JSON.parse(res.body).timestamp);
            const RTT = Number(process.hrtime.bigint()) - timestamp;
            timing_list.push(RTT)
        } else {
            timing_list.push(NaN)
            error_count++;
        }
    })
};


const timeIt = async (endpoint, timing_list) => {
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        await sendRequest(endpoint, timing_list);
    }
}

let burst_count = 1;
// Client entry point.
const intervalId = setInterval(async () => {
    await timeIt("/empty", emptyTimings)
    await timeIt("/film", singleTimings)
    await timeIt("/films", multiTimings)
    process.stdout.write("Burst: " + burst_count + "  Errors: " + error_count + "\r")
    burst_count++;
}, PACKET_BURST_TIME);

setTimeout(() => {
    console.log("\nCompleted sending Packet Bursts")
    console.log("Waiting for responses")
    clearInterval(intervalId)
}, TOTAL_TIME);


// Exit Hook, Save findings to CSV
process.on("exit", () => {
    console.log()
    console.log("Total Errors: ", error_count)
    csv_writer.write_out_results(file_name, emptyTimings, singleTimings, multiTimings, NUMBER_OF_REQUESTS)
})
