// David Walshe
// 02/05/2020

// Core imports
const fs = require("fs")

// NPM Modules
const grpc = require("grpc")

// Proto imports
const test = require("../proto_out/gRPC/proto/test_pb")
const service = require("../proto_out/gRPC/proto/test_grpc_pb")

// Constaints
const SCRIPT_START_TIME = process.hrtime()
const NUMBER_OF_REQUESTS = 100

// Timing Capture variables.
const emptyTimings = []
const singleTimings = []
const multiTimings = []


// Helper method for getting a client connection for the server.
const getClientConnection = () => {
    return new service.TestServiceClient(
        "localhost:50051",
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
})()


// Exit Hook, Save findings to CSV
process.on("exit", () => {
    console.log(emptyTimings.length)
    console.log(singleTimings.length)
    console.log(multiTimings.length)
    write_out_results()
})


// Create a CSV stringifier
const createObjectCsvStringifier = require('csv-writer').createObjectCsvStringifier;


// Creates a CSV Stringifier for saving the connection findings.
const getCsvStringifier = () => {
    return createObjectCsvStringifier({
        header: [
            {id: 'empty_timing', title: 'ET'},
            {id: 'single_item_timing', title: 'SIT'},
            {id: 'ten_item_timing', title: 'MIT'}
        ]
    });
}


// Utility function to write out the findings to a CSV file.
const write_out_results = () => {
    const data = []

    // Add headers
    data.push({
        "empty_timing": "ET",
        "single_item_timing": "SIT",
        "ten_item_timing": "MIT"
    })

    // Add Data
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        data.push({
            "empty_timing": emptyTimings[i]/1_000_000,
            "single_item_timing": singleTimings[i]/1_000_000,
            "ten_item_timing": multiTimings[i]/1_000_000
        })
    }

    // Save data to file synchronously, async write wont work due to
    // running this code from exit hook.
    const csvStringifier = getCsvStringifier()
    fs.writeFileSync("out.csv", csvStringifier.stringifyRecords(data), )
}