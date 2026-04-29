(function () {
  'use strict';

  /**
   * @param  {*} arg passed in argument value
   * @param  {string} name name of the argument
   * @param  {string} typename e.g. 'string', 'Function' (value is compared to typeof after lowercasing)
   * @return {void}
   * @throws {TypeError}
   */
  function assertArgumentType(arg, name, typename) {
    const type = typeof arg;
    if (type !== typename.toLowerCase()) {
      throw new TypeError(`The "${name}" argument must be of type ${typename}. Received type ${type}`);
    }
  }

  const FORWARD_SLASH = 47; // '/'
  const BACKWARD_SLASH = 92; // '\\'

  /**
   * Is this [a-zA-Z]?
   * @param  {number}  charCode value from String.charCodeAt()
   * @return {Boolean}          [description]
   */
  function isWindowsDeviceName(charCode) {
    return charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122;
  }

  /**
   * [isAbsolute description]
   * @param  {boolean} isPosix whether this impl is for POSIX or not
   * @param  {string} filepath   input file path
   * @return {Boolean}          [description]
   */
  function isAbsolute(isPosix, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const length = filepath.length;
    // empty string special case
    if (length === 0) {
      return false;
    }
    const firstChar = filepath.charCodeAt(0);
    if (firstChar === FORWARD_SLASH) {
      return true;
    }
    // we already did our checks for posix
    if (isPosix) {
      return false;
    }
    // win32 from here on out
    if (firstChar === BACKWARD_SLASH) {
      return true;
    }
    if (length > 2 && isWindowsDeviceName(firstChar) && filepath.charAt(1) === ':') {
      const thirdChar = filepath.charAt(2);
      return thirdChar === '/' || thirdChar === '\\';
    }
    return false;
  }

  /**
   * [dirname description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @return {string}            [description]
   */
  function dirname(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const length = filepath.length;
    if (length === 0) {
      return '.';
    }

    // ignore trailing separator
    let fromIndex = length - 1;
    const hadTrailing = filepath.endsWith(separator);
    if (hadTrailing) {
      fromIndex--;
    }
    const foundIndex = filepath.lastIndexOf(separator, fromIndex);
    // no separators
    if (foundIndex === -1) {
      // handle special case of root Windows paths
      if (length >= 2 && separator === '\\' && filepath.charAt(1) === ':') {
        const firstChar = filepath.charCodeAt(0);
        if (isWindowsDeviceName(firstChar)) {
          return filepath; // it's a root Windows path
        }
      }
      return '.';
    }
    // only found root separator
    if (foundIndex === 0) {
      return separator; // if it was '/', return that
    }
    // Handle special case of '//something'
    if (foundIndex === 1 && separator === '/' && filepath.charAt(0) === '/') {
      return '//';
    }
    return filepath.slice(0, foundIndex);
  }

  /**
   * [extname description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @return {string}            [description]
   */
  function extname(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const index = filepath.lastIndexOf('.');
    if (index === -1 || index === 0) {
      return '';
    }
    // ignore trailing separator
    let endIndex = filepath.length;
    if (filepath.endsWith(separator)) {
      endIndex--;
    }
    return filepath.slice(index, endIndex);
  }
  function lastIndexWin32Separator(filepath, index) {
    for (let i = index; i >= 0; i--) {
      const char = filepath.charCodeAt(i);
      if (char === BACKWARD_SLASH || char === FORWARD_SLASH) {
        return i;
      }
    }
    return -1;
  }

  /**
   * [basename description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @param  {string} [ext]      file extension to drop if it exists
   * @return {string}            [description]
   */
  function basename(separator, filepath, ext) {
    assertArgumentType(filepath, 'path', 'string');
    if (ext !== undefined) {
      assertArgumentType(ext, 'ext', 'string');
    }
    const length = filepath.length;
    if (length === 0) {
      return '';
    }
    const isPosix = separator === '/';
    let endIndex = length;
    // drop trailing separator (if there is one)
    const lastCharCode = filepath.charCodeAt(length - 1);
    if (lastCharCode === FORWARD_SLASH || !isPosix && lastCharCode === BACKWARD_SLASH) {
      endIndex--;
    }

    // Find last occurence of separator
    let lastIndex = -1;
    if (isPosix) {
      lastIndex = filepath.lastIndexOf(separator, endIndex - 1);
    } else {
      // On win32, handle *either* separator!
      lastIndex = lastIndexWin32Separator(filepath, endIndex - 1);
      // handle special case of root path like 'C:' or 'C:\\'
      if ((lastIndex === 2 || lastIndex === -1) && filepath.charAt(1) === ':' && isWindowsDeviceName(filepath.charCodeAt(0))) {
        return '';
      }
    }

    // Take from last occurrence of separator to end of string (or beginning to end if not found)
    const base = filepath.slice(lastIndex + 1, endIndex);

    // drop trailing extension (if specified)
    if (ext === undefined) {
      return base;
    }
    return base.endsWith(ext) ? base.slice(0, base.length - ext.length) : base;
  }

  /**
   * The `path.normalize()` method normalizes the given path, resolving '..' and '.' segments.
   *
   * When multiple, sequential path segment separation characters are found (e.g.
   * / on POSIX and either \ or / on Windows), they are replaced by a single
   * instance of the platform-specific path segment separator (/ on POSIX and \
   * on Windows). Trailing separators are preserved.
   *
   * If the path is a zero-length string, '.' is returned, representing the
   * current working directory.
   *
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath  input file path
   * @return {string} [description]
   */
  function normalize(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    if (filepath.length === 0) {
      return '.';
    }

    // Windows can handle '/' or '\\' and both should be turned into separator
    const isWindows = separator === '\\';
    if (isWindows) {
      filepath = filepath.replace(/\//g, separator);
    }
    const hadLeading = filepath.startsWith(separator);
    // On Windows, need to handle UNC paths (\\host-name\\resource\\dir) special to retain leading double backslash
    const isUNC = hadLeading && isWindows && filepath.length > 2 && filepath.charAt(1) === '\\';
    const hadTrailing = filepath.endsWith(separator);
    const parts = filepath.split(separator);
    const result = [];
    for (const segment of parts) {
      if (segment.length !== 0 && segment !== '.') {
        if (segment === '..') {
          result.pop(); // FIXME: What if this goes above root? Should we throw an error?
        } else {
          result.push(segment);
        }
      }
    }
    let normalized = hadLeading ? separator : '';
    normalized += result.join(separator);
    if (hadTrailing) {
      normalized += separator;
    }
    if (isUNC) {
      normalized = '\\' + normalized;
    }
    return normalized;
  }

  /**
   * [assertSegment description]
   * @param  {*} segment [description]
   * @return {void}         [description]
   */
  function assertSegment(segment) {
    if (typeof segment !== 'string') {
      throw new TypeError(`Path must be a string. Received ${segment}`);
    }
  }

  /**
   * The `path.join()` method joins all given path segments together using the
   * platform-specific separator as a delimiter, then normalizes the resulting path.
   * Zero-length path segments are ignored. If the joined path string is a zero-
   * length string then '.' will be returned, representing the current working directory.
   * @param  {string} separator platform-specific file separator
   * @param  {string[]} paths [description]
   * @return {string}       The joined filepath
   */
  function join(separator, paths) {
    const result = [];
    // naive impl: just join all the paths with separator
    for (const segment of paths) {
      assertSegment(segment);
      if (segment.length !== 0) {
        result.push(segment);
      }
    }
    return normalize(separator, result.join(separator));
  }

  /**
   * The `path.resolve()` method resolves a sequence of paths or path segments into an absolute path.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {string[]} paths [description]
   * @return {string}       [description]
   */
  function resolve(separator, paths) {
    let resolved = '';
    let hitRoot = false;
    const isPosix = separator === '/';
    // go from right to left until we hit absolute path/root
    for (let i = paths.length - 1; i >= 0; i--) {
      const segment = paths[i];
      assertSegment(segment);
      if (segment.length === 0) {
        continue; // skip empty
      }
      resolved = segment + separator + resolved; // prepend new segment
      if (isAbsolute(isPosix, segment)) {
        // have we backed into an absolute path?
        hitRoot = true;
        break;
      }
    }
    // if we didn't hit root, prepend cwd
    if (!hitRoot) {
      resolved = (global.process ? process.cwd() : '/') + separator + resolved;
    }
    const normalized = normalize(separator, resolved);
    if (normalized.charAt(normalized.length - 1) === separator) {
      // FIXME: Handle UNC paths on Windows as well, so we don't trim trailing separator on something like '\\\\host-name\\resource\\'
      // Don't remove trailing separator if this is root path on windows!
      if (!isPosix && normalized.length === 3 && normalized.charAt(1) === ':' && isWindowsDeviceName(normalized.charCodeAt(0))) {
        return normalized;
      }
      // otherwise trim trailing separator
      return normalized.slice(0, normalized.length - 1);
    }
    return normalized;
  }

  /**
   * The `path.relative()` method returns the relative path `from` from to `to` based
   * on the current working directory. If from and to each resolve to the same
   * path (after calling `path.resolve()` on each), a zero-length string is returned.
   *
   * If a zero-length string is passed as `from` or `to`, the current working directory
   * will be used instead of the zero-length strings.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {string} from [description]
   * @param  {string} to   [description]
   * @return {string}      [description]
   */
  function relative(separator, from, to) {
    assertArgumentType(from, 'from', 'string');
    assertArgumentType(to, 'to', 'string');
    if (from === to) {
      return '';
    }
    from = resolve(separator, [from]);
    to = resolve(separator, [to]);
    if (from === to) {
      return '';
    }

    // we now have two absolute paths,
    // lets "go up" from `from` until we reach common base dir of `to`
    // const originalFrom = from;
    let upCount = 0;
    let remainingPath = '';
    while (true) {
      if (to.startsWith(from)) {
        // match! record rest...?
        remainingPath = to.slice(from.length);
        break;
      }
      // FIXME: Break/throw if we hit bad edge case of no common root!
      from = dirname(separator, from);
      upCount++;
    }
    // remove leading separator from remainingPath if there is any
    if (remainingPath.length > 0) {
      remainingPath = remainingPath.slice(1);
    }
    return ('..' + separator).repeat(upCount) + remainingPath;
  }

  /**
   * The `path.parse()` method returns an object whose properties represent
   * significant elements of the path. Trailing directory separators are ignored,
   * see `path.sep`.
   *
   * The returned object will have the following properties:
   *
   * - dir <string>
   * - root <string>
   * - base <string>
   * - name <string>
   * - ext <string>
   * @param  {string} separator platform-specific file separator
   * @param  {string} filepath [description]
   * @return {object}
   */
  function parse(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const result = {
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: ''
    };
    const length = filepath.length;
    if (length === 0) {
      return result;
    }

    // Cheat and just call our other methods for dirname/basename/extname?
    result.base = basename(separator, filepath);
    result.ext = extname(separator, result.base);
    const baseLength = result.base.length;
    result.name = result.base.slice(0, baseLength - result.ext.length);
    const toSubtract = baseLength === 0 ? 0 : baseLength + 1;
    result.dir = filepath.slice(0, filepath.length - toSubtract); // drop trailing separator!
    const firstCharCode = filepath.charCodeAt(0);
    // both win32 and POSIX return '/' root
    if (firstCharCode === FORWARD_SLASH) {
      result.root = '/';
      return result;
    }
    // we're done with POSIX...
    if (separator === '/') {
      return result;
    }
    // for win32...
    if (firstCharCode === BACKWARD_SLASH) {
      // FIXME: Handle UNC paths like '\\\\host-name\\resource\\file_path'
      // need to retain '\\\\host-name\\resource\\' as root in that case!
      result.root = '\\';
      return result;
    }
    // check for C: style root
    if (length > 1 && isWindowsDeviceName(firstCharCode) && filepath.charAt(1) === ':') {
      if (length > 2) {
        // is it like C:\\?
        const thirdCharCode = filepath.charCodeAt(2);
        if (thirdCharCode === FORWARD_SLASH || thirdCharCode === BACKWARD_SLASH) {
          result.root = filepath.slice(0, 3);
          return result;
        }
      }
      // nope, just C:, no trailing separator
      result.root = filepath.slice(0, 2);
    }
    return result;
  }

  /**
   * The `path.format()` method returns a path string from an object. This is the
   * opposite of `path.parse()`.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {object} pathObject object of format returned by `path.parse()`
   * @param  {string} pathObject.dir directory name
   * @param  {string} pathObject.root file root dir, ignored if `pathObject.dir` is provided
   * @param  {string} pathObject.base file basename
   * @param  {string} pathObject.name basename minus extension, ignored if `pathObject.base` exists
   * @param  {string} pathObject.ext file extension, ignored if `pathObject.base` exists
   * @return {string}
   */
  function format(separator, pathObject) {
    assertArgumentType(pathObject, 'pathObject', 'object');
    const base = pathObject.base || `${pathObject.name || ''}${pathObject.ext || ''}`;

    // append base to root if `dir` wasn't specified, or if
    // dir is the root
    if (!pathObject.dir || pathObject.dir === pathObject.root) {
      return `${pathObject.root || ''}${base}`;
    }
    // combine dir + / + base
    return `${pathObject.dir}${separator}${base}`;
  }

  /**
   * On Windows systems only, returns an equivalent namespace-prefixed path for
   * the given path. If path is not a string, path will be returned without modifications.
   * See https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces
   * @param  {string} filepath [description]
   * @return {string}          [description]
   */
  function toNamespacedPath(filepath) {
    if (typeof filepath !== 'string') {
      return filepath;
    }
    if (filepath.length === 0) {
      return '';
    }
    const resolvedPath = resolve('\\', [filepath]);
    const length = resolvedPath.length;
    if (length < 2) {
      // need '\\\\' or 'C:' minimum
      return filepath;
    }
    const firstCharCode = resolvedPath.charCodeAt(0);
    // if start with '\\\\', prefix with UNC root, drop the slashes
    if (firstCharCode === BACKWARD_SLASH && resolvedPath.charAt(1) === '\\') {
      // return as-is if it's an aready long path ('\\\\?\\' or '\\\\.\\' prefix)
      if (length >= 3) {
        const thirdChar = resolvedPath.charAt(2);
        if (thirdChar === '?' || thirdChar === '.') {
          return filepath;
        }
      }
      return '\\\\?\\UNC\\' + resolvedPath.slice(2);
    } else if (isWindowsDeviceName(firstCharCode) && resolvedPath.charAt(1) === ':') {
      return '\\\\?\\' + resolvedPath;
    }
    return filepath;
  }
  const Win32Path = {
    sep: '\\',
    delimiter: ';',
    basename: function (filepath, ext) {
      return basename(this.sep, filepath, ext);
    },
    normalize: function (filepath) {
      return normalize(this.sep, filepath);
    },
    join: function (...paths) {
      return join(this.sep, paths);
    },
    extname: function (filepath) {
      return extname(this.sep, filepath);
    },
    dirname: function (filepath) {
      return dirname(this.sep, filepath);
    },
    isAbsolute: function (filepath) {
      return isAbsolute(false, filepath);
    },
    relative: function (from, to) {
      return relative(this.sep, from, to);
    },
    resolve: function (...paths) {
      return resolve(this.sep, paths);
    },
    parse: function (filepath) {
      return parse(this.sep, filepath);
    },
    format: function (pathObject) {
      return format(this.sep, pathObject);
    },
    toNamespacedPath: toNamespacedPath
  };
  const PosixPath = {
    sep: '/',
    delimiter: ':',
    basename: function (filepath, ext) {
      return basename(this.sep, filepath, ext);
    },
    normalize: function (filepath) {
      return normalize(this.sep, filepath);
    },
    join: function (...paths) {
      return join(this.sep, paths);
    },
    extname: function (filepath) {
      return extname(this.sep, filepath);
    },
    dirname: function (filepath) {
      return dirname(this.sep, filepath);
    },
    isAbsolute: function (filepath) {
      return isAbsolute(true, filepath);
    },
    relative: function (from, to) {
      return relative(this.sep, from, to);
    },
    resolve: function (...paths) {
      return resolve(this.sep, paths);
    },
    parse: function (filepath) {
      return parse(this.sep, filepath);
    },
    format: function (pathObject) {
      return format(this.sep, pathObject);
    },
    toNamespacedPath: function (filepath) {
      return filepath; // no-op
    }
  };
  const path = PosixPath;
  path.win32 = Win32Path;
  path.posix = PosixPath;

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var invoker$1 = {};

  /**
   * Titanium SDK
   * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */
  var hasRequiredInvoker;
  function requireInvoker() {
    if (hasRequiredInvoker) return invoker$1;
    hasRequiredInvoker = 1;
    /**
     * Generates a wrapped invoker function for a specific API
     * This lets us pass in context-specific data to a function
     * defined in an API namespace (i.e. on a module)
     *
     * We use this for create methods, and other APIs that take
     * a KrollInvocation object as their first argument in Java
     *
     * For example, an invoker for a "create" method might look
     * something like this:
     *
     *     function createView(sourceUrl, options) {
     *         var view = new View(options);
     *         view.sourceUrl = sourceUrl;
     *         return view;
     *     }
     *
     * And the corresponding invoker for app.js would look like:
     *
     *     UI.createView = function() {
     *         return createView("app://app.js", arguments[0]);
     *     }
     *
     * wrapperAPI: The scope specific API (module) wrapper
     * realAPI: The actual module implementation
     * apiName: The top level API name of the root module
     * invocationAPI: The actual API to generate an invoker for
     * scopeVars: A map that is passed into each invoker
     */

    /**
     * @param {object} wrapperAPI e.g. TitaniumWrapper
     * @param {object} realAPI e.g. Titanium
     * @param {string} apiName e.g. 'Titanium'
     * @param {object} invocationAPI details on the API we're wrapping
     * @param {string} invocationAPI.namespace the namespace of the proxy where method hangs (w/o 'Ti.' prefix) e.g. 'Filesystem' or 'UI.Android'
     * @param {string} invocationAPI.api the method name e.g. 'openFile' or 'createSearchView'
     * @param {object} scopeVars holder for context specific values (basically just wraps sourceUrl)
     * @param {string} scopeVars.sourceUrl source URL of JS file entry point
     * @param {Module} [scopeVars.module] module
     */
    function genInvoker(wrapperAPI, realAPI, apiName, invocationAPI, scopeVars) {
      let apiNamespace = wrapperAPI;
      const namespace = invocationAPI.namespace;
      if (namespace !== apiName) {
        const names = namespace.split('.');
        for (const name of names) {
          let api;
          // Create a module wrapper only if it hasn't been wrapped already.
          if (Object.prototype.hasOwnProperty.call(apiNamespace, name)) {
            api = apiNamespace[name];
          } else {
            function SandboxAPI() {
              const proto = Object.getPrototypeOf(this);
              Object.defineProperty(this, '_events', {
                get: function () {
                  return proto._events;
                },
                set: function (value) {
                  proto._events = value;
                }
              });
            }
            SandboxAPI.prototype = apiNamespace[name];
            api = new SandboxAPI();
            apiNamespace[name] = api;
          }
          apiNamespace = api;
          realAPI = realAPI[name];
        }
      }
      let delegate = realAPI[invocationAPI.api];
      // These invokers form a call hierarchy so we need to
      // provide a way back to the actual root Titanium / actual impl.
      while (delegate.__delegate__) {
        delegate = delegate.__delegate__;
      }
      apiNamespace[invocationAPI.api] = createInvoker(realAPI, delegate, scopeVars);
    }
    invoker$1.genInvoker = genInvoker;

    /**
     * Creates and returns a single invoker function that wraps
     * a delegate function, thisObj, and scopeVars
     * @param {object} thisObj The `this` object to use when invoking the `delegate` function
     * @param {function} delegate The function to wrap/delegate to under the hood
     * @param {object} scopeVars The scope variables to splice into the arguments when calling the delegate
     * @param {string} scopeVars.sourceUrl the only real relevent scope variable!
     * @return {function}
     */
    function createInvoker(thisObj, delegate, scopeVars) {
      const urlInvoker = function invoker(...args) {
        // eslint-disable-line func-style
        args.splice(0, 0, invoker.__scopeVars__);
        return delegate.apply(invoker.__thisObj__, args);
      };
      urlInvoker.__delegate__ = delegate;
      urlInvoker.__thisObj__ = thisObj;
      urlInvoker.__scopeVars__ = scopeVars;
      return urlInvoker;
    }
    invoker$1.createInvoker = createInvoker;
    return invoker$1;
  }

  var invokerExports = requireInvoker();
  var invoker = /*@__PURE__*/getDefaultExportFromCjs(invokerExports);

  /**
   * Titanium SDK
   * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */
  function bootstrap$2(global, kroll) {
    const assets = kroll.binding('assets');
    const Script = kroll.binding('evals').Script;

    /**
     * The loaded index.json file from the app. Used to store the encrypted JS assets'
     * filenames/offsets.
     */
    let fileIndex;
    // FIXME: fix file name parity between platforms
    const INDEX_JSON = 'index.json';
    class Module {
      /**
       * [Module description]
       * @param {string} id      module id
       * @param {Module} parent  parent module
       */
      constructor(id, parent) {
        this.id = id;
        this.exports = {};
        this.parent = parent;
        this.filename = null;
        this.loaded = false;
        this.wrapperCache = {};
        this.isService = false; // toggled on if this module is the service entry point
      }

      /**
       * Attempts to load the module. If no file is found
       * with the provided name an exception will be thrown.
       * Once the contents of the file are read, it is run
       * in the current context. A sandbox is created by
       * executing the code inside a wrapper function.
       * This provides a speed boost vs creating a new context.
       *
       * @param  {String} filename [description]
       * @param  {String} source   [description]
       * @returns {void}
       */
      load(filename, source) {
        if (this.loaded) {
          throw new Error('Module already loaded.');
        }
        this.filename = filename;
        this.path = path.dirname(filename);
        this.paths = this.nodeModulesPaths(this.path);
        if (!source) {
          source = assets.readAsset(`Resources${filename}`);
        }

        // Stick it in the cache
        Module.cache[this.filename] = this;
        this._runScript(source, this.filename);
        this.loaded = true;
      }

      /**
       * Generates a context-specific module wrapper, and wraps
       * each invocation API in an external (3rd party) module
       * See invoker.js for more info
       * @param  {object} externalModule native module proxy
       * @param  {string} sourceUrl      the current JS file url
       * @return {object}                wrapper around the externalModule
       */
      createModuleWrapper(externalModule, sourceUrl) {

        // The module wrapper forwards on using the original as a prototype
        function ModuleWrapper() {}
        ModuleWrapper.prototype = externalModule;
        const wrapper = new ModuleWrapper();
        // Here we take the APIs defined in the bootstrap.js
        // and effectively lazily hook them
        // We explicitly guard the code so iOS doesn't even use/include the referenced invoker.js import
        const invocationAPIs = externalModule.invocationAPIs || [];
        for (const api of invocationAPIs) {
          const delegate = externalModule[api];
          if (!delegate) {
            continue;
          }
          wrapper[api] = invoker.createInvoker(externalModule, delegate, new kroll.ScopeVars({
            sourceUrl
          }));
        }
        wrapper.addEventListener = function (...args) {
          externalModule.addEventListener.apply(externalModule, args);
        };
        wrapper.removeEventListener = function (...args) {
          externalModule.removeEventListener.apply(externalModule, args);
        };
        wrapper.fireEvent = function (...args) {
          externalModule.fireEvent.apply(externalModule, args);
        };
        return wrapper;
      }

      /**
       * Takes a CommonJS module and uses it to extend an existing external/native module. The exports are added to the external module.
       * @param  {Object} externalModule The external/native module we're extending
       * @param  {String} id             module id
       */
      extendModuleWithCommonJs(externalModule, id) {
        if (!kroll.isExternalCommonJsModule(id)) {
          return;
        }

        // Load under fake name, or the commonjs side of the native module gets cached in place of the native module!
        // See TIMOB-24932
        const fakeId = `${id}.commonjs`;
        const jsModule = new Module(fakeId, this);
        jsModule.load(fakeId, kroll.getExternalCommonJsModule(id));
        if (jsModule.exports) {
          console.trace(`Extending native module '${id}' with the CommonJS module that was packaged with it.`);
          kroll.extend(externalModule, jsModule.exports);
        }
      }

      /**
       * Loads a native / external (3rd party) module
       * @param  {String} id              module id
       * @param  {object} externalBinding external binding object
       * @return {Object}                 The exported module
       */
      loadExternalModule(id, externalBinding) {
        // try to get the cached module...
        let externalModule = Module.cache[id];
        if (!externalModule) {
          // iOS and Android differ quite a bit here.
          // With ios, we should already have the native module loaded
          // There's no special "bootstrap.js" file packaged within it
          // On Android, we load a bootstrap.js bundled with the module
          {
            // This is the process for Android, first grab the bootstrap source
            const source = externalBinding.bootstrap;

            // Load the native module's bootstrap JS
            const module = new Module(id, this);
            module.load(`${id}/bootstrap.js`, source);

            // Bootstrap and load the module using the native bindings
            const result = module.exports.bootstrap(externalBinding);

            // Cache the external module instance after it's been modified by it's bootstrap script
            externalModule = result;
          }
        }
        if (!externalModule) {
          console.trace(`Unable to load external module: ${id}`);
          return null;
        }

        // cache the loaded native module (before we extend it)
        Module.cache[id] = externalModule;

        // We cache each context-specific module wrapper
        // on the parent module, rather than in the Module.cache
        let wrapper = this.wrapperCache[id];
        if (wrapper) {
          return wrapper;
        }
        const sourceUrl = `app://${this.filename}`; // FIXME: If this.filename starts with '/', we need to drop it, I think?
        wrapper = this.createModuleWrapper(externalModule, sourceUrl);

        // Then we "extend" the API/module using any shipped JS code (assets/<module.id>.js)
        this.extendModuleWithCommonJs(wrapper, id);
        this.wrapperCache[id] = wrapper;
        return wrapper;
      }

      // See https://nodejs.org/api/modules.html#modules_all_together

      /**
       * Require another module as a child of this module.
       * This parent module's path is used as the base for relative paths
       * when loading the child. Returns the exports object
       * of the child module.
       *
       * @param  {String} request  The path to the requested module
       * @return {Object}          The loaded module
       */
      require(request) {
        // 2. If X begins with './' or '/' or '../'
        const start = request.substring(0, 2); // hack up the start of the string to check relative/absolute/"naked" module id
        if (start === './' || start === '..') {
          const loaded = this.loadAsFileOrDirectory(path.normalize(this.path + '/' + request));
          if (loaded) {
            return loaded.exports;
          }
          // Root/absolute path (internally when reading the file, we prepend "Resources/" as root dir)
        } else if (request.substring(0, 1) === '/') {
          const loaded = this.loadAsFileOrDirectory(path.normalize(request));
          if (loaded) {
            return loaded.exports;
          }
        } else {
          // Despite being step 1 in Node.JS psuedo-code, we moved it down here because we don't allow native modules
          // to start with './', '..' or '/' - so this avoids a lot of misses on requires starting that way

          // 1. If X is a core module,
          let loaded = this.loadCoreModule(request);
          if (loaded) {
            // a. return the core module
            // b. STOP
            return loaded;
          }

          // Look for CommonJS module
          if (request.indexOf('/') === -1) {
            // For CommonJS we need to look for module.id/module.id.js first...
            const filename = `/${request}/${request}.js`;
            // Only look for this _exact file_. DO NOT APPEND .js or .json to it!
            if (this.filenameExists(filename)) {
              loaded = this.loadJavascriptText(filename);
              if (loaded) {
                return loaded.exports;
              }
            }

            // Then try module.id as directory
            loaded = this.loadAsDirectory(`/${request}`);
            if (loaded) {
              return loaded.exports;
            }
          }

          // Allow looking through node_modules
          // 3. LOAD_NODE_MODULES(X, dirname(Y))
          loaded = this.loadNodeModules(request, this.paths);
          if (loaded) {
            return loaded.exports;
          }

          // Fallback to old Titanium behavior of assuming it's actually an absolute path

          // We'd like to warn users about legacy style require syntax so they can update, but the new syntax is not backwards compatible.
          // So for now, let's just be quite about it. In future versions of the SDK (7.0?) we should warn (once 5.x is end of life so backwards compat is not necessary)
          // eslint-disable-next-line max-len
          // console.warn(`require called with un-prefixed module id: ${request}, should be a core or CommonJS module. Falling back to old Ti behavior and assuming it's an absolute path: /${request}`);

          loaded = this.loadAsFileOrDirectory(path.normalize(`/${request}`));
          if (loaded) {
            return loaded.exports;
          }
        }

        // 4. THROW "not found"
        throw new Error(`Requested module not found: ${request}`); // TODO Set 'code' property to 'MODULE_NOT_FOUND' to match Node?
      }

      /**
       * Loads the core module if it exists. If not, returns null.
       *
       * @param  {String}  id The request module id
       * @return {Object}    true if the module id matches a native or CommonJS module id, (or it's first path segment does).
       */
      loadCoreModule(id) {
        // skip bad ids, relative ids, absolute ids. "native"/"core" modules should be of form "module.id" or "module.id/sub.file.js"
        if (!id || id.startsWith('.') || id.startsWith('/')) {
          return null;
        }

        // check if we have a cached copy of the wrapper
        if (this.wrapperCache[id]) {
          return this.wrapperCache[id];
        }
        const parts = id.split('/');
        const externalBinding = kroll.externalBinding(parts[0]);
        if (externalBinding) {
          if (parts.length === 1) {
            // This is the "root" of an external module. It can look like:
            // request("com.example.mymodule")
            // We can load and return it right away (caching occurs in the called function).
            return this.loadExternalModule(parts[0], externalBinding);
          }

          // Could be a sub-module (CommonJS) of an external native module.
          // We allow that since TIMOB-9730.
          if (kroll.isExternalCommonJsModule(parts[0])) {
            const externalCommonJsContents = kroll.getExternalCommonJsModule(id);
            if (externalCommonJsContents) {
              // found it
              // FIXME Re-use loadAsJavaScriptText?
              const module = new Module(id, this);
              module.load(id, externalCommonJsContents);
              return module.exports;
            }
          }
        }
        return null; // failed to load
      }

      /**
       * Attempts to load a node module by id from the starting path
       * @param  {string} moduleId       The path of the module to load.
       * @param  {string[]} dirs       paths to search
       * @return {Module|null}      The module, if loaded. null if not.
       */
      loadNodeModules(moduleId, dirs) {
        // 2. for each DIR in DIRS:
        for (const dir of dirs) {
          // a. LOAD_AS_FILE(DIR/X)
          // b. LOAD_AS_DIRECTORY(DIR/X)
          const mod = this.loadAsFileOrDirectory(path.join(dir, moduleId));
          if (mod) {
            return mod;
          }
        }
        return null;
      }

      /**
       * Determine the set of paths to search for node_modules
       * @param  {string} startDir       The starting directory
       * @return {string[]}              The array of paths to search
       */
      nodeModulesPaths(startDir) {
        // Make sure we have an absolute path to start with
        startDir = path.resolve(startDir);

        // Return early if we are at root, this avoids doing a pointless loop
        // and also returning an array with duplicate entries
        // e.g. ["/node_modules", "/node_modules"]
        if (startDir === '/') {
          return ['/node_modules'];
        }
        // 1. let PARTS = path split(START)
        const parts = startDir.split('/');
        // 2. let I = count of PARTS - 1
        let i = parts.length - 1;
        // 3. let DIRS = []
        const dirs = [];

        // 4. while I >= 0,
        while (i >= 0) {
          // a. if PARTS[I] = "node_modules" CONTINUE
          if (parts[i] === 'node_modules' || parts[i] === '') {
            i -= 1;
            continue;
          }
          // b. DIR = path join(PARTS[0 .. I] + "node_modules")
          const dir = path.join(parts.slice(0, i + 1).join('/'), 'node_modules');
          // c. DIRS = DIRS + DIR
          dirs.push(dir);
          // d. let I = I - 1
          i -= 1;
        }
        // Always add /node_modules to the search path
        dirs.push('/node_modules');
        return dirs;
      }

      /**
       * Attempts to load a given path as a file or directory.
       * @param  {string} normalizedPath The path of the module to load.
       * @return {Module|null} The loaded module. null if unable to load.
       */
      loadAsFileOrDirectory(normalizedPath) {
        // a. LOAD_AS_FILE(Y + X)
        let loaded = this.loadAsFile(normalizedPath);
        if (loaded) {
          return loaded;
        }
        // b. LOAD_AS_DIRECTORY(Y + X)
        loaded = this.loadAsDirectory(normalizedPath);
        if (loaded) {
          return loaded;
        }
        return null;
      }

      /**
       * Loads a given file as a Javascript file, returning the module.exports.
       * @param  {string} filename File we're attempting to load
       * @return {Module} the loaded module
       */
      loadJavascriptText(filename) {
        // Look in the cache!
        if (Module.cache[filename]) {
          return Module.cache[filename];
        }
        const module = new Module(filename, this);
        module.load(filename);
        return module;
      }

      /**
       * Loads a JSON file by reading it's contents, doing a JSON.parse and returning the parsed object.
       *
       * @param  {String} filename File we're attempting to load
       * @return {Module} The loaded module instance
       */
      loadJavascriptObject(filename) {
        // Look in the cache!
        if (Module.cache[filename]) {
          return Module.cache[filename];
        }
        const module = new Module(filename, this);
        module.filename = filename;
        module.path = path.dirname(filename);
        const source = assets.readAsset(`Resources${filename}`);

        // Stick it in the cache
        Module.cache[filename] = module;
        module.exports = JSON.parse(source);
        module.loaded = true;
        return module;
      }

      /**
       * Attempts to load a file by it's full filename according to NodeJS rules.
       *
       * @param  {string} id The filename
       * @return {Module|null} Module instance if loaded, null if not found.
       */
      loadAsFile(id) {
        // 1. If X is a file, load X as JavaScript text.  STOP
        let filename = id;
        if (this.filenameExists(filename)) {
          // If the file has a .json extension, load as JavascriptObject
          if (filename.length > 5 && filename.slice(-4) === 'json') {
            return this.loadJavascriptObject(filename);
          }
          return this.loadJavascriptText(filename);
        }
        // 2. If X.js is a file, load X.js as JavaScript text.  STOP
        filename = id + '.js';
        if (this.filenameExists(filename)) {
          return this.loadJavascriptText(filename);
        }
        // 3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
        filename = id + '.json';
        if (this.filenameExists(filename)) {
          return this.loadJavascriptObject(filename);
        }
        // failed to load anything!
        return null;
      }

      /**
       * Attempts to load a directory according to NodeJS rules.
       *
       * @param  {string} id The directory name
       * @return {Module|null} Loaded module, null if not found.
       */
      loadAsDirectory(id) {
        // 1. If X/package.json is a file,
        let filename = path.resolve(id, 'package.json');
        if (this.filenameExists(filename)) {
          // a. Parse X/package.json, and look for "main" field.
          const object = this.loadJavascriptObject(filename);
          if (object && object.exports && object.exports.main) {
            // b. let M = X + (json main field)
            const m = path.resolve(id, object.exports.main);
            // c. LOAD_AS_FILE(M)
            return this.loadAsFileOrDirectory(m);
          }
        }

        // 2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
        filename = path.resolve(id, 'index.js');
        if (this.filenameExists(filename)) {
          return this.loadJavascriptText(filename);
        }
        // 3. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
        filename = path.resolve(id, 'index.json');
        if (this.filenameExists(filename)) {
          return this.loadJavascriptObject(filename);
        }
        return null;
      }

      /**
       * Setup a sandbox and run the module's script inside it.
       * Returns the result of the executed script.
       * @param  {String} source   [description]
       * @param  {String} filename [description]
       * @return {*}          [description]
       */
      _runScript(source, filename) {
        const self = this;
        function require(path) {
          return self.require(path);
        }
        require.main = Module.main;

        // This "first time" run is really only for app.js, AFAICT, and needs
        // an activity. If app was restarted for Service only, we don't want
        // to go this route. So added currentActivity check. (bill)
        if (self.id === '.' && !this.isService) {
          global.require = require;

          // check if we have an inspector binding...
          const inspector = kroll.binding('inspector');
          if (inspector) {
            // If debugger is enabled, load app.js and pause right before we execute it
            const inspectorWrapper = inspector.callAndPauseOnStart;
            if (inspectorWrapper) {
              // FIXME Why can't we do normal Module.wrap(source) here?
              // I get "Uncaught TypeError: Cannot read property 'createTabGroup' of undefined" for "Ti.UI.createTabGroup();"
              // Not sure why app.js is special case and can't be run under normal self-invoking wrapping function that gets passed in global/kroll/Ti/etc
              // Instead, let's use a slightly modified version of callAndPauseOnStart:
              // It will compile the source as-is, schedule a pause and then run the source.
              return inspectorWrapper(source, filename);
            }
          }
          // run app.js "normally" (i.e. not under debugger/inspector)
          return Script.runInThisContext(source, filename, true);
        }

        // In V8, we treat external modules the same as native modules.  First, we wrap the
        // module code and then run it in the current context.  This will allow external modules to
        // access globals as mentioned in TIMOB-11752. This will also help resolve startup slowness that
        // occurs as a result of creating a new context during startup in TIMOB-12286.
        source = Module.wrap(source);
        const f = Script.runInThisContext(source, filename, true);
        return f(this.exports, require, this, filename, path.dirname(filename), Titanium, Ti, global, kroll);
      }

      /**
       * Look up a filename in the app's index.json file
       * @param  {String} filename the file we're looking for
       * @return {Boolean}         true if the filename exists in the index.json
       */
      filenameExists(filename) {
        filename = 'Resources' + filename; // When we actually look for files, assume "Resources/" is the root
        if (!fileIndex) {
          const json = assets.readAsset(INDEX_JSON);
          if (json) {
            try {
              fileIndex = JSON.parse(json);
            } catch (e) {
              fileIndex = {};
            }
          } else {
            // _index_.json may be omitted in encrypted builds for security.
            // Without the index, we cannot determine file status from the index,
            // so we fall back to trying to load the file directly.
            fileIndex = null;
          }
        }
        if (fileIndex) {
          return filename in fileIndex;
        }

        // No index available - attempt direct asset lookup as fallback.
        // Use a '/' prefixed path so the native side routes through loadURL:
        // which handles encrypted file loading via resolveAppAsset:.
        // Paths like 'Resources/app.js' would incorrectly go through
        // loadCoreModuleAsset: instead.
        return !!assets.readAsset('/' + filename.substring(filename.indexOf('/') + 1));
      }
    }
    Module.cache = [];
    Module.main = null;
    Module.wrapper = ['(function (exports, require, module, __filename, __dirname, Titanium, Ti, global, kroll) {', '\n});'];
    Module.wrap = function (script) {
      return Module.wrapper[0] + script + Module.wrapper[1];
    };

    /**
     * [runModule description]
     * @param  {String} source            JS Source code
     * @param  {String} filename          Filename of the module
     * @param  {Titanium.Service|null|Titanium.Android.Activity} activityOrService [description]
     * @return {Module}                   The loaded Module
     */
    Module.runModule = function (source, filename, activityOrService) {
      let id = filename;
      if (!Module.main) {
        id = '.';
      }
      const module = new Module(id, null);
      // FIXME: I don't know why instanceof for Titanium.Service works here!
      // On Android, it's an apiname of Ti.Android.Service
      // On iOS, we don't yet pass in the value, but we do set Ti.App.currentService property beforehand!
      // Can we remove the preload stuff in KrollBridge.m to pass along the service instance into this like we do on Android?
      module.isService = activityOrService instanceof Titanium.Service;
      {
        if (module.isService) {
          Object.defineProperty(Ti.Android, 'currentService', {
            value: activityOrService,
            writable: false,
            configurable: true
          });
        } else {
          Object.defineProperty(Ti.Android, 'currentService', {
            value: null,
            writable: false,
            configurable: true
          });
        }
      }
      if (!Module.main) {
        Module.main = module;
      }
      filename = filename.replace('Resources/', '/'); // normalize back to absolute paths (which really are relative to Resources under the hood)
      module.load(filename, source);
      {
        Object.defineProperty(Ti.Android, 'currentService', {
          value: null,
          writable: false,
          configurable: true
        });
      }
      return module;
    };
    return Module;
  }

  /**
   * This hangs the Proxy type off Ti namespace. It also generates a hidden _properties object
   * that is used to store property values on the JS side for Java Proxies.
   * Basically these get/set methods are fallbacks for when a Java proxy doesn't have a native method to handle getting/setting the property.
   * (see Proxy.h/ProxyBindingV8.cpp.fm for more info)
   * @param {object} tiBinding the underlying 'Titanium' native binding (see KrollBindings::initTitanium)
   * @param {object} Ti the global.Titanium object
   */
  function ProxyBootstrap(tiBinding, Ti) {
    const Proxy = tiBinding.Proxy;
    Ti.Proxy = Proxy;
    Proxy.defineProperties = function (proxyPrototype, names) {
      const properties = {};
      const len = names.length;
      for (let i = 0; i < len; ++i) {
        const name = names[i];
        properties[name] = {
          get: function () {
            // eslint-disable-line no-loop-func
            return this.getProperty(name);
          },
          set: function (value) {
            // eslint-disable-line no-loop-func
            this.setPropertyAndFire(name, value);
          },
          enumerable: true
        };
      }
      Object.defineProperties(proxyPrototype, properties);
    };
    Object.defineProperty(Proxy.prototype, 'getProperty', {
      value: function (property) {
        return this._properties[property];
      },
      enumerable: false
    });
    Object.defineProperty(Proxy.prototype, 'setProperty', {
      value: function (property, value) {
        return this._properties[property] = value;
      },
      enumerable: false
    });
    Object.defineProperty(Proxy.prototype, 'setPropertiesAndFire', {
      value: function (properties) {
        const ownNames = Object.getOwnPropertyNames(properties);
        const len = ownNames.length;
        const changes = [];
        for (let i = 0; i < len; ++i) {
          const property = ownNames[i];
          const value = properties[property];
          if (!property) {
            continue;
          }
          const oldValue = this._properties[property];
          this._properties[property] = value;
          if (value !== oldValue) {
            changes.push([property, oldValue, value]);
          }
        }
        if (changes.length > 0) {
          this.onPropertiesChanged(changes);
        }
      },
      enumerable: false
    });
  }

  /* globals OS_ANDROID, OS_IOS */
  function bootstrap$1(global, kroll) {
    {
      const tiBinding = kroll.binding('Titanium');
      const Ti = tiBinding.Titanium;
      const bootstrap = kroll.NativeModule.require('bootstrap');
      // The bootstrap defines lazy namespace property tree **and**
      // sets up special APIs that get wrapped to pass along sourceUrl via a KrollInvocation object
      bootstrap.bootstrap(Ti);
      bootstrap.defineLazyBinding(Ti, 'API'); // Basically does the same thing iOS does for API module (lazy property getter)

      // Here, we go through all the specially marked APIs to generate the wrappers to pass in the sourceUrl
      // TODO: This is all insane, and we should just bake it into the Proxy conversion stuff to grab and pass along sourceUrl
      // Rather than carry it all over the place like this!
      // We already need to generate a KrollInvocation object to wrap the sourceUrl!
      function TitaniumWrapper(context) {
        const sourceUrl = this.sourceUrl = context.sourceUrl;
        const scopeVars = new kroll.ScopeVars({
          sourceUrl
        });
        Ti.bindInvocationAPIs(this, scopeVars);
      }
      TitaniumWrapper.prototype = Ti;
      Ti.Wrapper = TitaniumWrapper;

      // -----------------------------------------------------------------------
      // This loops through all known APIs that require an
      // Invocation object and wraps them so we can pass a
      // source URL as the first argument
      Ti.bindInvocationAPIs = function (wrapperTi, scopeVars) {
        for (const api of Ti.invocationAPIs) {
          // separate each invoker into it's own private scope
          invoker.genInvoker(wrapperTi, Ti, 'Titanium', api, scopeVars);
        }
      };
      ProxyBootstrap(tiBinding, Ti);
      return new TitaniumWrapper({
        // Even though the entry point is really ti://kroll.js, that will break resolution of urls under the covers!
        // So basically just assume app.js as the relative file base
        sourceUrl: 'app://app.js'
      });
    }
  }

  // Copyright Joyent, Inc. and other Node contributors.

  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:

  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.

  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  // Modifications Copyright 2011-Present Appcelerator, Inc.
  function EventEmitterBootstrap(global, kroll) {
    const TAG = 'EventEmitter';
    const EventEmitter = kroll.EventEmitter;
    const isArray = Array.isArray;

    // By default EventEmitters will print a warning if more than
    // 10 listeners are added to it. This is a useful default which
    // helps finding memory leaks.

    Object.defineProperty(EventEmitter.prototype, 'callHandler', {
      value: function (handler, type, data) {
        // kroll.log(TAG, "calling event handler: type:" + type + ", data: " + data + ", handler: " + handler);

        var handled = false,
          cancelBubble = data.cancelBubble,
          event;
        if (handler.listener && handler.listener.call) {
          // Create event object, copy any custom event data, and set the "type" and "source" properties.
          event = {
            type: type,
            source: this
          };
          kroll.extend(event, data);
          if (handler.self && event.source == handler.self.view) {
            // eslint-disable-line eqeqeq
            event.source = handler.self;
          }
          handler.listener.call(this, event);

          // The "cancelBubble" property may be reset in the handler.
          if (event.cancelBubble !== cancelBubble) {
            cancelBubble = event.cancelBubble;
          }
          handled = true;
        } else if (kroll.DBG) {
          kroll.log(TAG, 'handler for event \'' + type + '\' is ' + typeof handler.listener + ' and cannot be called.');
        }

        // Bubble the events to the parent view if needed.
        if (data.bubbles && !cancelBubble) {
          handled = this._fireSyncEventToParent(type, data) || handled;
        }
        return handled;
      },
      enumerable: false
    });
    Object.defineProperty(EventEmitter.prototype, 'emit', {
      value: function (type) {
        var handled = false,
          data = arguments[1],
          handler,
          listeners;

        // Set the "bubbles" and "cancelBubble" properties for event data.
        if (data !== null && typeof data === 'object') {
          data.bubbles = !!data.bubbles;
          data.cancelBubble = !!data.cancelBubble;
        } else {
          data = {
            bubbles: false,
            cancelBubble: false
          };
        }
        if (this._hasJavaListener) {
          this._onEventFired(type, data);
        }
        if (!this._events || !this._events[type] || !this.callHandler) {
          if (data.bubbles && !data.cancelBubble) {
            handled = this._fireSyncEventToParent(type, data);
          }
          return handled;
        }
        handler = this._events[type];
        if (typeof handler.listener === 'function') {
          handled = this.callHandler(handler, type, data);
        } else if (isArray(handler)) {
          listeners = handler.slice();
          for (var i = 0, l = listeners.length; i < l; i++) {
            handled = this.callHandler(listeners[i], type, data) || handled;
          }
        } else if (data.bubbles && !data.cancelBubble) {
          handled = this._fireSyncEventToParent(type, data);
        }
        return handled;
      },
      enumerable: false
    });

    // Titanium compatibility
    Object.defineProperty(EventEmitter.prototype, 'fireEvent', {
      value: EventEmitter.prototype.emit,
      enumerable: false,
      writable: true
    });
    Object.defineProperty(EventEmitter.prototype, 'fireSyncEvent', {
      value: EventEmitter.prototype.emit,
      enumerable: false
    });

    // EventEmitter is defined in src/node_events.cc
    // EventEmitter.prototype.emit() is also defined there.
    Object.defineProperty(EventEmitter.prototype, 'addListener', {
      value: function (type, listener, view) {
        if (typeof listener !== 'function') {
          throw new Error('addListener only takes instances of Function. The listener for event "' + type + '" is "' + typeof listener + '"');
        }
        if (!this._events) {
          this._events = {};
        }
        var id;

        // Setup ID first so we can pass count in to "listenerAdded"
        if (!this._events[type]) {
          id = 0;
        } else if (isArray(this._events[type])) {
          id = this._events[type].length;
        } else {
          id = 1;
        }
        var listenerWrapper = {};
        listenerWrapper.listener = listener;
        listenerWrapper.self = view;
        if (!this._events[type]) {
          // Optimize the case of one listener. Don't need the extra array object.
          this._events[type] = listenerWrapper;
        } else if (isArray(this._events[type])) {
          // If we've already got an array, just append.
          this._events[type].push(listenerWrapper);
        } else {
          // Adding the second element, need to change to array.
          this._events[type] = [this._events[type], listenerWrapper];
        }

        // Notify the Java proxy if this is the first listener added.
        if (id === 0) {
          this._hasListenersForEventType(type, true);
        }
        return id;
      },
      enumerable: false
    });

    // The JavaObject prototype will provide a version of this
    // that delegates back to the Java proxy. Non-Java versions
    // of EventEmitter don't care, so this no op is called instead.
    Object.defineProperty(EventEmitter.prototype, '_listenerForEvent', {
      value: function () {},
      enumerable: false
    });
    Object.defineProperty(EventEmitter.prototype, 'on', {
      value: EventEmitter.prototype.addListener,
      enumerable: false
    });

    // Titanium compatibility
    Object.defineProperty(EventEmitter.prototype, 'addEventListener', {
      value: EventEmitter.prototype.addListener,
      enumerable: false,
      writable: true
    });
    Object.defineProperty(EventEmitter.prototype, 'once', {
      value: function (type, listener) {
        var self = this;
        function g() {
          self.removeListener(type, g);
          listener.apply(this, arguments);
        }
        g.listener = listener;
        self.on(type, g);
        return this;
      },
      enumerable: false
    });
    Object.defineProperty(EventEmitter.prototype, 'removeListener', {
      value: function (type, listener) {
        if (typeof listener !== 'function') {
          throw new Error('removeListener only takes instances of Function');
        }

        // does not use listeners(), so no side effect of creating _events[type]
        if (!this._events || !this._events[type]) {
          return this;
        }
        var list = this._events[type];
        var count = 0;
        if (isArray(list)) {
          var position = -1;
          // Also support listener indexes / ids
          if (typeof listener === 'number') {
            position = listener;
            if (position > list.length || position < 0) {
              return this;
            }
          } else {
            for (var i = 0, length = list.length; i < length; i++) {
              if (list[i].listener === listener) {
                position = i;
                break;
              }
            }
          }
          if (position < 0) {
            return this;
          }
          list.splice(position, 1);
          if (list.length === 0) {
            delete this._events[type];
          }
          count = list.length;
        } else if (list.listener === listener || listener == 0) {
          // eslint-disable-line eqeqeq
          delete this._events[type];
        } else {
          return this;
        }
        if (count === 0) {
          this._hasListenersForEventType(type, false);
        }
        return this;
      },
      enumerable: false
    });
    Object.defineProperty(EventEmitter.prototype, 'removeEventListener', {
      value: EventEmitter.prototype.removeListener,
      enumerable: false,
      writable: true
    });
    Object.defineProperty(EventEmitter.prototype, 'removeAllListeners', {
      value: function (type) {
        // does not use listeners(), so no side effect of creating _events[type]
        if (type && this._events && this._events[type]) {
          this._events[type] = null;
          this._hasListenersForEventType(type, false);
        }
        return this;
      },
      enumerable: false
    });
    Object.defineProperty(EventEmitter.prototype, 'listeners', {
      value: function (type) {
        if (!this._events) {
          this._events = {};
        }
        if (!this._events[type]) {
          this._events[type] = [];
        }
        if (!isArray(this._events[type])) {
          this._events[type] = [this._events[type]];
        }
        return this._events[type];
      },
      enumerable: false
    });
    return EventEmitter;
  }

  /**
   * This is used by Android to require "baked-in" source.
   * SDK and module builds will bake in the raw source as c strings, and this will wrap
   * loading that code in via kroll.NativeModule.require(<id>)
   * For more information, see the bootstrap.js.ejs template.
   */
  function NativeModuleBootstrap(global, kroll) {
    const Script = kroll.binding('evals').Script;
    const runInThisContext = Script.runInThisContext;
    function NativeModule(id) {
      this.filename = id + '.js';
      this.id = id;
      this.exports = {};
      this.loaded = false;
    }

    /**
     * This should be an object with string keys (baked in module ids) -> string values (source of the baked in JS code)
     */
    NativeModule._source = kroll.binding('natives');
    NativeModule._cache = {};
    NativeModule.require = function (id) {
      if (id === 'native_module') {
        return NativeModule;
      }
      if (id === 'invoker') {
        return invoker; // Android native modules use a bootstrap.js file that assumes there's a builtin 'invoker'
      }
      const cached = NativeModule.getCached(id);
      if (cached) {
        return cached.exports;
      }
      if (!NativeModule.exists(id)) {
        throw new Error('No such native module ' + id);
      }
      const nativeModule = new NativeModule(id);
      nativeModule.compile();
      nativeModule.cache();
      return nativeModule.exports;
    };
    NativeModule.getCached = function (id) {
      return NativeModule._cache[id];
    };
    NativeModule.exists = function (id) {
      return id in NativeModule._source;
    };
    NativeModule.getSource = function (id) {
      return NativeModule._source[id];
    };
    NativeModule.wrap = function (script) {
      return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
    };
    NativeModule.wrapper = ['(function (exports, require, module, __filename, __dirname, Titanium, Ti, global, kroll) {', '\n});'];
    NativeModule.prototype.compile = function () {
      let source = NativeModule.getSource(this.id);
      source = NativeModule.wrap(source);

      // All native modules have their filename prefixed with ti:/
      const filename = `ti:/${this.filename}`;
      const fn = runInThisContext(source, filename, true);
      fn(this.exports, NativeModule.require, this, this.filename, null, global.Ti, global.Ti, global, kroll);
      this.loaded = true;
    };
    NativeModule.prototype.cache = function () {
      NativeModule._cache[this.id] = this;
    };
    return NativeModule;
  }

  // This is the file each platform loads on boot *before* we launch ti.main.js to insert all our shims/extensions

  /**
   * main bootstrapping function
   * @param {object} global the global object
   * @param {object} kroll; the kroll module/binding
   * @return {void}       [description]
   */
  function bootstrap(global, kroll) {
    // Works identical to Object.hasOwnProperty, except
    // also works if the given object does not have the method
    // on its prototype or it has been masked.
    function hasOwnProperty(object, property) {
      return Object.hasOwnProperty.call(object, property);
    }
    kroll.extend = function (thisObject, otherObject) {
      if (!otherObject) {
        // extend with what?!  denied!
        return;
      }
      for (var name in otherObject) {
        if (hasOwnProperty(otherObject, name)) {
          thisObject[name] = otherObject[name];
        }
      }
      return thisObject;
    };

    /**
     * This is used to shuttle the sourceUrl around to APIs that may need to
     * resolve relative paths based on the invoking file.
     * (see KrollInvocation.java for more)
     * @param {object} vars key/value pairs to store
     * @param {string} vars.sourceUrl the source URL of the file calling the API
     * @constructor
     * @returns {ScopeVars}
     */
    function ScopeVars(vars) {
      if (!vars) {
        return this;
      }
      const keys = Object.keys(vars);
      const length = keys.length;
      for (var i = 0; i < length; ++i) {
        const key = keys[i];
        this[key] = vars[key];
      }
    }
    function startup() {
      global.global = global; // hang the global object off itself
      global.kroll = kroll; // hang our special under the hood kroll object off the global
      {
        kroll.ScopeVars = ScopeVars;
        // external module bootstrap.js expects to call kroll.NativeModule.require directly to load in their own source
        // and to refer to the baked in "bootstrap.js" for the SDK and "invoker.js" to hang lazy APIs/wrap API calls to pass in scope vars
        kroll.NativeModule = NativeModuleBootstrap(global, kroll);
        // Android uses it's own EventEmitter impl, and it's baked right into the proxy class chain
        // It assumes it can call back into Java proxies to alert when listeners are added/removed
        // FIXME: Get it to use the events.js impl in the node extension, and get iOS to bake that into it's proxies as well!
        EventEmitterBootstrap(global, kroll);
      }
      global.Ti = global.Titanium = bootstrap$1(global, kroll);
      global.Module = bootstrap$2(global, kroll);
    }
    startup();
  }

  return bootstrap;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUVvRSxLQUFLLENBQUM7TUFDeERwRSxNQUFNLENBQUMwRSxNQUFNLEdBQUdQLFdBQVcsQ0FBQ25FLE1BQU0sRUFBRW9FLEtBQUssQ0FBQztJQUM1QztJQUNBNkosT0FBTyxDQUFDLENBQUM7RUFDWDs7RUFFQSxPQUFPbkgsU0FBUzs7QUFFakIsQ0FBQyxFQUFFLENBQUMiLCJuYW1lcyI6WyJhc3NlcnRBcmd1bWVudFR5cGUiLCJhcmciLCJuYW1lIiwidHlwZW5hbWUiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJUeXBlRXJyb3IiLCJGT1JXQVJEX1NMQVNIIiwiQkFDS1dBUkRfU0xBU0giLCJpc1dpbmRvd3NEZXZpY2VOYW1lIiwiY2hhckNvZGUiLCJpc0Fic29sdXRlIiwiaXNQb3NpeCIsImZpbGVwYXRoIiwibGVuZ3RoIiwiZmlyc3RDaGFyIiwiY2hhckNvZGVBdCIsImNoYXJBdCIsInRoaXJkQ2hhciIsImRpcm5hbWUiLCJzZXBhcmF0b3IiLCJmcm9tSW5kZXgiLCJoYWRUcmFpbGluZyIsImVuZHNXaXRoIiwiZm91bmRJbmRleCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJleHRuYW1lIiwiaW5kZXgiLCJlbmRJbmRleCIsImxhc3RJbmRleFdpbjMyU2VwYXJhdG9yIiwiaSIsImNoYXIiLCJiYXNlbmFtZSIsImV4dCIsInVuZGVmaW5lZCIsImxhc3RDaGFyQ29kZSIsImxhc3RJbmRleCIsImJhc2UiLCJub3JtYWxpemUiLCJpc1dpbmRvd3MiLCJyZXBsYWNlIiwiaGFkTGVhZGluZyIsInN0YXJ0c1dpdGgiLCJpc1VOQyIsInBhcnRzIiwic3BsaXQiLCJyZXN1bHQiLCJzZWdtZW50IiwicG9wIiwicHVzaCIsIm5vcm1hbGl6ZWQiLCJqb2luIiwiYXNzZXJ0U2VnbWVudCIsInBhdGhzIiwicmVzb2x2ZSIsInJlc29sdmVkIiwiaGl0Um9vdCIsImdsb2JhbCIsInByb2Nlc3MiLCJjd2QiLCJyZWxhdGl2ZSIsImZyb20iLCJ0byIsInVwQ291bnQiLCJyZW1haW5pbmdQYXRoIiwicmVwZWF0IiwicGFyc2UiLCJyb290IiwiZGlyIiwiYmFzZUxlbmd0aCIsInRvU3VidHJhY3QiLCJmaXJzdENoYXJDb2RlIiwidGhpcmRDaGFyQ29kZSIsImZvcm1hdCIsInBhdGhPYmplY3QiLCJ0b05hbWVzcGFjZWRQYXRoIiwicmVzb2x2ZWRQYXRoIiwiV2luMzJQYXRoIiwic2VwIiwiZGVsaW1pdGVyIiwiUG9zaXhQYXRoIiwicGF0aCIsIndpbjMyIiwicG9zaXgiLCJnZXREZWZhdWx0RXhwb3J0RnJvbUNqcyIsIngiLCJfX2VzTW9kdWxlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaW52b2tlciQxIiwiaGFzUmVxdWlyZWRJbnZva2VyIiwicmVxdWlyZUludm9rZXIiLCJnZW5JbnZva2VyIiwid3JhcHBlckFQSSIsInJlYWxBUEkiLCJhcGlOYW1lIiwiaW52b2NhdGlvbkFQSSIsInNjb3BlVmFycyIsImFwaU5hbWVzcGFjZSIsIm5hbWVzcGFjZSIsIm5hbWVzIiwiYXBpIiwiU2FuZGJveEFQSSIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIl9ldmVudHMiLCJzZXQiLCJ2YWx1ZSIsImRlbGVnYXRlIiwiX19kZWxlZ2F0ZV9fIiwiY3JlYXRlSW52b2tlciIsInRoaXNPYmoiLCJ1cmxJbnZva2VyIiwiaW52b2tlciIsImFyZ3MiLCJzcGxpY2UiLCJfX3Njb3BlVmFyc19fIiwiYXBwbHkiLCJfX3RoaXNPYmpfXyIsImludm9rZXJFeHBvcnRzIiwiYm9vdHN0cmFwJDIiLCJrcm9sbCIsImFzc2V0cyIsImJpbmRpbmciLCJTY3JpcHQiLCJmaWxlSW5kZXgiLCJJTkRFWF9KU09OIiwiTW9kdWxlIiwiY29uc3RydWN0b3IiLCJpZCIsInBhcmVudCIsImV4cG9ydHMiLCJmaWxlbmFtZSIsImxvYWRlZCIsIndyYXBwZXJDYWNoZSIsImlzU2VydmljZSIsImxvYWQiLCJzb3VyY2UiLCJFcnJvciIsIm5vZGVNb2R1bGVzUGF0aHMiLCJyZWFkQXNzZXQiLCJjYWNoZSIsIl9ydW5TY3JpcHQiLCJjcmVhdGVNb2R1bGVXcmFwcGVyIiwiZXh0ZXJuYWxNb2R1bGUiLCJzb3VyY2VVcmwiLCJNb2R1bGVXcmFwcGVyIiwid3JhcHBlciIsImludm9jYXRpb25BUElzIiwiU2NvcGVWYXJzIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJmaXJlRXZlbnQiLCJleHRlbmRNb2R1bGVXaXRoQ29tbW9uSnMiLCJpc0V4dGVybmFsQ29tbW9uSnNNb2R1bGUiLCJmYWtlSWQiLCJqc01vZHVsZSIsImdldEV4dGVybmFsQ29tbW9uSnNNb2R1bGUiLCJjb25zb2xlIiwidHJhY2UiLCJleHRlbmQiLCJsb2FkRXh0ZXJuYWxNb2R1bGUiLCJleHRlcm5hbEJpbmRpbmciLCJib290c3RyYXAiLCJtb2R1bGUiLCJyZXF1aXJlIiwicmVxdWVzdCIsInN0YXJ0Iiwic3Vic3RyaW5nIiwibG9hZEFzRmlsZU9yRGlyZWN0b3J5IiwibG9hZENvcmVNb2R1bGUiLCJpbmRleE9mIiwiZmlsZW5hbWVFeGlzdHMiLCJsb2FkSmF2YXNjcmlwdFRleHQiLCJsb2FkQXNEaXJlY3RvcnkiLCJsb2FkTm9kZU1vZHVsZXMiLCJleHRlcm5hbENvbW1vbkpzQ29udGVudHMiLCJtb2R1bGVJZCIsImRpcnMiLCJtb2QiLCJzdGFydERpciIsIm5vcm1hbGl6ZWRQYXRoIiwibG9hZEFzRmlsZSIsImxvYWRKYXZhc2NyaXB0T2JqZWN0IiwiSlNPTiIsIm9iamVjdCIsIm1haW4iLCJtIiwic2VsZiIsImluc3BlY3RvciIsImluc3BlY3RvcldyYXBwZXIiLCJjYWxsQW5kUGF1c2VPblN0YXJ0IiwicnVuSW5UaGlzQ29udGV4dCIsIndyYXAiLCJmIiwiVGl0YW5pdW0iLCJUaSIsImpzb24iLCJlIiwic2NyaXB0IiwicnVuTW9kdWxlIiwiYWN0aXZpdHlPclNlcnZpY2UiLCJTZXJ2aWNlIiwiQW5kcm9pZCIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiUHJveHlCb290c3RyYXAiLCJ0aUJpbmRpbmciLCJQcm94eSIsImRlZmluZVByb3BlcnRpZXMiLCJwcm94eVByb3RvdHlwZSIsInByb3BlcnRpZXMiLCJsZW4iLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5QW5kRmlyZSIsImVudW1lcmFibGUiLCJwcm9wZXJ0eSIsIl9wcm9wZXJ0aWVzIiwib3duTmFtZXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiY2hhbmdlcyIsIm9sZFZhbHVlIiwib25Qcm9wZXJ0aWVzQ2hhbmdlZCIsImJvb3RzdHJhcCQxIiwiTmF0aXZlTW9kdWxlIiwiZGVmaW5lTGF6eUJpbmRpbmciLCJUaXRhbml1bVdyYXBwZXIiLCJjb250ZXh0IiwiYmluZEludm9jYXRpb25BUElzIiwiV3JhcHBlciIsIndyYXBwZXJUaSIsIkV2ZW50RW1pdHRlckJvb3RzdHJhcCIsIlRBRyIsIkV2ZW50RW1pdHRlciIsImlzQXJyYXkiLCJBcnJheSIsImhhbmRsZXIiLCJkYXRhIiwiaGFuZGxlZCIsImNhbmNlbEJ1YmJsZSIsImV2ZW50IiwibGlzdGVuZXIiLCJ2aWV3IiwiREJHIiwibG9nIiwiYnViYmxlcyIsIl9maXJlU3luY0V2ZW50VG9QYXJlbnQiLCJhcmd1bWVudHMiLCJsaXN0ZW5lcnMiLCJfaGFzSmF2YUxpc3RlbmVyIiwiX29uRXZlbnRGaXJlZCIsImNhbGxIYW5kbGVyIiwibCIsImVtaXQiLCJsaXN0ZW5lcldyYXBwZXIiLCJfaGFzTGlzdGVuZXJzRm9yRXZlbnRUeXBlIiwiYWRkTGlzdGVuZXIiLCJnIiwicmVtb3ZlTGlzdGVuZXIiLCJvbiIsImxpc3QiLCJjb3VudCIsInBvc2l0aW9uIiwiTmF0aXZlTW9kdWxlQm9vdHN0cmFwIiwiX3NvdXJjZSIsIl9jYWNoZSIsImNhY2hlZCIsImdldENhY2hlZCIsImV4aXN0cyIsIm5hdGl2ZU1vZHVsZSIsImNvbXBpbGUiLCJnZXRTb3VyY2UiLCJmbiIsInRoaXNPYmplY3QiLCJvdGhlck9iamVjdCIsInZhcnMiLCJrZXlzIiwia2V5Iiwic3RhcnR1cCJdLCJzb3VyY2VSb290IjoiL1VzZXJzL21hcmNiZW5kZXIvTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0L1RpdGFuaXVtL21vYmlsZXNkay9vc3gvMTMuMy4wL2NvbW1vbi9SZXNvdXJjZXMvYW5kcm9pZCIsInNvdXJjZXMiOlsidGkua2VybmVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogQHBhcmFtICB7Kn0gYXJnIHBhc3NlZCBpbiBhcmd1bWVudCB2YWx1ZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgYXJndW1lbnRcblx0ICogQHBhcmFtICB7c3RyaW5nfSB0eXBlbmFtZSBlLmcuICdzdHJpbmcnLCAnRnVuY3Rpb24nICh2YWx1ZSBpcyBjb21wYXJlZCB0byB0eXBlb2YgYWZ0ZXIgbG93ZXJjYXNpbmcpXG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cblx0ICovXG5cdGZ1bmN0aW9uIGFzc2VydEFyZ3VtZW50VHlwZShhcmcsIG5hbWUsIHR5cGVuYW1lKSB7XG5cdCAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cdCAgaWYgKHR5cGUgIT09IHR5cGVuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgJHt0eXBlbmFtZX0uIFJlY2VpdmVkIHR5cGUgJHt0eXBlfWApO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IEZPUldBUkRfU0xBU0ggPSA0NzsgLy8gJy8nXG5cdGNvbnN0IEJBQ0tXQVJEX1NMQVNIID0gOTI7IC8vICdcXFxcJ1xuXG5cdC8qKlxuXHQgKiBJcyB0aGlzIFthLXpBLVpdP1xuXHQgKiBAcGFyYW0gIHtudW1iZXJ9ICBjaGFyQ29kZSB2YWx1ZSBmcm9tIFN0cmluZy5jaGFyQ29kZUF0KClcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNXaW5kb3dzRGV2aWNlTmFtZShjaGFyQ29kZSkge1xuXHQgIHJldHVybiBjaGFyQ29kZSA+PSA2NSAmJiBjaGFyQ29kZSA8PSA5MCB8fCBjaGFyQ29kZSA+PSA5NyAmJiBjaGFyQ29kZSA8PSAxMjI7XG5cdH1cblxuXHQvKipcblx0ICogW2lzQWJzb2x1dGUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge2Jvb2xlYW59IGlzUG9zaXggd2hldGhlciB0aGlzIGltcGwgaXMgZm9yIFBPU0lYIG9yIG5vdFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGlzQWJzb2x1dGUoaXNQb3NpeCwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDtcblx0ICAvLyBlbXB0eSBzdHJpbmcgc3BlY2lhbCBjYXNlXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICBjb25zdCBmaXJzdENoYXIgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDApO1xuXHQgIGlmIChmaXJzdENoYXIgPT09IEZPUldBUkRfU0xBU0gpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvLyB3ZSBhbHJlYWR5IGRpZCBvdXIgY2hlY2tzIGZvciBwb3NpeFxuXHQgIGlmIChpc1Bvc2l4KSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8vIHdpbjMyIGZyb20gaGVyZSBvbiBvdXRcblx0ICBpZiAoZmlyc3RDaGFyID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIGlmIChsZW5ndGggPiAyICYmIGlzV2luZG93c0RldmljZU5hbWUoZmlyc3RDaGFyKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgY29uc3QgdGhpcmRDaGFyID0gZmlsZXBhdGguY2hhckF0KDIpO1xuXHQgICAgcmV0dXJuIHRoaXJkQ2hhciA9PT0gJy8nIHx8IHRoaXJkQ2hhciA9PT0gJ1xcXFwnO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogW2Rpcm5hbWUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yICBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXJuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDtcblx0ICBpZiAobGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblxuXHQgIC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3Jcblx0ICBsZXQgZnJvbUluZGV4ID0gbGVuZ3RoIC0gMTtcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBmcm9tSW5kZXgtLTtcblx0ICB9XG5cdCAgY29uc3QgZm91bmRJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZnJvbUluZGV4KTtcblx0ICAvLyBubyBzZXBhcmF0b3JzXG5cdCAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSB7XG5cdCAgICAvLyBoYW5kbGUgc3BlY2lhbCBjYXNlIG9mIHJvb3QgV2luZG93cyBwYXRoc1xuXHQgICAgaWYgKGxlbmd0aCA+PSAyICYmIHNlcGFyYXRvciA9PT0gJ1xcXFwnICYmIGZpbGVwYXRoLmNoYXJBdCgxKSA9PT0gJzonKSB7XG5cdCAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IGZpbGVwYXRoLmNoYXJDb2RlQXQoMCk7XG5cdCAgICAgIGlmIChpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhcikpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7IC8vIGl0J3MgYSByb290IFdpbmRvd3MgcGF0aFxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblx0ICAvLyBvbmx5IGZvdW5kIHJvb3Qgc2VwYXJhdG9yXG5cdCAgaWYgKGZvdW5kSW5kZXggPT09IDApIHtcblx0ICAgIHJldHVybiBzZXBhcmF0b3I7IC8vIGlmIGl0IHdhcyAnLycsIHJldHVybiB0aGF0XG5cdCAgfVxuXHQgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugb2YgJy8vc29tZXRoaW5nJ1xuXHQgIGlmIChmb3VuZEluZGV4ID09PSAxICYmIHNlcGFyYXRvciA9PT0gJy8nICYmIGZpbGVwYXRoLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG5cdCAgICByZXR1cm4gJy8vJztcblx0ICB9XG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKDAsIGZvdW5kSW5kZXgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFtleHRuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0bmFtZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBjb25zdCBpbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKCcuJyk7XG5cdCAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblx0ICAvLyBpZ25vcmUgdHJhaWxpbmcgc2VwYXJhdG9yXG5cdCAgbGV0IGVuZEluZGV4ID0gZmlsZXBhdGgubGVuZ3RoO1xuXHQgIGlmIChmaWxlcGF0aC5lbmRzV2l0aChzZXBhcmF0b3IpKSB7XG5cdCAgICBlbmRJbmRleC0tO1xuXHQgIH1cblx0ICByZXR1cm4gZmlsZXBhdGguc2xpY2UoaW5kZXgsIGVuZEluZGV4KTtcblx0fVxuXHRmdW5jdGlvbiBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgaW5kZXgpIHtcblx0ICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdCAgICBjb25zdCBjaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdChpKTtcblx0ICAgIGlmIChjaGFyID09PSBCQUNLV0FSRF9TTEFTSCB8fCBjaGFyID09PSBGT1JXQVJEX1NMQVNIKSB7XG5cdCAgICAgIHJldHVybiBpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblxuXHQvKipcblx0ICogW2Jhc2VuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IFtleHRdICAgICAgZmlsZSBleHRlbnNpb24gdG8gZHJvcCBpZiBpdCBleGlzdHNcblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgsIGV4dCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cdCAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICBhc3NlcnRBcmd1bWVudFR5cGUoZXh0LCAnZXh0JywgJ3N0cmluZycpO1xuXHQgIH1cblx0ICBjb25zdCBsZW5ndGggPSBmaWxlcGF0aC5sZW5ndGg7XG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblx0ICBjb25zdCBpc1Bvc2l4ID0gc2VwYXJhdG9yID09PSAnLyc7XG5cdCAgbGV0IGVuZEluZGV4ID0gbGVuZ3RoO1xuXHQgIC8vIGRyb3AgdHJhaWxpbmcgc2VwYXJhdG9yIChpZiB0aGVyZSBpcyBvbmUpXG5cdCAgY29uc3QgbGFzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdChsZW5ndGggLSAxKTtcblx0ICBpZiAobGFzdENoYXJDb2RlID09PSBGT1JXQVJEX1NMQVNIIHx8ICFpc1Bvc2l4ICYmIGxhc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0gpIHtcblx0ICAgIGVuZEluZGV4LS07XG5cdCAgfVxuXG5cdCAgLy8gRmluZCBsYXN0IG9jY3VyZW5jZSBvZiBzZXBhcmF0b3Jcblx0ICBsZXQgbGFzdEluZGV4ID0gLTE7XG5cdCAgaWYgKGlzUG9zaXgpIHtcblx0ICAgIGxhc3RJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZW5kSW5kZXggLSAxKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gT24gd2luMzIsIGhhbmRsZSAqZWl0aGVyKiBzZXBhcmF0b3IhXG5cdCAgICBsYXN0SW5kZXggPSBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgZW5kSW5kZXggLSAxKTtcblx0ICAgIC8vIGhhbmRsZSBzcGVjaWFsIGNhc2Ugb2Ygcm9vdCBwYXRoIGxpa2UgJ0M6JyBvciAnQzpcXFxcJ1xuXHQgICAgaWYgKChsYXN0SW5kZXggPT09IDIgfHwgbGFzdEluZGV4ID09PSAtMSkgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaWxlcGF0aC5jaGFyQ29kZUF0KDApKSkge1xuXHQgICAgICByZXR1cm4gJyc7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy8gVGFrZSBmcm9tIGxhc3Qgb2NjdXJyZW5jZSBvZiBzZXBhcmF0b3IgdG8gZW5kIG9mIHN0cmluZyAob3IgYmVnaW5uaW5nIHRvIGVuZCBpZiBub3QgZm91bmQpXG5cdCAgY29uc3QgYmFzZSA9IGZpbGVwYXRoLnNsaWNlKGxhc3RJbmRleCArIDEsIGVuZEluZGV4KTtcblxuXHQgIC8vIGRyb3AgdHJhaWxpbmcgZXh0ZW5zaW9uIChpZiBzcGVjaWZpZWQpXG5cdCAgaWYgKGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICByZXR1cm4gYmFzZTtcblx0ICB9XG5cdCAgcmV0dXJuIGJhc2UuZW5kc1dpdGgoZXh0KSA/IGJhc2Uuc2xpY2UoMCwgYmFzZS5sZW5ndGggLSBleHQubGVuZ3RoKSA6IGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLm5vcm1hbGl6ZSgpYCBtZXRob2Qgbm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmVzb2x2aW5nICcuLicgYW5kICcuJyBzZWdtZW50cy5cblx0ICpcblx0ICogV2hlbiBtdWx0aXBsZSwgc2VxdWVudGlhbCBwYXRoIHNlZ21lbnQgc2VwYXJhdGlvbiBjaGFyYWN0ZXJzIGFyZSBmb3VuZCAoZS5nLlxuXHQgKiAvIG9uIFBPU0lYIGFuZCBlaXRoZXIgXFwgb3IgLyBvbiBXaW5kb3dzKSwgdGhleSBhcmUgcmVwbGFjZWQgYnkgYSBzaW5nbGVcblx0ICogaW5zdGFuY2Ugb2YgdGhlIHBsYXRmb3JtLXNwZWNpZmljIHBhdGggc2VnbWVudCBzZXBhcmF0b3IgKC8gb24gUE9TSVggYW5kIFxcXG5cdCAqIG9uIFdpbmRvd3MpLiBUcmFpbGluZyBzZXBhcmF0b3JzIGFyZSBwcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIElmIHRoZSBwYXRoIGlzIGEgemVyby1sZW5ndGggc3RyaW5nLCAnLicgaXMgcmV0dXJuZWQsIHJlcHJlc2VudGluZyB0aGVcblx0ICogY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cblx0ICpcblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBpZiAoZmlsZXBhdGgubGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblxuXHQgIC8vIFdpbmRvd3MgY2FuIGhhbmRsZSAnLycgb3IgJ1xcXFwnIGFuZCBib3RoIHNob3VsZCBiZSB0dXJuZWQgaW50byBzZXBhcmF0b3Jcblx0ICBjb25zdCBpc1dpbmRvd3MgPSBzZXBhcmF0b3IgPT09ICdcXFxcJztcblx0ICBpZiAoaXNXaW5kb3dzKSB7XG5cdCAgICBmaWxlcGF0aCA9IGZpbGVwYXRoLnJlcGxhY2UoL1xcLy9nLCBzZXBhcmF0b3IpO1xuXHQgIH1cblx0ICBjb25zdCBoYWRMZWFkaW5nID0gZmlsZXBhdGguc3RhcnRzV2l0aChzZXBhcmF0b3IpO1xuXHQgIC8vIE9uIFdpbmRvd3MsIG5lZWQgdG8gaGFuZGxlIFVOQyBwYXRocyAoXFxcXGhvc3QtbmFtZVxcXFxyZXNvdXJjZVxcXFxkaXIpIHNwZWNpYWwgdG8gcmV0YWluIGxlYWRpbmcgZG91YmxlIGJhY2tzbGFzaFxuXHQgIGNvbnN0IGlzVU5DID0gaGFkTGVhZGluZyAmJiBpc1dpbmRvd3MgJiYgZmlsZXBhdGgubGVuZ3RoID4gMiAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJztcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgY29uc3QgcGFydHMgPSBmaWxlcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXHQgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwYXJ0cykge1xuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoICE9PSAwICYmIHNlZ21lbnQgIT09ICcuJykge1xuXHQgICAgICBpZiAoc2VnbWVudCA9PT0gJy4uJykge1xuXHQgICAgICAgIHJlc3VsdC5wb3AoKTsgLy8gRklYTUU6IFdoYXQgaWYgdGhpcyBnb2VzIGFib3ZlIHJvb3Q/IFNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvcj9cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICBsZXQgbm9ybWFsaXplZCA9IGhhZExlYWRpbmcgPyBzZXBhcmF0b3IgOiAnJztcblx0ICBub3JtYWxpemVkICs9IHJlc3VsdC5qb2luKHNlcGFyYXRvcik7XG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBub3JtYWxpemVkICs9IHNlcGFyYXRvcjtcblx0ICB9XG5cdCAgaWYgKGlzVU5DKSB7XG5cdCAgICBub3JtYWxpemVkID0gJ1xcXFwnICsgbm9ybWFsaXplZDtcblx0ICB9XG5cdCAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG5cdH1cblxuXHQvKipcblx0ICogW2Fzc2VydFNlZ21lbnQgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAgeyp9IHNlZ21lbnQgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHt2b2lkfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGFzc2VydFNlZ21lbnQoc2VnbWVudCkge1xuXHQgIGlmICh0eXBlb2Ygc2VnbWVudCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFBhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJHtzZWdtZW50fWApO1xuXHQgIH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHBhdGguam9pbigpYCBtZXRob2Qgam9pbnMgYWxsIGdpdmVuIHBhdGggc2VnbWVudHMgdG9nZXRoZXIgdXNpbmcgdGhlXG5cdCAqIHBsYXRmb3JtLXNwZWNpZmljIHNlcGFyYXRvciBhcyBhIGRlbGltaXRlciwgdGhlbiBub3JtYWxpemVzIHRoZSByZXN1bHRpbmcgcGF0aC5cblx0ICogWmVyby1sZW5ndGggcGF0aCBzZWdtZW50cyBhcmUgaWdub3JlZC4gSWYgdGhlIGpvaW5lZCBwYXRoIHN0cmluZyBpcyBhIHplcm8tXG5cdCAqIGxlbmd0aCBzdHJpbmcgdGhlbiAnLicgd2lsbCBiZSByZXR1cm5lZCwgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmdbXX0gcGF0aHMgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgIFRoZSBqb2luZWQgZmlsZXBhdGhcblx0ICovXG5cdGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yLCBwYXRocykge1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXHQgIC8vIG5haXZlIGltcGw6IGp1c3Qgam9pbiBhbGwgdGhlIHBhdGhzIHdpdGggc2VwYXJhdG9yXG5cdCAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBhdGhzKSB7XG5cdCAgICBhc3NlcnRTZWdtZW50KHNlZ21lbnQpO1xuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoICE9PSAwKSB7XG5cdCAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzdWx0LmpvaW4oc2VwYXJhdG9yKSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnJlc29sdmUoKWAgbWV0aG9kIHJlc29sdmVzIGEgc2VxdWVuY2Ugb2YgcGF0aHMgb3IgcGF0aCBzZWdtZW50cyBpbnRvIGFuIGFic29sdXRlIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ1tdfSBwYXRocyBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzb2x2ZShzZXBhcmF0b3IsIHBhdGhzKSB7XG5cdCAgbGV0IHJlc29sdmVkID0gJyc7XG5cdCAgbGV0IGhpdFJvb3QgPSBmYWxzZTtcblx0ICBjb25zdCBpc1Bvc2l4ID0gc2VwYXJhdG9yID09PSAnLyc7XG5cdCAgLy8gZ28gZnJvbSByaWdodCB0byBsZWZ0IHVudGlsIHdlIGhpdCBhYnNvbHV0ZSBwYXRoL3Jvb3Rcblx0ICBmb3IgKGxldCBpID0gcGF0aHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0ICAgIGNvbnN0IHNlZ21lbnQgPSBwYXRoc1tpXTtcblx0ICAgIGFzc2VydFNlZ21lbnQoc2VnbWVudCk7XG5cdCAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDApIHtcblx0ICAgICAgY29udGludWU7IC8vIHNraXAgZW1wdHlcblx0ICAgIH1cblx0ICAgIHJlc29sdmVkID0gc2VnbWVudCArIHNlcGFyYXRvciArIHJlc29sdmVkOyAvLyBwcmVwZW5kIG5ldyBzZWdtZW50XG5cdCAgICBpZiAoaXNBYnNvbHV0ZShpc1Bvc2l4LCBzZWdtZW50KSkge1xuXHQgICAgICAvLyBoYXZlIHdlIGJhY2tlZCBpbnRvIGFuIGFic29sdXRlIHBhdGg/XG5cdCAgICAgIGhpdFJvb3QgPSB0cnVlO1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICB9XG5cdCAgLy8gaWYgd2UgZGlkbid0IGhpdCByb290LCBwcmVwZW5kIGN3ZFxuXHQgIGlmICghaGl0Um9vdCkge1xuXHQgICAgcmVzb2x2ZWQgPSAoZ2xvYmFsLnByb2Nlc3MgPyBwcm9jZXNzLmN3ZCgpIDogJy8nKSArIHNlcGFyYXRvciArIHJlc29sdmVkO1xuXHQgIH1cblx0ICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzb2x2ZWQpO1xuXHQgIGlmIChub3JtYWxpemVkLmNoYXJBdChub3JtYWxpemVkLmxlbmd0aCAtIDEpID09PSBzZXBhcmF0b3IpIHtcblx0ICAgIC8vIEZJWE1FOiBIYW5kbGUgVU5DIHBhdGhzIG9uIFdpbmRvd3MgYXMgd2VsbCwgc28gd2UgZG9uJ3QgdHJpbSB0cmFpbGluZyBzZXBhcmF0b3Igb24gc29tZXRoaW5nIGxpa2UgJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXCdcblx0ICAgIC8vIERvbid0IHJlbW92ZSB0cmFpbGluZyBzZXBhcmF0b3IgaWYgdGhpcyBpcyByb290IHBhdGggb24gd2luZG93cyFcblx0ICAgIGlmICghaXNQb3NpeCAmJiBub3JtYWxpemVkLmxlbmd0aCA9PT0gMyAmJiBub3JtYWxpemVkLmNoYXJBdCgxKSA9PT0gJzonICYmIGlzV2luZG93c0RldmljZU5hbWUobm9ybWFsaXplZC5jaGFyQ29kZUF0KDApKSkge1xuXHQgICAgICByZXR1cm4gbm9ybWFsaXplZDtcblx0ICAgIH1cblx0ICAgIC8vIG90aGVyd2lzZSB0cmltIHRyYWlsaW5nIHNlcGFyYXRvclxuXHQgICAgcmV0dXJuIG5vcm1hbGl6ZWQuc2xpY2UoMCwgbm9ybWFsaXplZC5sZW5ndGggLSAxKTtcblx0ICB9XG5cdCAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnJlbGF0aXZlKClgIG1ldGhvZCByZXR1cm5zIHRoZSByZWxhdGl2ZSBwYXRoIGBmcm9tYCBmcm9tIHRvIGB0b2AgYmFzZWRcblx0ICogb24gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIElmIGZyb20gYW5kIHRvIGVhY2ggcmVzb2x2ZSB0byB0aGUgc2FtZVxuXHQgKiBwYXRoIChhZnRlciBjYWxsaW5nIGBwYXRoLnJlc29sdmUoKWAgb24gZWFjaCksIGEgemVyby1sZW5ndGggc3RyaW5nIGlzIHJldHVybmVkLlxuXHQgKlxuXHQgKiBJZiBhIHplcm8tbGVuZ3RoIHN0cmluZyBpcyBwYXNzZWQgYXMgYGZyb21gIG9yIGB0b2AsIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5XG5cdCAqIHdpbGwgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSB6ZXJvLWxlbmd0aCBzdHJpbmdzLlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZyb20gW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHRvICAgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVsYXRpdmUoc2VwYXJhdG9yLCBmcm9tLCB0bykge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmcm9tLCAnZnJvbScsICdzdHJpbmcnKTtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUodG8sICd0bycsICdzdHJpbmcnKTtcblx0ICBpZiAoZnJvbSA9PT0gdG8pIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9XG5cdCAgZnJvbSA9IHJlc29sdmUoc2VwYXJhdG9yLCBbZnJvbV0pO1xuXHQgIHRvID0gcmVzb2x2ZShzZXBhcmF0b3IsIFt0b10pO1xuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIC8vIHdlIG5vdyBoYXZlIHR3byBhYnNvbHV0ZSBwYXRocyxcblx0ICAvLyBsZXRzIFwiZ28gdXBcIiBmcm9tIGBmcm9tYCB1bnRpbCB3ZSByZWFjaCBjb21tb24gYmFzZSBkaXIgb2YgYHRvYFxuXHQgIC8vIGNvbnN0IG9yaWdpbmFsRnJvbSA9IGZyb207XG5cdCAgbGV0IHVwQ291bnQgPSAwO1xuXHQgIGxldCByZW1haW5pbmdQYXRoID0gJyc7XG5cdCAgd2hpbGUgKHRydWUpIHtcblx0ICAgIGlmICh0by5zdGFydHNXaXRoKGZyb20pKSB7XG5cdCAgICAgIC8vIG1hdGNoISByZWNvcmQgcmVzdC4uLj9cblx0ICAgICAgcmVtYWluaW5nUGF0aCA9IHRvLnNsaWNlKGZyb20ubGVuZ3RoKTtcblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogQnJlYWsvdGhyb3cgaWYgd2UgaGl0IGJhZCBlZGdlIGNhc2Ugb2Ygbm8gY29tbW9uIHJvb3QhXG5cdCAgICBmcm9tID0gZGlybmFtZShzZXBhcmF0b3IsIGZyb20pO1xuXHQgICAgdXBDb3VudCsrO1xuXHQgIH1cblx0ICAvLyByZW1vdmUgbGVhZGluZyBzZXBhcmF0b3IgZnJvbSByZW1haW5pbmdQYXRoIGlmIHRoZXJlIGlzIGFueVxuXHQgIGlmIChyZW1haW5pbmdQYXRoLmxlbmd0aCA+IDApIHtcblx0ICAgIHJlbWFpbmluZ1BhdGggPSByZW1haW5pbmdQYXRoLnNsaWNlKDEpO1xuXHQgIH1cblx0ICByZXR1cm4gKCcuLicgKyBzZXBhcmF0b3IpLnJlcGVhdCh1cENvdW50KSArIHJlbWFpbmluZ1BhdGg7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnBhcnNlKClgIG1ldGhvZCByZXR1cm5zIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHJlcHJlc2VudFxuXHQgKiBzaWduaWZpY2FudCBlbGVtZW50cyBvZiB0aGUgcGF0aC4gVHJhaWxpbmcgZGlyZWN0b3J5IHNlcGFyYXRvcnMgYXJlIGlnbm9yZWQsXG5cdCAqIHNlZSBgcGF0aC5zZXBgLlxuXHQgKlxuXHQgKiBUaGUgcmV0dXJuZWQgb2JqZWN0IHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cdCAqXG5cdCAqIC0gZGlyIDxzdHJpbmc+XG5cdCAqIC0gcm9vdCA8c3RyaW5nPlxuXHQgKiAtIGJhc2UgPHN0cmluZz5cblx0ICogLSBuYW1lIDxzdHJpbmc+XG5cdCAqIC0gZXh0IDxzdHJpbmc+XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqL1xuXHRmdW5jdGlvbiBwYXJzZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBjb25zdCByZXN1bHQgPSB7XG5cdCAgICByb290OiAnJyxcblx0ICAgIGRpcjogJycsXG5cdCAgICBiYXNlOiAnJyxcblx0ICAgIGV4dDogJycsXG5cdCAgICBuYW1lOiAnJ1xuXHQgIH07XG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXHQgIGlmIChsZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXG5cdCAgLy8gQ2hlYXQgYW5kIGp1c3QgY2FsbCBvdXIgb3RoZXIgbWV0aG9kcyBmb3IgZGlybmFtZS9iYXNlbmFtZS9leHRuYW1lP1xuXHQgIHJlc3VsdC5iYXNlID0gYmFzZW5hbWUoc2VwYXJhdG9yLCBmaWxlcGF0aCk7XG5cdCAgcmVzdWx0LmV4dCA9IGV4dG5hbWUoc2VwYXJhdG9yLCByZXN1bHQuYmFzZSk7XG5cdCAgY29uc3QgYmFzZUxlbmd0aCA9IHJlc3VsdC5iYXNlLmxlbmd0aDtcblx0ICByZXN1bHQubmFtZSA9IHJlc3VsdC5iYXNlLnNsaWNlKDAsIGJhc2VMZW5ndGggLSByZXN1bHQuZXh0Lmxlbmd0aCk7XG5cdCAgY29uc3QgdG9TdWJ0cmFjdCA9IGJhc2VMZW5ndGggPT09IDAgPyAwIDogYmFzZUxlbmd0aCArIDE7XG5cdCAgcmVzdWx0LmRpciA9IGZpbGVwYXRoLnNsaWNlKDAsIGZpbGVwYXRoLmxlbmd0aCAtIHRvU3VidHJhY3QpOyAvLyBkcm9wIHRyYWlsaW5nIHNlcGFyYXRvciFcblx0ICBjb25zdCBmaXJzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTtcblx0ICAvLyBib3RoIHdpbjMyIGFuZCBQT1NJWCByZXR1cm4gJy8nIHJvb3Rcblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCkge1xuXHQgICAgcmVzdWx0LnJvb3QgPSAnLyc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH1cblx0ICAvLyB3ZSdyZSBkb25lIHdpdGggUE9TSVguLi5cblx0ICBpZiAoc2VwYXJhdG9yID09PSAnLycpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHQgIC8vIGZvciB3aW4zMi4uLlxuXHQgIGlmIChmaXJzdENoYXJDb2RlID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgLy8gRklYTUU6IEhhbmRsZSBVTkMgcGF0aHMgbGlrZSAnXFxcXFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcZmlsZV9wYXRoJ1xuXHQgICAgLy8gbmVlZCB0byByZXRhaW4gJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXCcgYXMgcm9vdCBpbiB0aGF0IGNhc2UhXG5cdCAgICByZXN1bHQucm9vdCA9ICdcXFxcJztcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHQgIC8vIGNoZWNrIGZvciBDOiBzdHlsZSByb290XG5cdCAgaWYgKGxlbmd0aCA+IDEgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgaWYgKGxlbmd0aCA+IDIpIHtcblx0ICAgICAgLy8gaXMgaXQgbGlrZSBDOlxcXFw/XG5cdCAgICAgIGNvbnN0IHRoaXJkQ2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDIpO1xuXHQgICAgICBpZiAodGhpcmRDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCB8fCB0aGlyZENoYXJDb2RlID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgICAgIHJlc3VsdC5yb290ID0gZmlsZXBhdGguc2xpY2UoMCwgMyk7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgLy8gbm9wZSwganVzdCBDOiwgbm8gdHJhaWxpbmcgc2VwYXJhdG9yXG5cdCAgICByZXN1bHQucm9vdCA9IGZpbGVwYXRoLnNsaWNlKDAsIDIpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5mb3JtYXQoKWAgbWV0aG9kIHJldHVybnMgYSBwYXRoIHN0cmluZyBmcm9tIGFuIG9iamVjdC4gVGhpcyBpcyB0aGVcblx0ICogb3Bwb3NpdGUgb2YgYHBhdGgucGFyc2UoKWAuXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge29iamVjdH0gcGF0aE9iamVjdCBvYmplY3Qgb2YgZm9ybWF0IHJldHVybmVkIGJ5IGBwYXRoLnBhcnNlKClgXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5kaXIgZGlyZWN0b3J5IG5hbWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LnJvb3QgZmlsZSByb290IGRpciwgaWdub3JlZCBpZiBgcGF0aE9iamVjdC5kaXJgIGlzIHByb3ZpZGVkXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5iYXNlIGZpbGUgYmFzZW5hbWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0Lm5hbWUgYmFzZW5hbWUgbWludXMgZXh0ZW5zaW9uLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmJhc2VgIGV4aXN0c1xuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3QuZXh0IGZpbGUgZXh0ZW5zaW9uLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmJhc2VgIGV4aXN0c1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JtYXQoc2VwYXJhdG9yLCBwYXRoT2JqZWN0KSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKHBhdGhPYmplY3QsICdwYXRoT2JqZWN0JywgJ29iamVjdCcpO1xuXHQgIGNvbnN0IGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgYCR7cGF0aE9iamVjdC5uYW1lIHx8ICcnfSR7cGF0aE9iamVjdC5leHQgfHwgJyd9YDtcblxuXHQgIC8vIGFwcGVuZCBiYXNlIHRvIHJvb3QgaWYgYGRpcmAgd2Fzbid0IHNwZWNpZmllZCwgb3IgaWZcblx0ICAvLyBkaXIgaXMgdGhlIHJvb3Rcblx0ICBpZiAoIXBhdGhPYmplY3QuZGlyIHx8IHBhdGhPYmplY3QuZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcblx0ICAgIHJldHVybiBgJHtwYXRoT2JqZWN0LnJvb3QgfHwgJyd9JHtiYXNlfWA7XG5cdCAgfVxuXHQgIC8vIGNvbWJpbmUgZGlyICsgLyArIGJhc2Vcblx0ICByZXR1cm4gYCR7cGF0aE9iamVjdC5kaXJ9JHtzZXBhcmF0b3J9JHtiYXNlfWA7XG5cdH1cblxuXHQvKipcblx0ICogT24gV2luZG93cyBzeXN0ZW1zIG9ubHksIHJldHVybnMgYW4gZXF1aXZhbGVudCBuYW1lc3BhY2UtcHJlZml4ZWQgcGF0aCBmb3Jcblx0ICogdGhlIGdpdmVuIHBhdGguIElmIHBhdGggaXMgbm90IGEgc3RyaW5nLCBwYXRoIHdpbGwgYmUgcmV0dXJuZWQgd2l0aG91dCBtb2RpZmljYXRpb25zLlxuXHQgKiBTZWUgaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvd2luZG93cy9kZXNrdG9wL0ZpbGVJTy9uYW1pbmctYS1maWxlI25hbWVzcGFjZXNcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gdG9OYW1lc3BhY2VkUGF0aChmaWxlcGF0aCkge1xuXHQgIGlmICh0eXBlb2YgZmlsZXBhdGggIT09ICdzdHJpbmcnKSB7XG5cdCAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgfVxuXHQgIGlmIChmaWxlcGF0aC5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9XG5cdCAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZSgnXFxcXCcsIFtmaWxlcGF0aF0pO1xuXHQgIGNvbnN0IGxlbmd0aCA9IHJlc29sdmVkUGF0aC5sZW5ndGg7XG5cdCAgaWYgKGxlbmd0aCA8IDIpIHtcblx0ICAgIC8vIG5lZWQgJ1xcXFxcXFxcJyBvciAnQzonIG1pbmltdW1cblx0ICAgIHJldHVybiBmaWxlcGF0aDtcblx0ICB9XG5cdCAgY29uc3QgZmlyc3RDaGFyQ29kZSA9IHJlc29sdmVkUGF0aC5jaGFyQ29kZUF0KDApO1xuXHQgIC8vIGlmIHN0YXJ0IHdpdGggJ1xcXFxcXFxcJywgcHJlZml4IHdpdGggVU5DIHJvb3QsIGRyb3AgdGhlIHNsYXNoZXNcblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0ggJiYgcmVzb2x2ZWRQYXRoLmNoYXJBdCgxKSA9PT0gJ1xcXFwnKSB7XG5cdCAgICAvLyByZXR1cm4gYXMtaXMgaWYgaXQncyBhbiBhcmVhZHkgbG9uZyBwYXRoICgnXFxcXFxcXFw/XFxcXCcgb3IgJ1xcXFxcXFxcLlxcXFwnIHByZWZpeClcblx0ICAgIGlmIChsZW5ndGggPj0gMykge1xuXHQgICAgICBjb25zdCB0aGlyZENoYXIgPSByZXNvbHZlZFBhdGguY2hhckF0KDIpO1xuXHQgICAgICBpZiAodGhpcmRDaGFyID09PSAnPycgfHwgdGhpcmRDaGFyID09PSAnLicpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiAnXFxcXFxcXFw/XFxcXFVOQ1xcXFwnICsgcmVzb2x2ZWRQYXRoLnNsaWNlKDIpO1xuXHQgIH0gZWxzZSBpZiAoaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiByZXNvbHZlZFBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgIHJldHVybiAnXFxcXFxcXFw/XFxcXCcgKyByZXNvbHZlZFBhdGg7XG5cdCAgfVxuXHQgIHJldHVybiBmaWxlcGF0aDtcblx0fVxuXHRjb25zdCBXaW4zMlBhdGggPSB7XG5cdCAgc2VwOiAnXFxcXCcsXG5cdCAgZGVsaW1pdGVyOiAnOycsXG5cdCAgYmFzZW5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCwgZXh0KSB7XG5cdCAgICByZXR1cm4gYmFzZW5hbWUodGhpcy5zZXAsIGZpbGVwYXRoLCBleHQpO1xuXHQgIH0sXG5cdCAgbm9ybWFsaXplOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBub3JtYWxpemUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGpvaW46IGZ1bmN0aW9uICguLi5wYXRocykge1xuXHQgICAgcmV0dXJuIGpvaW4odGhpcy5zZXAsIHBhdGhzKTtcblx0ICB9LFxuXHQgIGV4dG5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGV4dG5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGRpcm5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGRpcm5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGlzQWJzb2x1dGU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGlzQWJzb2x1dGUoZmFsc2UsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IHRvTmFtZXNwYWNlZFBhdGhcblx0fTtcblx0Y29uc3QgUG9zaXhQYXRoID0ge1xuXHQgIHNlcDogJy8nLFxuXHQgIGRlbGltaXRlcjogJzonLFxuXHQgIGJhc2VuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgsIGV4dCkge1xuXHQgICAgcmV0dXJuIGJhc2VuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCwgZXh0KTtcblx0ICB9LFxuXHQgIG5vcm1hbGl6ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gbm9ybWFsaXplKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBqb2luOiBmdW5jdGlvbiAoLi4ucGF0aHMpIHtcblx0ICAgIHJldHVybiBqb2luKHRoaXMuc2VwLCBwYXRocyk7XG5cdCAgfSxcblx0ICBleHRuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBleHRuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBkaXJuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBkaXJuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBpc0Fic29sdXRlOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBpc0Fic29sdXRlKHRydWUsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGZpbGVwYXRoOyAvLyBuby1vcFxuXHQgIH1cblx0fTtcblx0Y29uc3QgcGF0aCA9IFBvc2l4UGF0aDtcblx0cGF0aC53aW4zMiA9IFdpbjMyUGF0aDtcblx0cGF0aC5wb3NpeCA9IFBvc2l4UGF0aDtcblxuXHRmdW5jdGlvbiBnZXREZWZhdWx0RXhwb3J0RnJvbUNqcyAoeCkge1xuXHRcdHJldHVybiB4ICYmIHguX19lc01vZHVsZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ2RlZmF1bHQnKSA/IHhbJ2RlZmF1bHQnXSA6IHg7XG5cdH1cblxuXHR2YXIgaW52b2tlciQxID0ge307XG5cblx0LyoqXG5cdCAqIFRpdGFuaXVtIFNES1xuXHQgKiBDb3B5cmlnaHQgVGlEZXYsIEluYy4gMDQvMDcvMjAyMi1QcmVzZW50LiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFwYWNoZSBQdWJsaWMgTGljZW5zZVxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBMSUNFTlNFIGluY2x1ZGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gZm9yIGRldGFpbHMuXG5cdCAqL1xuXHR2YXIgaGFzUmVxdWlyZWRJbnZva2VyO1xuXHRmdW5jdGlvbiByZXF1aXJlSW52b2tlcigpIHtcblx0ICBpZiAoaGFzUmVxdWlyZWRJbnZva2VyKSByZXR1cm4gaW52b2tlciQxO1xuXHQgIGhhc1JlcXVpcmVkSW52b2tlciA9IDE7XG5cdCAgLyoqXG5cdCAgICogR2VuZXJhdGVzIGEgd3JhcHBlZCBpbnZva2VyIGZ1bmN0aW9uIGZvciBhIHNwZWNpZmljIEFQSVxuXHQgICAqIFRoaXMgbGV0cyB1cyBwYXNzIGluIGNvbnRleHQtc3BlY2lmaWMgZGF0YSB0byBhIGZ1bmN0aW9uXG5cdCAgICogZGVmaW5lZCBpbiBhbiBBUEkgbmFtZXNwYWNlIChpLmUuIG9uIGEgbW9kdWxlKVxuXHQgICAqXG5cdCAgICogV2UgdXNlIHRoaXMgZm9yIGNyZWF0ZSBtZXRob2RzLCBhbmQgb3RoZXIgQVBJcyB0aGF0IHRha2Vcblx0ICAgKiBhIEtyb2xsSW52b2NhdGlvbiBvYmplY3QgYXMgdGhlaXIgZmlyc3QgYXJndW1lbnQgaW4gSmF2YVxuXHQgICAqXG5cdCAgICogRm9yIGV4YW1wbGUsIGFuIGludm9rZXIgZm9yIGEgXCJjcmVhdGVcIiBtZXRob2QgbWlnaHQgbG9va1xuXHQgICAqIHNvbWV0aGluZyBsaWtlIHRoaXM6XG5cdCAgICpcblx0ICAgKiAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhzb3VyY2VVcmwsIG9wdGlvbnMpIHtcblx0ICAgKiAgICAgICAgIHZhciB2aWV3ID0gbmV3IFZpZXcob3B0aW9ucyk7XG5cdCAgICogICAgICAgICB2aWV3LnNvdXJjZVVybCA9IHNvdXJjZVVybDtcblx0ICAgKiAgICAgICAgIHJldHVybiB2aWV3O1xuXHQgICAqICAgICB9XG5cdCAgICpcblx0ICAgKiBBbmQgdGhlIGNvcnJlc3BvbmRpbmcgaW52b2tlciBmb3IgYXBwLmpzIHdvdWxkIGxvb2sgbGlrZTpcblx0ICAgKlxuXHQgICAqICAgICBVSS5jcmVhdGVWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdCAgICogICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhcImFwcDovL2FwcC5qc1wiLCBhcmd1bWVudHNbMF0pO1xuXHQgICAqICAgICB9XG5cdCAgICpcblx0ICAgKiB3cmFwcGVyQVBJOiBUaGUgc2NvcGUgc3BlY2lmaWMgQVBJIChtb2R1bGUpIHdyYXBwZXJcblx0ICAgKiByZWFsQVBJOiBUaGUgYWN0dWFsIG1vZHVsZSBpbXBsZW1lbnRhdGlvblxuXHQgICAqIGFwaU5hbWU6IFRoZSB0b3AgbGV2ZWwgQVBJIG5hbWUgb2YgdGhlIHJvb3QgbW9kdWxlXG5cdCAgICogaW52b2NhdGlvbkFQSTogVGhlIGFjdHVhbCBBUEkgdG8gZ2VuZXJhdGUgYW4gaW52b2tlciBmb3Jcblx0ICAgKiBzY29wZVZhcnM6IEEgbWFwIHRoYXQgaXMgcGFzc2VkIGludG8gZWFjaCBpbnZva2VyXG5cdCAgICovXG5cblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gd3JhcHBlckFQSSBlLmcuIFRpdGFuaXVtV3JhcHBlclxuXHQgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsQVBJIGUuZy4gVGl0YW5pdW1cblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gYXBpTmFtZSBlLmcuICdUaXRhbml1bSdcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gaW52b2NhdGlvbkFQSSBkZXRhaWxzIG9uIHRoZSBBUEkgd2UncmUgd3JhcHBpbmdcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gaW52b2NhdGlvbkFQSS5uYW1lc3BhY2UgdGhlIG5hbWVzcGFjZSBvZiB0aGUgcHJveHkgd2hlcmUgbWV0aG9kIGhhbmdzICh3L28gJ1RpLicgcHJlZml4KSBlLmcuICdGaWxlc3lzdGVtJyBvciAnVUkuQW5kcm9pZCdcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gaW52b2NhdGlvbkFQSS5hcGkgdGhlIG1ldGhvZCBuYW1lIGUuZy4gJ29wZW5GaWxlJyBvciAnY3JlYXRlU2VhcmNoVmlldydcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gc2NvcGVWYXJzIGhvbGRlciBmb3IgY29udGV4dCBzcGVjaWZpYyB2YWx1ZXMgKGJhc2ljYWxseSBqdXN0IHdyYXBzIHNvdXJjZVVybClcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVWYXJzLnNvdXJjZVVybCBzb3VyY2UgVVJMIG9mIEpTIGZpbGUgZW50cnkgcG9pbnRcblx0ICAgKiBAcGFyYW0ge01vZHVsZX0gW3Njb3BlVmFycy5tb2R1bGVdIG1vZHVsZVxuXHQgICAqL1xuXHQgIGZ1bmN0aW9uIGdlbkludm9rZXIod3JhcHBlckFQSSwgcmVhbEFQSSwgYXBpTmFtZSwgaW52b2NhdGlvbkFQSSwgc2NvcGVWYXJzKSB7XG5cdCAgICBsZXQgYXBpTmFtZXNwYWNlID0gd3JhcHBlckFQSTtcblx0ICAgIGNvbnN0IG5hbWVzcGFjZSA9IGludm9jYXRpb25BUEkubmFtZXNwYWNlO1xuXHQgICAgaWYgKG5hbWVzcGFjZSAhPT0gYXBpTmFtZSkge1xuXHQgICAgICBjb25zdCBuYW1lcyA9IG5hbWVzcGFjZS5zcGxpdCgnLicpO1xuXHQgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHtcblx0ICAgICAgICBsZXQgYXBpO1xuXHQgICAgICAgIC8vIENyZWF0ZSBhIG1vZHVsZSB3cmFwcGVyIG9ubHkgaWYgaXQgaGFzbid0IGJlZW4gd3JhcHBlZCBhbHJlYWR5LlxuXHQgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBpTmFtZXNwYWNlLCBuYW1lKSkge1xuXHQgICAgICAgICAgYXBpID0gYXBpTmFtZXNwYWNlW25hbWVdO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBmdW5jdGlvbiBTYW5kYm94QVBJKCkge1xuXHQgICAgICAgICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcblx0ICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfZXZlbnRzJywge1xuXHQgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvLl9ldmVudHM7XG5cdCAgICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgcHJvdG8uX2V2ZW50cyA9IHZhbHVlO1xuXHQgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBTYW5kYm94QVBJLnByb3RvdHlwZSA9IGFwaU5hbWVzcGFjZVtuYW1lXTtcblx0ICAgICAgICAgIGFwaSA9IG5ldyBTYW5kYm94QVBJKCk7XG5cdCAgICAgICAgICBhcGlOYW1lc3BhY2VbbmFtZV0gPSBhcGk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGFwaU5hbWVzcGFjZSA9IGFwaTtcblx0ICAgICAgICByZWFsQVBJID0gcmVhbEFQSVtuYW1lXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgbGV0IGRlbGVnYXRlID0gcmVhbEFQSVtpbnZvY2F0aW9uQVBJLmFwaV07XG5cdCAgICAvLyBUaGVzZSBpbnZva2VycyBmb3JtIGEgY2FsbCBoaWVyYXJjaHkgc28gd2UgbmVlZCB0b1xuXHQgICAgLy8gcHJvdmlkZSBhIHdheSBiYWNrIHRvIHRoZSBhY3R1YWwgcm9vdCBUaXRhbml1bSAvIGFjdHVhbCBpbXBsLlxuXHQgICAgd2hpbGUgKGRlbGVnYXRlLl9fZGVsZWdhdGVfXykge1xuXHQgICAgICBkZWxlZ2F0ZSA9IGRlbGVnYXRlLl9fZGVsZWdhdGVfXztcblx0ICAgIH1cblx0ICAgIGFwaU5hbWVzcGFjZVtpbnZvY2F0aW9uQVBJLmFwaV0gPSBjcmVhdGVJbnZva2VyKHJlYWxBUEksIGRlbGVnYXRlLCBzY29wZVZhcnMpO1xuXHQgIH1cblx0ICBpbnZva2VyJDEuZ2VuSW52b2tlciA9IGdlbkludm9rZXI7XG5cblx0ICAvKipcblx0ICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgc2luZ2xlIGludm9rZXIgZnVuY3Rpb24gdGhhdCB3cmFwc1xuXHQgICAqIGEgZGVsZWdhdGUgZnVuY3Rpb24sIHRoaXNPYmosIGFuZCBzY29wZVZhcnNcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gdGhpc09iaiBUaGUgYHRoaXNgIG9iamVjdCB0byB1c2Ugd2hlbiBpbnZva2luZyB0aGUgYGRlbGVnYXRlYCBmdW5jdGlvblxuXHQgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlbGVnYXRlIFRoZSBmdW5jdGlvbiB0byB3cmFwL2RlbGVnYXRlIHRvIHVuZGVyIHRoZSBob29kXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IHNjb3BlVmFycyBUaGUgc2NvcGUgdmFyaWFibGVzIHRvIHNwbGljZSBpbnRvIHRoZSBhcmd1bWVudHMgd2hlbiBjYWxsaW5nIHRoZSBkZWxlZ2F0ZVxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBzY29wZVZhcnMuc291cmNlVXJsIHRoZSBvbmx5IHJlYWwgcmVsZXZlbnQgc2NvcGUgdmFyaWFibGUhXG5cdCAgICogQHJldHVybiB7ZnVuY3Rpb259XG5cdCAgICovXG5cdCAgZnVuY3Rpb24gY3JlYXRlSW52b2tlcih0aGlzT2JqLCBkZWxlZ2F0ZSwgc2NvcGVWYXJzKSB7XG5cdCAgICBjb25zdCB1cmxJbnZva2VyID0gZnVuY3Rpb24gaW52b2tlciguLi5hcmdzKSB7XG5cdCAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZnVuYy1zdHlsZVxuXHQgICAgICBhcmdzLnNwbGljZSgwLCAwLCBpbnZva2VyLl9fc2NvcGVWYXJzX18pO1xuXHQgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoaW52b2tlci5fX3RoaXNPYmpfXywgYXJncyk7XG5cdCAgICB9O1xuXHQgICAgdXJsSW52b2tlci5fX2RlbGVnYXRlX18gPSBkZWxlZ2F0ZTtcblx0ICAgIHVybEludm9rZXIuX190aGlzT2JqX18gPSB0aGlzT2JqO1xuXHQgICAgdXJsSW52b2tlci5fX3Njb3BlVmFyc19fID0gc2NvcGVWYXJzO1xuXHQgICAgcmV0dXJuIHVybEludm9rZXI7XG5cdCAgfVxuXHQgIGludm9rZXIkMS5jcmVhdGVJbnZva2VyID0gY3JlYXRlSW52b2tlcjtcblx0ICByZXR1cm4gaW52b2tlciQxO1xuXHR9XG5cblx0dmFyIGludm9rZXJFeHBvcnRzID0gcmVxdWlyZUludm9rZXIoKTtcblx0dmFyIGludm9rZXIgPSAvKkBfX1BVUkVfXyovZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMoaW52b2tlckV4cG9ydHMpO1xuXG5cdC8qKlxuXHQgKiBUaXRhbml1bSBTREtcblx0ICogQ29weXJpZ2h0IFRpRGV2LCBJbmMuIDA0LzA3LzIwMjItUHJlc2VudC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBcGFjaGUgUHVibGljIExpY2Vuc2Vcblx0ICogUGxlYXNlIHNlZSB0aGUgTElDRU5TRSBpbmNsdWRlZCB3aXRoIHRoaXMgZGlzdHJpYnV0aW9uIGZvciBkZXRhaWxzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYm9vdHN0cmFwJDIoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIGNvbnN0IGFzc2V0cyA9IGtyb2xsLmJpbmRpbmcoJ2Fzc2V0cycpO1xuXHQgIGNvbnN0IFNjcmlwdCA9IGtyb2xsLmJpbmRpbmcoJ2V2YWxzJykuU2NyaXB0IDtcblxuXHQgIC8qKlxuXHQgICAqIFRoZSBsb2FkZWQgaW5kZXguanNvbiBmaWxlIGZyb20gdGhlIGFwcC4gVXNlZCB0byBzdG9yZSB0aGUgZW5jcnlwdGVkIEpTIGFzc2V0cydcblx0ICAgKiBmaWxlbmFtZXMvb2Zmc2V0cy5cblx0ICAgKi9cblx0ICBsZXQgZmlsZUluZGV4O1xuXHQgIC8vIEZJWE1FOiBmaXggZmlsZSBuYW1lIHBhcml0eSBiZXR3ZWVuIHBsYXRmb3Jtc1xuXHQgIGNvbnN0IElOREVYX0pTT04gPSAnaW5kZXguanNvbicgO1xuXHQgIGNsYXNzIE1vZHVsZSB7XG5cdCAgICAvKipcblx0ICAgICAqIFtNb2R1bGUgZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgICAgICBtb2R1bGUgaWRcblx0ICAgICAqIEBwYXJhbSB7TW9kdWxlfSBwYXJlbnQgIHBhcmVudCBtb2R1bGVcblx0ICAgICAqL1xuXHQgICAgY29uc3RydWN0b3IoaWQsIHBhcmVudCkge1xuXHQgICAgICB0aGlzLmlkID0gaWQ7XG5cdCAgICAgIHRoaXMuZXhwb3J0cyA9IHt9O1xuXHQgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblx0ICAgICAgdGhpcy5maWxlbmFtZSA9IG51bGw7XG5cdCAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdCAgICAgIHRoaXMud3JhcHBlckNhY2hlID0ge307XG5cdCAgICAgIHRoaXMuaXNTZXJ2aWNlID0gZmFsc2U7IC8vIHRvZ2dsZWQgb24gaWYgdGhpcyBtb2R1bGUgaXMgdGhlIHNlcnZpY2UgZW50cnkgcG9pbnRcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIHRoZSBtb2R1bGUuIElmIG5vIGZpbGUgaXMgZm91bmRcblx0ICAgICAqIHdpdGggdGhlIHByb3ZpZGVkIG5hbWUgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuXHQgICAgICogT25jZSB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXJlIHJlYWQsIGl0IGlzIHJ1blxuXHQgICAgICogaW4gdGhlIGN1cnJlbnQgY29udGV4dC4gQSBzYW5kYm94IGlzIGNyZWF0ZWQgYnlcblx0ICAgICAqIGV4ZWN1dGluZyB0aGUgY29kZSBpbnNpZGUgYSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHQgICAgICogVGhpcyBwcm92aWRlcyBhIHNwZWVkIGJvb3N0IHZzIGNyZWF0aW5nIGEgbmV3IGNvbnRleHQuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgIFtkZXNjcmlwdGlvbl1cblx0ICAgICAqIEByZXR1cm5zIHt2b2lkfVxuXHQgICAgICovXG5cdCAgICBsb2FkKGZpbGVuYW1lLCBzb3VyY2UpIHtcblx0ICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNb2R1bGUgYWxyZWFkeSBsb2FkZWQuJyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuXHQgICAgICB0aGlzLnBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpO1xuXHQgICAgICB0aGlzLnBhdGhzID0gdGhpcy5ub2RlTW9kdWxlc1BhdGhzKHRoaXMucGF0aCk7XG5cdCAgICAgIGlmICghc291cmNlKSB7XG5cdCAgICAgICAgc291cmNlID0gYXNzZXRzLnJlYWRBc3NldChgUmVzb3VyY2VzJHtmaWxlbmFtZX1gICk7XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBTdGljayBpdCBpbiB0aGUgY2FjaGVcblx0ICAgICAgTW9kdWxlLmNhY2hlW3RoaXMuZmlsZW5hbWVdID0gdGhpcztcblx0ICAgICAgdGhpcy5fcnVuU2NyaXB0KHNvdXJjZSwgdGhpcy5maWxlbmFtZSk7XG5cdCAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBHZW5lcmF0ZXMgYSBjb250ZXh0LXNwZWNpZmljIG1vZHVsZSB3cmFwcGVyLCBhbmQgd3JhcHNcblx0ICAgICAqIGVhY2ggaW52b2NhdGlvbiBBUEkgaW4gYW4gZXh0ZXJuYWwgKDNyZCBwYXJ0eSkgbW9kdWxlXG5cdCAgICAgKiBTZWUgaW52b2tlci5qcyBmb3IgbW9yZSBpbmZvXG5cdCAgICAgKiBAcGFyYW0gIHtvYmplY3R9IGV4dGVybmFsTW9kdWxlIG5hdGl2ZSBtb2R1bGUgcHJveHlcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gc291cmNlVXJsICAgICAgdGhlIGN1cnJlbnQgSlMgZmlsZSB1cmxcblx0ICAgICAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgd3JhcHBlciBhcm91bmQgdGhlIGV4dGVybmFsTW9kdWxlXG5cdCAgICAgKi9cblx0ICAgIGNyZWF0ZU1vZHVsZVdyYXBwZXIoZXh0ZXJuYWxNb2R1bGUsIHNvdXJjZVVybCkge1xuXG5cdCAgICAgIC8vIFRoZSBtb2R1bGUgd3JhcHBlciBmb3J3YXJkcyBvbiB1c2luZyB0aGUgb3JpZ2luYWwgYXMgYSBwcm90b3R5cGVcblx0ICAgICAgZnVuY3Rpb24gTW9kdWxlV3JhcHBlcigpIHt9XG5cdCAgICAgIE1vZHVsZVdyYXBwZXIucHJvdG90eXBlID0gZXh0ZXJuYWxNb2R1bGU7XG5cdCAgICAgIGNvbnN0IHdyYXBwZXIgPSBuZXcgTW9kdWxlV3JhcHBlcigpO1xuXHQgICAgICAvLyBIZXJlIHdlIHRha2UgdGhlIEFQSXMgZGVmaW5lZCBpbiB0aGUgYm9vdHN0cmFwLmpzXG5cdCAgICAgIC8vIGFuZCBlZmZlY3RpdmVseSBsYXppbHkgaG9vayB0aGVtXG5cdCAgICAgIC8vIFdlIGV4cGxpY2l0bHkgZ3VhcmQgdGhlIGNvZGUgc28gaU9TIGRvZXNuJ3QgZXZlbiB1c2UvaW5jbHVkZSB0aGUgcmVmZXJlbmNlZCBpbnZva2VyLmpzIGltcG9ydFxuXHQgICAgICBjb25zdCBpbnZvY2F0aW9uQVBJcyA9IGV4dGVybmFsTW9kdWxlLmludm9jYXRpb25BUElzIHx8IFtdO1xuXHQgICAgICBmb3IgKGNvbnN0IGFwaSBvZiBpbnZvY2F0aW9uQVBJcykge1xuXHQgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gZXh0ZXJuYWxNb2R1bGVbYXBpXTtcblx0ICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgd3JhcHBlclthcGldID0gaW52b2tlci5jcmVhdGVJbnZva2VyKGV4dGVybmFsTW9kdWxlLCBkZWxlZ2F0ZSwgbmV3IGtyb2xsLlNjb3BlVmFycyh7XG5cdCAgICAgICAgICBzb3VyY2VVcmxcblx0ICAgICAgICB9KSk7XG5cdCAgICAgIH1cblx0ICAgICAgd3JhcHBlci5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0ICAgICAgICBleHRlcm5hbE1vZHVsZS5hZGRFdmVudExpc3RlbmVyLmFwcGx5KGV4dGVybmFsTW9kdWxlLCBhcmdzKTtcblx0ICAgICAgfTtcblx0ICAgICAgd3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0ICAgICAgICBleHRlcm5hbE1vZHVsZS5yZW1vdmVFdmVudExpc3RlbmVyLmFwcGx5KGV4dGVybmFsTW9kdWxlLCBhcmdzKTtcblx0ICAgICAgfTtcblx0ICAgICAgd3JhcHBlci5maXJlRXZlbnQgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuXHQgICAgICAgIGV4dGVybmFsTW9kdWxlLmZpcmVFdmVudC5hcHBseShleHRlcm5hbE1vZHVsZSwgYXJncyk7XG5cdCAgICAgIH07XG5cdCAgICAgIHJldHVybiB3cmFwcGVyO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIFRha2VzIGEgQ29tbW9uSlMgbW9kdWxlIGFuZCB1c2VzIGl0IHRvIGV4dGVuZCBhbiBleGlzdGluZyBleHRlcm5hbC9uYXRpdmUgbW9kdWxlLiBUaGUgZXhwb3J0cyBhcmUgYWRkZWQgdG8gdGhlIGV4dGVybmFsIG1vZHVsZS5cblx0ICAgICAqIEBwYXJhbSAge09iamVjdH0gZXh0ZXJuYWxNb2R1bGUgVGhlIGV4dGVybmFsL25hdGl2ZSBtb2R1bGUgd2UncmUgZXh0ZW5kaW5nXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgICAgICAgICAgIG1vZHVsZSBpZFxuXHQgICAgICovXG5cdCAgICBleHRlbmRNb2R1bGVXaXRoQ29tbW9uSnMoZXh0ZXJuYWxNb2R1bGUsIGlkKSB7XG5cdCAgICAgIGlmICgha3JvbGwuaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlKGlkKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIExvYWQgdW5kZXIgZmFrZSBuYW1lLCBvciB0aGUgY29tbW9uanMgc2lkZSBvZiB0aGUgbmF0aXZlIG1vZHVsZSBnZXRzIGNhY2hlZCBpbiBwbGFjZSBvZiB0aGUgbmF0aXZlIG1vZHVsZSFcblx0ICAgICAgLy8gU2VlIFRJTU9CLTI0OTMyXG5cdCAgICAgIGNvbnN0IGZha2VJZCA9IGAke2lkfS5jb21tb25qc2A7XG5cdCAgICAgIGNvbnN0IGpzTW9kdWxlID0gbmV3IE1vZHVsZShmYWtlSWQsIHRoaXMpO1xuXHQgICAgICBqc01vZHVsZS5sb2FkKGZha2VJZCwga3JvbGwuZ2V0RXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCkpO1xuXHQgICAgICBpZiAoanNNb2R1bGUuZXhwb3J0cykge1xuXHQgICAgICAgIGNvbnNvbGUudHJhY2UoYEV4dGVuZGluZyBuYXRpdmUgbW9kdWxlICcke2lkfScgd2l0aCB0aGUgQ29tbW9uSlMgbW9kdWxlIHRoYXQgd2FzIHBhY2thZ2VkIHdpdGggaXQuYCk7XG5cdCAgICAgICAga3JvbGwuZXh0ZW5kKGV4dGVybmFsTW9kdWxlLCBqc01vZHVsZS5leHBvcnRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIExvYWRzIGEgbmF0aXZlIC8gZXh0ZXJuYWwgKDNyZCBwYXJ0eSkgbW9kdWxlXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgICAgICAgICAgICBtb2R1bGUgaWRcblx0ICAgICAqIEBwYXJhbSAge29iamVjdH0gZXh0ZXJuYWxCaW5kaW5nIGV4dGVybmFsIGJpbmRpbmcgb2JqZWN0XG5cdCAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICBUaGUgZXhwb3J0ZWQgbW9kdWxlXG5cdCAgICAgKi9cblx0ICAgIGxvYWRFeHRlcm5hbE1vZHVsZShpZCwgZXh0ZXJuYWxCaW5kaW5nKSB7XG5cdCAgICAgIC8vIHRyeSB0byBnZXQgdGhlIGNhY2hlZCBtb2R1bGUuLi5cblx0ICAgICAgbGV0IGV4dGVybmFsTW9kdWxlID0gTW9kdWxlLmNhY2hlW2lkXTtcblx0ICAgICAgaWYgKCFleHRlcm5hbE1vZHVsZSkge1xuXHQgICAgICAgIC8vIGlPUyBhbmQgQW5kcm9pZCBkaWZmZXIgcXVpdGUgYSBiaXQgaGVyZS5cblx0ICAgICAgICAvLyBXaXRoIGlvcywgd2Ugc2hvdWxkIGFscmVhZHkgaGF2ZSB0aGUgbmF0aXZlIG1vZHVsZSBsb2FkZWRcblx0ICAgICAgICAvLyBUaGVyZSdzIG5vIHNwZWNpYWwgXCJib290c3RyYXAuanNcIiBmaWxlIHBhY2thZ2VkIHdpdGhpbiBpdFxuXHQgICAgICAgIC8vIE9uIEFuZHJvaWQsIHdlIGxvYWQgYSBib290c3RyYXAuanMgYnVuZGxlZCB3aXRoIHRoZSBtb2R1bGVcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBwcm9jZXNzIGZvciBBbmRyb2lkLCBmaXJzdCBncmFiIHRoZSBib290c3RyYXAgc291cmNlXG5cdCAgICAgICAgICBjb25zdCBzb3VyY2UgPSBleHRlcm5hbEJpbmRpbmcuYm9vdHN0cmFwO1xuXG5cdCAgICAgICAgICAvLyBMb2FkIHRoZSBuYXRpdmUgbW9kdWxlJ3MgYm9vdHN0cmFwIEpTXG5cdCAgICAgICAgICBjb25zdCBtb2R1bGUgPSBuZXcgTW9kdWxlKGlkLCB0aGlzKTtcblx0ICAgICAgICAgIG1vZHVsZS5sb2FkKGAke2lkfS9ib290c3RyYXAuanNgLCBzb3VyY2UpO1xuXG5cdCAgICAgICAgICAvLyBCb290c3RyYXAgYW5kIGxvYWQgdGhlIG1vZHVsZSB1c2luZyB0aGUgbmF0aXZlIGJpbmRpbmdzXG5cdCAgICAgICAgICBjb25zdCByZXN1bHQgPSBtb2R1bGUuZXhwb3J0cy5ib290c3RyYXAoZXh0ZXJuYWxCaW5kaW5nKTtcblxuXHQgICAgICAgICAgLy8gQ2FjaGUgdGhlIGV4dGVybmFsIG1vZHVsZSBpbnN0YW5jZSBhZnRlciBpdCdzIGJlZW4gbW9kaWZpZWQgYnkgaXQncyBib290c3RyYXAgc2NyaXB0XG5cdCAgICAgICAgICBleHRlcm5hbE1vZHVsZSA9IHJlc3VsdDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKCFleHRlcm5hbE1vZHVsZSkge1xuXHQgICAgICAgIGNvbnNvbGUudHJhY2UoYFVuYWJsZSB0byBsb2FkIGV4dGVybmFsIG1vZHVsZTogJHtpZH1gKTtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIGNhY2hlIHRoZSBsb2FkZWQgbmF0aXZlIG1vZHVsZSAoYmVmb3JlIHdlIGV4dGVuZCBpdClcblx0ICAgICAgTW9kdWxlLmNhY2hlW2lkXSA9IGV4dGVybmFsTW9kdWxlO1xuXG5cdCAgICAgIC8vIFdlIGNhY2hlIGVhY2ggY29udGV4dC1zcGVjaWZpYyBtb2R1bGUgd3JhcHBlclxuXHQgICAgICAvLyBvbiB0aGUgcGFyZW50IG1vZHVsZSwgcmF0aGVyIHRoYW4gaW4gdGhlIE1vZHVsZS5jYWNoZVxuXHQgICAgICBsZXQgd3JhcHBlciA9IHRoaXMud3JhcHBlckNhY2hlW2lkXTtcblx0ICAgICAgaWYgKHdyYXBwZXIpIHtcblx0ICAgICAgICByZXR1cm4gd3JhcHBlcjtcblx0ICAgICAgfVxuXHQgICAgICBjb25zdCBzb3VyY2VVcmwgPSBgYXBwOi8vJHt0aGlzLmZpbGVuYW1lfWA7IC8vIEZJWE1FOiBJZiB0aGlzLmZpbGVuYW1lIHN0YXJ0cyB3aXRoICcvJywgd2UgbmVlZCB0byBkcm9wIGl0LCBJIHRoaW5rP1xuXHQgICAgICB3cmFwcGVyID0gdGhpcy5jcmVhdGVNb2R1bGVXcmFwcGVyKGV4dGVybmFsTW9kdWxlLCBzb3VyY2VVcmwpO1xuXG5cdCAgICAgIC8vIFRoZW4gd2UgXCJleHRlbmRcIiB0aGUgQVBJL21vZHVsZSB1c2luZyBhbnkgc2hpcHBlZCBKUyBjb2RlIChhc3NldHMvPG1vZHVsZS5pZD4uanMpXG5cdCAgICAgIHRoaXMuZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzKHdyYXBwZXIsIGlkKTtcblx0ICAgICAgdGhpcy53cmFwcGVyQ2FjaGVbaWRdID0gd3JhcHBlcjtcblx0ICAgICAgcmV0dXJuIHdyYXBwZXI7XG5cdCAgICB9XG5cblx0ICAgIC8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvYXBpL21vZHVsZXMuaHRtbCNtb2R1bGVzX2FsbF90b2dldGhlclxuXG5cdCAgICAvKipcblx0ICAgICAqIFJlcXVpcmUgYW5vdGhlciBtb2R1bGUgYXMgYSBjaGlsZCBvZiB0aGlzIG1vZHVsZS5cblx0ICAgICAqIFRoaXMgcGFyZW50IG1vZHVsZSdzIHBhdGggaXMgdXNlZCBhcyB0aGUgYmFzZSBmb3IgcmVsYXRpdmUgcGF0aHNcblx0ICAgICAqIHdoZW4gbG9hZGluZyB0aGUgY2hpbGQuIFJldHVybnMgdGhlIGV4cG9ydHMgb2JqZWN0XG5cdCAgICAgKiBvZiB0aGUgY2hpbGQgbW9kdWxlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVxdWVzdCAgVGhlIHBhdGggdG8gdGhlIHJlcXVlc3RlZCBtb2R1bGVcblx0ICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVGhlIGxvYWRlZCBtb2R1bGVcblx0ICAgICAqL1xuXHQgICAgcmVxdWlyZShyZXF1ZXN0KSB7XG5cdCAgICAgIC8vIDIuIElmIFggYmVnaW5zIHdpdGggJy4vJyBvciAnLycgb3IgJy4uLydcblx0ICAgICAgY29uc3Qgc3RhcnQgPSByZXF1ZXN0LnN1YnN0cmluZygwLCAyKTsgLy8gaGFjayB1cCB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZyB0byBjaGVjayByZWxhdGl2ZS9hYnNvbHV0ZS9cIm5ha2VkXCIgbW9kdWxlIGlkXG5cdCAgICAgIGlmIChzdGFydCA9PT0gJy4vJyB8fCBzdGFydCA9PT0gJy4uJykge1xuXHQgICAgICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGgubm9ybWFsaXplKHRoaXMucGF0aCArICcvJyArIHJlcXVlc3QpKTtcblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIC8vIFJvb3QvYWJzb2x1dGUgcGF0aCAoaW50ZXJuYWxseSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUsIHdlIHByZXBlbmQgXCJSZXNvdXJjZXMvXCIgYXMgcm9vdCBkaXIpXG5cdCAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5zdWJzdHJpbmcoMCwgMSkgPT09ICcvJykge1xuXHQgICAgICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGgubm9ybWFsaXplKHJlcXVlc3QpKTtcblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8vIERlc3BpdGUgYmVpbmcgc3RlcCAxIGluIE5vZGUuSlMgcHN1ZWRvLWNvZGUsIHdlIG1vdmVkIGl0IGRvd24gaGVyZSBiZWNhdXNlIHdlIGRvbid0IGFsbG93IG5hdGl2ZSBtb2R1bGVzXG5cdCAgICAgICAgLy8gdG8gc3RhcnQgd2l0aCAnLi8nLCAnLi4nIG9yICcvJyAtIHNvIHRoaXMgYXZvaWRzIGEgbG90IG9mIG1pc3NlcyBvbiByZXF1aXJlcyBzdGFydGluZyB0aGF0IHdheVxuXG5cdCAgICAgICAgLy8gMS4gSWYgWCBpcyBhIGNvcmUgbW9kdWxlLFxuXHQgICAgICAgIGxldCBsb2FkZWQgPSB0aGlzLmxvYWRDb3JlTW9kdWxlKHJlcXVlc3QpO1xuXHQgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgIC8vIGEuIHJldHVybiB0aGUgY29yZSBtb2R1bGVcblx0ICAgICAgICAgIC8vIGIuIFNUT1Bcblx0ICAgICAgICAgIHJldHVybiBsb2FkZWQ7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gTG9vayBmb3IgQ29tbW9uSlMgbW9kdWxlXG5cdCAgICAgICAgaWYgKHJlcXVlc3QuaW5kZXhPZignLycpID09PSAtMSkge1xuXHQgICAgICAgICAgLy8gRm9yIENvbW1vbkpTIHdlIG5lZWQgdG8gbG9vayBmb3IgbW9kdWxlLmlkL21vZHVsZS5pZC5qcyBmaXJzdC4uLlxuXHQgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBgLyR7cmVxdWVzdH0vJHtyZXF1ZXN0fS5qc2A7XG5cdCAgICAgICAgICAvLyBPbmx5IGxvb2sgZm9yIHRoaXMgX2V4YWN0IGZpbGVfLiBETyBOT1QgQVBQRU5EIC5qcyBvciAuanNvbiB0byBpdCFcblx0ICAgICAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRKYXZhc2NyaXB0VGV4dChmaWxlbmFtZSk7XG5cdCAgICAgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgLy8gVGhlbiB0cnkgbW9kdWxlLmlkIGFzIGRpcmVjdG9yeVxuXHQgICAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkQXNEaXJlY3RvcnkoYC8ke3JlcXVlc3R9YCk7XG5cdCAgICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBBbGxvdyBsb29raW5nIHRocm91Z2ggbm9kZV9tb2R1bGVzXG5cdCAgICAgICAgLy8gMy4gTE9BRF9OT0RFX01PRFVMRVMoWCwgZGlybmFtZShZKSlcblx0ICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWROb2RlTW9kdWxlcyhyZXF1ZXN0LCB0aGlzLnBhdGhzKTtcblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gRmFsbGJhY2sgdG8gb2xkIFRpdGFuaXVtIGJlaGF2aW9yIG9mIGFzc3VtaW5nIGl0J3MgYWN0dWFsbHkgYW4gYWJzb2x1dGUgcGF0aFxuXG5cdCAgICAgICAgLy8gV2UnZCBsaWtlIHRvIHdhcm4gdXNlcnMgYWJvdXQgbGVnYWN5IHN0eWxlIHJlcXVpcmUgc3ludGF4IHNvIHRoZXkgY2FuIHVwZGF0ZSwgYnV0IHRoZSBuZXcgc3ludGF4IGlzIG5vdCBiYWNrd2FyZHMgY29tcGF0aWJsZS5cblx0ICAgICAgICAvLyBTbyBmb3Igbm93LCBsZXQncyBqdXN0IGJlIHF1aXRlIGFib3V0IGl0LiBJbiBmdXR1cmUgdmVyc2lvbnMgb2YgdGhlIFNESyAoNy4wPykgd2Ugc2hvdWxkIHdhcm4gKG9uY2UgNS54IGlzIGVuZCBvZiBsaWZlIHNvIGJhY2t3YXJkcyBjb21wYXQgaXMgbm90IG5lY2Vzc2FyeSlcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuXHQgICAgICAgIC8vIGNvbnNvbGUud2FybihgcmVxdWlyZSBjYWxsZWQgd2l0aCB1bi1wcmVmaXhlZCBtb2R1bGUgaWQ6ICR7cmVxdWVzdH0sIHNob3VsZCBiZSBhIGNvcmUgb3IgQ29tbW9uSlMgbW9kdWxlLiBGYWxsaW5nIGJhY2sgdG8gb2xkIFRpIGJlaGF2aW9yIGFuZCBhc3N1bWluZyBpdCdzIGFuIGFic29sdXRlIHBhdGg6IC8ke3JlcXVlc3R9YCk7XG5cblx0ICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLm5vcm1hbGl6ZShgLyR7cmVxdWVzdH1gKSk7XG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIDQuIFRIUk9XIFwibm90IGZvdW5kXCJcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXF1ZXN0ZWQgbW9kdWxlIG5vdCBmb3VuZDogJHtyZXF1ZXN0fWApOyAvLyBUT0RPIFNldCAnY29kZScgcHJvcGVydHkgdG8gJ01PRFVMRV9OT1RfRk9VTkQnIHRvIG1hdGNoIE5vZGU/XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgdGhlIGNvcmUgbW9kdWxlIGlmIGl0IGV4aXN0cy4gSWYgbm90LCByZXR1cm5zIG51bGwuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSAgaWQgVGhlIHJlcXVlc3QgbW9kdWxlIGlkXG5cdCAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIHRydWUgaWYgdGhlIG1vZHVsZSBpZCBtYXRjaGVzIGEgbmF0aXZlIG9yIENvbW1vbkpTIG1vZHVsZSBpZCwgKG9yIGl0J3MgZmlyc3QgcGF0aCBzZWdtZW50IGRvZXMpLlxuXHQgICAgICovXG5cdCAgICBsb2FkQ29yZU1vZHVsZShpZCkge1xuXHQgICAgICAvLyBza2lwIGJhZCBpZHMsIHJlbGF0aXZlIGlkcywgYWJzb2x1dGUgaWRzLiBcIm5hdGl2ZVwiL1wiY29yZVwiIG1vZHVsZXMgc2hvdWxkIGJlIG9mIGZvcm0gXCJtb2R1bGUuaWRcIiBvciBcIm1vZHVsZS5pZC9zdWIuZmlsZS5qc1wiXG5cdCAgICAgIGlmICghaWQgfHwgaWQuc3RhcnRzV2l0aCgnLicpIHx8IGlkLnN0YXJ0c1dpdGgoJy8nKSkge1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICB9XG5cblx0ICAgICAgLy8gY2hlY2sgaWYgd2UgaGF2ZSBhIGNhY2hlZCBjb3B5IG9mIHRoZSB3cmFwcGVyXG5cdCAgICAgIGlmICh0aGlzLndyYXBwZXJDYWNoZVtpZF0pIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy53cmFwcGVyQ2FjaGVbaWRdO1xuXHQgICAgICB9XG5cdCAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy8nKTtcblx0ICAgICAgY29uc3QgZXh0ZXJuYWxCaW5kaW5nID0ga3JvbGwuZXh0ZXJuYWxCaW5kaW5nKHBhcnRzWzBdKTtcblx0ICAgICAgaWYgKGV4dGVybmFsQmluZGluZykge1xuXHQgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIFwicm9vdFwiIG9mIGFuIGV4dGVybmFsIG1vZHVsZS4gSXQgY2FuIGxvb2sgbGlrZTpcblx0ICAgICAgICAgIC8vIHJlcXVlc3QoXCJjb20uZXhhbXBsZS5teW1vZHVsZVwiKVxuXHQgICAgICAgICAgLy8gV2UgY2FuIGxvYWQgYW5kIHJldHVybiBpdCByaWdodCBhd2F5IChjYWNoaW5nIG9jY3VycyBpbiB0aGUgY2FsbGVkIGZ1bmN0aW9uKS5cblx0ICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRFeHRlcm5hbE1vZHVsZShwYXJ0c1swXSwgZXh0ZXJuYWxCaW5kaW5nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBDb3VsZCBiZSBhIHN1Yi1tb2R1bGUgKENvbW1vbkpTKSBvZiBhbiBleHRlcm5hbCBuYXRpdmUgbW9kdWxlLlxuXHQgICAgICAgIC8vIFdlIGFsbG93IHRoYXQgc2luY2UgVElNT0ItOTczMC5cblx0ICAgICAgICBpZiAoa3JvbGwuaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlKHBhcnRzWzBdKSkge1xuXHQgICAgICAgICAgY29uc3QgZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzID0ga3JvbGwuZ2V0RXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCk7XG5cdCAgICAgICAgICBpZiAoZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzKSB7XG5cdCAgICAgICAgICAgIC8vIGZvdW5kIGl0XG5cdCAgICAgICAgICAgIC8vIEZJWE1FIFJlLXVzZSBsb2FkQXNKYXZhU2NyaXB0VGV4dD9cblx0ICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShpZCwgdGhpcyk7XG5cdCAgICAgICAgICAgIG1vZHVsZS5sb2FkKGlkLCBleHRlcm5hbENvbW1vbkpzQ29udGVudHMpO1xuXHQgICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBudWxsOyAvLyBmYWlsZWQgdG8gbG9hZFxuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYSBub2RlIG1vZHVsZSBieSBpZCBmcm9tIHRoZSBzdGFydGluZyBwYXRoXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG1vZHVsZUlkICAgICAgIFRoZSBwYXRoIG9mIHRoZSBtb2R1bGUgdG8gbG9hZC5cblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ1tdfSBkaXJzICAgICAgIHBhdGhzIHRvIHNlYXJjaFxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfG51bGx9ICAgICAgVGhlIG1vZHVsZSwgaWYgbG9hZGVkLiBudWxsIGlmIG5vdC5cblx0ICAgICAqL1xuXHQgICAgbG9hZE5vZGVNb2R1bGVzKG1vZHVsZUlkLCBkaXJzKSB7XG5cdCAgICAgIC8vIDIuIGZvciBlYWNoIERJUiBpbiBESVJTOlxuXHQgICAgICBmb3IgKGNvbnN0IGRpciBvZiBkaXJzKSB7XG5cdCAgICAgICAgLy8gYS4gTE9BRF9BU19GSUxFKERJUi9YKVxuXHQgICAgICAgIC8vIGIuIExPQURfQVNfRElSRUNUT1JZKERJUi9YKVxuXHQgICAgICAgIGNvbnN0IG1vZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGguam9pbihkaXIsIG1vZHVsZUlkKSk7XG5cdCAgICAgICAgaWYgKG1vZCkge1xuXHQgICAgICAgICAgcmV0dXJuIG1vZDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogRGV0ZXJtaW5lIHRoZSBzZXQgb2YgcGF0aHMgdG8gc2VhcmNoIGZvciBub2RlX21vZHVsZXNcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gc3RhcnREaXIgICAgICAgVGhlIHN0YXJ0aW5nIGRpcmVjdG9yeVxuXHQgICAgICogQHJldHVybiB7c3RyaW5nW119ICAgICAgICAgICAgICBUaGUgYXJyYXkgb2YgcGF0aHMgdG8gc2VhcmNoXG5cdCAgICAgKi9cblx0ICAgIG5vZGVNb2R1bGVzUGF0aHMoc3RhcnREaXIpIHtcblx0ICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYW4gYWJzb2x1dGUgcGF0aCB0byBzdGFydCB3aXRoXG5cdCAgICAgIHN0YXJ0RGlyID0gcGF0aC5yZXNvbHZlKHN0YXJ0RGlyKTtcblxuXHQgICAgICAvLyBSZXR1cm4gZWFybHkgaWYgd2UgYXJlIGF0IHJvb3QsIHRoaXMgYXZvaWRzIGRvaW5nIGEgcG9pbnRsZXNzIGxvb3Bcblx0ICAgICAgLy8gYW5kIGFsc28gcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggZHVwbGljYXRlIGVudHJpZXNcblx0ICAgICAgLy8gZS5nLiBbXCIvbm9kZV9tb2R1bGVzXCIsIFwiL25vZGVfbW9kdWxlc1wiXVxuXHQgICAgICBpZiAoc3RhcnREaXIgPT09ICcvJykge1xuXHQgICAgICAgIHJldHVybiBbJy9ub2RlX21vZHVsZXMnXTtcblx0ICAgICAgfVxuXHQgICAgICAvLyAxLiBsZXQgUEFSVFMgPSBwYXRoIHNwbGl0KFNUQVJUKVxuXHQgICAgICBjb25zdCBwYXJ0cyA9IHN0YXJ0RGlyLnNwbGl0KCcvJyk7XG5cdCAgICAgIC8vIDIuIGxldCBJID0gY291bnQgb2YgUEFSVFMgLSAxXG5cdCAgICAgIGxldCBpID0gcGFydHMubGVuZ3RoIC0gMTtcblx0ICAgICAgLy8gMy4gbGV0IERJUlMgPSBbXVxuXHQgICAgICBjb25zdCBkaXJzID0gW107XG5cblx0ICAgICAgLy8gNC4gd2hpbGUgSSA+PSAwLFxuXHQgICAgICB3aGlsZSAoaSA+PSAwKSB7XG5cdCAgICAgICAgLy8gYS4gaWYgUEFSVFNbSV0gPSBcIm5vZGVfbW9kdWxlc1wiIENPTlRJTlVFXG5cdCAgICAgICAgaWYgKHBhcnRzW2ldID09PSAnbm9kZV9tb2R1bGVzJyB8fCBwYXJ0c1tpXSA9PT0gJycpIHtcblx0ICAgICAgICAgIGkgLT0gMTtcblx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICAvLyBiLiBESVIgPSBwYXRoIGpvaW4oUEFSVFNbMCAuLiBJXSArIFwibm9kZV9tb2R1bGVzXCIpXG5cdCAgICAgICAgY29uc3QgZGlyID0gcGF0aC5qb2luKHBhcnRzLnNsaWNlKDAsIGkgKyAxKS5qb2luKCcvJyksICdub2RlX21vZHVsZXMnKTtcblx0ICAgICAgICAvLyBjLiBESVJTID0gRElSUyArIERJUlxuXHQgICAgICAgIGRpcnMucHVzaChkaXIpO1xuXHQgICAgICAgIC8vIGQuIGxldCBJID0gSSAtIDFcblx0ICAgICAgICBpIC09IDE7XG5cdCAgICAgIH1cblx0ICAgICAgLy8gQWx3YXlzIGFkZCAvbm9kZV9tb2R1bGVzIHRvIHRoZSBzZWFyY2ggcGF0aFxuXHQgICAgICBkaXJzLnB1c2goJy9ub2RlX21vZHVsZXMnKTtcblx0ICAgICAgcmV0dXJuIGRpcnM7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhIGdpdmVuIHBhdGggYXMgYSBmaWxlIG9yIGRpcmVjdG9yeS5cblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gbm9ybWFsaXplZFBhdGggVGhlIHBhdGggb2YgdGhlIG1vZHVsZSB0byBsb2FkLlxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfG51bGx9IFRoZSBsb2FkZWQgbW9kdWxlLiBudWxsIGlmIHVuYWJsZSB0byBsb2FkLlxuXHQgICAgICovXG5cdCAgICBsb2FkQXNGaWxlT3JEaXJlY3Rvcnkobm9ybWFsaXplZFBhdGgpIHtcblx0ICAgICAgLy8gYS4gTE9BRF9BU19GSUxFKFkgKyBYKVxuXHQgICAgICBsZXQgbG9hZGVkID0gdGhpcy5sb2FkQXNGaWxlKG5vcm1hbGl6ZWRQYXRoKTtcblx0ICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgIHJldHVybiBsb2FkZWQ7XG5cdCAgICAgIH1cblx0ICAgICAgLy8gYi4gTE9BRF9BU19ESVJFQ1RPUlkoWSArIFgpXG5cdCAgICAgIGxvYWRlZCA9IHRoaXMubG9hZEFzRGlyZWN0b3J5KG5vcm1hbGl6ZWRQYXRoKTtcblx0ICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgIHJldHVybiBsb2FkZWQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgYSBnaXZlbiBmaWxlIGFzIGEgSmF2YXNjcmlwdCBmaWxlLCByZXR1cm5pbmcgdGhlIG1vZHVsZS5leHBvcnRzLlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBmaWxlbmFtZSBGaWxlIHdlJ3JlIGF0dGVtcHRpbmcgdG8gbG9hZFxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfSB0aGUgbG9hZGVkIG1vZHVsZVxuXHQgICAgICovXG5cdCAgICBsb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpIHtcblx0ICAgICAgLy8gTG9vayBpbiB0aGUgY2FjaGUhXG5cdCAgICAgIGlmIChNb2R1bGUuY2FjaGVbZmlsZW5hbWVdKSB7XG5cdCAgICAgICAgcmV0dXJuIE1vZHVsZS5jYWNoZVtmaWxlbmFtZV07XG5cdCAgICAgIH1cblx0ICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShmaWxlbmFtZSwgdGhpcyk7XG5cdCAgICAgIG1vZHVsZS5sb2FkKGZpbGVuYW1lKTtcblx0ICAgICAgcmV0dXJuIG1vZHVsZTtcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBMb2FkcyBhIEpTT04gZmlsZSBieSByZWFkaW5nIGl0J3MgY29udGVudHMsIGRvaW5nIGEgSlNPTi5wYXJzZSBhbmQgcmV0dXJuaW5nIHRoZSBwYXJzZWQgb2JqZWN0LlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgRmlsZSB3ZSdyZSBhdHRlbXB0aW5nIHRvIGxvYWRcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZX0gVGhlIGxvYWRlZCBtb2R1bGUgaW5zdGFuY2Vcblx0ICAgICAqL1xuXHQgICAgbG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpIHtcblx0ICAgICAgLy8gTG9vayBpbiB0aGUgY2FjaGUhXG5cdCAgICAgIGlmIChNb2R1bGUuY2FjaGVbZmlsZW5hbWVdKSB7XG5cdCAgICAgICAgcmV0dXJuIE1vZHVsZS5jYWNoZVtmaWxlbmFtZV07XG5cdCAgICAgIH1cblx0ICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShmaWxlbmFtZSwgdGhpcyk7XG5cdCAgICAgIG1vZHVsZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuXHQgICAgICBtb2R1bGUucGF0aCA9IHBhdGguZGlybmFtZShmaWxlbmFtZSk7XG5cdCAgICAgIGNvbnN0IHNvdXJjZSA9IGFzc2V0cy5yZWFkQXNzZXQoYFJlc291cmNlcyR7ZmlsZW5hbWV9YCApO1xuXG5cdCAgICAgIC8vIFN0aWNrIGl0IGluIHRoZSBjYWNoZVxuXHQgICAgICBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdID0gbW9kdWxlO1xuXHQgICAgICBtb2R1bGUuZXhwb3J0cyA9IEpTT04ucGFyc2Uoc291cmNlKTtcblx0ICAgICAgbW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cdCAgICAgIHJldHVybiBtb2R1bGU7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhIGZpbGUgYnkgaXQncyBmdWxsIGZpbGVuYW1lIGFjY29yZGluZyB0byBOb2RlSlMgcnVsZXMuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBpZCBUaGUgZmlsZW5hbWVcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSBNb2R1bGUgaW5zdGFuY2UgaWYgbG9hZGVkLCBudWxsIGlmIG5vdCBmb3VuZC5cblx0ICAgICAqL1xuXHQgICAgbG9hZEFzRmlsZShpZCkge1xuXHQgICAgICAvLyAxLiBJZiBYIGlzIGEgZmlsZSwgbG9hZCBYIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1Bcblx0ICAgICAgbGV0IGZpbGVuYW1lID0gaWQ7XG5cdCAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgIC8vIElmIHRoZSBmaWxlIGhhcyBhIC5qc29uIGV4dGVuc2lvbiwgbG9hZCBhcyBKYXZhc2NyaXB0T2JqZWN0XG5cdCAgICAgICAgaWYgKGZpbGVuYW1lLmxlbmd0aCA+IDUgJiYgZmlsZW5hbWUuc2xpY2UoLTQpID09PSAnanNvbicpIHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfVxuXHQgICAgICAvLyAyLiBJZiBYLmpzIGlzIGEgZmlsZSwgbG9hZCBYLmpzIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1Bcblx0ICAgICAgZmlsZW5hbWUgPSBpZCArICcuanMnO1xuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIDMuIElmIFguanNvbiBpcyBhIGZpbGUsIHBhcnNlIFguanNvbiB0byBhIEphdmFTY3JpcHQgT2JqZWN0LiAgU1RPUFxuXHQgICAgICBmaWxlbmFtZSA9IGlkICsgJy5qc29uJztcblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIGZhaWxlZCB0byBsb2FkIGFueXRoaW5nIVxuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgZGlyZWN0b3J5IGFjY29yZGluZyB0byBOb2RlSlMgcnVsZXMuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBpZCBUaGUgZGlyZWN0b3J5IG5hbWVcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSBMb2FkZWQgbW9kdWxlLCBudWxsIGlmIG5vdCBmb3VuZC5cblx0ICAgICAqL1xuXHQgICAgbG9hZEFzRGlyZWN0b3J5KGlkKSB7XG5cdCAgICAgIC8vIDEuIElmIFgvcGFja2FnZS5qc29uIGlzIGEgZmlsZSxcblx0ICAgICAgbGV0IGZpbGVuYW1lID0gcGF0aC5yZXNvbHZlKGlkLCAncGFja2FnZS5qc29uJyk7XG5cdCAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgIC8vIGEuIFBhcnNlIFgvcGFja2FnZS5qc29uLCBhbmQgbG9vayBmb3IgXCJtYWluXCIgZmllbGQuXG5cdCAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cdCAgICAgICAgaWYgKG9iamVjdCAmJiBvYmplY3QuZXhwb3J0cyAmJiBvYmplY3QuZXhwb3J0cy5tYWluKSB7XG5cdCAgICAgICAgICAvLyBiLiBsZXQgTSA9IFggKyAoanNvbiBtYWluIGZpZWxkKVxuXHQgICAgICAgICAgY29uc3QgbSA9IHBhdGgucmVzb2x2ZShpZCwgb2JqZWN0LmV4cG9ydHMubWFpbik7XG5cdCAgICAgICAgICAvLyBjLiBMT0FEX0FTX0ZJTEUoTSlcblx0ICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShtKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyAyLiBJZiBYL2luZGV4LmpzIGlzIGEgZmlsZSwgbG9hZCBYL2luZGV4LmpzIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1Bcblx0ICAgICAgZmlsZW5hbWUgPSBwYXRoLnJlc29sdmUoaWQsICdpbmRleC5qcycpO1xuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIDMuIElmIFgvaW5kZXguanNvbiBpcyBhIGZpbGUsIHBhcnNlIFgvaW5kZXguanNvbiB0byBhIEphdmFTY3JpcHQgb2JqZWN0LiBTVE9QXG5cdCAgICAgIGZpbGVuYW1lID0gcGF0aC5yZXNvbHZlKGlkLCAnaW5kZXguanNvbicpO1xuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogU2V0dXAgYSBzYW5kYm94IGFuZCBydW4gdGhlIG1vZHVsZSdzIHNjcmlwdCBpbnNpZGUgaXQuXG5cdCAgICAgKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGV4ZWN1dGVkIHNjcmlwdC5cblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlICAgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAgICAgKi9cblx0ICAgIF9ydW5TY3JpcHQoc291cmNlLCBmaWxlbmFtZSkge1xuXHQgICAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgICAgZnVuY3Rpb24gcmVxdWlyZShwYXRoKSB7XG5cdCAgICAgICAgcmV0dXJuIHNlbGYucmVxdWlyZShwYXRoKTtcblx0ICAgICAgfVxuXHQgICAgICByZXF1aXJlLm1haW4gPSBNb2R1bGUubWFpbjtcblxuXHQgICAgICAvLyBUaGlzIFwiZmlyc3QgdGltZVwiIHJ1biBpcyByZWFsbHkgb25seSBmb3IgYXBwLmpzLCBBRkFJQ1QsIGFuZCBuZWVkc1xuXHQgICAgICAvLyBhbiBhY3Rpdml0eS4gSWYgYXBwIHdhcyByZXN0YXJ0ZWQgZm9yIFNlcnZpY2Ugb25seSwgd2UgZG9uJ3Qgd2FudFxuXHQgICAgICAvLyB0byBnbyB0aGlzIHJvdXRlLiBTbyBhZGRlZCBjdXJyZW50QWN0aXZpdHkgY2hlY2suIChiaWxsKVxuXHQgICAgICBpZiAoc2VsZi5pZCA9PT0gJy4nICYmICF0aGlzLmlzU2VydmljZSkge1xuXHQgICAgICAgIGdsb2JhbC5yZXF1aXJlID0gcmVxdWlyZTtcblxuXHQgICAgICAgIC8vIGNoZWNrIGlmIHdlIGhhdmUgYW4gaW5zcGVjdG9yIGJpbmRpbmcuLi5cblx0ICAgICAgICBjb25zdCBpbnNwZWN0b3IgPSBrcm9sbC5iaW5kaW5nKCdpbnNwZWN0b3InKTtcblx0ICAgICAgICBpZiAoaW5zcGVjdG9yKSB7XG5cdCAgICAgICAgICAvLyBJZiBkZWJ1Z2dlciBpcyBlbmFibGVkLCBsb2FkIGFwcC5qcyBhbmQgcGF1c2UgcmlnaHQgYmVmb3JlIHdlIGV4ZWN1dGUgaXRcblx0ICAgICAgICAgIGNvbnN0IGluc3BlY3RvcldyYXBwZXIgPSBpbnNwZWN0b3IuY2FsbEFuZFBhdXNlT25TdGFydDtcblx0ICAgICAgICAgIGlmIChpbnNwZWN0b3JXcmFwcGVyKSB7XG5cdCAgICAgICAgICAgIC8vIEZJWE1FIFdoeSBjYW4ndCB3ZSBkbyBub3JtYWwgTW9kdWxlLndyYXAoc291cmNlKSBoZXJlP1xuXHQgICAgICAgICAgICAvLyBJIGdldCBcIlVuY2F1Z2h0IFR5cGVFcnJvcjogQ2Fubm90IHJlYWQgcHJvcGVydHkgJ2NyZWF0ZVRhYkdyb3VwJyBvZiB1bmRlZmluZWRcIiBmb3IgXCJUaS5VSS5jcmVhdGVUYWJHcm91cCgpO1wiXG5cdCAgICAgICAgICAgIC8vIE5vdCBzdXJlIHdoeSBhcHAuanMgaXMgc3BlY2lhbCBjYXNlIGFuZCBjYW4ndCBiZSBydW4gdW5kZXIgbm9ybWFsIHNlbGYtaW52b2tpbmcgd3JhcHBpbmcgZnVuY3Rpb24gdGhhdCBnZXRzIHBhc3NlZCBpbiBnbG9iYWwva3JvbGwvVGkvZXRjXG5cdCAgICAgICAgICAgIC8vIEluc3RlYWQsIGxldCdzIHVzZSBhIHNsaWdodGx5IG1vZGlmaWVkIHZlcnNpb24gb2YgY2FsbEFuZFBhdXNlT25TdGFydDpcblx0ICAgICAgICAgICAgLy8gSXQgd2lsbCBjb21waWxlIHRoZSBzb3VyY2UgYXMtaXMsIHNjaGVkdWxlIGEgcGF1c2UgYW5kIHRoZW4gcnVuIHRoZSBzb3VyY2UuXG5cdCAgICAgICAgICAgIHJldHVybiBpbnNwZWN0b3JXcmFwcGVyKHNvdXJjZSwgZmlsZW5hbWUpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICAvLyBydW4gYXBwLmpzIFwibm9ybWFsbHlcIiAoaS5lLiBub3QgdW5kZXIgZGVidWdnZXIvaW5zcGVjdG9yKVxuXHQgICAgICAgIHJldHVybiBTY3JpcHQucnVuSW5UaGlzQ29udGV4dChzb3VyY2UsIGZpbGVuYW1lLCB0cnVlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIEluIFY4LCB3ZSB0cmVhdCBleHRlcm5hbCBtb2R1bGVzIHRoZSBzYW1lIGFzIG5hdGl2ZSBtb2R1bGVzLiAgRmlyc3QsIHdlIHdyYXAgdGhlXG5cdCAgICAgIC8vIG1vZHVsZSBjb2RlIGFuZCB0aGVuIHJ1biBpdCBpbiB0aGUgY3VycmVudCBjb250ZXh0LiAgVGhpcyB3aWxsIGFsbG93IGV4dGVybmFsIG1vZHVsZXMgdG9cblx0ICAgICAgLy8gYWNjZXNzIGdsb2JhbHMgYXMgbWVudGlvbmVkIGluIFRJTU9CLTExNzUyLiBUaGlzIHdpbGwgYWxzbyBoZWxwIHJlc29sdmUgc3RhcnR1cCBzbG93bmVzcyB0aGF0XG5cdCAgICAgIC8vIG9jY3VycyBhcyBhIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBjb250ZXh0IGR1cmluZyBzdGFydHVwIGluIFRJTU9CLTEyMjg2LlxuXHQgICAgICBzb3VyY2UgPSBNb2R1bGUud3JhcChzb3VyY2UpO1xuXHQgICAgICBjb25zdCBmID0gU2NyaXB0LnJ1bkluVGhpc0NvbnRleHQoc291cmNlLCBmaWxlbmFtZSwgdHJ1ZSk7XG5cdCAgICAgIHJldHVybiBmKHRoaXMuZXhwb3J0cywgcmVxdWlyZSwgdGhpcywgZmlsZW5hbWUsIHBhdGguZGlybmFtZShmaWxlbmFtZSksIFRpdGFuaXVtLCBUaSwgZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogTG9vayB1cCBhIGZpbGVuYW1lIGluIHRoZSBhcHAncyBpbmRleC5qc29uIGZpbGVcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgdGhlIGZpbGUgd2UncmUgbG9va2luZyBmb3Jcblx0ICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgdHJ1ZSBpZiB0aGUgZmlsZW5hbWUgZXhpc3RzIGluIHRoZSBpbmRleC5qc29uXG5cdCAgICAgKi9cblx0ICAgIGZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSB7XG5cdCAgICAgIGZpbGVuYW1lID0gJ1Jlc291cmNlcycgKyBmaWxlbmFtZTsgLy8gV2hlbiB3ZSBhY3R1YWxseSBsb29rIGZvciBmaWxlcywgYXNzdW1lIFwiUmVzb3VyY2VzL1wiIGlzIHRoZSByb290XG5cdCAgICAgIGlmICghZmlsZUluZGV4KSB7XG5cdCAgICAgICAgY29uc3QganNvbiA9IGFzc2V0cy5yZWFkQXNzZXQoSU5ERVhfSlNPTik7XG5cdCAgICAgICAgaWYgKGpzb24pIHtcblx0ICAgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIGZpbGVJbmRleCA9IEpTT04ucGFyc2UoanNvbik7XG5cdCAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgIGZpbGVJbmRleCA9IHt9O1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAvLyBfaW5kZXhfLmpzb24gbWF5IGJlIG9taXR0ZWQgaW4gZW5jcnlwdGVkIGJ1aWxkcyBmb3Igc2VjdXJpdHkuXG5cdCAgICAgICAgICAvLyBXaXRob3V0IHRoZSBpbmRleCwgd2UgY2Fubm90IGRldGVybWluZSBmaWxlIHN0YXR1cyBmcm9tIHRoZSBpbmRleCxcblx0ICAgICAgICAgIC8vIHNvIHdlIGZhbGwgYmFjayB0byB0cnlpbmcgdG8gbG9hZCB0aGUgZmlsZSBkaXJlY3RseS5cblx0ICAgICAgICAgIGZpbGVJbmRleCA9IG51bGw7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGlmIChmaWxlSW5kZXgpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZW5hbWUgaW4gZmlsZUluZGV4O1xuXHQgICAgICB9XG5cblx0ICAgICAgLy8gTm8gaW5kZXggYXZhaWxhYmxlIC0gYXR0ZW1wdCBkaXJlY3QgYXNzZXQgbG9va3VwIGFzIGZhbGxiYWNrLlxuXHQgICAgICAvLyBVc2UgYSAnLycgcHJlZml4ZWQgcGF0aCBzbyB0aGUgbmF0aXZlIHNpZGUgcm91dGVzIHRocm91Z2ggbG9hZFVSTDpcblx0ICAgICAgLy8gd2hpY2ggaGFuZGxlcyBlbmNyeXB0ZWQgZmlsZSBsb2FkaW5nIHZpYSByZXNvbHZlQXBwQXNzZXQ6LlxuXHQgICAgICAvLyBQYXRocyBsaWtlICdSZXNvdXJjZXMvYXBwLmpzJyB3b3VsZCBpbmNvcnJlY3RseSBnbyB0aHJvdWdoXG5cdCAgICAgIC8vIGxvYWRDb3JlTW9kdWxlQXNzZXQ6IGluc3RlYWQuXG5cdCAgICAgIHJldHVybiAhIWFzc2V0cy5yZWFkQXNzZXQoJy8nICsgZmlsZW5hbWUuc3Vic3RyaW5nKGZpbGVuYW1lLmluZGV4T2YoJy8nKSArIDEpKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgTW9kdWxlLmNhY2hlID0gW107XG5cdCAgTW9kdWxlLm1haW4gPSBudWxsO1xuXHQgIE1vZHVsZS53cmFwcGVyID0gWycoZnVuY3Rpb24gKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBUaXRhbml1bSwgVGksIGdsb2JhbCwga3JvbGwpIHsnLCAnXFxufSk7J107XG5cdCAgTW9kdWxlLndyYXAgPSBmdW5jdGlvbiAoc2NyaXB0KSB7XG5cdCAgICByZXR1cm4gTW9kdWxlLndyYXBwZXJbMF0gKyBzY3JpcHQgKyBNb2R1bGUud3JhcHBlclsxXTtcblx0ICB9O1xuXG5cdCAgLyoqXG5cdCAgICogW3J1bk1vZHVsZSBkZXNjcmlwdGlvbl1cblx0ICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgICAgICAgICAgIEpTIFNvdXJjZSBjb2RlXG5cdCAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSAgICAgICAgICBGaWxlbmFtZSBvZiB0aGUgbW9kdWxlXG5cdCAgICogQHBhcmFtICB7VGl0YW5pdW0uU2VydmljZXxudWxsfFRpdGFuaXVtLkFuZHJvaWQuQWN0aXZpdHl9IGFjdGl2aXR5T3JTZXJ2aWNlIFtkZXNjcmlwdGlvbl1cblx0ICAgKiBAcmV0dXJuIHtNb2R1bGV9ICAgICAgICAgICAgICAgICAgIFRoZSBsb2FkZWQgTW9kdWxlXG5cdCAgICovXG5cdCAgTW9kdWxlLnJ1bk1vZHVsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGZpbGVuYW1lLCBhY3Rpdml0eU9yU2VydmljZSkge1xuXHQgICAgbGV0IGlkID0gZmlsZW5hbWU7XG5cdCAgICBpZiAoIU1vZHVsZS5tYWluKSB7XG5cdCAgICAgIGlkID0gJy4nO1xuXHQgICAgfVxuXHQgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShpZCwgbnVsbCk7XG5cdCAgICAvLyBGSVhNRTogSSBkb24ndCBrbm93IHdoeSBpbnN0YW5jZW9mIGZvciBUaXRhbml1bS5TZXJ2aWNlIHdvcmtzIGhlcmUhXG5cdCAgICAvLyBPbiBBbmRyb2lkLCBpdCdzIGFuIGFwaW5hbWUgb2YgVGkuQW5kcm9pZC5TZXJ2aWNlXG5cdCAgICAvLyBPbiBpT1MsIHdlIGRvbid0IHlldCBwYXNzIGluIHRoZSB2YWx1ZSwgYnV0IHdlIGRvIHNldCBUaS5BcHAuY3VycmVudFNlcnZpY2UgcHJvcGVydHkgYmVmb3JlaGFuZCFcblx0ICAgIC8vIENhbiB3ZSByZW1vdmUgdGhlIHByZWxvYWQgc3R1ZmYgaW4gS3JvbGxCcmlkZ2UubSB0byBwYXNzIGFsb25nIHRoZSBzZXJ2aWNlIGluc3RhbmNlIGludG8gdGhpcyBsaWtlIHdlIGRvIG9uIEFuZHJvaWQ/XG5cdCAgICBtb2R1bGUuaXNTZXJ2aWNlID0gYWN0aXZpdHlPclNlcnZpY2UgaW5zdGFuY2VvZiBUaXRhbml1bS5TZXJ2aWNlIDtcblx0ICAgIHtcblx0ICAgICAgaWYgKG1vZHVsZS5pc1NlcnZpY2UpIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGkuQW5kcm9pZCwgJ2N1cnJlbnRTZXJ2aWNlJywge1xuXHQgICAgICAgICAgdmFsdWU6IGFjdGl2aXR5T3JTZXJ2aWNlLFxuXHQgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpLkFuZHJvaWQsICdjdXJyZW50U2VydmljZScsIHtcblx0ICAgICAgICAgIHZhbHVlOiBudWxsLFxuXHQgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGlmICghTW9kdWxlLm1haW4pIHtcblx0ICAgICAgTW9kdWxlLm1haW4gPSBtb2R1bGU7XG5cdCAgICB9XG5cdCAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoJ1Jlc291cmNlcy8nLCAnLycpOyAvLyBub3JtYWxpemUgYmFjayB0byBhYnNvbHV0ZSBwYXRocyAod2hpY2ggcmVhbGx5IGFyZSByZWxhdGl2ZSB0byBSZXNvdXJjZXMgdW5kZXIgdGhlIGhvb2QpXG5cdCAgICBtb2R1bGUubG9hZChmaWxlbmFtZSwgc291cmNlKTtcblx0ICAgIHtcblx0ICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpLkFuZHJvaWQsICdjdXJyZW50U2VydmljZScsIHtcblx0ICAgICAgICB2YWx1ZTogbnVsbCxcblx0ICAgICAgICB3cml0YWJsZTogZmFsc2UsXG5cdCAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1vZHVsZTtcblx0ICB9O1xuXHQgIHJldHVybiBNb2R1bGU7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBoYW5ncyB0aGUgUHJveHkgdHlwZSBvZmYgVGkgbmFtZXNwYWNlLiBJdCBhbHNvIGdlbmVyYXRlcyBhIGhpZGRlbiBfcHJvcGVydGllcyBvYmplY3Rcblx0ICogdGhhdCBpcyB1c2VkIHRvIHN0b3JlIHByb3BlcnR5IHZhbHVlcyBvbiB0aGUgSlMgc2lkZSBmb3IgSmF2YSBQcm94aWVzLlxuXHQgKiBCYXNpY2FsbHkgdGhlc2UgZ2V0L3NldCBtZXRob2RzIGFyZSBmYWxsYmFja3MgZm9yIHdoZW4gYSBKYXZhIHByb3h5IGRvZXNuJ3QgaGF2ZSBhIG5hdGl2ZSBtZXRob2QgdG8gaGFuZGxlIGdldHRpbmcvc2V0dGluZyB0aGUgcHJvcGVydHkuXG5cdCAqIChzZWUgUHJveHkuaC9Qcm94eUJpbmRpbmdWOC5jcHAuZm0gZm9yIG1vcmUgaW5mbylcblx0ICogQHBhcmFtIHtvYmplY3R9IHRpQmluZGluZyB0aGUgdW5kZXJseWluZyAnVGl0YW5pdW0nIG5hdGl2ZSBiaW5kaW5nIChzZWUgS3JvbGxCaW5kaW5nczo6aW5pdFRpdGFuaXVtKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gVGkgdGhlIGdsb2JhbC5UaXRhbml1bSBvYmplY3Rcblx0ICovXG5cdGZ1bmN0aW9uIFByb3h5Qm9vdHN0cmFwKHRpQmluZGluZywgVGkpIHtcblx0ICBjb25zdCBQcm94eSA9IHRpQmluZGluZy5Qcm94eTtcblx0ICBUaS5Qcm94eSA9IFByb3h5O1xuXHQgIFByb3h5LmRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJveHlQcm90b3R5cGUsIG5hbWVzKSB7XG5cdCAgICBjb25zdCBwcm9wZXJ0aWVzID0ge307XG5cdCAgICBjb25zdCBsZW4gPSBuYW1lcy5sZW5ndGg7XG5cdCAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdCAgICAgIGNvbnN0IG5hbWUgPSBuYW1lc1tpXTtcblx0ICAgICAgcHJvcGVydGllc1tuYW1lXSA9IHtcblx0ICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9vcC1mdW5jXG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQcm9wZXJ0eShuYW1lKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvb3AtZnVuY1xuXHQgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUFuZEZpcmUobmFtZSwgdmFsdWUpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJveHlQcm90b3R5cGUsIHByb3BlcnRpZXMpO1xuXHQgIH07XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3h5LnByb3RvdHlwZSwgJ2dldFByb3BlcnR5Jywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eV07XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHkucHJvdG90eXBlLCAnc2V0UHJvcGVydHknLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHByb3BlcnR5LCB2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eV0gPSB2YWx1ZTtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eS5wcm90b3R5cGUsICdzZXRQcm9wZXJ0aWVzQW5kRmlyZScsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXHQgICAgICBjb25zdCBvd25OYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3BlcnRpZXMpO1xuXHQgICAgICBjb25zdCBsZW4gPSBvd25OYW1lcy5sZW5ndGg7XG5cdCAgICAgIGNvbnN0IGNoYW5nZXMgPSBbXTtcblx0ICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuXHQgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gb3duTmFtZXNbaV07XG5cdCAgICAgICAgY29uc3QgdmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblx0ICAgICAgICBpZiAoIXByb3BlcnR5KSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblx0ICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHQgICAgICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcblx0ICAgICAgICAgIGNoYW5nZXMucHVzaChbcHJvcGVydHksIG9sZFZhbHVlLCB2YWx1ZV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBpZiAoY2hhbmdlcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgdGhpcy5vblByb3BlcnRpZXNDaGFuZ2VkKGNoYW5nZXMpO1xuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0fVxuXG5cdC8qIGdsb2JhbHMgT1NfQU5EUk9JRCwgT1NfSU9TICovXG5cdGZ1bmN0aW9uIGJvb3RzdHJhcCQxKGdsb2JhbCwga3JvbGwpIHtcblx0ICB7XG5cdCAgICBjb25zdCB0aUJpbmRpbmcgPSBrcm9sbC5iaW5kaW5nKCdUaXRhbml1bScpO1xuXHQgICAgY29uc3QgVGkgPSB0aUJpbmRpbmcuVGl0YW5pdW07XG5cdCAgICBjb25zdCBib290c3RyYXAgPSBrcm9sbC5OYXRpdmVNb2R1bGUucmVxdWlyZSgnYm9vdHN0cmFwJyk7XG5cdCAgICAvLyBUaGUgYm9vdHN0cmFwIGRlZmluZXMgbGF6eSBuYW1lc3BhY2UgcHJvcGVydHkgdHJlZSAqKmFuZCoqXG5cdCAgICAvLyBzZXRzIHVwIHNwZWNpYWwgQVBJcyB0aGF0IGdldCB3cmFwcGVkIHRvIHBhc3MgYWxvbmcgc291cmNlVXJsIHZpYSBhIEtyb2xsSW52b2NhdGlvbiBvYmplY3Rcblx0ICAgIGJvb3RzdHJhcC5ib290c3RyYXAoVGkpO1xuXHQgICAgYm9vdHN0cmFwLmRlZmluZUxhenlCaW5kaW5nKFRpLCAnQVBJJyk7IC8vIEJhc2ljYWxseSBkb2VzIHRoZSBzYW1lIHRoaW5nIGlPUyBkb2VzIGZvciBBUEkgbW9kdWxlIChsYXp5IHByb3BlcnR5IGdldHRlcilcblxuXHQgICAgLy8gSGVyZSwgd2UgZ28gdGhyb3VnaCBhbGwgdGhlIHNwZWNpYWxseSBtYXJrZWQgQVBJcyB0byBnZW5lcmF0ZSB0aGUgd3JhcHBlcnMgdG8gcGFzcyBpbiB0aGUgc291cmNlVXJsXG5cdCAgICAvLyBUT0RPOiBUaGlzIGlzIGFsbCBpbnNhbmUsIGFuZCB3ZSBzaG91bGQganVzdCBiYWtlIGl0IGludG8gdGhlIFByb3h5IGNvbnZlcnNpb24gc3R1ZmYgdG8gZ3JhYiBhbmQgcGFzcyBhbG9uZyBzb3VyY2VVcmxcblx0ICAgIC8vIFJhdGhlciB0aGFuIGNhcnJ5IGl0IGFsbCBvdmVyIHRoZSBwbGFjZSBsaWtlIHRoaXMhXG5cdCAgICAvLyBXZSBhbHJlYWR5IG5lZWQgdG8gZ2VuZXJhdGUgYSBLcm9sbEludm9jYXRpb24gb2JqZWN0IHRvIHdyYXAgdGhlIHNvdXJjZVVybCFcblx0ICAgIGZ1bmN0aW9uIFRpdGFuaXVtV3JhcHBlcihjb250ZXh0KSB7XG5cdCAgICAgIGNvbnN0IHNvdXJjZVVybCA9IHRoaXMuc291cmNlVXJsID0gY29udGV4dC5zb3VyY2VVcmw7XG5cdCAgICAgIGNvbnN0IHNjb3BlVmFycyA9IG5ldyBrcm9sbC5TY29wZVZhcnMoe1xuXHQgICAgICAgIHNvdXJjZVVybFxuXHQgICAgICB9KTtcblx0ICAgICAgVGkuYmluZEludm9jYXRpb25BUElzKHRoaXMsIHNjb3BlVmFycyk7XG5cdCAgICB9XG5cdCAgICBUaXRhbml1bVdyYXBwZXIucHJvdG90eXBlID0gVGk7XG5cdCAgICBUaS5XcmFwcGVyID0gVGl0YW5pdW1XcmFwcGVyO1xuXG5cdCAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgICAgLy8gVGhpcyBsb29wcyB0aHJvdWdoIGFsbCBrbm93biBBUElzIHRoYXQgcmVxdWlyZSBhblxuXHQgICAgLy8gSW52b2NhdGlvbiBvYmplY3QgYW5kIHdyYXBzIHRoZW0gc28gd2UgY2FuIHBhc3MgYVxuXHQgICAgLy8gc291cmNlIFVSTCBhcyB0aGUgZmlyc3QgYXJndW1lbnRcblx0ICAgIFRpLmJpbmRJbnZvY2F0aW9uQVBJcyA9IGZ1bmN0aW9uICh3cmFwcGVyVGksIHNjb3BlVmFycykge1xuXHQgICAgICBmb3IgKGNvbnN0IGFwaSBvZiBUaS5pbnZvY2F0aW9uQVBJcykge1xuXHQgICAgICAgIC8vIHNlcGFyYXRlIGVhY2ggaW52b2tlciBpbnRvIGl0J3Mgb3duIHByaXZhdGUgc2NvcGVcblx0ICAgICAgICBpbnZva2VyLmdlbkludm9rZXIod3JhcHBlclRpLCBUaSwgJ1RpdGFuaXVtJywgYXBpLCBzY29wZVZhcnMpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgUHJveHlCb290c3RyYXAodGlCaW5kaW5nLCBUaSk7XG5cdCAgICByZXR1cm4gbmV3IFRpdGFuaXVtV3JhcHBlcih7XG5cdCAgICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBlbnRyeSBwb2ludCBpcyByZWFsbHkgdGk6Ly9rcm9sbC5qcywgdGhhdCB3aWxsIGJyZWFrIHJlc29sdXRpb24gb2YgdXJscyB1bmRlciB0aGUgY292ZXJzIVxuXHQgICAgICAvLyBTbyBiYXNpY2FsbHkganVzdCBhc3N1bWUgYXBwLmpzIGFzIHRoZSByZWxhdGl2ZSBmaWxlIGJhc2Vcblx0ICAgICAgc291cmNlVXJsOiAnYXBwOi8vYXBwLmpzJ1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9XG5cblx0Ly8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG5cblx0Ly8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcblx0Ly8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHQvLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcblx0Ly8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuXHQvLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG5cdC8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuXHQvLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHQvLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuXHQvLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuXHQvLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG5cdC8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0Ly8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuXHQvLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcblx0Ly8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG5cdC8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcblx0Ly8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuXHQvLyBNb2RpZmljYXRpb25zIENvcHlyaWdodCAyMDExLVByZXNlbnQgQXBwY2VsZXJhdG9yLCBJbmMuXG5cdGZ1bmN0aW9uIEV2ZW50RW1pdHRlckJvb3RzdHJhcChnbG9iYWwsIGtyb2xsKSB7XG5cdCAgY29uc3QgVEFHID0gJ0V2ZW50RW1pdHRlcic7XG5cdCAgY29uc3QgRXZlbnRFbWl0dGVyID0ga3JvbGwuRXZlbnRFbWl0dGVyO1xuXHQgIGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5cdCAgLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuXHQgIC8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuXHQgIC8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdjYWxsSGFuZGxlcicsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAoaGFuZGxlciwgdHlwZSwgZGF0YSkge1xuXHQgICAgICAvLyBrcm9sbC5sb2coVEFHLCBcImNhbGxpbmcgZXZlbnQgaGFuZGxlcjogdHlwZTpcIiArIHR5cGUgKyBcIiwgZGF0YTogXCIgKyBkYXRhICsgXCIsIGhhbmRsZXI6IFwiICsgaGFuZGxlcik7XG5cblx0ICAgICAgdmFyIGhhbmRsZWQgPSBmYWxzZSxcblx0ICAgICAgICBjYW5jZWxCdWJibGUgPSBkYXRhLmNhbmNlbEJ1YmJsZSxcblx0ICAgICAgICBldmVudDtcblx0ICAgICAgaWYgKGhhbmRsZXIubGlzdGVuZXIgJiYgaGFuZGxlci5saXN0ZW5lci5jYWxsKSB7XG5cdCAgICAgICAgLy8gQ3JlYXRlIGV2ZW50IG9iamVjdCwgY29weSBhbnkgY3VzdG9tIGV2ZW50IGRhdGEsIGFuZCBzZXQgdGhlIFwidHlwZVwiIGFuZCBcInNvdXJjZVwiIHByb3BlcnRpZXMuXG5cdCAgICAgICAgZXZlbnQgPSB7XG5cdCAgICAgICAgICB0eXBlOiB0eXBlLFxuXHQgICAgICAgICAgc291cmNlOiB0aGlzXG5cdCAgICAgICAgfTtcblx0ICAgICAgICBrcm9sbC5leHRlbmQoZXZlbnQsIGRhdGEpO1xuXHQgICAgICAgIGlmIChoYW5kbGVyLnNlbGYgJiYgZXZlbnQuc291cmNlID09IGhhbmRsZXIuc2VsZi52aWV3KSB7XG5cdCAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuXHQgICAgICAgICAgZXZlbnQuc291cmNlID0gaGFuZGxlci5zZWxmO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBoYW5kbGVyLmxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuXG5cdCAgICAgICAgLy8gVGhlIFwiY2FuY2VsQnViYmxlXCIgcHJvcGVydHkgbWF5IGJlIHJlc2V0IGluIHRoZSBoYW5kbGVyLlxuXHQgICAgICAgIGlmIChldmVudC5jYW5jZWxCdWJibGUgIT09IGNhbmNlbEJ1YmJsZSkge1xuXHQgICAgICAgICAgY2FuY2VsQnViYmxlID0gZXZlbnQuY2FuY2VsQnViYmxlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcblx0ICAgICAgfSBlbHNlIGlmIChrcm9sbC5EQkcpIHtcblx0ICAgICAgICBrcm9sbC5sb2coVEFHLCAnaGFuZGxlciBmb3IgZXZlbnQgXFwnJyArIHR5cGUgKyAnXFwnIGlzICcgKyB0eXBlb2YgaGFuZGxlci5saXN0ZW5lciArICcgYW5kIGNhbm5vdCBiZSBjYWxsZWQuJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBCdWJibGUgdGhlIGV2ZW50cyB0byB0aGUgcGFyZW50IHZpZXcgaWYgbmVlZGVkLlxuXHQgICAgICBpZiAoZGF0YS5idWJibGVzICYmICFjYW5jZWxCdWJibGUpIHtcblx0ICAgICAgICBoYW5kbGVkID0gdGhpcy5fZmlyZVN5bmNFdmVudFRvUGFyZW50KHR5cGUsIGRhdGEpIHx8IGhhbmRsZWQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGhhbmRsZWQ7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2VtaXQnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUpIHtcblx0ICAgICAgdmFyIGhhbmRsZWQgPSBmYWxzZSxcblx0ICAgICAgICBkYXRhID0gYXJndW1lbnRzWzFdLFxuXHQgICAgICAgIGhhbmRsZXIsXG5cdCAgICAgICAgbGlzdGVuZXJzO1xuXG5cdCAgICAgIC8vIFNldCB0aGUgXCJidWJibGVzXCIgYW5kIFwiY2FuY2VsQnViYmxlXCIgcHJvcGVydGllcyBmb3IgZXZlbnQgZGF0YS5cblx0ICAgICAgaWYgKGRhdGEgIT09IG51bGwgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgICAgZGF0YS5idWJibGVzID0gISFkYXRhLmJ1YmJsZXM7XG5cdCAgICAgICAgZGF0YS5jYW5jZWxCdWJibGUgPSAhIWRhdGEuY2FuY2VsQnViYmxlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGRhdGEgPSB7XG5cdCAgICAgICAgICBidWJibGVzOiBmYWxzZSxcblx0ICAgICAgICAgIGNhbmNlbEJ1YmJsZTogZmFsc2Vcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLl9oYXNKYXZhTGlzdGVuZXIpIHtcblx0ICAgICAgICB0aGlzLl9vbkV2ZW50RmlyZWQodHlwZSwgZGF0YSk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSB8fCAhdGhpcy5jYWxsSGFuZGxlcikge1xuXHQgICAgICAgIGlmIChkYXRhLmJ1YmJsZXMgJiYgIWRhdGEuY2FuY2VsQnViYmxlKSB7XG5cdCAgICAgICAgICBoYW5kbGVkID0gdGhpcy5fZmlyZVN5bmNFdmVudFRvUGFyZW50KHR5cGUsIGRhdGEpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gaGFuZGxlZDtcblx0ICAgICAgfVxuXHQgICAgICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXHQgICAgICBpZiAodHlwZW9mIGhhbmRsZXIubGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICBoYW5kbGVkID0gdGhpcy5jYWxsSGFuZGxlcihoYW5kbGVyLCB0eXBlLCBkYXRhKTtcblx0ICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG5cdCAgICAgICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuY2FsbEhhbmRsZXIobGlzdGVuZXJzW2ldLCB0eXBlLCBkYXRhKSB8fCBoYW5kbGVkO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIGlmIChkYXRhLmJ1YmJsZXMgJiYgIWRhdGEuY2FuY2VsQnViYmxlKSB7XG5cdCAgICAgICAgaGFuZGxlZCA9IHRoaXMuX2ZpcmVTeW5jRXZlbnRUb1BhcmVudCh0eXBlLCBkYXRhKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gaGFuZGxlZDtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXG5cdCAgLy8gVGl0YW5pdW0gY29tcGF0aWJpbGl0eVxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnZmlyZUV2ZW50Jywge1xuXHQgICAgdmFsdWU6IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlLFxuXHQgICAgd3JpdGFibGU6IHRydWVcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2ZpcmVTeW5jRXZlbnQnLCB7XG5cdCAgICB2YWx1ZTogRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblxuXHQgIC8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuXHQgIC8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2FkZExpc3RlbmVyJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lciwgdmlldykge1xuXHQgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbi4gVGhlIGxpc3RlbmVyIGZvciBldmVudCBcIicgKyB0eXBlICsgJ1wiIGlzIFwiJyArIHR5cGVvZiBsaXN0ZW5lciArICdcIicpO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGlkO1xuXG5cdCAgICAgIC8vIFNldHVwIElEIGZpcnN0IHNvIHdlIGNhbiBwYXNzIGNvdW50IGluIHRvIFwibGlzdGVuZXJBZGRlZFwiXG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgaWQgPSAwO1xuXHQgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXHQgICAgICAgIGlkID0gdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZCA9IDE7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGxpc3RlbmVyV3JhcHBlciA9IHt9O1xuXHQgICAgICBsaXN0ZW5lcldyYXBwZXIubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0ICAgICAgbGlzdGVuZXJXcmFwcGVyLnNlbGYgPSB2aWV3O1xuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyV3JhcHBlcjtcblx0ICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblx0ICAgICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXJXcmFwcGVyKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cblx0ICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcldyYXBwZXJdO1xuXHQgICAgICB9XG5cblx0ICAgICAgLy8gTm90aWZ5IHRoZSBKYXZhIHByb3h5IGlmIHRoaXMgaXMgdGhlIGZpcnN0IGxpc3RlbmVyIGFkZGVkLlxuXHQgICAgICBpZiAoaWQgPT09IDApIHtcblx0ICAgICAgICB0aGlzLl9oYXNMaXN0ZW5lcnNGb3JFdmVudFR5cGUodHlwZSwgdHJ1ZSk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGlkO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cblx0ICAvLyBUaGUgSmF2YU9iamVjdCBwcm90b3R5cGUgd2lsbCBwcm92aWRlIGEgdmVyc2lvbiBvZiB0aGlzXG5cdCAgLy8gdGhhdCBkZWxlZ2F0ZXMgYmFjayB0byB0aGUgSmF2YSBwcm94eS4gTm9uLUphdmEgdmVyc2lvbnNcblx0ICAvLyBvZiBFdmVudEVtaXR0ZXIgZG9uJ3QgY2FyZSwgc28gdGhpcyBubyBvcCBpcyBjYWxsZWQgaW5zdGVhZC5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ19saXN0ZW5lckZvckV2ZW50Jywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHt9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ29uJywge1xuXHQgICAgdmFsdWU6IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIsXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXG5cdCAgLy8gVGl0YW5pdW0gY29tcGF0aWJpbGl0eVxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnYWRkRXZlbnRMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyLFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2UsXG5cdCAgICB3cml0YWJsZTogdHJ1ZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnb25jZScsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcblx0ICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgICBmdW5jdGlvbiBnKCkge1xuXHQgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cdCAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgfVxuXHQgICAgICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cdCAgICAgIHNlbGYub24odHlwZSwgZyk7XG5cdCAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdyZW1vdmVMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcblx0ICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cdCAgICAgIHZhciBjb3VudCA9IDA7XG5cdCAgICAgIGlmIChpc0FycmF5KGxpc3QpKSB7XG5cdCAgICAgICAgdmFyIHBvc2l0aW9uID0gLTE7XG5cdCAgICAgICAgLy8gQWxzbyBzdXBwb3J0IGxpc3RlbmVyIGluZGV4ZXMgLyBpZHNcblx0ICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnbnVtYmVyJykge1xuXHQgICAgICAgICAgcG9zaXRpb24gPSBsaXN0ZW5lcjtcblx0ICAgICAgICAgIGlmIChwb3NpdGlvbiA+IGxpc3QubGVuZ3RoIHx8IHBvc2l0aW9uIDwgMCkge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYgKGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG5cdCAgICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuXHQgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG5cdCAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBjb3VudCA9IGxpc3QubGVuZ3RoO1xuXHQgICAgICB9IGVsc2UgaWYgKGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyIHx8IGxpc3RlbmVyID09IDApIHtcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuXHQgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG5cdCAgICAgICAgdGhpcy5faGFzTGlzdGVuZXJzRm9yRXZlbnRUeXBlKHR5cGUsIGZhbHNlKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAncmVtb3ZlRXZlbnRMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyLFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2UsXG5cdCAgICB3cml0YWJsZTogdHJ1ZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAncmVtb3ZlQWxsTGlzdGVuZXJzJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlKSB7XG5cdCAgICAgIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuXHQgICAgICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcblx0ICAgICAgICB0aGlzLl9oYXNMaXN0ZW5lcnNGb3JFdmVudFR5cGUodHlwZSwgZmFsc2UpO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdsaXN0ZW5lcnMnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUpIHtcblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHMpIHtcblx0ICAgICAgICB0aGlzLl9ldmVudHMgPSB7fTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIHJldHVybiBFdmVudEVtaXR0ZXI7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBpcyB1c2VkIGJ5IEFuZHJvaWQgdG8gcmVxdWlyZSBcImJha2VkLWluXCIgc291cmNlLlxuXHQgKiBTREsgYW5kIG1vZHVsZSBidWlsZHMgd2lsbCBiYWtlIGluIHRoZSByYXcgc291cmNlIGFzIGMgc3RyaW5ncywgYW5kIHRoaXMgd2lsbCB3cmFwXG5cdCAqIGxvYWRpbmcgdGhhdCBjb2RlIGluIHZpYSBrcm9sbC5OYXRpdmVNb2R1bGUucmVxdWlyZSg8aWQ+KVxuXHQgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZSBib290c3RyYXAuanMuZWpzIHRlbXBsYXRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gTmF0aXZlTW9kdWxlQm9vdHN0cmFwKGdsb2JhbCwga3JvbGwpIHtcblx0ICBjb25zdCBTY3JpcHQgPSBrcm9sbC5iaW5kaW5nKCdldmFscycpLlNjcmlwdDtcblx0ICBjb25zdCBydW5JblRoaXNDb250ZXh0ID0gU2NyaXB0LnJ1bkluVGhpc0NvbnRleHQ7XG5cdCAgZnVuY3Rpb24gTmF0aXZlTW9kdWxlKGlkKSB7XG5cdCAgICB0aGlzLmZpbGVuYW1lID0gaWQgKyAnLmpzJztcblx0ICAgIHRoaXMuaWQgPSBpZDtcblx0ICAgIHRoaXMuZXhwb3J0cyA9IHt9O1xuXHQgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBUaGlzIHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCBzdHJpbmcga2V5cyAoYmFrZWQgaW4gbW9kdWxlIGlkcykgLT4gc3RyaW5nIHZhbHVlcyAoc291cmNlIG9mIHRoZSBiYWtlZCBpbiBKUyBjb2RlKVxuXHQgICAqL1xuXHQgIE5hdGl2ZU1vZHVsZS5fc291cmNlID0ga3JvbGwuYmluZGluZygnbmF0aXZlcycpO1xuXHQgIE5hdGl2ZU1vZHVsZS5fY2FjaGUgPSB7fTtcblx0ICBOYXRpdmVNb2R1bGUucmVxdWlyZSA9IGZ1bmN0aW9uIChpZCkge1xuXHQgICAgaWYgKGlkID09PSAnbmF0aXZlX21vZHVsZScpIHtcblx0ICAgICAgcmV0dXJuIE5hdGl2ZU1vZHVsZTtcblx0ICAgIH1cblx0ICAgIGlmIChpZCA9PT0gJ2ludm9rZXInKSB7XG5cdCAgICAgIHJldHVybiBpbnZva2VyOyAvLyBBbmRyb2lkIG5hdGl2ZSBtb2R1bGVzIHVzZSBhIGJvb3RzdHJhcC5qcyBmaWxlIHRoYXQgYXNzdW1lcyB0aGVyZSdzIGEgYnVpbHRpbiAnaW52b2tlcidcblx0ICAgIH1cblx0ICAgIGNvbnN0IGNhY2hlZCA9IE5hdGl2ZU1vZHVsZS5nZXRDYWNoZWQoaWQpO1xuXHQgICAgaWYgKGNhY2hlZCkge1xuXHQgICAgICByZXR1cm4gY2FjaGVkLmV4cG9ydHM7XG5cdCAgICB9XG5cdCAgICBpZiAoIU5hdGl2ZU1vZHVsZS5leGlzdHMoaWQpKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc3VjaCBuYXRpdmUgbW9kdWxlICcgKyBpZCk7XG5cdCAgICB9XG5cdCAgICBjb25zdCBuYXRpdmVNb2R1bGUgPSBuZXcgTmF0aXZlTW9kdWxlKGlkKTtcblx0ICAgIG5hdGl2ZU1vZHVsZS5jb21waWxlKCk7XG5cdCAgICBuYXRpdmVNb2R1bGUuY2FjaGUoKTtcblx0ICAgIHJldHVybiBuYXRpdmVNb2R1bGUuZXhwb3J0cztcblx0ICB9O1xuXHQgIE5hdGl2ZU1vZHVsZS5nZXRDYWNoZWQgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIHJldHVybiBOYXRpdmVNb2R1bGUuX2NhY2hlW2lkXTtcblx0ICB9O1xuXHQgIE5hdGl2ZU1vZHVsZS5leGlzdHMgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIHJldHVybiBpZCBpbiBOYXRpdmVNb2R1bGUuX3NvdXJjZTtcblx0ICB9O1xuXHQgIE5hdGl2ZU1vZHVsZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIHJldHVybiBOYXRpdmVNb2R1bGUuX3NvdXJjZVtpZF07XG5cdCAgfTtcblx0ICBOYXRpdmVNb2R1bGUud3JhcCA9IGZ1bmN0aW9uIChzY3JpcHQpIHtcblx0ICAgIHJldHVybiBOYXRpdmVNb2R1bGUud3JhcHBlclswXSArIHNjcmlwdCArIE5hdGl2ZU1vZHVsZS53cmFwcGVyWzFdO1xuXHQgIH07XG5cdCAgTmF0aXZlTW9kdWxlLndyYXBwZXIgPSBbJyhmdW5jdGlvbiAoZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIFRpdGFuaXVtLCBUaSwgZ2xvYmFsLCBrcm9sbCkgeycsICdcXG59KTsnXTtcblx0ICBOYXRpdmVNb2R1bGUucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICBsZXQgc291cmNlID0gTmF0aXZlTW9kdWxlLmdldFNvdXJjZSh0aGlzLmlkKTtcblx0ICAgIHNvdXJjZSA9IE5hdGl2ZU1vZHVsZS53cmFwKHNvdXJjZSk7XG5cblx0ICAgIC8vIEFsbCBuYXRpdmUgbW9kdWxlcyBoYXZlIHRoZWlyIGZpbGVuYW1lIHByZWZpeGVkIHdpdGggdGk6L1xuXHQgICAgY29uc3QgZmlsZW5hbWUgPSBgdGk6LyR7dGhpcy5maWxlbmFtZX1gO1xuXHQgICAgY29uc3QgZm4gPSBydW5JblRoaXNDb250ZXh0KHNvdXJjZSwgZmlsZW5hbWUsIHRydWUpO1xuXHQgICAgZm4odGhpcy5leHBvcnRzLCBOYXRpdmVNb2R1bGUucmVxdWlyZSwgdGhpcywgdGhpcy5maWxlbmFtZSwgbnVsbCwgZ2xvYmFsLlRpLCBnbG9iYWwuVGksIGdsb2JhbCwga3JvbGwpO1xuXHQgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuXHQgIH07XG5cdCAgTmF0aXZlTW9kdWxlLnByb3RvdHlwZS5jYWNoZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIE5hdGl2ZU1vZHVsZS5fY2FjaGVbdGhpcy5pZF0gPSB0aGlzO1xuXHQgIH07XG5cdCAgcmV0dXJuIE5hdGl2ZU1vZHVsZTtcblx0fVxuXG5cdC8vIFRoaXMgaXMgdGhlIGZpbGUgZWFjaCBwbGF0Zm9ybSBsb2FkcyBvbiBib290ICpiZWZvcmUqIHdlIGxhdW5jaCB0aS5tYWluLmpzIHRvIGluc2VydCBhbGwgb3VyIHNoaW1zL2V4dGVuc2lvbnNcblxuXHQvKipcblx0ICogbWFpbiBib290c3RyYXBwaW5nIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBnbG9iYWwgdGhlIGdsb2JhbCBvYmplY3Rcblx0ICogQHBhcmFtIHtvYmplY3R9IGtyb2xsOyB0aGUga3JvbGwgbW9kdWxlL2JpbmRpbmdcblx0ICogQHJldHVybiB7dm9pZH0gICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gYm9vdHN0cmFwKGdsb2JhbCwga3JvbGwpIHtcblx0ICAvLyBXb3JrcyBpZGVudGljYWwgdG8gT2JqZWN0Lmhhc093blByb3BlcnR5LCBleGNlcHRcblx0ICAvLyBhbHNvIHdvcmtzIGlmIHRoZSBnaXZlbiBvYmplY3QgZG9lcyBub3QgaGF2ZSB0aGUgbWV0aG9kXG5cdCAgLy8gb24gaXRzIHByb3RvdHlwZSBvciBpdCBoYXMgYmVlbiBtYXNrZWQuXG5cdCAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xuXHQgIH1cblx0ICBrcm9sbC5leHRlbmQgPSBmdW5jdGlvbiAodGhpc09iamVjdCwgb3RoZXJPYmplY3QpIHtcblx0ICAgIGlmICghb3RoZXJPYmplY3QpIHtcblx0ICAgICAgLy8gZXh0ZW5kIHdpdGggd2hhdD8hICBkZW5pZWQhXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGZvciAodmFyIG5hbWUgaW4gb3RoZXJPYmplY3QpIHtcblx0ICAgICAgaWYgKGhhc093blByb3BlcnR5KG90aGVyT2JqZWN0LCBuYW1lKSkge1xuXHQgICAgICAgIHRoaXNPYmplY3RbbmFtZV0gPSBvdGhlck9iamVjdFtuYW1lXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXNPYmplY3Q7XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIFRoaXMgaXMgdXNlZCB0byBzaHV0dGxlIHRoZSBzb3VyY2VVcmwgYXJvdW5kIHRvIEFQSXMgdGhhdCBtYXkgbmVlZCB0b1xuXHQgICAqIHJlc29sdmUgcmVsYXRpdmUgcGF0aHMgYmFzZWQgb24gdGhlIGludm9raW5nIGZpbGUuXG5cdCAgICogKHNlZSBLcm9sbEludm9jYXRpb24uamF2YSBmb3IgbW9yZSlcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gdmFycyBrZXkvdmFsdWUgcGFpcnMgdG8gc3RvcmVcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gdmFycy5zb3VyY2VVcmwgdGhlIHNvdXJjZSBVUkwgb2YgdGhlIGZpbGUgY2FsbGluZyB0aGUgQVBJXG5cdCAgICogQGNvbnN0cnVjdG9yXG5cdCAgICogQHJldHVybnMge1Njb3BlVmFyc31cblx0ICAgKi9cblx0ICBmdW5jdGlvbiBTY29wZVZhcnModmFycykge1xuXHQgICAgaWYgKCF2YXJzKSB7XG5cdCAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfVxuXHQgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhcnMpO1xuXHQgICAgY29uc3QgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdCAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cdCAgICAgIHRoaXNba2V5XSA9IHZhcnNba2V5XTtcblx0ICAgIH1cblx0ICB9XG5cdCAgZnVuY3Rpb24gc3RhcnR1cCgpIHtcblx0ICAgIGdsb2JhbC5nbG9iYWwgPSBnbG9iYWw7IC8vIGhhbmcgdGhlIGdsb2JhbCBvYmplY3Qgb2ZmIGl0c2VsZlxuXHQgICAgZ2xvYmFsLmtyb2xsID0ga3JvbGw7IC8vIGhhbmcgb3VyIHNwZWNpYWwgdW5kZXIgdGhlIGhvb2Qga3JvbGwgb2JqZWN0IG9mZiB0aGUgZ2xvYmFsXG5cdCAgICB7XG5cdCAgICAgIGtyb2xsLlNjb3BlVmFycyA9IFNjb3BlVmFycztcblx0ICAgICAgLy8gZXh0ZXJuYWwgbW9kdWxlIGJvb3RzdHJhcC5qcyBleHBlY3RzIHRvIGNhbGwga3JvbGwuTmF0aXZlTW9kdWxlLnJlcXVpcmUgZGlyZWN0bHkgdG8gbG9hZCBpbiB0aGVpciBvd24gc291cmNlXG5cdCAgICAgIC8vIGFuZCB0byByZWZlciB0byB0aGUgYmFrZWQgaW4gXCJib290c3RyYXAuanNcIiBmb3IgdGhlIFNESyBhbmQgXCJpbnZva2VyLmpzXCIgdG8gaGFuZyBsYXp5IEFQSXMvd3JhcCBBUEkgY2FsbHMgdG8gcGFzcyBpbiBzY29wZSB2YXJzXG5cdCAgICAgIGtyb2xsLk5hdGl2ZU1vZHVsZSA9IE5hdGl2ZU1vZHVsZUJvb3RzdHJhcChnbG9iYWwsIGtyb2xsKTtcblx0ICAgICAgLy8gQW5kcm9pZCB1c2VzIGl0J3Mgb3duIEV2ZW50RW1pdHRlciBpbXBsLCBhbmQgaXQncyBiYWtlZCByaWdodCBpbnRvIHRoZSBwcm94eSBjbGFzcyBjaGFpblxuXHQgICAgICAvLyBJdCBhc3N1bWVzIGl0IGNhbiBjYWxsIGJhY2sgaW50byBKYXZhIHByb3hpZXMgdG8gYWxlcnQgd2hlbiBsaXN0ZW5lcnMgYXJlIGFkZGVkL3JlbW92ZWRcblx0ICAgICAgLy8gRklYTUU6IEdldCBpdCB0byB1c2UgdGhlIGV2ZW50cy5qcyBpbXBsIGluIHRoZSBub2RlIGV4dGVuc2lvbiwgYW5kIGdldCBpT1MgdG8gYmFrZSB0aGF0IGludG8gaXQncyBwcm94aWVzIGFzIHdlbGwhXG5cdCAgICAgIEV2ZW50RW1pdHRlckJvb3RzdHJhcChnbG9iYWwsIGtyb2xsKTtcblx0ICAgIH1cblx0ICAgIGdsb2JhbC5UaSA9IGdsb2JhbC5UaXRhbml1bSA9IGJvb3RzdHJhcCQxKGdsb2JhbCwga3JvbGwpO1xuXHQgICAgZ2xvYmFsLk1vZHVsZSA9IGJvb3RzdHJhcCQyKGdsb2JhbCwga3JvbGwpO1xuXHQgIH1cblx0ICBzdGFydHVwKCk7XG5cdH1cblxuXHRyZXR1cm4gYm9vdHN0cmFwO1xuXG59KSgpO1xuIl0sInZlcnNpb24iOjN9
