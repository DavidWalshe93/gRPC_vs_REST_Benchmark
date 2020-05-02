// David Walshe
// 02/05/2020

// NPM Modules
const grpc = require("grpc");

// Proto imports
const test = require("../proto_out/gRPC/proto/test_pb");
const service = require("../proto_out/gRPC/proto/test_grpc_pb");

// Data to send in Responses
const db = require("../../films.json");
const NUMBER_OF_FILMS = 100;


// Helper method to load data into Film protobuf.
const loadFilm = () => {
    const film_json = db[0];
    let film = new test.Film();

    film.setId(film_json.id);
    film.setTitle(film_json.title);
    film.setLength(film_json.length);
    film.setRating(film_json.rating);
    film.setDescription(film_json.description);
    film.setPrice(film_json.price);

    return film;
}


// Helper method to load data into Films protobuf.
const loadFilms = () => {
    let films = new test.Films();

    for (let i = 0; i < NUMBER_OF_FILMS; i++) {
        films.addFilms(loadFilm());
    }

    return films;
}


// Static Response Data
const FILM = loadFilm();
const FILMS = loadFilms();


// Empty Request Handler
const getEmpty = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let emptyResponse = new test.EmptyResponse();
    emptyResponse.setTimestamp(timestamp);

    // Send response to client
    cb(null, emptyResponse);
};


// Empty Request Handler
const getSingle = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let singleFilmResponse = new test.SingleFilmResponse();
    singleFilmResponse.setTimestamp(timestamp);
    singleFilmResponse.setFilm(FILM);

    // Send response to client
    cb(null, singleFilmResponse);
};


// Multiple Request Handler
const getMultiple = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let multipleFilmResponse = new test.MultiFilmResponse();
    multipleFilmResponse.setTimestamp(timestamp);
    multipleFilmResponse.setFilms(FILMS);

    // Send response to client
    cb(null, multipleFilmResponse);
};

// Run server.
const main = () => {
    const server = new grpc.Server();

    // Added RPC API Services to Server.
    server.addService(service.TestServiceService, {
        getEmpty: getEmpty,
        getSingle: getSingle,
        getMultiple: getMultiple,
    });
    const PORT = "0.0.0.0:50051"
    server.bind(`${PORT}`, grpc.ServerCredentials.createInsecure());
    server.start();

    console.log(`Server running on ${PORT}`);
};

main();