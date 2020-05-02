// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Author: David Walshe
// Date:   19/04/2020
//
'use strict';
var grpc = require('grpc');
var gRPC_proto_test_pb = require('../../gRPC/proto/test_pb.js');

function serialize_test_EmptyRequest(arg) {
  if (!(arg instanceof gRPC_proto_test_pb.EmptyRequest)) {
    throw new Error('Expected argument of type test.EmptyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_EmptyRequest(buffer_arg) {
  return gRPC_proto_test_pb.EmptyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_test_EmptyResponse(arg) {
  if (!(arg instanceof gRPC_proto_test_pb.EmptyResponse)) {
    throw new Error('Expected argument of type test.EmptyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_EmptyResponse(buffer_arg) {
  return gRPC_proto_test_pb.EmptyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_test_MultiFilmResponse(arg) {
  if (!(arg instanceof gRPC_proto_test_pb.MultiFilmResponse)) {
    throw new Error('Expected argument of type test.MultiFilmResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_MultiFilmResponse(buffer_arg) {
  return gRPC_proto_test_pb.MultiFilmResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_test_SingleFilmResponse(arg) {
  if (!(arg instanceof gRPC_proto_test_pb.SingleFilmResponse)) {
    throw new Error('Expected argument of type test.SingleFilmResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_SingleFilmResponse(buffer_arg) {
  return gRPC_proto_test_pb.SingleFilmResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// =====================================================================================================================
// Services
// =====================================================================================================================
var TestServiceService = exports.TestServiceService = {
  // Service for Empty Message Testing
getEmpty: {
    path: '/test.TestService/GetEmpty',
    requestStream: false,
    responseStream: false,
    requestType: gRPC_proto_test_pb.EmptyRequest,
    responseType: gRPC_proto_test_pb.EmptyResponse,
    requestSerialize: serialize_test_EmptyRequest,
    requestDeserialize: deserialize_test_EmptyRequest,
    responseSerialize: serialize_test_EmptyResponse,
    responseDeserialize: deserialize_test_EmptyResponse,
  },
  // Service for Single Text Testing
getSingle: {
    path: '/test.TestService/GetSingle',
    requestStream: false,
    responseStream: false,
    requestType: gRPC_proto_test_pb.EmptyRequest,
    responseType: gRPC_proto_test_pb.SingleFilmResponse,
    requestSerialize: serialize_test_EmptyRequest,
    requestDeserialize: deserialize_test_EmptyRequest,
    responseSerialize: serialize_test_SingleFilmResponse,
    responseDeserialize: deserialize_test_SingleFilmResponse,
  },
  // Service for Multi Text Testing
getMultiple: {
    path: '/test.TestService/GetMultiple',
    requestStream: false,
    responseStream: false,
    requestType: gRPC_proto_test_pb.EmptyRequest,
    responseType: gRPC_proto_test_pb.MultiFilmResponse,
    requestSerialize: serialize_test_EmptyRequest,
    requestDeserialize: deserialize_test_EmptyRequest,
    responseSerialize: serialize_test_MultiFilmResponse,
    responseDeserialize: deserialize_test_MultiFilmResponse,
  },
};

exports.TestServiceClient = grpc.makeGenericClientConstructor(TestServiceService);
