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

// Constaints
const SCRIPT_START_TIME = process.hrtime()
const NUMBER_OF_REQUESTS = process.env.NUMBER_OF_REQUESTS || 1;

const IP_ADDRESS = process.env.SERVER_IP || "localhost";
const PORT = process.env.gRPC_PORT || 50051;

const SERVER_URL = `${IP_ADDRESS}:${PORT}`
console.log("SERVER URL: ", SERVER_URL)


// Timing Capture variables.
const emptyTimings = []
const singleTimings = []
const multiTimings = []


// Helper method for getting a client connection for the server.
const getClientConnection = () => {


    return new service.TestServiceClient(
        SERVER_URL,
        grpc.credentials.createInsecure()
    )
};


// Helper method to create a new request to send to the server.
const getRequest = () => {
    let request = new test.EmptyRequest();
    request.setTimestamp(Number(process.hrtime.bigint()))

    return request
}


// Empty request
const getEmpty = () => {

    const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getEmpty(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint()) - response.getTimestamp();
            emptyTimings.push(RTT)
        } else {
            console.log(error);
        }
    });
    process.stdout.write(".");
};


// Single Film Request
const getSingle = async () => {

    const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getSingle(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint()) - response.getTimestamp();
            singleTimings.push(RTT)
        } else {
            console.log(error);
        }
    });
};


// Multiple Film Request
const getMultiple = async () => {

    const client = getClientConnection();
    // Call the server RPC "testEmpty".
    client.getMultiple(getRequest(), (error, response) => {
        if (!error) {
            const RTT = Number(process.hrtime.bigint())  - response.getTimestamp();
            multiTimings.push(RTT)
        } else {
            console.log(error);
        }
    });
};


const timeIt = async (func) => {
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        await func();
    }
}


// Client entry point.
(async () => {
    await timeIt(getEmpty)
    await timeIt(getSingle)
    await timeIt(getMultiple)
})();


// Exit Hook, Save findings to CSV
process.on("exit", () => {
    csv_writer.write_out_results("gRPC.csv", emptyTimings, singleTimings, multiTimings, NUMBER_OF_REQUESTS)
})