// package: echo
// file: echo.proto

var echo_pb = require("./echo_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Echo = (function () {
  function Echo() {}
  Echo.serviceName = "echo.Echo";
  return Echo;
}());

Echo.UnaryEcho = {
  methodName: "UnaryEcho",
  service: Echo,
  requestStream: false,
  responseStream: false,
  requestType: echo_pb.EchoRequest,
  responseType: echo_pb.EchoResponse
};

Echo.ServerStreamingEcho = {
  methodName: "ServerStreamingEcho",
  service: Echo,
  requestStream: false,
  responseStream: true,
  requestType: echo_pb.EchoRequest,
  responseType: echo_pb.EchoResponse
};

Echo.ClientStreamingEcho = {
  methodName: "ClientStreamingEcho",
  service: Echo,
  requestStream: true,
  responseStream: false,
  requestType: echo_pb.EchoRequest,
  responseType: echo_pb.EchoResponse
};

Echo.BidirectionalStreamingEcho = {
  methodName: "BidirectionalStreamingEcho",
  service: Echo,
  requestStream: true,
  responseStream: true,
  requestType: echo_pb.EchoRequest,
  responseType: echo_pb.EchoResponse
};

exports.Echo = Echo;

function EchoClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EchoClient.prototype.unaryEcho = function unaryEcho(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Echo.UnaryEcho, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

EchoClient.prototype.serverStreamingEcho = function serverStreamingEcho(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Echo.ServerStreamingEcho, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoClient.prototype.clientStreamingEcho = function clientStreamingEcho(metadata) {
  var listeners = {
    end: [],
    status: []
  };
  var client = grpc.client(Echo.ClientStreamingEcho, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      if (!client.started) {
        client.start(metadata);
      }
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoClient.prototype.bidirectionalStreamingEcho = function bidirectionalStreamingEcho(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(Echo.BidirectionalStreamingEcho, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.EchoClient = EchoClient;

