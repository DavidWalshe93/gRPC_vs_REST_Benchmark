// David Walshe
// 02/05/2020

// Core imports
const fs = require("fs")

// NPM Modules
const grpc = require("grpc")

// Proto imports
const test = require("../proto_out/gRPC/proto/test_pb")
const service = require("../proto_out/gRPC/proto/test_grpc_pb")

// Timing Capture variables.
const emptyTimings = []
const singleTimings = []
const multiTimings = []

const START_TIME = process.hrtime()

// Helper method for getting a client connection for the server.
const getClientConnection = () => {
    return new service.TestServiceClient(
        "localhost:50051",
        grpc.credentials.createInsecure()
    )
};


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

// Single Film Request
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

const NUMBER_OF_REQUESTS = 100
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

process.on("exit", () => {
    console.log(emptyTimings.length)
    console.log(singleTimings.length)
    console.log(multiTimings.length)
    const END_TIME = process.hrtime(START_TIME)[1]
    console.log(END_TIME)
    write_out_results()
})

const createObjectCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const getCsvWriter = () => {
    return createObjectCsvStringifier({
        header: [
            {id: 'empty_timing', title: 'ET'},
            {id: 'single_item_timing', title: 'SIT'},
            {id: 'ten_item_timing', title: 'MIT'}
        ]
    });
}

const write_out_results = () => {

    const data = []
    data.push({
        "empty_timing": "ET",
        "single_item_timing": "SIT",
        "ten_item_timing": "MIT"
    })
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        data.push({
            "empty_timing": emptyTimings[i]/1_000_000,
            "single_item_timing": singleTimings[i]/1_000_000,
            "ten_item_timing": multiTimings[i]/1_000_000
        })
    }

    const csvWriter = getCsvWriter()
    fs.writeFileSync("out.csv", csvWriter.stringifyRecords(data), )
}