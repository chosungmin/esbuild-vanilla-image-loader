"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/is-stream@1.1.0/node_modules/is-stream/index.js
var require_is_stream = __commonJS({
  "node_modules/.pnpm/is-stream@1.1.0/node_modules/is-stream/index.js"(exports, module2) {
    "use strict";
    var isStream = module2.exports = function(stream) {
      return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
    };
    isStream.writable = function(stream) {
      return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
    };
    isStream.readable = function(stream) {
      return isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
    };
    isStream.duplex = function(stream) {
      return isStream.writable(stream) && isStream.readable(stream);
    };
    isStream.transform = function(stream) {
      return isStream.duplex(stream) && typeof stream._transform === "function" && typeof stream._transformState === "object";
    };
  }
});

// node_modules/.pnpm/pinkie@2.0.4/node_modules/pinkie/index.js
var require_pinkie = __commonJS({
  "node_modules/.pnpm/pinkie@2.0.4/node_modules/pinkie/index.js"(exports, module2) {
    "use strict";
    var PENDING = "pending";
    var SETTLED = "settled";
    var FULFILLED = "fulfilled";
    var REJECTED = "rejected";
    var NOOP = function() {
    };
    var isNode = typeof global !== "undefined" && typeof global.process !== "undefined" && typeof global.process.emit === "function";
    var asyncSetTimer = typeof setImmediate === "undefined" ? setTimeout : setImmediate;
    var asyncQueue = [];
    var asyncTimer;
    function asyncFlush() {
      for (var i = 0; i < asyncQueue.length; i++) {
        asyncQueue[i][0](asyncQueue[i][1]);
      }
      asyncQueue = [];
      asyncTimer = false;
    }
    function asyncCall(callback, arg) {
      asyncQueue.push([callback, arg]);
      if (!asyncTimer) {
        asyncTimer = true;
        asyncSetTimer(asyncFlush, 0);
      }
    }
    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }
      function rejectPromise(reason) {
        reject(promise, reason);
      }
      try {
        resolver(resolvePromise, rejectPromise);
      } catch (e) {
        rejectPromise(e);
      }
    }
    function invokeCallback(subscriber) {
      var owner = subscriber.owner;
      var settled = owner._state;
      var value = owner._data;
      var callback = subscriber[settled];
      var promise = subscriber.then;
      if (typeof callback === "function") {
        settled = FULFILLED;
        try {
          value = callback(value);
        } catch (e) {
          reject(promise, e);
        }
      }
      if (!handleThenable(promise, value)) {
        if (settled === FULFILLED) {
          resolve(promise, value);
        }
        if (settled === REJECTED) {
          reject(promise, value);
        }
      }
    }
    function handleThenable(promise, value) {
      var resolved;
      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }
        if (value && (typeof value === "function" || typeof value === "object")) {
          var then = value.then;
          if (typeof then === "function") {
            then.call(value, function(val) {
              if (!resolved) {
                resolved = true;
                if (value === val) {
                  fulfill(promise, val);
                } else {
                  resolve(promise, val);
                }
              }
            }, function(reason) {
              if (!resolved) {
                resolved = true;
                reject(promise, reason);
              }
            });
            return true;
          }
        }
      } catch (e) {
        if (!resolved) {
          reject(promise, e);
        }
        return true;
      }
      return false;
    }
    function resolve(promise, value) {
      if (promise === value || !handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }
    function fulfill(promise, value) {
      if (promise._state === PENDING) {
        promise._state = SETTLED;
        promise._data = value;
        asyncCall(publishFulfillment, promise);
      }
    }
    function reject(promise, reason) {
      if (promise._state === PENDING) {
        promise._state = SETTLED;
        promise._data = reason;
        asyncCall(publishRejection, promise);
      }
    }
    function publish(promise) {
      promise._then = promise._then.forEach(invokeCallback);
    }
    function publishFulfillment(promise) {
      promise._state = FULFILLED;
      publish(promise);
    }
    function publishRejection(promise) {
      promise._state = REJECTED;
      publish(promise);
      if (!promise._handled && isNode) {
        global.process.emit("unhandledRejection", promise._data, promise);
      }
    }
    function notifyRejectionHandled(promise) {
      global.process.emit("rejectionHandled", promise);
    }
    function Promise2(resolver) {
      if (typeof resolver !== "function") {
        throw new TypeError("Promise resolver " + resolver + " is not a function");
      }
      if (this instanceof Promise2 === false) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }
      this._then = [];
      invokeResolver(resolver, this);
    }
    Promise2.prototype = {
      constructor: Promise2,
      _state: PENDING,
      _then: null,
      _data: void 0,
      _handled: false,
      then: function(onFulfillment, onRejection) {
        var subscriber = {
          owner: this,
          then: new this.constructor(NOOP),
          fulfilled: onFulfillment,
          rejected: onRejection
        };
        if ((onRejection || onFulfillment) && !this._handled) {
          this._handled = true;
          if (this._state === REJECTED && isNode) {
            asyncCall(notifyRejectionHandled, this);
          }
        }
        if (this._state === FULFILLED || this._state === REJECTED) {
          asyncCall(invokeCallback, subscriber);
        } else {
          this._then.push(subscriber);
        }
        return subscriber.then;
      },
      catch: function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    Promise2.all = function(promises) {
      if (!Array.isArray(promises)) {
        throw new TypeError("You must pass an array to Promise.all().");
      }
      return new Promise2(function(resolve2, reject2) {
        var results = [];
        var remaining = 0;
        function resolver(index) {
          remaining++;
          return function(value) {
            results[index] = value;
            if (!--remaining) {
              resolve2(results);
            }
          };
        }
        for (var i = 0, promise; i < promises.length; i++) {
          promise = promises[i];
          if (promise && typeof promise.then === "function") {
            promise.then(resolver(i), reject2);
          } else {
            results[i] = promise;
          }
        }
        if (!remaining) {
          resolve2(results);
        }
      });
    };
    Promise2.race = function(promises) {
      if (!Array.isArray(promises)) {
        throw new TypeError("You must pass an array to Promise.race().");
      }
      return new Promise2(function(resolve2, reject2) {
        for (var i = 0, promise; i < promises.length; i++) {
          promise = promises[i];
          if (promise && typeof promise.then === "function") {
            promise.then(resolve2, reject2);
          } else {
            resolve2(promise);
          }
        }
      });
    };
    Promise2.resolve = function(value) {
      if (value && typeof value === "object" && value.constructor === Promise2) {
        return value;
      }
      return new Promise2(function(resolve2) {
        resolve2(value);
      });
    };
    Promise2.reject = function(reason) {
      return new Promise2(function(resolve2, reject2) {
        reject2(reason);
      });
    };
    module2.exports = Promise2;
  }
});

