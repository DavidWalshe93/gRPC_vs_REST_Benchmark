// David Walshe
// 02/05/2020

// Core imports
const fs = require("fs")

// NPM Modules
const grpc = require("grpc")

// Local Modules
const csv_writer = require("../../utils/csv_writer")

// Proto imports
const test = require("../proto_out/gRPC/proto/test_pb")
const service = require("../proto_out/gRPC/proto/test_grpc_pb")

// Constants
const NUMBER_OF_REQUESTS = process.env.NUMBER_OF_REQUESTS || 1;
const PACKET_BURST_TIME = process.env.PACKET_BURST_TIME || 5000;
const BURSTS = process.env.BURSTS || 10;
const TOTAL_TIME = (PACKET_BURST_TIME * BURSTS) + (PACKET_BURST_TIME / 2)

const IP_ADDRESS = process.env.SERVER_IP || "localhost";
const PORT = process.env.gRPC_PORT || 50051;

const SERVER_URL = `${IP_ADDRESS}:${PORT}`
console.log("SERVER URL: ", SERVER_URL)


// Timing Capture variables.
const emptyTimings = []
const singleTimings = []
const multiTimings = []

let error_count = 0;
let burst_count = 1


// Helper method for getting a client connection for the server.
const getClientConnection = () => {


    return new service.TestServiceClient(
        SERVER_URL,
        grpc.credentials.createInsecure()
    )
};

const client = getClientConnection();


// Helper method to create a new request to send to the server.
const getRequest = () => {
    let request = new test.EmptyRequest();
    request.setTimestamp(Number(process.hrtime.bigint()))

    return request
}


// Empty request
const getEmpty = () => {

    // const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getEmpty(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint()) - response.getTimestamp();
            emptyTimings.push(RTT)
        } else {
            emptyTimings.push(NaN);
            error_count++;
    }
    });
    process.stdout.write(".");
};


// Single Film Request
const getSingle = async () => {

    // const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getSingle(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint()) - response.getTimestamp();
            singleTimings.push(RTT)
        } else {
            singleTimings.push(NaN);
            error_count++;
        }
    });
};


// Multiple Film Request
const getMultiple = async () => {

    // const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getMultiple(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint())  - response.getTimestamp();
            multiTimings.push(RTT)
        } else {
            multiTimings.push(NaN);
            error_count++;
        }
    });
};


// Simple Packet sending function.
const timeIt = async (func) => {
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        await func();
    }
}


// Client entry point.
const intervalId = setInterval(async () => {
    await timeIt(getEmpty)
    await timeIt(getSingle)
    await timeIt(getMultiple)
    process.stdout.write("Burst: " + burst_count + "  Errors: " + error_count + "\r")
    burst_count++;
}, PACKET_BURST_TIME);


// Stop request sending after 10 bursts.
setTimeout(() => {
    console.log()
    console.log("Completed sending Packet Bursts")
    console.log("Waiting for responses")
    clearInterval(intervalId)
}, TOTAL_TIME);


// Exit Hook, Save findings to CSV
process.on("exit", () => {
    console.log()
    console.log("Total Errors: ", error_count)
    csv_writer.write_out_results("gRPC", emptyTimings, singleTimings, multiTimings, NUMBER_OF_REQUESTS)
})