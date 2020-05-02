FOR /F "tokens=* USEBACKQ" %%F IN (`where grpc_tools_node_protoc_plugin`) DO (
SET protoc_gen_path=%%F
)
ECHO "protoc-gen-path: %protoc_gen_path%"

SET proto_out=".\gRPC\proto_out"

protoc.exe -I=. .\gRPC\proto\test.proto --js_out=import_style=commonjs,binary:%proto_out% --grpc_out=%proto_out% --plugin=protoc-gen-grpc=%protoc_gen_path%
