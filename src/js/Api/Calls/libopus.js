export var libopus = (function () {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function (libopus) {
            libopus = libopus || {};

            var Module = typeof libopus !== "undefined" ? libopus : {};
            var moduleOverrides = {};
            var key;
            for (key in Module) {
                if (Module.hasOwnProperty(key)) {
                    moduleOverrides[key] = Module[key]
                }
            }
            var arguments_ = [];
            var thisProgram = "./this.program";
            var quit_ = function (status, toThrow) {
                throw toThrow
            };
            var ENVIRONMENT_IS_WEB = false;
            var ENVIRONMENT_IS_WORKER = false;
            var ENVIRONMENT_IS_NODE = false;
            var ENVIRONMENT_IS_SHELL = false;
            ENVIRONMENT_IS_WEB = typeof window === "object";
            ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
            var scriptDirectory = "";

            function locateFile(path) {
                if (Module["locateFile"]) {
                    return Module["locateFile"](path, scriptDirectory)
                }
                return scriptDirectory + path
            }

            var read_, readAsync, readBinary, setWindowTitle;
            var nodeFS;
            var nodePath;
            if (ENVIRONMENT_IS_NODE) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = require("path").dirname(scriptDirectory) + "/"
                } else {
                    scriptDirectory = __dirname + "/"
                }
                read_ = function shell_read(filename, binary) {
                    if (!nodeFS) nodeFS = null;
                    if (!nodePath) nodePath = require("path");
                    filename = nodePath["normalize"](filename);
                    return nodeFS["readFileSync"](filename, binary ? null : "utf8")
                };
                readBinary = function readBinary(filename) {
                    var ret = read_(filename, true);
                    if (!ret.buffer) {
                        ret = new Uint8Array(ret)
                    }
                    assert(ret.buffer);
                    return ret
                };
                if (process["argv"].length > 1) {
                    thisProgram = process["argv"][1].replace(/\\/g, "/")
                }
                arguments_ = process["argv"].slice(2);
                process["on"]("uncaughtException", function (ex) {
                    if (!(ex instanceof ExitStatus)) {
                        throw ex
                    }
                });
                process["on"]("unhandledRejection", abort);
                quit_ = function (status) {
                    process["exit"](status)
                };
                Module["inspect"] = function () {
                    return "[Emscripten Module object]"
                }
            } else if (ENVIRONMENT_IS_SHELL) {
                if (typeof read != "undefined") {
                    read_ = function shell_read(f) {
                        return read(f)
                    }
                }
                readBinary = function readBinary(f) {
                    var data;
                    if (typeof readbuffer === "function") {
                        return new Uint8Array(readbuffer(f))
                    }
                    data = read(f, "binary");
                    assert(typeof data === "object");
                    return data
                };
                if (typeof scriptArgs != "undefined") {
                    arguments_ = scriptArgs
                } else if (typeof arguments != "undefined") {
                    arguments_ = arguments
                }
                if (typeof quit === "function") {
                    quit_ = function (status) {
                        quit(status)
                    }
                }
                if (typeof print !== "undefined") {
                    if (typeof console === "undefined") console = {};
                    console.log = print;
                    console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
                }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = self.location.href
                } else if (document.currentScript) {
                    scriptDirectory = document.currentScript.src
                }
                if (_scriptDir) {
                    scriptDirectory = _scriptDir
                }
                if (scriptDirectory.indexOf("blob:") !== 0) {
                    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
                } else {
                    scriptDirectory = ""
                }
                {
                    read_ = function shell_read(url) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        xhr.send(null);
                        return xhr.responseText
                    };
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = function readBinary(url) {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.responseType = "arraybuffer";
                            xhr.send(null);
                            return new Uint8Array(xhr.response)
                        }
                    }
                    readAsync = function readAsync(url, onload, onerror) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function xhr_onload() {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                                onload(xhr.response);
                                return
                            }
                            onerror()
                        };
                        xhr.onerror = onerror;
                        xhr.send(null)
                    }
                }
                setWindowTitle = function (title) {
                    document.title = title
                }
            } else {
            }
            var out = Module["print"] || console.log.bind(console);
            var err = Module["printErr"] || console.warn.bind(console);
            for (key in moduleOverrides) {
                if (moduleOverrides.hasOwnProperty(key)) {
                    Module[key] = moduleOverrides[key]
                }
            }
            moduleOverrides = null;
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            if (Module["quit"]) quit_ = Module["quit"];
            var wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            var noExitRuntime;
            if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
            if (typeof WebAssembly !== "object") {
                err("no native wasm support detected")
            }
            var wasmMemory;
            var wasmTable = new WebAssembly.Table({"initial": 3, "maximum": 3 + 0, "element": "anyfunc"});
            var ABORT = false;
            var EXITSTATUS = 0;

            function assert(condition, text) {
                if (!condition) {
                    abort("Assertion failed: " + text)
                }
            }

            var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
            var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
            var WASM_PAGE_SIZE = 65536;
            var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateGlobalBufferAndViews(buf) {
                buffer = buf;
                Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
            }

            var DYNAMIC_BASE = 5282816, DYNAMICTOP_PTR = 39776;
            var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
            if (Module["wasmMemory"]) {
                wasmMemory = Module["wasmMemory"]
            } else {
                wasmMemory = new WebAssembly.Memory({
                    "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE,
                    "maximum": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
                })
            }
            if (wasmMemory) {
                buffer = wasmMemory.buffer
            }
            INITIAL_TOTAL_MEMORY = buffer.byteLength;
            updateGlobalBufferAndViews(buffer);
            HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

            function callRuntimeCallbacks(callbacks) {
                while (callbacks.length > 0) {
                    var callback = callbacks.shift();
                    if (typeof callback == "function") {
                        callback();
                        continue
                    }
                    var func = callback.func;
                    if (typeof func === "number") {
                        if (callback.arg === undefined) {
                            Module["dynCall_v"](func)
                        } else {
                            Module["dynCall_vi"](func, callback.arg)
                        }
                    } else {
                        func(callback.arg === undefined ? null : callback.arg)
                    }
                }
            }

            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATMAIN__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;

            function preRun() {
                if (Module["preRun"]) {
                    if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                    while (Module["preRun"].length) {
                        addOnPreRun(Module["preRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPRERUN__)
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__)
            }

            function preMain() {
                callRuntimeCallbacks(__ATMAIN__)
            }

            function postRun() {
                if (Module["postRun"]) {
                    if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                    while (Module["postRun"].length) {
                        addOnPostRun(Module["postRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPOSTRUN__)
            }

            function addOnPreRun(cb) {
                __ATPRERUN__.unshift(cb)
            }

            function addOnPostRun(cb) {
                __ATPOSTRUN__.unshift(cb)
            }

            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;

            function addRunDependency(id) {
                runDependencies++;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
            }

            function removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null
                    }
                    if (dependenciesFulfilled) {
                        var callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback()
                    }
                }
            }

            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};

            function abort(what) {
                if (Module["onAbort"]) {
                    Module["onAbort"](what)
                }
                what += "";
                out(what);
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
                throw new WebAssembly.RuntimeError(what)
            }

            var dataURIPrefix = "data:application/octet-stream;base64,";

            function isDataURI(filename) {
                return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
            }

            var wasmBinaryFile = "libopus.wasm";
            if (!isDataURI(wasmBinaryFile)) {
                wasmBinaryFile = locateFile(wasmBinaryFile)
            }

            function getBinary() {
                try {
                    if (wasmBinary) {
                        return new Uint8Array(wasmBinary)
                    }
                    if (readBinary) {
                        return readBinary(wasmBinaryFile)
                    } else {
                        throw"both async and sync fetching of the wasm failed"
                    }
                } catch (err) {
                    abort(err)
                }
            }

            function getBinaryPromise() {
                if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                    return fetch(wasmBinaryFile, {credentials: "same-origin"}).then(function (response) {
                        if (!response["ok"]) {
                            throw"failed to load wasm binary file at '" + wasmBinaryFile + "'"
                        }
                        return response["arrayBuffer"]()
                    }).catch(function () {
                        return getBinary()
                    })
                }
                return new Promise(function (resolve, reject) {
                    resolve(getBinary())
                })
            }

            function createWasm() {
                var info = {"a": asmLibraryArg};

                function receiveInstance(instance, module) {
                    var exports = instance.exports;
                    Module["asm"] = exports;
                    removeRunDependency("wasm-instantiate")
                }

                addRunDependency("wasm-instantiate");

                function receiveInstantiatedSource(output) {
                    receiveInstance(output["instance"])
                }

                function instantiateArrayBuffer(receiver) {
                    return getBinaryPromise().then(function (binary) {
                        return WebAssembly.instantiate(binary, info)
                    }).then(receiver, function (reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }

                function instantiateAsync() {
                    if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                        fetch(wasmBinaryFile, {credentials: "same-origin"}).then(function (response) {
                            var result = WebAssembly.instantiateStreaming(response, info);
                            return result.then(receiveInstantiatedSource, function (reason) {
                                err("wasm streaming compile failed: " + reason);
                                err("falling back to ArrayBuffer instantiation");
                                instantiateArrayBuffer(receiveInstantiatedSource)
                            })
                        })
                    } else {
                        return instantiateArrayBuffer(receiveInstantiatedSource)
                    }
                }

                if (Module["instantiateWasm"]) {
                    try {
                        var exports = Module["instantiateWasm"](info, receiveInstance);
                        return exports
                    } catch (e) {
                        err("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }
                instantiateAsync();
                return {}
            }

            __ATINIT__.push({
                func: function () {
                    ___wasm_call_ctors()
                }
            });

            function _emscripten_memcpy_big(dest, src, num) {
                HEAPU8.set(HEAPU8.subarray(src, src + num), dest)
            }

            function abortOnCannotGrowMemory(requestedSize) {
                abort("OOM")
            }

            function _emscripten_resize_heap(requestedSize) {
                abortOnCannotGrowMemory(requestedSize)
            }

            var asmLibraryArg = {
                "a": _emscripten_memcpy_big,
                "b": _emscripten_resize_heap,
                "memory": wasmMemory,
                "table": wasmTable
            };
            var asm = createWasm();
            Module["asm"] = asm;
            var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
                return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["c"]).apply(null, arguments)
            };
            var _opus_strerror = Module["_opus_strerror"] = function () {
                return (_opus_strerror = Module["_opus_strerror"] = Module["asm"]["d"]).apply(null, arguments)
            };
            var _opus_get_version_string = Module["_opus_get_version_string"] = function () {
                return (_opus_get_version_string = Module["_opus_get_version_string"] = Module["asm"]["e"]).apply(null, arguments)
            };
            var _opus_decoder_get_size = Module["_opus_decoder_get_size"] = function () {
                return (_opus_decoder_get_size = Module["_opus_decoder_get_size"] = Module["asm"]["f"]).apply(null, arguments)
            };
            var _opus_decoder_init = Module["_opus_decoder_init"] = function () {
                return (_opus_decoder_init = Module["_opus_decoder_init"] = Module["asm"]["g"]).apply(null, arguments)
            };
            var _opus_decode = Module["_opus_decode"] = function () {
                return (_opus_decode = Module["_opus_decode"] = Module["asm"]["h"]).apply(null, arguments)
            };
            var _opus_decode_float = Module["_opus_decode_float"] = function () {
                return (_opus_decode_float = Module["_opus_decode_float"] = Module["asm"]["i"]).apply(null, arguments)
            };
            var _opus_decoder_ctl = Module["_opus_decoder_ctl"] = function () {
                return (_opus_decoder_ctl = Module["_opus_decoder_ctl"] = Module["asm"]["j"]).apply(null, arguments)
            };
            var _opus_packet_get_nb_samples = Module["_opus_packet_get_nb_samples"] = function () {
                return (_opus_packet_get_nb_samples = Module["_opus_packet_get_nb_samples"] = Module["asm"]["k"]).apply(null, arguments)
            };
            var _opus_encoder_get_size = Module["_opus_encoder_get_size"] = function () {
                return (_opus_encoder_get_size = Module["_opus_encoder_get_size"] = Module["asm"]["l"]).apply(null, arguments)
            };
            var _opus_encoder_init = Module["_opus_encoder_init"] = function () {
                return (_opus_encoder_init = Module["_opus_encoder_init"] = Module["asm"]["m"]).apply(null, arguments)
            };
            var _opus_encode = Module["_opus_encode"] = function () {
                return (_opus_encode = Module["_opus_encode"] = Module["asm"]["n"]).apply(null, arguments)
            };
            var _opus_encode_float = Module["_opus_encode_float"] = function () {
                return (_opus_encode_float = Module["_opus_encode_float"] = Module["asm"]["o"]).apply(null, arguments)
            };
            var _opus_encoder_ctl = Module["_opus_encoder_ctl"] = function () {
                return (_opus_encoder_ctl = Module["_opus_encoder_ctl"] = Module["asm"]["p"]).apply(null, arguments)
            };
            var _malloc = Module["_malloc"] = function () {
                return (_malloc = Module["_malloc"] = Module["asm"]["q"]).apply(null, arguments)
            };
            var _free = Module["_free"] = function () {
                return (_free = Module["_free"] = Module["asm"]["r"]).apply(null, arguments)
            };
            Module["asm"] = asm;
            var calledRun;
            Module["then"] = function (func) {
                if (calledRun) {
                    func(Module)
                } else {
                    var old = Module["onRuntimeInitialized"];
                    Module["onRuntimeInitialized"] = function () {
                        if (old) old();
                        func(Module)
                    }
                }
                return Module
            };

            function ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status
            }

            dependenciesFulfilled = function runCaller() {
                if (!calledRun) run();
                if (!calledRun) dependenciesFulfilled = runCaller
            };

            function run(args) {
                args = args || arguments_;
                if (runDependencies > 0) {
                    return
                }
                preRun();
                if (runDependencies > 0) return;

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    if (ABORT) return;
                    initRuntime();
                    preMain();
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun()
                }

                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function () {
                        setTimeout(function () {
                            Module["setStatus"]("")
                        }, 1);
                        doRun()
                    }, 1)
                } else {
                    doRun()
                }
            }

            Module["run"] = run;
            if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                    Module["preInit"].pop()()
                }
            }
            noExitRuntime = true;
            run();


            return libopus
        }
    );
})();