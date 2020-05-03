// David Walshe
// 02/05/2020


// Core Modules
const fs = require("fs")


// Create a CSV stringifier
const createObjectCsvStringifier = require('csv-writer').createObjectCsvStringifier;


// Creates a CSV Stringifier for saving the connection findings.
const getCsvStringifier = () => {
    return createObjectCsvStringifier({
        header: [
            {id: 'empty_timing', title: 'ET'},
            {id: 'single_item_timing', title: 'SIT'},
            {id: 'multi_item_timing', title: 'MIT'}
        ]
    });
}


// Utility function to write out the findings to a CSV file.
const write_out_results = (file_name, emptyTimings, singleItemTimings, multiItemTimings, numberOfRequests) => {
    const data = []
    const path = `R:\\Data\\${file_name}`

    console.log()
    console.log("Empty Responses: ", emptyTimings.length)
    console.log("Single Item Responses: ", singleItemTimings.length)
    console.log("Multi Item Responses: ", multiItemTimings.length)

    // Add headers if the file does not previously exist
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            data.push({
                "empty_timing": "ET",
                "single_item_timing": "SIT",
                "multi_item_timing": "MIT"
            })
        }
    });

    let indexSize = Math.max(emptyTimings.length, singleItemTimings.length, multiItemTimings.length)

    // Add Data
    for (let i = 0; i < indexSize; i++) {
        data.push({
            "empty_timing": emptyTimings[i]/1_000_000,
            "single_item_timing": singleItemTimings[i]/1_000_000,
            "multi_item_timing": multiItemTimings[i]/1_000_000
        })
    }

    // Save data to file synchronously, async write wont work due to
    // running this code from exit hook.
    const csvStringifier = getCsvStringifier()
    fs.appendFileSync(path, csvStringifier.stringifyRecords(data))
    console.log(`Appended ${numberOfRequests} records to ${path}`)
}


module.exports = {
    write_out_results
}