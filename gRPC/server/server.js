// David Walshe
// 02/05/2020

// NPM Modules
const grpc = require("grpc")

// Proto imports
const test = require("../proto_out/gRPC/proto/test_pb");
const service = require("../proto_out/gRPC/proto/test_grpc_pb");

const db = require("../../films.json")

const getEmpty = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let emptyResponse = new test.EmptyResponse();
    emptyResponse.setTimestamp(timestamp)

    // Send response to client
    cb(null, emptyResponse)
};

const loadFilm = () => {
    const film_json = db[0]
    let film = new test.Film();

    film.setId(film_json.id);
    film.setTitle(film_json.title);
    film.setLength(film_json.length);
    film.setRating(film_json.rating);
    film.setDescription(film_json.description);
    film.setPrice(film_json.price);

    return film
}

const loadFilms = () => {
    let films = new test.Films();

    for (let i = 0; i < 100; i++) {
        films.addFilms(loadFilm())
    }

    return films;
}


const getSingle = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let singleFilmResponse = new test.SingleFilmResponse();
    singleFilmResponse.setTimestamp(timestamp)
    singleFilmResponse.setFilm(loadFilm())

    // Send response to client
    cb(null, singleFilmResponse)
};

const getMultiple = (call, cb) => {
    const timestamp = call.request.getTimestamp();

    // Create a protobuf response object.
    let multipleFilmResponse = new test.MultiFilmResponse();
    multipleFilmResponse.setTimestamp(timestamp)
    multipleFilmResponse.setFilms(loadFilms())

    // Send response to client
    cb(null, multipleFilmResponse)
};

const main = () => {
    const server = new grpc.Server();

    // Added RPC API Services to Server.
    server.addService(service.TestServiceService, {
        getEmpty: getEmpty,
        getSingle: getSingle,
        getMultiple: getMultiple,
    });

    server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
    server.start();

    console.log("Server running on 127.0.0.1:50051")
};

main();