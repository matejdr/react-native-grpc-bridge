# @matejdr/react-native-grpc-bridge

A bridge for @improbable-eng/grpc-web using native gRPC

Based on react-native-grpc from Mitch528, found [here](https://github.com/Mitch528/react-native-grpc.git).

## Installation

```sh
npm install @matejdr/react-native-grpc-bridge
```

### Node version

```sh
nvm install
```
or
```sh
nvm use
```

## Usage

```js
import { grpc } from '@improbable-eng/grpc-web';
import { NativeGRPCTransport } from '@matejdr/react-native-grpc-bridge';
grpc.setDefaultTransport(NativeGRPCTransport({ withCredentials: true }));
```

## Running a docker Server for example app

There is an envoy proxy in front of go server.

```sh
cd server
docker-compose up server envoy --build
```

## Running a gRPC Server manually

### Install protoc

* protoc : [link](https://github.com/protocolbuffers/protobuf/releases)

### Install for go

```sh
go get -u google.golang.org/grpc
go get -u github.com/golang/protobuf/proto
go get -u github.com/golang/protobuf/protoc-gen-go
export PATH=$HOME/go/bin:$PATH
````

### Install grpc-web

```sh
GROC_WEB_PLUGIN=protoc-gen-grpc-web-1.0.6-darwin-x86_64
curl -OL https://github.com/grpc/grpc-web/releases/download/1.0.6/$GROC_WEB_PLUGIN
sudo mv $GROC_WEB_PLUGIN /usr/local/bin/protoc-gen-grpc-web
chmod +x /usr/local/bin/protoc-gen-grpc-web
```

### Install npm packages

```sh
yarn install
```

### Generate stubs for js and go

```sh
protoc \
  --proto_path=server/proto \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --js_out=import_style=commonjs:example/src/api \
  --ts_out=service=grpc-web:example/src/api \
  echo.proto
protoc \
  --proto_path=server/proto \
  --go_out=plugins=grpc:server/echoserver/echo \
  --go_opt=paths=source_relative \
  echo.proto
```

### Running a server

```sh
cd server/echoserver
go run main.go
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
