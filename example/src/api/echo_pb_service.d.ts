// package: echo
// file: echo.proto

import * as echo_pb from "./echo_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EchoUnaryEcho = {
  readonly methodName: string;
  readonly service: typeof Echo;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof echo_pb.EchoRequest;
  readonly responseType: typeof echo_pb.EchoResponse;
};

type EchoServerStreamingEcho = {
  readonly methodName: string;
  readonly service: typeof Echo;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof echo_pb.EchoRequest;
  readonly responseType: typeof echo_pb.EchoResponse;
};

type EchoClientStreamingEcho = {
  readonly methodName: string;
  readonly service: typeof Echo;
  readonly requestStream: true;
  readonly responseStream: false;
  readonly requestType: typeof echo_pb.EchoRequest;
  readonly responseType: typeof echo_pb.EchoResponse;
};

type EchoBidirectionalStreamingEcho = {
  readonly methodName: string;
  readonly service: typeof Echo;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof echo_pb.EchoRequest;
  readonly responseType: typeof echo_pb.EchoResponse;
};

export class Echo {
  static readonly serviceName: string;
  static readonly UnaryEcho: EchoUnaryEcho;
  static readonly ServerStreamingEcho: EchoServerStreamingEcho;
  static readonly ClientStreamingEcho: EchoClientStreamingEcho;
  static readonly BidirectionalStreamingEcho: EchoBidirectionalStreamingEcho;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class EchoClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  unaryEcho(
    requestMessage: echo_pb.EchoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  unaryEcho(
    requestMessage: echo_pb.EchoRequest,
    callback: (error: ServiceError|null, responseMessage: echo_pb.EchoResponse|null) => void
  ): UnaryResponse;
  serverStreamingEcho(requestMessage: echo_pb.EchoRequest, metadata?: grpc.Metadata): ResponseStream<echo_pb.EchoResponse>;
  clientStreamingEcho(metadata?: grpc.Metadata): RequestStream<echo_pb.EchoRequest>;
  bidirectionalStreamingEcho(metadata?: grpc.Metadata): BidirectionalStream<echo_pb.EchoRequest, echo_pb.EchoResponse>;
}