// node_modules/.pnpm/pinkie-promise@2.0.1/node_modules/pinkie-promise/index.js
var require_pinkie_promise = __commonJS({
  "node_modules/.pnpm/pinkie-promise@2.0.1/node_modules/pinkie-promise/index.js"(exports, module2) {
    "use strict";
    module2.exports = typeof Promise === "function" ? Promise : require_pinkie();
  }
});

// node_modules/.pnpm/hasha@2.2.0/node_modules/hasha/index.js
var require_hasha = __commonJS({
  "node_modules/.pnpm/hasha@2.2.0/node_modules/hasha/index.js"(exports, module2) {
    "use strict";
    var fs2 = require("fs");
    var crypto = require("crypto");
    var isStream = require_is_stream();
    var Promise2 = require_pinkie_promise();
    var hasha2 = module2.exports = function(input, opts) {
      opts = opts || {};
      var outputEncoding = opts.encoding || "hex";
      if (outputEncoding === "buffer") {
        outputEncoding = void 0;
      }
      var hash = crypto.createHash(opts.algorithm || "sha512");
      var update = function(buf) {
        var inputEncoding = typeof buf === "string" ? "utf8" : void 0;
        hash.update(buf, inputEncoding);
      };
      if (Array.isArray(input)) {
        input.forEach(update);
      } else {
        update(input);
      }
      return hash.digest(outputEncoding);
    };
    hasha2.stream = function(opts) {
      opts = opts || {};
      var outputEncoding = opts.encoding || "hex";
      if (outputEncoding === "buffer") {
        outputEncoding = void 0;
      }
      var stream = crypto.createHash(opts.algorithm || "sha512");
      stream.setEncoding(outputEncoding);
      return stream;
    };
    hasha2.fromStream = function(stream, opts) {
      if (!isStream(stream)) {
        return Promise2.reject(new TypeError("Expected a stream"));
      }
      opts = opts || {};
      return new Promise2(function(resolve, reject) {
        stream.on("error", reject).pipe(hasha2.stream(opts)).on("error", reject).on("finish", function() {
          resolve(this.read());
        });
      });
    };
    hasha2.fromFile = function(fp, opts) {
      return hasha2.fromStream(fs2.createReadStream(fp), opts);
    };
    hasha2.fromFileSync = function(fp, opts) {
      return hasha2(fs2.readFileSync(fp), opts);
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ImageLoader: () => ImageLoader
});
module.exports = __toCommonJS(src_exports);
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var import_hasha = __toESM(require_hasha());
function ImageLoader({ outputPath = "dist/assets", ...options }) {
  return {
    name: "esbuild-vanilla-image-loader",
    setup(build) {
      build.onLoad({
        filter: options?.filter ?? /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/
      }, async (args) => {
        if (options?.dataUrl) {
          return {
            contents: await import_promises.default.readFile(args.path),
            loader: "dataurl"
          };
        }
        if (options?.file) {
          return {
            contents: `
            const file = '${args.path.replace(build.initialOptions.absWorkingDir, "")}';
            export default file;`,
            loader: "js"
          };
        }
        const fileContent = await import_promises.default.readFile(args.path);
        const hash = await (0, import_hasha.default)(fileContent, { algorithm: "sha1" });
        const ext = import_path.default.extname(args.path);
        const base = import_path.default.basename(args.path, ext);
        const hashedName = `${base}-${hash.slice(0, 16)}${ext}`;
        const outPath = import_path.default.resolve(outputPath, hashedName);
        let alreadyExists = false;
        try {
          await import_promises.default.access(outPath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }
        if (!alreadyExists) {
          await import_promises.default.mkdir(import_path.default.dirname(outPath), { recursive: true });
          await import_promises.default.writeFile(outPath, fileContent);
        }
        return {
          contents: `/assets/${hashedName}`,
          loader: "text"
        };
      });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageLoader
});
