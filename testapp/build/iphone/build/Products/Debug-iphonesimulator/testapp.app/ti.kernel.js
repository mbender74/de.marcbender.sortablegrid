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
    join: function () {
      for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }
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
    resolve: function () {
      for (var _len2 = arguments.length, paths = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
      }
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
    join: function () {
      for (var _len3 = arguments.length, paths = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        paths[_key3] = arguments[_key3];
      }
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
    resolve: function () {
      for (var _len4 = arguments.length, paths = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        paths[_key4] = arguments[_key4];
      }
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

  var invoker = {};

  /**
   * Titanium SDK
   * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */
  var hasRequiredInvoker;
  function requireInvoker() {
    if (hasRequiredInvoker) return invoker;
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
    invoker.genInvoker = genInvoker;

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
      const urlInvoker = function invoker() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // eslint-disable-line func-style
        args.splice(0, 0, invoker.__scopeVars__);
        return delegate.apply(invoker.__thisObj__, args);
      };
      urlInvoker.__delegate__ = delegate;
      urlInvoker.__thisObj__ = thisObj;
      urlInvoker.__scopeVars__ = scopeVars;
      return urlInvoker;
    }
    invoker.createInvoker = createInvoker;
    return invoker;
  }

  requireInvoker();

  /**
   * Titanium SDK
   * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */
  function bootstrap$2(global, kroll) {
    const assets = kroll.binding('assets');
    const Script = kroll.binding('Script');

    /**
     * The loaded index.json file from the app. Used to store the encrypted JS assets'
     * filenames/offsets.
     */
    let fileIndex;
    // FIXME: fix file name parity between platforms
    const INDEX_JSON = '/_index_.json';
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
          source = assets.readAsset(filename);
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
        {
          // iOS does not need a module wrapper, return original external module
          return externalModule;
        }
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
            externalModule = externalBinding;
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
        const source = assets.readAsset(filename);

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
          fileIndex = JSON.parse(json);
        }
        return fileIndex && filename in fileIndex;
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
      module.isService = Ti.App.currentService !== null;
      if (!Module.main) {
        Module.main = module;
      }
      filename = filename.replace('Resources/', '/'); // normalize back to absolute paths (which really are relative to Resources under the hood)
      module.load(filename, source);
      return module;
    };
    return Module;
  }

  /* globals OS_ANDROID, OS_IOS */
  function bootstrap$1(global, kroll) {
    {
      // On iOS, really we just need to set up the TopTiModule binding stuff, then hang lazy property getters for the top-level modules like UI, API, etc
      const Ti = kroll.binding('topTi');
      const modules = ['Accelerometer', 'App', 'API', 'Calendar', 'Codec', 'Contacts', 'Database', 'Filesystem', 'Geolocation', 'Gesture', 'Locale', 'Media', 'Network', 'Platform', 'Stream', 'Utils', 'UI', 'WatchSession', 'XML'];
      for (const modName of modules) {
        // This makes the namespace "lazy" - we instantiate it on demand and then
        // replace the lazy init with straight property value when done
        Object.defineProperty(Ti, modName, {
          configurable: true,
          // must be configurable to be able to change the property to static value after access
          enumerable: false,
          // writable: true, // cannot specify writable with a getter
          get: function () {
            const realModule = kroll.binding(modName);
            // Now replace our lazy getter on the property with a value
            Object.defineProperty(Ti, modName, {
              configurable: false,
              enumerable: false,
              writable: false,
              value: realModule
            });
            return realModule;
          }
        });
      }
      return Ti;
    }
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
    function startup() {
      global.global = global; // hang the global object off itself
      global.kroll = kroll; // hang our special under the hood kroll object off the global
      {
        // route kroll.externalBinding to same impl as binding - we treat 1st and 3rd party native modules the same
        kroll.externalBinding = kroll.binding;
      }
      global.Ti = global.Titanium = bootstrap$1(global, kroll);
      global.Module = bootstrap$2(global, kroll);
    }
    startup();
  }

  return bootstrap;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUU7TUFDaEQsSUFBSSxDQUFDQSxXQUFXLEVBQUU7UUFDaEI7UUFDQTtNQUNGO01BQ0EsS0FBSyxJQUFJdE4sSUFBSSxJQUFJc04sV0FBVyxFQUFFO1FBQzVCLElBQUkxRyxjQUFjLENBQUMwRyxXQUFXLEVBQUV0TixJQUFJLENBQUMsRUFBRTtVQUNyQ3FOLFVBQVUsQ0FBQ3JOLElBQUksQ0FBQyxHQUFHc04sV0FBVyxDQUFDdE4sSUFBSSxDQUFDO1FBQ3RDO01BQ0Y7TUFDQSxPQUFPcU4sVUFBVTtJQUNuQixDQUFDO0lBQ0QsU0FBU0UsT0FBT0EsQ0FBQSxFQUFHO01BQ2pCL0osTUFBTSxDQUFDQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQyxDQUFDO01BQ3hCQSxNQUFNLENBQUN5RSxLQUFLLEdBQUdBLEtBQUssQ0FBQyxDQUFDO01BQ3RCO1FBQ0U7UUFDQUEsS0FBSyxDQUFDa0MsZUFBZSxHQUFHbEMsS0FBSyxDQUFDRSxPQUFPO01BQ3ZDO01BQ0EzRSxNQUFNLENBQUM2SSxFQUFFLEdBQUc3SSxNQUFNLENBQUM0SSxRQUFRLEdBQUdRLFdBQVcsQ0FBQ3BKLE1BQU0sRUFBRXlFLEtBQUssQ0FBQztNQUN4RHpFLE1BQU0sQ0FBQytFLE1BQU0sR0FBR1AsV0FBVyxDQUFDeEUsTUFBTSxFQUFFeUUsS0FBSyxDQUFDO0lBQzVDO0lBQ0FzRixPQUFPLENBQUMsQ0FBQztFQUNYOztFQUVBLE9BQU9KLFNBQVM7O0FBRWpCLENBQUMsRUFBRSxDQUFDIiwibmFtZXMiOlsiYXNzZXJ0QXJndW1lbnRUeXBlIiwiYXJnIiwibmFtZSIsInR5cGVuYW1lIiwidHlwZSIsInRvTG93ZXJDYXNlIiwiVHlwZUVycm9yIiwiRk9SV0FSRF9TTEFTSCIsIkJBQ0tXQVJEX1NMQVNIIiwiaXNXaW5kb3dzRGV2aWNlTmFtZSIsImNoYXJDb2RlIiwiaXNBYnNvbHV0ZSIsImlzUG9zaXgiLCJmaWxlcGF0aCIsImxlbmd0aCIsImZpcnN0Q2hhciIsImNoYXJDb2RlQXQiLCJjaGFyQXQiLCJ0aGlyZENoYXIiLCJkaXJuYW1lIiwic2VwYXJhdG9yIiwiZnJvbUluZGV4IiwiaGFkVHJhaWxpbmciLCJlbmRzV2l0aCIsImZvdW5kSW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIiwiZXh0bmFtZSIsImluZGV4IiwiZW5kSW5kZXgiLCJsYXN0SW5kZXhXaW4zMlNlcGFyYXRvciIsImkiLCJjaGFyIiwiYmFzZW5hbWUiLCJleHQiLCJ1bmRlZmluZWQiLCJsYXN0Q2hhckNvZGUiLCJsYXN0SW5kZXgiLCJiYXNlIiwibm9ybWFsaXplIiwiaXNXaW5kb3dzIiwicmVwbGFjZSIsImhhZExlYWRpbmciLCJzdGFydHNXaXRoIiwiaXNVTkMiLCJwYXJ0cyIsInNwbGl0IiwicmVzdWx0Iiwic2VnbWVudCIsInBvcCIsInB1c2giLCJub3JtYWxpemVkIiwiam9pbiIsImFzc2VydFNlZ21lbnQiLCJwYXRocyIsInJlc29sdmUiLCJyZXNvbHZlZCIsImhpdFJvb3QiLCJnbG9iYWwiLCJwcm9jZXNzIiwiY3dkIiwicmVsYXRpdmUiLCJmcm9tIiwidG8iLCJ1cENvdW50IiwicmVtYWluaW5nUGF0aCIsInJlcGVhdCIsInBhcnNlIiwicm9vdCIsImRpciIsImJhc2VMZW5ndGgiLCJ0b1N1YnRyYWN0IiwiZmlyc3RDaGFyQ29kZSIsInRoaXJkQ2hhckNvZGUiLCJmb3JtYXQiLCJwYXRoT2JqZWN0IiwidG9OYW1lc3BhY2VkUGF0aCIsInJlc29sdmVkUGF0aCIsIldpbjMyUGF0aCIsInNlcCIsImRlbGltaXRlciIsIl9sZW4iLCJhcmd1bWVudHMiLCJBcnJheSIsIl9rZXkiLCJfbGVuMiIsIl9rZXkyIiwiUG9zaXhQYXRoIiwiX2xlbjMiLCJfa2V5MyIsIl9sZW40IiwiX2tleTQiLCJwYXRoIiwid2luMzIiLCJwb3NpeCIsImludm9rZXIiLCJoYXNSZXF1aXJlZEludm9rZXIiLCJyZXF1aXJlSW52b2tlciIsImdlbkludm9rZXIiLCJ3cmFwcGVyQVBJIiwicmVhbEFQSSIsImFwaU5hbWUiLCJpbnZvY2F0aW9uQVBJIiwic2NvcGVWYXJzIiwiYXBpTmFtZXNwYWNlIiwibmFtZXNwYWNlIiwibmFtZXMiLCJhcGkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJTYW5kYm94QVBJIiwicHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiX2V2ZW50cyIsInNldCIsInZhbHVlIiwiZGVsZWdhdGUiLCJfX2RlbGVnYXRlX18iLCJjcmVhdGVJbnZva2VyIiwidGhpc09iaiIsInVybEludm9rZXIiLCJhcmdzIiwic3BsaWNlIiwiX19zY29wZVZhcnNfXyIsImFwcGx5IiwiX190aGlzT2JqX18iLCJib290c3RyYXAkMiIsImtyb2xsIiwiYXNzZXRzIiwiYmluZGluZyIsIlNjcmlwdCIsImZpbGVJbmRleCIsIklOREVYX0pTT04iLCJNb2R1bGUiLCJjb25zdHJ1Y3RvciIsImlkIiwicGFyZW50IiwiZXhwb3J0cyIsImZpbGVuYW1lIiwibG9hZGVkIiwid3JhcHBlckNhY2hlIiwiaXNTZXJ2aWNlIiwibG9hZCIsInNvdXJjZSIsIkVycm9yIiwibm9kZU1vZHVsZXNQYXRocyIsInJlYWRBc3NldCIsImNhY2hlIiwiX3J1blNjcmlwdCIsImNyZWF0ZU1vZHVsZVdyYXBwZXIiLCJleHRlcm5hbE1vZHVsZSIsInNvdXJjZVVybCIsImV4dGVuZE1vZHVsZVdpdGhDb21tb25KcyIsImlzRXh0ZXJuYWxDb21tb25Kc01vZHVsZSIsImZha2VJZCIsImpzTW9kdWxlIiwiZ2V0RXh0ZXJuYWxDb21tb25Kc01vZHVsZSIsImNvbnNvbGUiLCJ0cmFjZSIsImV4dGVuZCIsImxvYWRFeHRlcm5hbE1vZHVsZSIsImV4dGVybmFsQmluZGluZyIsIndyYXBwZXIiLCJyZXF1aXJlIiwicmVxdWVzdCIsInN0YXJ0Iiwic3Vic3RyaW5nIiwibG9hZEFzRmlsZU9yRGlyZWN0b3J5IiwibG9hZENvcmVNb2R1bGUiLCJpbmRleE9mIiwiZmlsZW5hbWVFeGlzdHMiLCJsb2FkSmF2YXNjcmlwdFRleHQiLCJsb2FkQXNEaXJlY3RvcnkiLCJsb2FkTm9kZU1vZHVsZXMiLCJleHRlcm5hbENvbW1vbkpzQ29udGVudHMiLCJtb2R1bGUiLCJtb2R1bGVJZCIsImRpcnMiLCJtb2QiLCJzdGFydERpciIsIm5vcm1hbGl6ZWRQYXRoIiwibG9hZEFzRmlsZSIsImxvYWRKYXZhc2NyaXB0T2JqZWN0IiwiSlNPTiIsIm9iamVjdCIsIm1haW4iLCJtIiwic2VsZiIsImluc3BlY3RvciIsImluc3BlY3RvcldyYXBwZXIiLCJjYWxsQW5kUGF1c2VPblN0YXJ0IiwicnVuSW5UaGlzQ29udGV4dCIsIndyYXAiLCJmIiwiVGl0YW5pdW0iLCJUaSIsImpzb24iLCJzY3JpcHQiLCJydW5Nb2R1bGUiLCJhY3Rpdml0eU9yU2VydmljZSIsIkFwcCIsImN1cnJlbnRTZXJ2aWNlIiwiYm9vdHN0cmFwJDEiLCJtb2R1bGVzIiwibW9kTmFtZSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJyZWFsTW9kdWxlIiwid3JpdGFibGUiLCJib290c3RyYXAiLCJwcm9wZXJ0eSIsInRoaXNPYmplY3QiLCJvdGhlck9iamVjdCIsInN0YXJ0dXAiXSwic291cmNlUm9vdCI6Ii9Vc2Vycy9tYXJjYmVuZGVyL0xpYnJhcnkvQXBwbGljYXRpb24gU3VwcG9ydC9UaXRhbml1bS9tb2JpbGVzZGsvb3N4LzEzLjIuMC5HQS9jb21tb24vUmVzb3VyY2VzL2lvcyIsInNvdXJjZXMiOlsidGkua2VybmVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogQHBhcmFtICB7Kn0gYXJnIHBhc3NlZCBpbiBhcmd1bWVudCB2YWx1ZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgYXJndW1lbnRcblx0ICogQHBhcmFtICB7c3RyaW5nfSB0eXBlbmFtZSBlLmcuICdzdHJpbmcnLCAnRnVuY3Rpb24nICh2YWx1ZSBpcyBjb21wYXJlZCB0byB0eXBlb2YgYWZ0ZXIgbG93ZXJjYXNpbmcpXG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cblx0ICovXG5cdGZ1bmN0aW9uIGFzc2VydEFyZ3VtZW50VHlwZShhcmcsIG5hbWUsIHR5cGVuYW1lKSB7XG5cdCAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cdCAgaWYgKHR5cGUgIT09IHR5cGVuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgJHt0eXBlbmFtZX0uIFJlY2VpdmVkIHR5cGUgJHt0eXBlfWApO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IEZPUldBUkRfU0xBU0ggPSA0NzsgLy8gJy8nXG5cdGNvbnN0IEJBQ0tXQVJEX1NMQVNIID0gOTI7IC8vICdcXFxcJ1xuXG5cdC8qKlxuXHQgKiBJcyB0aGlzIFthLXpBLVpdP1xuXHQgKiBAcGFyYW0gIHtudW1iZXJ9ICBjaGFyQ29kZSB2YWx1ZSBmcm9tIFN0cmluZy5jaGFyQ29kZUF0KClcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNXaW5kb3dzRGV2aWNlTmFtZShjaGFyQ29kZSkge1xuXHQgIHJldHVybiBjaGFyQ29kZSA+PSA2NSAmJiBjaGFyQ29kZSA8PSA5MCB8fCBjaGFyQ29kZSA+PSA5NyAmJiBjaGFyQ29kZSA8PSAxMjI7XG5cdH1cblxuXHQvKipcblx0ICogW2lzQWJzb2x1dGUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge2Jvb2xlYW59IGlzUG9zaXggd2hldGhlciB0aGlzIGltcGwgaXMgZm9yIFBPU0lYIG9yIG5vdFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGlzQWJzb2x1dGUoaXNQb3NpeCwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDtcblx0ICAvLyBlbXB0eSBzdHJpbmcgc3BlY2lhbCBjYXNlXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICBjb25zdCBmaXJzdENoYXIgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDApO1xuXHQgIGlmIChmaXJzdENoYXIgPT09IEZPUldBUkRfU0xBU0gpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvLyB3ZSBhbHJlYWR5IGRpZCBvdXIgY2hlY2tzIGZvciBwb3NpeFxuXHQgIGlmIChpc1Bvc2l4KSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8vIHdpbjMyIGZyb20gaGVyZSBvbiBvdXRcblx0ICBpZiAoZmlyc3RDaGFyID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIGlmIChsZW5ndGggPiAyICYmIGlzV2luZG93c0RldmljZU5hbWUoZmlyc3RDaGFyKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgY29uc3QgdGhpcmRDaGFyID0gZmlsZXBhdGguY2hhckF0KDIpO1xuXHQgICAgcmV0dXJuIHRoaXJkQ2hhciA9PT0gJy8nIHx8IHRoaXJkQ2hhciA9PT0gJ1xcXFwnO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogW2Rpcm5hbWUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yICBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXJuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDtcblx0ICBpZiAobGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblxuXHQgIC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3Jcblx0ICBsZXQgZnJvbUluZGV4ID0gbGVuZ3RoIC0gMTtcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBmcm9tSW5kZXgtLTtcblx0ICB9XG5cdCAgY29uc3QgZm91bmRJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZnJvbUluZGV4KTtcblx0ICAvLyBubyBzZXBhcmF0b3JzXG5cdCAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSB7XG5cdCAgICAvLyBoYW5kbGUgc3BlY2lhbCBjYXNlIG9mIHJvb3QgV2luZG93cyBwYXRoc1xuXHQgICAgaWYgKGxlbmd0aCA+PSAyICYmIHNlcGFyYXRvciA9PT0gJ1xcXFwnICYmIGZpbGVwYXRoLmNoYXJBdCgxKSA9PT0gJzonKSB7XG5cdCAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IGZpbGVwYXRoLmNoYXJDb2RlQXQoMCk7XG5cdCAgICAgIGlmIChpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhcikpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7IC8vIGl0J3MgYSByb290IFdpbmRvd3MgcGF0aFxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblx0ICAvLyBvbmx5IGZvdW5kIHJvb3Qgc2VwYXJhdG9yXG5cdCAgaWYgKGZvdW5kSW5kZXggPT09IDApIHtcblx0ICAgIHJldHVybiBzZXBhcmF0b3I7IC8vIGlmIGl0IHdhcyAnLycsIHJldHVybiB0aGF0XG5cdCAgfVxuXHQgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugb2YgJy8vc29tZXRoaW5nJ1xuXHQgIGlmIChmb3VuZEluZGV4ID09PSAxICYmIHNlcGFyYXRvciA9PT0gJy8nICYmIGZpbGVwYXRoLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG5cdCAgICByZXR1cm4gJy8vJztcblx0ICB9XG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKDAsIGZvdW5kSW5kZXgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFtleHRuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0bmFtZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBjb25zdCBpbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKCcuJyk7XG5cdCAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblx0ICAvLyBpZ25vcmUgdHJhaWxpbmcgc2VwYXJhdG9yXG5cdCAgbGV0IGVuZEluZGV4ID0gZmlsZXBhdGgubGVuZ3RoO1xuXHQgIGlmIChmaWxlcGF0aC5lbmRzV2l0aChzZXBhcmF0b3IpKSB7XG5cdCAgICBlbmRJbmRleC0tO1xuXHQgIH1cblx0ICByZXR1cm4gZmlsZXBhdGguc2xpY2UoaW5kZXgsIGVuZEluZGV4KTtcblx0fVxuXHRmdW5jdGlvbiBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgaW5kZXgpIHtcblx0ICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdCAgICBjb25zdCBjaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdChpKTtcblx0ICAgIGlmIChjaGFyID09PSBCQUNLV0FSRF9TTEFTSCB8fCBjaGFyID09PSBGT1JXQVJEX1NMQVNIKSB7XG5cdCAgICAgIHJldHVybiBpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblxuXHQvKipcblx0ICogW2Jhc2VuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IFtleHRdICAgICAgZmlsZSBleHRlbnNpb24gdG8gZHJvcCBpZiBpdCBleGlzdHNcblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgsIGV4dCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cdCAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICBhc3NlcnRBcmd1bWVudFR5cGUoZXh0LCAnZXh0JywgJ3N0cmluZycpO1xuXHQgIH1cblx0ICBjb25zdCBsZW5ndGggPSBmaWxlcGF0aC5sZW5ndGg7XG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblx0ICBjb25zdCBpc1Bvc2l4ID0gc2VwYXJhdG9yID09PSAnLyc7XG5cdCAgbGV0IGVuZEluZGV4ID0gbGVuZ3RoO1xuXHQgIC8vIGRyb3AgdHJhaWxpbmcgc2VwYXJhdG9yIChpZiB0aGVyZSBpcyBvbmUpXG5cdCAgY29uc3QgbGFzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdChsZW5ndGggLSAxKTtcblx0ICBpZiAobGFzdENoYXJDb2RlID09PSBGT1JXQVJEX1NMQVNIIHx8ICFpc1Bvc2l4ICYmIGxhc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0gpIHtcblx0ICAgIGVuZEluZGV4LS07XG5cdCAgfVxuXG5cdCAgLy8gRmluZCBsYXN0IG9jY3VyZW5jZSBvZiBzZXBhcmF0b3Jcblx0ICBsZXQgbGFzdEluZGV4ID0gLTE7XG5cdCAgaWYgKGlzUG9zaXgpIHtcblx0ICAgIGxhc3RJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZW5kSW5kZXggLSAxKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gT24gd2luMzIsIGhhbmRsZSAqZWl0aGVyKiBzZXBhcmF0b3IhXG5cdCAgICBsYXN0SW5kZXggPSBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgZW5kSW5kZXggLSAxKTtcblx0ICAgIC8vIGhhbmRsZSBzcGVjaWFsIGNhc2Ugb2Ygcm9vdCBwYXRoIGxpa2UgJ0M6JyBvciAnQzpcXFxcJ1xuXHQgICAgaWYgKChsYXN0SW5kZXggPT09IDIgfHwgbGFzdEluZGV4ID09PSAtMSkgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaWxlcGF0aC5jaGFyQ29kZUF0KDApKSkge1xuXHQgICAgICByZXR1cm4gJyc7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy8gVGFrZSBmcm9tIGxhc3Qgb2NjdXJyZW5jZSBvZiBzZXBhcmF0b3IgdG8gZW5kIG9mIHN0cmluZyAob3IgYmVnaW5uaW5nIHRvIGVuZCBpZiBub3QgZm91bmQpXG5cdCAgY29uc3QgYmFzZSA9IGZpbGVwYXRoLnNsaWNlKGxhc3RJbmRleCArIDEsIGVuZEluZGV4KTtcblxuXHQgIC8vIGRyb3AgdHJhaWxpbmcgZXh0ZW5zaW9uIChpZiBzcGVjaWZpZWQpXG5cdCAgaWYgKGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICByZXR1cm4gYmFzZTtcblx0ICB9XG5cdCAgcmV0dXJuIGJhc2UuZW5kc1dpdGgoZXh0KSA/IGJhc2Uuc2xpY2UoMCwgYmFzZS5sZW5ndGggLSBleHQubGVuZ3RoKSA6IGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLm5vcm1hbGl6ZSgpYCBtZXRob2Qgbm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmVzb2x2aW5nICcuLicgYW5kICcuJyBzZWdtZW50cy5cblx0ICpcblx0ICogV2hlbiBtdWx0aXBsZSwgc2VxdWVudGlhbCBwYXRoIHNlZ21lbnQgc2VwYXJhdGlvbiBjaGFyYWN0ZXJzIGFyZSBmb3VuZCAoZS5nLlxuXHQgKiAvIG9uIFBPU0lYIGFuZCBlaXRoZXIgXFwgb3IgLyBvbiBXaW5kb3dzKSwgdGhleSBhcmUgcmVwbGFjZWQgYnkgYSBzaW5nbGVcblx0ICogaW5zdGFuY2Ugb2YgdGhlIHBsYXRmb3JtLXNwZWNpZmljIHBhdGggc2VnbWVudCBzZXBhcmF0b3IgKC8gb24gUE9TSVggYW5kIFxcXG5cdCAqIG9uIFdpbmRvd3MpLiBUcmFpbGluZyBzZXBhcmF0b3JzIGFyZSBwcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIElmIHRoZSBwYXRoIGlzIGEgemVyby1sZW5ndGggc3RyaW5nLCAnLicgaXMgcmV0dXJuZWQsIHJlcHJlc2VudGluZyB0aGVcblx0ICogY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cblx0ICpcblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBpZiAoZmlsZXBhdGgubGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH1cblxuXHQgIC8vIFdpbmRvd3MgY2FuIGhhbmRsZSAnLycgb3IgJ1xcXFwnIGFuZCBib3RoIHNob3VsZCBiZSB0dXJuZWQgaW50byBzZXBhcmF0b3Jcblx0ICBjb25zdCBpc1dpbmRvd3MgPSBzZXBhcmF0b3IgPT09ICdcXFxcJztcblx0ICBpZiAoaXNXaW5kb3dzKSB7XG5cdCAgICBmaWxlcGF0aCA9IGZpbGVwYXRoLnJlcGxhY2UoL1xcLy9nLCBzZXBhcmF0b3IpO1xuXHQgIH1cblx0ICBjb25zdCBoYWRMZWFkaW5nID0gZmlsZXBhdGguc3RhcnRzV2l0aChzZXBhcmF0b3IpO1xuXHQgIC8vIE9uIFdpbmRvd3MsIG5lZWQgdG8gaGFuZGxlIFVOQyBwYXRocyAoXFxcXGhvc3QtbmFtZVxcXFxyZXNvdXJjZVxcXFxkaXIpIHNwZWNpYWwgdG8gcmV0YWluIGxlYWRpbmcgZG91YmxlIGJhY2tzbGFzaFxuXHQgIGNvbnN0IGlzVU5DID0gaGFkTGVhZGluZyAmJiBpc1dpbmRvd3MgJiYgZmlsZXBhdGgubGVuZ3RoID4gMiAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJztcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgY29uc3QgcGFydHMgPSBmaWxlcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXHQgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwYXJ0cykge1xuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoICE9PSAwICYmIHNlZ21lbnQgIT09ICcuJykge1xuXHQgICAgICBpZiAoc2VnbWVudCA9PT0gJy4uJykge1xuXHQgICAgICAgIHJlc3VsdC5wb3AoKTsgLy8gRklYTUU6IFdoYXQgaWYgdGhpcyBnb2VzIGFib3ZlIHJvb3Q/IFNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvcj9cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICBsZXQgbm9ybWFsaXplZCA9IGhhZExlYWRpbmcgPyBzZXBhcmF0b3IgOiAnJztcblx0ICBub3JtYWxpemVkICs9IHJlc3VsdC5qb2luKHNlcGFyYXRvcik7XG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBub3JtYWxpemVkICs9IHNlcGFyYXRvcjtcblx0ICB9XG5cdCAgaWYgKGlzVU5DKSB7XG5cdCAgICBub3JtYWxpemVkID0gJ1xcXFwnICsgbm9ybWFsaXplZDtcblx0ICB9XG5cdCAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG5cdH1cblxuXHQvKipcblx0ICogW2Fzc2VydFNlZ21lbnQgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAgeyp9IHNlZ21lbnQgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHt2b2lkfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGFzc2VydFNlZ21lbnQoc2VnbWVudCkge1xuXHQgIGlmICh0eXBlb2Ygc2VnbWVudCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFBhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJHtzZWdtZW50fWApO1xuXHQgIH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHBhdGguam9pbigpYCBtZXRob2Qgam9pbnMgYWxsIGdpdmVuIHBhdGggc2VnbWVudHMgdG9nZXRoZXIgdXNpbmcgdGhlXG5cdCAqIHBsYXRmb3JtLXNwZWNpZmljIHNlcGFyYXRvciBhcyBhIGRlbGltaXRlciwgdGhlbiBub3JtYWxpemVzIHRoZSByZXN1bHRpbmcgcGF0aC5cblx0ICogWmVyby1sZW5ndGggcGF0aCBzZWdtZW50cyBhcmUgaWdub3JlZC4gSWYgdGhlIGpvaW5lZCBwYXRoIHN0cmluZyBpcyBhIHplcm8tXG5cdCAqIGxlbmd0aCBzdHJpbmcgdGhlbiAnLicgd2lsbCBiZSByZXR1cm5lZCwgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmdbXX0gcGF0aHMgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgIFRoZSBqb2luZWQgZmlsZXBhdGhcblx0ICovXG5cdGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yLCBwYXRocykge1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXHQgIC8vIG5haXZlIGltcGw6IGp1c3Qgam9pbiBhbGwgdGhlIHBhdGhzIHdpdGggc2VwYXJhdG9yXG5cdCAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBhdGhzKSB7XG5cdCAgICBhc3NlcnRTZWdtZW50KHNlZ21lbnQpO1xuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoICE9PSAwKSB7XG5cdCAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzdWx0LmpvaW4oc2VwYXJhdG9yKSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnJlc29sdmUoKWAgbWV0aG9kIHJlc29sdmVzIGEgc2VxdWVuY2Ugb2YgcGF0aHMgb3IgcGF0aCBzZWdtZW50cyBpbnRvIGFuIGFic29sdXRlIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ1tdfSBwYXRocyBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzb2x2ZShzZXBhcmF0b3IsIHBhdGhzKSB7XG5cdCAgbGV0IHJlc29sdmVkID0gJyc7XG5cdCAgbGV0IGhpdFJvb3QgPSBmYWxzZTtcblx0ICBjb25zdCBpc1Bvc2l4ID0gc2VwYXJhdG9yID09PSAnLyc7XG5cdCAgLy8gZ28gZnJvbSByaWdodCB0byBsZWZ0IHVudGlsIHdlIGhpdCBhYnNvbHV0ZSBwYXRoL3Jvb3Rcblx0ICBmb3IgKGxldCBpID0gcGF0aHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0ICAgIGNvbnN0IHNlZ21lbnQgPSBwYXRoc1tpXTtcblx0ICAgIGFzc2VydFNlZ21lbnQoc2VnbWVudCk7XG5cdCAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDApIHtcblx0ICAgICAgY29udGludWU7IC8vIHNraXAgZW1wdHlcblx0ICAgIH1cblx0ICAgIHJlc29sdmVkID0gc2VnbWVudCArIHNlcGFyYXRvciArIHJlc29sdmVkOyAvLyBwcmVwZW5kIG5ldyBzZWdtZW50XG5cdCAgICBpZiAoaXNBYnNvbHV0ZShpc1Bvc2l4LCBzZWdtZW50KSkge1xuXHQgICAgICAvLyBoYXZlIHdlIGJhY2tlZCBpbnRvIGFuIGFic29sdXRlIHBhdGg/XG5cdCAgICAgIGhpdFJvb3QgPSB0cnVlO1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICB9XG5cdCAgLy8gaWYgd2UgZGlkbid0IGhpdCByb290LCBwcmVwZW5kIGN3ZFxuXHQgIGlmICghaGl0Um9vdCkge1xuXHQgICAgcmVzb2x2ZWQgPSAoZ2xvYmFsLnByb2Nlc3MgPyBwcm9jZXNzLmN3ZCgpIDogJy8nKSArIHNlcGFyYXRvciArIHJlc29sdmVkO1xuXHQgIH1cblx0ICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzb2x2ZWQpO1xuXHQgIGlmIChub3JtYWxpemVkLmNoYXJBdChub3JtYWxpemVkLmxlbmd0aCAtIDEpID09PSBzZXBhcmF0b3IpIHtcblx0ICAgIC8vIEZJWE1FOiBIYW5kbGUgVU5DIHBhdGhzIG9uIFdpbmRvd3MgYXMgd2VsbCwgc28gd2UgZG9uJ3QgdHJpbSB0cmFpbGluZyBzZXBhcmF0b3Igb24gc29tZXRoaW5nIGxpa2UgJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXCdcblx0ICAgIC8vIERvbid0IHJlbW92ZSB0cmFpbGluZyBzZXBhcmF0b3IgaWYgdGhpcyBpcyByb290IHBhdGggb24gd2luZG93cyFcblx0ICAgIGlmICghaXNQb3NpeCAmJiBub3JtYWxpemVkLmxlbmd0aCA9PT0gMyAmJiBub3JtYWxpemVkLmNoYXJBdCgxKSA9PT0gJzonICYmIGlzV2luZG93c0RldmljZU5hbWUobm9ybWFsaXplZC5jaGFyQ29kZUF0KDApKSkge1xuXHQgICAgICByZXR1cm4gbm9ybWFsaXplZDtcblx0ICAgIH1cblx0ICAgIC8vIG90aGVyd2lzZSB0cmltIHRyYWlsaW5nIHNlcGFyYXRvclxuXHQgICAgcmV0dXJuIG5vcm1hbGl6ZWQuc2xpY2UoMCwgbm9ybWFsaXplZC5sZW5ndGggLSAxKTtcblx0ICB9XG5cdCAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnJlbGF0aXZlKClgIG1ldGhvZCByZXR1cm5zIHRoZSByZWxhdGl2ZSBwYXRoIGBmcm9tYCBmcm9tIHRvIGB0b2AgYmFzZWRcblx0ICogb24gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIElmIGZyb20gYW5kIHRvIGVhY2ggcmVzb2x2ZSB0byB0aGUgc2FtZVxuXHQgKiBwYXRoIChhZnRlciBjYWxsaW5nIGBwYXRoLnJlc29sdmUoKWAgb24gZWFjaCksIGEgemVyby1sZW5ndGggc3RyaW5nIGlzIHJldHVybmVkLlxuXHQgKlxuXHQgKiBJZiBhIHplcm8tbGVuZ3RoIHN0cmluZyBpcyBwYXNzZWQgYXMgYGZyb21gIG9yIGB0b2AsIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5XG5cdCAqIHdpbGwgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSB6ZXJvLWxlbmd0aCBzdHJpbmdzLlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZyb20gW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHRvICAgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVsYXRpdmUoc2VwYXJhdG9yLCBmcm9tLCB0bykge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmcm9tLCAnZnJvbScsICdzdHJpbmcnKTtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUodG8sICd0bycsICdzdHJpbmcnKTtcblx0ICBpZiAoZnJvbSA9PT0gdG8pIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9XG5cdCAgZnJvbSA9IHJlc29sdmUoc2VwYXJhdG9yLCBbZnJvbV0pO1xuXHQgIHRvID0gcmVzb2x2ZShzZXBhcmF0b3IsIFt0b10pO1xuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIC8vIHdlIG5vdyBoYXZlIHR3byBhYnNvbHV0ZSBwYXRocyxcblx0ICAvLyBsZXRzIFwiZ28gdXBcIiBmcm9tIGBmcm9tYCB1bnRpbCB3ZSByZWFjaCBjb21tb24gYmFzZSBkaXIgb2YgYHRvYFxuXHQgIC8vIGNvbnN0IG9yaWdpbmFsRnJvbSA9IGZyb207XG5cdCAgbGV0IHVwQ291bnQgPSAwO1xuXHQgIGxldCByZW1haW5pbmdQYXRoID0gJyc7XG5cdCAgd2hpbGUgKHRydWUpIHtcblx0ICAgIGlmICh0by5zdGFydHNXaXRoKGZyb20pKSB7XG5cdCAgICAgIC8vIG1hdGNoISByZWNvcmQgcmVzdC4uLj9cblx0ICAgICAgcmVtYWluaW5nUGF0aCA9IHRvLnNsaWNlKGZyb20ubGVuZ3RoKTtcblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogQnJlYWsvdGhyb3cgaWYgd2UgaGl0IGJhZCBlZGdlIGNhc2Ugb2Ygbm8gY29tbW9uIHJvb3QhXG5cdCAgICBmcm9tID0gZGlybmFtZShzZXBhcmF0b3IsIGZyb20pO1xuXHQgICAgdXBDb3VudCsrO1xuXHQgIH1cblx0ICAvLyByZW1vdmUgbGVhZGluZyBzZXBhcmF0b3IgZnJvbSByZW1haW5pbmdQYXRoIGlmIHRoZXJlIGlzIGFueVxuXHQgIGlmIChyZW1haW5pbmdQYXRoLmxlbmd0aCA+IDApIHtcblx0ICAgIHJlbWFpbmluZ1BhdGggPSByZW1haW5pbmdQYXRoLnNsaWNlKDEpO1xuXHQgIH1cblx0ICByZXR1cm4gKCcuLicgKyBzZXBhcmF0b3IpLnJlcGVhdCh1cENvdW50KSArIHJlbWFpbmluZ1BhdGg7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwYXRoLnBhcnNlKClgIG1ldGhvZCByZXR1cm5zIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHJlcHJlc2VudFxuXHQgKiBzaWduaWZpY2FudCBlbGVtZW50cyBvZiB0aGUgcGF0aC4gVHJhaWxpbmcgZGlyZWN0b3J5IHNlcGFyYXRvcnMgYXJlIGlnbm9yZWQsXG5cdCAqIHNlZSBgcGF0aC5zZXBgLlxuXHQgKlxuXHQgKiBUaGUgcmV0dXJuZWQgb2JqZWN0IHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cdCAqXG5cdCAqIC0gZGlyIDxzdHJpbmc+XG5cdCAqIC0gcm9vdCA8c3RyaW5nPlxuXHQgKiAtIGJhc2UgPHN0cmluZz5cblx0ICogLSBuYW1lIDxzdHJpbmc+XG5cdCAqIC0gZXh0IDxzdHJpbmc+XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqL1xuXHRmdW5jdGlvbiBwYXJzZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblx0ICBjb25zdCByZXN1bHQgPSB7XG5cdCAgICByb290OiAnJyxcblx0ICAgIGRpcjogJycsXG5cdCAgICBiYXNlOiAnJyxcblx0ICAgIGV4dDogJycsXG5cdCAgICBuYW1lOiAnJ1xuXHQgIH07XG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXHQgIGlmIChsZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXG5cdCAgLy8gQ2hlYXQgYW5kIGp1c3QgY2FsbCBvdXIgb3RoZXIgbWV0aG9kcyBmb3IgZGlybmFtZS9iYXNlbmFtZS9leHRuYW1lP1xuXHQgIHJlc3VsdC5iYXNlID0gYmFzZW5hbWUoc2VwYXJhdG9yLCBmaWxlcGF0aCk7XG5cdCAgcmVzdWx0LmV4dCA9IGV4dG5hbWUoc2VwYXJhdG9yLCByZXN1bHQuYmFzZSk7XG5cdCAgY29uc3QgYmFzZUxlbmd0aCA9IHJlc3VsdC5iYXNlLmxlbmd0aDtcblx0ICByZXN1bHQubmFtZSA9IHJlc3VsdC5iYXNlLnNsaWNlKDAsIGJhc2VMZW5ndGggLSByZXN1bHQuZXh0Lmxlbmd0aCk7XG5cdCAgY29uc3QgdG9TdWJ0cmFjdCA9IGJhc2VMZW5ndGggPT09IDAgPyAwIDogYmFzZUxlbmd0aCArIDE7XG5cdCAgcmVzdWx0LmRpciA9IGZpbGVwYXRoLnNsaWNlKDAsIGZpbGVwYXRoLmxlbmd0aCAtIHRvU3VidHJhY3QpOyAvLyBkcm9wIHRyYWlsaW5nIHNlcGFyYXRvciFcblx0ICBjb25zdCBmaXJzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTtcblx0ICAvLyBib3RoIHdpbjMyIGFuZCBQT1NJWCByZXR1cm4gJy8nIHJvb3Rcblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCkge1xuXHQgICAgcmVzdWx0LnJvb3QgPSAnLyc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH1cblx0ICAvLyB3ZSdyZSBkb25lIHdpdGggUE9TSVguLi5cblx0ICBpZiAoc2VwYXJhdG9yID09PSAnLycpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHQgIC8vIGZvciB3aW4zMi4uLlxuXHQgIGlmIChmaXJzdENoYXJDb2RlID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgLy8gRklYTUU6IEhhbmRsZSBVTkMgcGF0aHMgbGlrZSAnXFxcXFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcZmlsZV9wYXRoJ1xuXHQgICAgLy8gbmVlZCB0byByZXRhaW4gJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXCcgYXMgcm9vdCBpbiB0aGF0IGNhc2UhXG5cdCAgICByZXN1bHQucm9vdCA9ICdcXFxcJztcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHQgIC8vIGNoZWNrIGZvciBDOiBzdHlsZSByb290XG5cdCAgaWYgKGxlbmd0aCA+IDEgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgaWYgKGxlbmd0aCA+IDIpIHtcblx0ICAgICAgLy8gaXMgaXQgbGlrZSBDOlxcXFw/XG5cdCAgICAgIGNvbnN0IHRoaXJkQ2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDIpO1xuXHQgICAgICBpZiAodGhpcmRDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCB8fCB0aGlyZENoYXJDb2RlID09PSBCQUNLV0FSRF9TTEFTSCkge1xuXHQgICAgICAgIHJlc3VsdC5yb290ID0gZmlsZXBhdGguc2xpY2UoMCwgMyk7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgLy8gbm9wZSwganVzdCBDOiwgbm8gdHJhaWxpbmcgc2VwYXJhdG9yXG5cdCAgICByZXN1bHQucm9vdCA9IGZpbGVwYXRoLnNsaWNlKDAsIDIpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5mb3JtYXQoKWAgbWV0aG9kIHJldHVybnMgYSBwYXRoIHN0cmluZyBmcm9tIGFuIG9iamVjdC4gVGhpcyBpcyB0aGVcblx0ICogb3Bwb3NpdGUgb2YgYHBhdGgucGFyc2UoKWAuXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge29iamVjdH0gcGF0aE9iamVjdCBvYmplY3Qgb2YgZm9ybWF0IHJldHVybmVkIGJ5IGBwYXRoLnBhcnNlKClgXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5kaXIgZGlyZWN0b3J5IG5hbWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LnJvb3QgZmlsZSByb290IGRpciwgaWdub3JlZCBpZiBgcGF0aE9iamVjdC5kaXJgIGlzIHByb3ZpZGVkXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5iYXNlIGZpbGUgYmFzZW5hbWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0Lm5hbWUgYmFzZW5hbWUgbWludXMgZXh0ZW5zaW9uLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmJhc2VgIGV4aXN0c1xuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3QuZXh0IGZpbGUgZXh0ZW5zaW9uLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmJhc2VgIGV4aXN0c1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JtYXQoc2VwYXJhdG9yLCBwYXRoT2JqZWN0KSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKHBhdGhPYmplY3QsICdwYXRoT2JqZWN0JywgJ29iamVjdCcpO1xuXHQgIGNvbnN0IGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgYCR7cGF0aE9iamVjdC5uYW1lIHx8ICcnfSR7cGF0aE9iamVjdC5leHQgfHwgJyd9YDtcblxuXHQgIC8vIGFwcGVuZCBiYXNlIHRvIHJvb3QgaWYgYGRpcmAgd2Fzbid0IHNwZWNpZmllZCwgb3IgaWZcblx0ICAvLyBkaXIgaXMgdGhlIHJvb3Rcblx0ICBpZiAoIXBhdGhPYmplY3QuZGlyIHx8IHBhdGhPYmplY3QuZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcblx0ICAgIHJldHVybiBgJHtwYXRoT2JqZWN0LnJvb3QgfHwgJyd9JHtiYXNlfWA7XG5cdCAgfVxuXHQgIC8vIGNvbWJpbmUgZGlyICsgLyArIGJhc2Vcblx0ICByZXR1cm4gYCR7cGF0aE9iamVjdC5kaXJ9JHtzZXBhcmF0b3J9JHtiYXNlfWA7XG5cdH1cblxuXHQvKipcblx0ICogT24gV2luZG93cyBzeXN0ZW1zIG9ubHksIHJldHVybnMgYW4gZXF1aXZhbGVudCBuYW1lc3BhY2UtcHJlZml4ZWQgcGF0aCBmb3Jcblx0ICogdGhlIGdpdmVuIHBhdGguIElmIHBhdGggaXMgbm90IGEgc3RyaW5nLCBwYXRoIHdpbGwgYmUgcmV0dXJuZWQgd2l0aG91dCBtb2RpZmljYXRpb25zLlxuXHQgKiBTZWUgaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvd2luZG93cy9kZXNrdG9wL0ZpbGVJTy9uYW1pbmctYS1maWxlI25hbWVzcGFjZXNcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gdG9OYW1lc3BhY2VkUGF0aChmaWxlcGF0aCkge1xuXHQgIGlmICh0eXBlb2YgZmlsZXBhdGggIT09ICdzdHJpbmcnKSB7XG5cdCAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgfVxuXHQgIGlmIChmaWxlcGF0aC5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9XG5cdCAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZSgnXFxcXCcsIFtmaWxlcGF0aF0pO1xuXHQgIGNvbnN0IGxlbmd0aCA9IHJlc29sdmVkUGF0aC5sZW5ndGg7XG5cdCAgaWYgKGxlbmd0aCA8IDIpIHtcblx0ICAgIC8vIG5lZWQgJ1xcXFxcXFxcJyBvciAnQzonIG1pbmltdW1cblx0ICAgIHJldHVybiBmaWxlcGF0aDtcblx0ICB9XG5cdCAgY29uc3QgZmlyc3RDaGFyQ29kZSA9IHJlc29sdmVkUGF0aC5jaGFyQ29kZUF0KDApO1xuXHQgIC8vIGlmIHN0YXJ0IHdpdGggJ1xcXFxcXFxcJywgcHJlZml4IHdpdGggVU5DIHJvb3QsIGRyb3AgdGhlIHNsYXNoZXNcblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0ggJiYgcmVzb2x2ZWRQYXRoLmNoYXJBdCgxKSA9PT0gJ1xcXFwnKSB7XG5cdCAgICAvLyByZXR1cm4gYXMtaXMgaWYgaXQncyBhbiBhcmVhZHkgbG9uZyBwYXRoICgnXFxcXFxcXFw/XFxcXCcgb3IgJ1xcXFxcXFxcLlxcXFwnIHByZWZpeClcblx0ICAgIGlmIChsZW5ndGggPj0gMykge1xuXHQgICAgICBjb25zdCB0aGlyZENoYXIgPSByZXNvbHZlZFBhdGguY2hhckF0KDIpO1xuXHQgICAgICBpZiAodGhpcmRDaGFyID09PSAnPycgfHwgdGhpcmRDaGFyID09PSAnLicpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiAnXFxcXFxcXFw/XFxcXFVOQ1xcXFwnICsgcmVzb2x2ZWRQYXRoLnNsaWNlKDIpO1xuXHQgIH0gZWxzZSBpZiAoaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiByZXNvbHZlZFBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgIHJldHVybiAnXFxcXFxcXFw/XFxcXCcgKyByZXNvbHZlZFBhdGg7XG5cdCAgfVxuXHQgIHJldHVybiBmaWxlcGF0aDtcblx0fVxuXHRjb25zdCBXaW4zMlBhdGggPSB7XG5cdCAgc2VwOiAnXFxcXCcsXG5cdCAgZGVsaW1pdGVyOiAnOycsXG5cdCAgYmFzZW5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCwgZXh0KSB7XG5cdCAgICByZXR1cm4gYmFzZW5hbWUodGhpcy5zZXAsIGZpbGVwYXRoLCBleHQpO1xuXHQgIH0sXG5cdCAgbm9ybWFsaXplOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBub3JtYWxpemUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGpvaW46IGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwYXRocyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgcGF0aHNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gam9pbih0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgZXh0bmFtZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gZXh0bmFtZSh0aGlzLnNlcCwgZmlsZXBhdGgpO1xuXHQgIH0sXG5cdCAgZGlybmFtZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gZGlybmFtZSh0aGlzLnNlcCwgZmlsZXBhdGgpO1xuXHQgIH0sXG5cdCAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gaXNBYnNvbHV0ZShmYWxzZSwgZmlsZXBhdGgpO1xuXHQgIH0sXG5cdCAgcmVsYXRpdmU6IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuXHQgICAgcmV0dXJuIHJlbGF0aXZlKHRoaXMuc2VwLCBmcm9tLCB0byk7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHBhdGhzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdCAgICAgIHBhdGhzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IHRvTmFtZXNwYWNlZFBhdGhcblx0fTtcblx0Y29uc3QgUG9zaXhQYXRoID0ge1xuXHQgIHNlcDogJy8nLFxuXHQgIGRlbGltaXRlcjogJzonLFxuXHQgIGJhc2VuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgsIGV4dCkge1xuXHQgICAgcmV0dXJuIGJhc2VuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCwgZXh0KTtcblx0ICB9LFxuXHQgIG5vcm1hbGl6ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gbm9ybWFsaXplKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBqb2luOiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIHBhdGhzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG5cdCAgICAgIHBhdGhzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG5cdCAgICB9XG5cdCAgICByZXR1cm4gam9pbih0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgZXh0bmFtZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gZXh0bmFtZSh0aGlzLnNlcCwgZmlsZXBhdGgpO1xuXHQgIH0sXG5cdCAgZGlybmFtZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gZGlybmFtZSh0aGlzLnNlcCwgZmlsZXBhdGgpO1xuXHQgIH0sXG5cdCAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gaXNBYnNvbHV0ZSh0cnVlLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICByZWxhdGl2ZTogZnVuY3Rpb24gKGZyb20sIHRvKSB7XG5cdCAgICByZXR1cm4gcmVsYXRpdmUodGhpcy5zZXAsIGZyb20sIHRvKTtcblx0ICB9LFxuXHQgIHJlc29sdmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgcGF0aHMgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcblx0ICAgICAgcGF0aHNbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiByZXNvbHZlKHRoaXMuc2VwLCBwYXRocyk7XG5cdCAgfSxcblx0ICBwYXJzZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gcGFyc2UodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGZvcm1hdDogZnVuY3Rpb24gKHBhdGhPYmplY3QpIHtcblx0ICAgIHJldHVybiBmb3JtYXQodGhpcy5zZXAsIHBhdGhPYmplY3QpO1xuXHQgIH0sXG5cdCAgdG9OYW1lc3BhY2VkUGF0aDogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gZmlsZXBhdGg7IC8vIG5vLW9wXG5cdCAgfVxuXHR9O1xuXHRjb25zdCBwYXRoID0gUG9zaXhQYXRoO1xuXHRwYXRoLndpbjMyID0gV2luMzJQYXRoO1xuXHRwYXRoLnBvc2l4ID0gUG9zaXhQYXRoO1xuXG5cdHZhciBpbnZva2VyID0ge307XG5cblx0LyoqXG5cdCAqIFRpdGFuaXVtIFNES1xuXHQgKiBDb3B5cmlnaHQgVGlEZXYsIEluYy4gMDQvMDcvMjAyMi1QcmVzZW50LiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFwYWNoZSBQdWJsaWMgTGljZW5zZVxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBMSUNFTlNFIGluY2x1ZGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gZm9yIGRldGFpbHMuXG5cdCAqL1xuXHR2YXIgaGFzUmVxdWlyZWRJbnZva2VyO1xuXHRmdW5jdGlvbiByZXF1aXJlSW52b2tlcigpIHtcblx0ICBpZiAoaGFzUmVxdWlyZWRJbnZva2VyKSByZXR1cm4gaW52b2tlcjtcblx0ICBoYXNSZXF1aXJlZEludm9rZXIgPSAxO1xuXHQgIC8qKlxuXHQgICAqIEdlbmVyYXRlcyBhIHdyYXBwZWQgaW52b2tlciBmdW5jdGlvbiBmb3IgYSBzcGVjaWZpYyBBUElcblx0ICAgKiBUaGlzIGxldHMgdXMgcGFzcyBpbiBjb250ZXh0LXNwZWNpZmljIGRhdGEgdG8gYSBmdW5jdGlvblxuXHQgICAqIGRlZmluZWQgaW4gYW4gQVBJIG5hbWVzcGFjZSAoaS5lLiBvbiBhIG1vZHVsZSlcblx0ICAgKlxuXHQgICAqIFdlIHVzZSB0aGlzIGZvciBjcmVhdGUgbWV0aG9kcywgYW5kIG90aGVyIEFQSXMgdGhhdCB0YWtlXG5cdCAgICogYSBLcm9sbEludm9jYXRpb24gb2JqZWN0IGFzIHRoZWlyIGZpcnN0IGFyZ3VtZW50IGluIEphdmFcblx0ICAgKlxuXHQgICAqIEZvciBleGFtcGxlLCBhbiBpbnZva2VyIGZvciBhIFwiY3JlYXRlXCIgbWV0aG9kIG1pZ2h0IGxvb2tcblx0ICAgKiBzb21ldGhpbmcgbGlrZSB0aGlzOlxuXHQgICAqXG5cdCAgICogICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoc291cmNlVXJsLCBvcHRpb25zKSB7XG5cdCAgICogICAgICAgICB2YXIgdmlldyA9IG5ldyBWaWV3KG9wdGlvbnMpO1xuXHQgICAqICAgICAgICAgdmlldy5zb3VyY2VVcmwgPSBzb3VyY2VVcmw7XG5cdCAgICogICAgICAgICByZXR1cm4gdmlldztcblx0ICAgKiAgICAgfVxuXHQgICAqXG5cdCAgICogQW5kIHRoZSBjb3JyZXNwb25kaW5nIGludm9rZXIgZm9yIGFwcC5qcyB3b3VsZCBsb29rIGxpa2U6XG5cdCAgICpcblx0ICAgKiAgICAgVUkuY3JlYXRlVmlldyA9IGZ1bmN0aW9uKCkge1xuXHQgICAqICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoXCJhcHA6Ly9hcHAuanNcIiwgYXJndW1lbnRzWzBdKTtcblx0ICAgKiAgICAgfVxuXHQgICAqXG5cdCAgICogd3JhcHBlckFQSTogVGhlIHNjb3BlIHNwZWNpZmljIEFQSSAobW9kdWxlKSB3cmFwcGVyXG5cdCAgICogcmVhbEFQSTogVGhlIGFjdHVhbCBtb2R1bGUgaW1wbGVtZW50YXRpb25cblx0ICAgKiBhcGlOYW1lOiBUaGUgdG9wIGxldmVsIEFQSSBuYW1lIG9mIHRoZSByb290IG1vZHVsZVxuXHQgICAqIGludm9jYXRpb25BUEk6IFRoZSBhY3R1YWwgQVBJIHRvIGdlbmVyYXRlIGFuIGludm9rZXIgZm9yXG5cdCAgICogc2NvcGVWYXJzOiBBIG1hcCB0aGF0IGlzIHBhc3NlZCBpbnRvIGVhY2ggaW52b2tlclxuXHQgICAqL1xuXG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IHdyYXBwZXJBUEkgZS5nLiBUaXRhbml1bVdyYXBwZXJcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbEFQSSBlLmcuIFRpdGFuaXVtXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGFwaU5hbWUgZS5nLiAnVGl0YW5pdW0nXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IGludm9jYXRpb25BUEkgZGV0YWlscyBvbiB0aGUgQVBJIHdlJ3JlIHdyYXBwaW5nXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGludm9jYXRpb25BUEkubmFtZXNwYWNlIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIHByb3h5IHdoZXJlIG1ldGhvZCBoYW5ncyAody9vICdUaS4nIHByZWZpeCkgZS5nLiAnRmlsZXN5c3RlbScgb3IgJ1VJLkFuZHJvaWQnXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGludm9jYXRpb25BUEkuYXBpIHRoZSBtZXRob2QgbmFtZSBlLmcuICdvcGVuRmlsZScgb3IgJ2NyZWF0ZVNlYXJjaFZpZXcnXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IHNjb3BlVmFycyBob2xkZXIgZm9yIGNvbnRleHQgc3BlY2lmaWMgdmFsdWVzIChiYXNpY2FsbHkganVzdCB3cmFwcyBzb3VyY2VVcmwpXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlVmFycy5zb3VyY2VVcmwgc291cmNlIFVSTCBvZiBKUyBmaWxlIGVudHJ5IHBvaW50XG5cdCAgICogQHBhcmFtIHtNb2R1bGV9IFtzY29wZVZhcnMubW9kdWxlXSBtb2R1bGVcblx0ICAgKi9cblx0ICBmdW5jdGlvbiBnZW5JbnZva2VyKHdyYXBwZXJBUEksIHJlYWxBUEksIGFwaU5hbWUsIGludm9jYXRpb25BUEksIHNjb3BlVmFycykge1xuXHQgICAgbGV0IGFwaU5hbWVzcGFjZSA9IHdyYXBwZXJBUEk7XG5cdCAgICBjb25zdCBuYW1lc3BhY2UgPSBpbnZvY2F0aW9uQVBJLm5hbWVzcGFjZTtcblx0ICAgIGlmIChuYW1lc3BhY2UgIT09IGFwaU5hbWUpIHtcblx0ICAgICAgY29uc3QgbmFtZXMgPSBuYW1lc3BhY2Uuc3BsaXQoJy4nKTtcblx0ICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG5cdCAgICAgICAgbGV0IGFwaTtcblx0ICAgICAgICAvLyBDcmVhdGUgYSBtb2R1bGUgd3JhcHBlciBvbmx5IGlmIGl0IGhhc24ndCBiZWVuIHdyYXBwZWQgYWxyZWFkeS5cblx0ICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwaU5hbWVzcGFjZSwgbmFtZSkpIHtcblx0ICAgICAgICAgIGFwaSA9IGFwaU5hbWVzcGFjZVtuYW1lXTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgZnVuY3Rpb24gU2FuZGJveEFQSSgpIHtcblx0ICAgICAgICAgICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG5cdCAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2V2ZW50cycsIHtcblx0ICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBwcm90by5fZXZlbnRzO1xuXHQgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgIHByb3RvLl9ldmVudHMgPSB2YWx1ZTtcblx0ICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgU2FuZGJveEFQSS5wcm90b3R5cGUgPSBhcGlOYW1lc3BhY2VbbmFtZV07XG5cdCAgICAgICAgICBhcGkgPSBuZXcgU2FuZGJveEFQSSgpO1xuXHQgICAgICAgICAgYXBpTmFtZXNwYWNlW25hbWVdID0gYXBpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBhcGlOYW1lc3BhY2UgPSBhcGk7XG5cdCAgICAgICAgcmVhbEFQSSA9IHJlYWxBUElbbmFtZV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGxldCBkZWxlZ2F0ZSA9IHJlYWxBUElbaW52b2NhdGlvbkFQSS5hcGldO1xuXHQgICAgLy8gVGhlc2UgaW52b2tlcnMgZm9ybSBhIGNhbGwgaGllcmFyY2h5IHNvIHdlIG5lZWQgdG9cblx0ICAgIC8vIHByb3ZpZGUgYSB3YXkgYmFjayB0byB0aGUgYWN0dWFsIHJvb3QgVGl0YW5pdW0gLyBhY3R1YWwgaW1wbC5cblx0ICAgIHdoaWxlIChkZWxlZ2F0ZS5fX2RlbGVnYXRlX18pIHtcblx0ICAgICAgZGVsZWdhdGUgPSBkZWxlZ2F0ZS5fX2RlbGVnYXRlX187XG5cdCAgICB9XG5cdCAgICBhcGlOYW1lc3BhY2VbaW52b2NhdGlvbkFQSS5hcGldID0gY3JlYXRlSW52b2tlcihyZWFsQVBJLCBkZWxlZ2F0ZSwgc2NvcGVWYXJzKTtcblx0ICB9XG5cdCAgaW52b2tlci5nZW5JbnZva2VyID0gZ2VuSW52b2tlcjtcblxuXHQgIC8qKlxuXHQgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBzaW5nbGUgaW52b2tlciBmdW5jdGlvbiB0aGF0IHdyYXBzXG5cdCAgICogYSBkZWxlZ2F0ZSBmdW5jdGlvbiwgdGhpc09iaiwgYW5kIHNjb3BlVmFyc1xuXHQgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGlzT2JqIFRoZSBgdGhpc2Agb2JqZWN0IHRvIHVzZSB3aGVuIGludm9raW5nIHRoZSBgZGVsZWdhdGVgIGZ1bmN0aW9uXG5cdCAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGVsZWdhdGUgVGhlIGZ1bmN0aW9uIHRvIHdyYXAvZGVsZWdhdGUgdG8gdW5kZXIgdGhlIGhvb2Rcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gc2NvcGVWYXJzIFRoZSBzY29wZSB2YXJpYWJsZXMgdG8gc3BsaWNlIGludG8gdGhlIGFyZ3VtZW50cyB3aGVuIGNhbGxpbmcgdGhlIGRlbGVnYXRlXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlVmFycy5zb3VyY2VVcmwgdGhlIG9ubHkgcmVhbCByZWxldmVudCBzY29wZSB2YXJpYWJsZSFcblx0ICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cblx0ICAgKi9cblx0ICBmdW5jdGlvbiBjcmVhdGVJbnZva2VyKHRoaXNPYmosIGRlbGVnYXRlLCBzY29wZVZhcnMpIHtcblx0ICAgIGNvbnN0IHVybEludm9rZXIgPSBmdW5jdGlvbiBpbnZva2VyKCkge1xuXHQgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZnVuYy1zdHlsZVxuXHQgICAgICBhcmdzLnNwbGljZSgwLCAwLCBpbnZva2VyLl9fc2NvcGVWYXJzX18pO1xuXHQgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoaW52b2tlci5fX3RoaXNPYmpfXywgYXJncyk7XG5cdCAgICB9O1xuXHQgICAgdXJsSW52b2tlci5fX2RlbGVnYXRlX18gPSBkZWxlZ2F0ZTtcblx0ICAgIHVybEludm9rZXIuX190aGlzT2JqX18gPSB0aGlzT2JqO1xuXHQgICAgdXJsSW52b2tlci5fX3Njb3BlVmFyc19fID0gc2NvcGVWYXJzO1xuXHQgICAgcmV0dXJuIHVybEludm9rZXI7XG5cdCAgfVxuXHQgIGludm9rZXIuY3JlYXRlSW52b2tlciA9IGNyZWF0ZUludm9rZXI7XG5cdCAgcmV0dXJuIGludm9rZXI7XG5cdH1cblxuXHRyZXF1aXJlSW52b2tlcigpO1xuXG5cdC8qKlxuXHQgKiBUaXRhbml1bSBTREtcblx0ICogQ29weXJpZ2h0IFRpRGV2LCBJbmMuIDA0LzA3LzIwMjItUHJlc2VudC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBcGFjaGUgUHVibGljIExpY2Vuc2Vcblx0ICogUGxlYXNlIHNlZSB0aGUgTElDRU5TRSBpbmNsdWRlZCB3aXRoIHRoaXMgZGlzdHJpYnV0aW9uIGZvciBkZXRhaWxzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYm9vdHN0cmFwJDIoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIGNvbnN0IGFzc2V0cyA9IGtyb2xsLmJpbmRpbmcoJ2Fzc2V0cycpO1xuXHQgIGNvbnN0IFNjcmlwdCA9IGtyb2xsLmJpbmRpbmcoJ1NjcmlwdCcpO1xuXG5cdCAgLyoqXG5cdCAgICogVGhlIGxvYWRlZCBpbmRleC5qc29uIGZpbGUgZnJvbSB0aGUgYXBwLiBVc2VkIHRvIHN0b3JlIHRoZSBlbmNyeXB0ZWQgSlMgYXNzZXRzJ1xuXHQgICAqIGZpbGVuYW1lcy9vZmZzZXRzLlxuXHQgICAqL1xuXHQgIGxldCBmaWxlSW5kZXg7XG5cdCAgLy8gRklYTUU6IGZpeCBmaWxlIG5hbWUgcGFyaXR5IGJldHdlZW4gcGxhdGZvcm1zXG5cdCAgY29uc3QgSU5ERVhfSlNPTiA9ICcvX2luZGV4Xy5qc29uJztcblx0ICBjbGFzcyBNb2R1bGUge1xuXHQgICAgLyoqXG5cdCAgICAgKiBbTW9kdWxlIGRlc2NyaXB0aW9uXVxuXHQgICAgICogQHBhcmFtIHtzdHJpbmd9IGlkICAgICAgbW9kdWxlIGlkXG5cdCAgICAgKiBAcGFyYW0ge01vZHVsZX0gcGFyZW50ICBwYXJlbnQgbW9kdWxlXG5cdCAgICAgKi9cblx0ICAgIGNvbnN0cnVjdG9yKGlkLCBwYXJlbnQpIHtcblx0ICAgICAgdGhpcy5pZCA9IGlkO1xuXHQgICAgICB0aGlzLmV4cG9ydHMgPSB7fTtcblx0ICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cdCAgICAgIHRoaXMuZmlsZW5hbWUgPSBudWxsO1xuXHQgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXHQgICAgICB0aGlzLndyYXBwZXJDYWNoZSA9IHt9O1xuXHQgICAgICB0aGlzLmlzU2VydmljZSA9IGZhbHNlOyAvLyB0b2dnbGVkIG9uIGlmIHRoaXMgbW9kdWxlIGlzIHRoZSBzZXJ2aWNlIGVudHJ5IHBvaW50XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCB0aGUgbW9kdWxlLiBJZiBubyBmaWxlIGlzIGZvdW5kXG5cdCAgICAgKiB3aXRoIHRoZSBwcm92aWRlZCBuYW1lIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cblx0ICAgICAqIE9uY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGFyZSByZWFkLCBpdCBpcyBydW5cblx0ICAgICAqIGluIHRoZSBjdXJyZW50IGNvbnRleHQuIEEgc2FuZGJveCBpcyBjcmVhdGVkIGJ5XG5cdCAgICAgKiBleGVjdXRpbmcgdGhlIGNvZGUgaW5zaWRlIGEgd3JhcHBlciBmdW5jdGlvbi5cblx0ICAgICAqIFRoaXMgcHJvdmlkZXMgYSBzcGVlZCBib29zdCB2cyBjcmVhdGluZyBhIG5ldyBjb250ZXh0LlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2UgICBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcmV0dXJucyB7dm9pZH1cblx0ICAgICAqL1xuXHQgICAgbG9hZChmaWxlbmFtZSwgc291cmNlKSB7XG5cdCAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIGFscmVhZHkgbG9hZGVkLicpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblx0ICAgICAgdGhpcy5wYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVuYW1lKTtcblx0ICAgICAgdGhpcy5wYXRocyA9IHRoaXMubm9kZU1vZHVsZXNQYXRocyh0aGlzLnBhdGgpO1xuXHQgICAgICBpZiAoIXNvdXJjZSkge1xuXHQgICAgICAgIHNvdXJjZSA9IGFzc2V0cy5yZWFkQXNzZXQoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgLy8gU3RpY2sgaXQgaW4gdGhlIGNhY2hlXG5cdCAgICAgIE1vZHVsZS5jYWNoZVt0aGlzLmZpbGVuYW1lXSA9IHRoaXM7XG5cdCAgICAgIHRoaXMuX3J1blNjcmlwdChzb3VyY2UsIHRoaXMuZmlsZW5hbWUpO1xuXHQgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogR2VuZXJhdGVzIGEgY29udGV4dC1zcGVjaWZpYyBtb2R1bGUgd3JhcHBlciwgYW5kIHdyYXBzXG5cdCAgICAgKiBlYWNoIGludm9jYXRpb24gQVBJIGluIGFuIGV4dGVybmFsICgzcmQgcGFydHkpIG1vZHVsZVxuXHQgICAgICogU2VlIGludm9rZXIuanMgZm9yIG1vcmUgaW5mb1xuXHQgICAgICogQHBhcmFtICB7b2JqZWN0fSBleHRlcm5hbE1vZHVsZSBuYXRpdmUgbW9kdWxlIHByb3h5XG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZVVybCAgICAgIHRoZSBjdXJyZW50IEpTIGZpbGUgdXJsXG5cdCAgICAgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgIHdyYXBwZXIgYXJvdW5kIHRoZSBleHRlcm5hbE1vZHVsZVxuXHQgICAgICovXG5cdCAgICBjcmVhdGVNb2R1bGVXcmFwcGVyKGV4dGVybmFsTW9kdWxlLCBzb3VyY2VVcmwpIHtcblx0ICAgICAge1xuXHQgICAgICAgIC8vIGlPUyBkb2VzIG5vdCBuZWVkIGEgbW9kdWxlIHdyYXBwZXIsIHJldHVybiBvcmlnaW5hbCBleHRlcm5hbCBtb2R1bGVcblx0ICAgICAgICByZXR1cm4gZXh0ZXJuYWxNb2R1bGU7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBUYWtlcyBhIENvbW1vbkpTIG1vZHVsZSBhbmQgdXNlcyBpdCB0byBleHRlbmQgYW4gZXhpc3RpbmcgZXh0ZXJuYWwvbmF0aXZlIG1vZHVsZS4gVGhlIGV4cG9ydHMgYXJlIGFkZGVkIHRvIHRoZSBleHRlcm5hbCBtb2R1bGUuXG5cdCAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV4dGVybmFsTW9kdWxlIFRoZSBleHRlcm5hbC9uYXRpdmUgbW9kdWxlIHdlJ3JlIGV4dGVuZGluZ1xuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAgICAgICAgICAgICBtb2R1bGUgaWRcblx0ICAgICAqL1xuXHQgICAgZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzKGV4dGVybmFsTW9kdWxlLCBpZCkge1xuXHQgICAgICBpZiAoIWtyb2xsLmlzRXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCkpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBMb2FkIHVuZGVyIGZha2UgbmFtZSwgb3IgdGhlIGNvbW1vbmpzIHNpZGUgb2YgdGhlIG5hdGl2ZSBtb2R1bGUgZ2V0cyBjYWNoZWQgaW4gcGxhY2Ugb2YgdGhlIG5hdGl2ZSBtb2R1bGUhXG5cdCAgICAgIC8vIFNlZSBUSU1PQi0yNDkzMlxuXHQgICAgICBjb25zdCBmYWtlSWQgPSBgJHtpZH0uY29tbW9uanNgO1xuXHQgICAgICBjb25zdCBqc01vZHVsZSA9IG5ldyBNb2R1bGUoZmFrZUlkLCB0aGlzKTtcblx0ICAgICAganNNb2R1bGUubG9hZChmYWtlSWQsIGtyb2xsLmdldEV4dGVybmFsQ29tbW9uSnNNb2R1bGUoaWQpKTtcblx0ICAgICAgaWYgKGpzTW9kdWxlLmV4cG9ydHMpIHtcblx0ICAgICAgICBjb25zb2xlLnRyYWNlKGBFeHRlbmRpbmcgbmF0aXZlIG1vZHVsZSAnJHtpZH0nIHdpdGggdGhlIENvbW1vbkpTIG1vZHVsZSB0aGF0IHdhcyBwYWNrYWdlZCB3aXRoIGl0LmApO1xuXHQgICAgICAgIGtyb2xsLmV4dGVuZChleHRlcm5hbE1vZHVsZSwganNNb2R1bGUuZXhwb3J0cyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBMb2FkcyBhIG5hdGl2ZSAvIGV4dGVybmFsICgzcmQgcGFydHkpIG1vZHVsZVxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAgICAgICAgICAgICAgbW9kdWxlIGlkXG5cdCAgICAgKiBAcGFyYW0gIHtvYmplY3R9IGV4dGVybmFsQmluZGluZyBleHRlcm5hbCBiaW5kaW5nIG9iamVjdFxuXHQgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgVGhlIGV4cG9ydGVkIG1vZHVsZVxuXHQgICAgICovXG5cdCAgICBsb2FkRXh0ZXJuYWxNb2R1bGUoaWQsIGV4dGVybmFsQmluZGluZykge1xuXHQgICAgICAvLyB0cnkgdG8gZ2V0IHRoZSBjYWNoZWQgbW9kdWxlLi4uXG5cdCAgICAgIGxldCBleHRlcm5hbE1vZHVsZSA9IE1vZHVsZS5jYWNoZVtpZF07XG5cdCAgICAgIGlmICghZXh0ZXJuYWxNb2R1bGUpIHtcblx0ICAgICAgICAvLyBpT1MgYW5kIEFuZHJvaWQgZGlmZmVyIHF1aXRlIGEgYml0IGhlcmUuXG5cdCAgICAgICAgLy8gV2l0aCBpb3MsIHdlIHNob3VsZCBhbHJlYWR5IGhhdmUgdGhlIG5hdGl2ZSBtb2R1bGUgbG9hZGVkXG5cdCAgICAgICAgLy8gVGhlcmUncyBubyBzcGVjaWFsIFwiYm9vdHN0cmFwLmpzXCIgZmlsZSBwYWNrYWdlZCB3aXRoaW4gaXRcblx0ICAgICAgICAvLyBPbiBBbmRyb2lkLCB3ZSBsb2FkIGEgYm9vdHN0cmFwLmpzIGJ1bmRsZWQgd2l0aCB0aGUgbW9kdWxlXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgZXh0ZXJuYWxNb2R1bGUgPSBleHRlcm5hbEJpbmRpbmc7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGlmICghZXh0ZXJuYWxNb2R1bGUpIHtcblx0ICAgICAgICBjb25zb2xlLnRyYWNlKGBVbmFibGUgdG8gbG9hZCBleHRlcm5hbCBtb2R1bGU6ICR7aWR9YCk7XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBjYWNoZSB0aGUgbG9hZGVkIG5hdGl2ZSBtb2R1bGUgKGJlZm9yZSB3ZSBleHRlbmQgaXQpXG5cdCAgICAgIE1vZHVsZS5jYWNoZVtpZF0gPSBleHRlcm5hbE1vZHVsZTtcblxuXHQgICAgICAvLyBXZSBjYWNoZSBlYWNoIGNvbnRleHQtc3BlY2lmaWMgbW9kdWxlIHdyYXBwZXJcblx0ICAgICAgLy8gb24gdGhlIHBhcmVudCBtb2R1bGUsIHJhdGhlciB0aGFuIGluIHRoZSBNb2R1bGUuY2FjaGVcblx0ICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLndyYXBwZXJDYWNoZVtpZF07XG5cdCAgICAgIGlmICh3cmFwcGVyKSB7XG5cdCAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG5cdCAgICAgIH1cblx0ICAgICAgY29uc3Qgc291cmNlVXJsID0gYGFwcDovLyR7dGhpcy5maWxlbmFtZX1gOyAvLyBGSVhNRTogSWYgdGhpcy5maWxlbmFtZSBzdGFydHMgd2l0aCAnLycsIHdlIG5lZWQgdG8gZHJvcCBpdCwgSSB0aGluaz9cblx0ICAgICAgd3JhcHBlciA9IHRoaXMuY3JlYXRlTW9kdWxlV3JhcHBlcihleHRlcm5hbE1vZHVsZSwgc291cmNlVXJsKTtcblxuXHQgICAgICAvLyBUaGVuIHdlIFwiZXh0ZW5kXCIgdGhlIEFQSS9tb2R1bGUgdXNpbmcgYW55IHNoaXBwZWQgSlMgY29kZSAoYXNzZXRzLzxtb2R1bGUuaWQ+LmpzKVxuXHQgICAgICB0aGlzLmV4dGVuZE1vZHVsZVdpdGhDb21tb25Kcyh3cmFwcGVyLCBpZCk7XG5cdCAgICAgIHRoaXMud3JhcHBlckNhY2hlW2lkXSA9IHdyYXBwZXI7XG5cdCAgICAgIHJldHVybiB3cmFwcGVyO1xuXHQgICAgfVxuXG5cdCAgICAvLyBTZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9tb2R1bGVzLmh0bWwjbW9kdWxlc19hbGxfdG9nZXRoZXJcblxuXHQgICAgLyoqXG5cdCAgICAgKiBSZXF1aXJlIGFub3RoZXIgbW9kdWxlIGFzIGEgY2hpbGQgb2YgdGhpcyBtb2R1bGUuXG5cdCAgICAgKiBUaGlzIHBhcmVudCBtb2R1bGUncyBwYXRoIGlzIHVzZWQgYXMgdGhlIGJhc2UgZm9yIHJlbGF0aXZlIHBhdGhzXG5cdCAgICAgKiB3aGVuIGxvYWRpbmcgdGhlIGNoaWxkLiBSZXR1cm5zIHRoZSBleHBvcnRzIG9iamVjdFxuXHQgICAgICogb2YgdGhlIGNoaWxkIG1vZHVsZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlcXVlc3QgIFRoZSBwYXRoIHRvIHRoZSByZXF1ZXN0ZWQgbW9kdWxlXG5cdCAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgIFRoZSBsb2FkZWQgbW9kdWxlXG5cdCAgICAgKi9cblx0ICAgIHJlcXVpcmUocmVxdWVzdCkge1xuXHQgICAgICAvLyAyLiBJZiBYIGJlZ2lucyB3aXRoICcuLycgb3IgJy8nIG9yICcuLi8nXG5cdCAgICAgIGNvbnN0IHN0YXJ0ID0gcmVxdWVzdC5zdWJzdHJpbmcoMCwgMik7IC8vIGhhY2sgdXAgdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmcgdG8gY2hlY2sgcmVsYXRpdmUvYWJzb2x1dGUvXCJuYWtlZFwiIG1vZHVsZSBpZFxuXHQgICAgICBpZiAoc3RhcnQgPT09ICcuLycgfHwgc3RhcnQgPT09ICcuLicpIHtcblx0ICAgICAgICBjb25zdCBsb2FkZWQgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLm5vcm1hbGl6ZSh0aGlzLnBhdGggKyAnLycgKyByZXF1ZXN0KSk7XG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICAvLyBSb290L2Fic29sdXRlIHBhdGggKGludGVybmFsbHkgd2hlbiByZWFkaW5nIHRoZSBmaWxlLCB3ZSBwcmVwZW5kIFwiUmVzb3VyY2VzL1wiIGFzIHJvb3QgZGlyKVxuXHQgICAgICB9IGVsc2UgaWYgKHJlcXVlc3Quc3Vic3RyaW5nKDAsIDEpID09PSAnLycpIHtcblx0ICAgICAgICBjb25zdCBsb2FkZWQgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLm5vcm1hbGl6ZShyZXF1ZXN0KSk7XG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBEZXNwaXRlIGJlaW5nIHN0ZXAgMSBpbiBOb2RlLkpTIHBzdWVkby1jb2RlLCB3ZSBtb3ZlZCBpdCBkb3duIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCBhbGxvdyBuYXRpdmUgbW9kdWxlc1xuXHQgICAgICAgIC8vIHRvIHN0YXJ0IHdpdGggJy4vJywgJy4uJyBvciAnLycgLSBzbyB0aGlzIGF2b2lkcyBhIGxvdCBvZiBtaXNzZXMgb24gcmVxdWlyZXMgc3RhcnRpbmcgdGhhdCB3YXlcblxuXHQgICAgICAgIC8vIDEuIElmIFggaXMgYSBjb3JlIG1vZHVsZSxcblx0ICAgICAgICBsZXQgbG9hZGVkID0gdGhpcy5sb2FkQ29yZU1vZHVsZShyZXF1ZXN0KTtcblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICAvLyBhLiByZXR1cm4gdGhlIGNvcmUgbW9kdWxlXG5cdCAgICAgICAgICAvLyBiLiBTVE9QXG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIExvb2sgZm9yIENvbW1vbkpTIG1vZHVsZVxuXHQgICAgICAgIGlmIChyZXF1ZXN0LmluZGV4T2YoJy8nKSA9PT0gLTEpIHtcblx0ICAgICAgICAgIC8vIEZvciBDb21tb25KUyB3ZSBuZWVkIHRvIGxvb2sgZm9yIG1vZHVsZS5pZC9tb2R1bGUuaWQuanMgZmlyc3QuLi5cblx0ICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYC8ke3JlcXVlc3R9LyR7cmVxdWVzdH0uanNgO1xuXHQgICAgICAgICAgLy8gT25seSBsb29rIGZvciB0aGlzIF9leGFjdCBmaWxlXy4gRE8gTk9UIEFQUEVORCAuanMgb3IgLmpzb24gdG8gaXQhXG5cdCAgICAgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpO1xuXHQgICAgICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIC8vIFRoZW4gdHJ5IG1vZHVsZS5pZCBhcyBkaXJlY3Rvcnlcblx0ICAgICAgICAgIGxvYWRlZCA9IHRoaXMubG9hZEFzRGlyZWN0b3J5KGAvJHtyZXF1ZXN0fWApO1xuXHQgICAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gQWxsb3cgbG9va2luZyB0aHJvdWdoIG5vZGVfbW9kdWxlc1xuXHQgICAgICAgIC8vIDMuIExPQURfTk9ERV9NT0RVTEVTKFgsIGRpcm5hbWUoWSkpXG5cdCAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkTm9kZU1vZHVsZXMocmVxdWVzdCwgdGhpcy5wYXRocyk7XG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIEZhbGxiYWNrIHRvIG9sZCBUaXRhbml1bSBiZWhhdmlvciBvZiBhc3N1bWluZyBpdCdzIGFjdHVhbGx5IGFuIGFic29sdXRlIHBhdGhcblxuXHQgICAgICAgIC8vIFdlJ2QgbGlrZSB0byB3YXJuIHVzZXJzIGFib3V0IGxlZ2FjeSBzdHlsZSByZXF1aXJlIHN5bnRheCBzbyB0aGV5IGNhbiB1cGRhdGUsIGJ1dCB0aGUgbmV3IHN5bnRheCBpcyBub3QgYmFja3dhcmRzIGNvbXBhdGlibGUuXG5cdCAgICAgICAgLy8gU28gZm9yIG5vdywgbGV0J3MganVzdCBiZSBxdWl0ZSBhYm91dCBpdC4gSW4gZnV0dXJlIHZlcnNpb25zIG9mIHRoZSBTREsgKDcuMD8pIHdlIHNob3VsZCB3YXJuIChvbmNlIDUueCBpcyBlbmQgb2YgbGlmZSBzbyBiYWNrd2FyZHMgY29tcGF0IGlzIG5vdCBuZWNlc3NhcnkpXG5cdCAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cblx0ICAgICAgICAvLyBjb25zb2xlLndhcm4oYHJlcXVpcmUgY2FsbGVkIHdpdGggdW4tcHJlZml4ZWQgbW9kdWxlIGlkOiAke3JlcXVlc3R9LCBzaG91bGQgYmUgYSBjb3JlIG9yIENvbW1vbkpTIG1vZHVsZS4gRmFsbGluZyBiYWNrIHRvIG9sZCBUaSBiZWhhdmlvciBhbmQgYXNzdW1pbmcgaXQncyBhbiBhYnNvbHV0ZSBwYXRoOiAvJHtyZXF1ZXN0fWApO1xuXG5cdCAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkQXNGaWxlT3JEaXJlY3RvcnkocGF0aC5ub3JtYWxpemUoYC8ke3JlcXVlc3R9YCkpO1xuXHQgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyA0LiBUSFJPVyBcIm5vdCBmb3VuZFwiXG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWVzdGVkIG1vZHVsZSBub3QgZm91bmQ6ICR7cmVxdWVzdH1gKTsgLy8gVE9ETyBTZXQgJ2NvZGUnIHByb3BlcnR5IHRvICdNT0RVTEVfTk9UX0ZPVU5EJyB0byBtYXRjaCBOb2RlP1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIExvYWRzIHRoZSBjb3JlIG1vZHVsZSBpZiBpdCBleGlzdHMuIElmIG5vdCwgcmV0dXJucyBudWxsLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGlkIFRoZSByZXF1ZXN0IG1vZHVsZSBpZFxuXHQgICAgICogQHJldHVybiB7T2JqZWN0fSAgICB0cnVlIGlmIHRoZSBtb2R1bGUgaWQgbWF0Y2hlcyBhIG5hdGl2ZSBvciBDb21tb25KUyBtb2R1bGUgaWQsIChvciBpdCdzIGZpcnN0IHBhdGggc2VnbWVudCBkb2VzKS5cblx0ICAgICAqL1xuXHQgICAgbG9hZENvcmVNb2R1bGUoaWQpIHtcblx0ICAgICAgLy8gc2tpcCBiYWQgaWRzLCByZWxhdGl2ZSBpZHMsIGFic29sdXRlIGlkcy4gXCJuYXRpdmVcIi9cImNvcmVcIiBtb2R1bGVzIHNob3VsZCBiZSBvZiBmb3JtIFwibW9kdWxlLmlkXCIgb3IgXCJtb2R1bGUuaWQvc3ViLmZpbGUuanNcIlxuXHQgICAgICBpZiAoIWlkIHx8IGlkLnN0YXJ0c1dpdGgoJy4nKSB8fCBpZC5zdGFydHNXaXRoKCcvJykpIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIGNoZWNrIGlmIHdlIGhhdmUgYSBjYWNoZWQgY29weSBvZiB0aGUgd3JhcHBlclxuXHQgICAgICBpZiAodGhpcy53cmFwcGVyQ2FjaGVbaWRdKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMud3JhcHBlckNhY2hlW2lkXTtcblx0ICAgICAgfVxuXHQgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcvJyk7XG5cdCAgICAgIGNvbnN0IGV4dGVybmFsQmluZGluZyA9IGtyb2xsLmV4dGVybmFsQmluZGluZyhwYXJ0c1swXSk7XG5cdCAgICAgIGlmIChleHRlcm5hbEJpbmRpbmcpIHtcblx0ICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBcInJvb3RcIiBvZiBhbiBleHRlcm5hbCBtb2R1bGUuIEl0IGNhbiBsb29rIGxpa2U6XG5cdCAgICAgICAgICAvLyByZXF1ZXN0KFwiY29tLmV4YW1wbGUubXltb2R1bGVcIilcblx0ICAgICAgICAgIC8vIFdlIGNhbiBsb2FkIGFuZCByZXR1cm4gaXQgcmlnaHQgYXdheSAoY2FjaGluZyBvY2N1cnMgaW4gdGhlIGNhbGxlZCBmdW5jdGlvbikuXG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkRXh0ZXJuYWxNb2R1bGUocGFydHNbMF0sIGV4dGVybmFsQmluZGluZyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gQ291bGQgYmUgYSBzdWItbW9kdWxlIChDb21tb25KUykgb2YgYW4gZXh0ZXJuYWwgbmF0aXZlIG1vZHVsZS5cblx0ICAgICAgICAvLyBXZSBhbGxvdyB0aGF0IHNpbmNlIFRJTU9CLTk3MzAuXG5cdCAgICAgICAgaWYgKGtyb2xsLmlzRXh0ZXJuYWxDb21tb25Kc01vZHVsZShwYXJ0c1swXSkpIHtcblx0ICAgICAgICAgIGNvbnN0IGV4dGVybmFsQ29tbW9uSnNDb250ZW50cyA9IGtyb2xsLmdldEV4dGVybmFsQ29tbW9uSnNNb2R1bGUoaWQpO1xuXHQgICAgICAgICAgaWYgKGV4dGVybmFsQ29tbW9uSnNDb250ZW50cykge1xuXHQgICAgICAgICAgICAvLyBmb3VuZCBpdFxuXHQgICAgICAgICAgICAvLyBGSVhNRSBSZS11c2UgbG9hZEFzSmF2YVNjcmlwdFRleHQ/XG5cdCAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoaWQsIHRoaXMpO1xuXHQgICAgICAgICAgICBtb2R1bGUubG9hZChpZCwgZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzKTtcblx0ICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbnVsbDsgLy8gZmFpbGVkIHRvIGxvYWRcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgbm9kZSBtb2R1bGUgYnkgaWQgZnJvbSB0aGUgc3RhcnRpbmcgcGF0aFxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBtb2R1bGVJZCAgICAgICBUaGUgcGF0aCBvZiB0aGUgbW9kdWxlIHRvIGxvYWQuXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmdbXX0gZGlycyAgICAgICBwYXRocyB0byBzZWFyY2hcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSAgICAgIFRoZSBtb2R1bGUsIGlmIGxvYWRlZC4gbnVsbCBpZiBub3QuXG5cdCAgICAgKi9cblx0ICAgIGxvYWROb2RlTW9kdWxlcyhtb2R1bGVJZCwgZGlycykge1xuXHQgICAgICAvLyAyLiBmb3IgZWFjaCBESVIgaW4gRElSUzpcblx0ICAgICAgZm9yIChjb25zdCBkaXIgb2YgZGlycykge1xuXHQgICAgICAgIC8vIGEuIExPQURfQVNfRklMRShESVIvWClcblx0ICAgICAgICAvLyBiLiBMT0FEX0FTX0RJUkVDVE9SWShESVIvWClcblx0ICAgICAgICBjb25zdCBtb2QgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLmpvaW4oZGlyLCBtb2R1bGVJZCkpO1xuXHQgICAgICAgIGlmIChtb2QpIHtcblx0ICAgICAgICAgIHJldHVybiBtb2Q7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIERldGVybWluZSB0aGUgc2V0IG9mIHBhdGhzIHRvIHNlYXJjaCBmb3Igbm9kZV9tb2R1bGVzXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0YXJ0RGlyICAgICAgIFRoZSBzdGFydGluZyBkaXJlY3Rvcnlcblx0ICAgICAqIEByZXR1cm4ge3N0cmluZ1tdfSAgICAgICAgICAgICAgVGhlIGFycmF5IG9mIHBhdGhzIHRvIHNlYXJjaFxuXHQgICAgICovXG5cdCAgICBub2RlTW9kdWxlc1BhdGhzKHN0YXJ0RGlyKSB7XG5cdCAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGFic29sdXRlIHBhdGggdG8gc3RhcnQgd2l0aFxuXHQgICAgICBzdGFydERpciA9IHBhdGgucmVzb2x2ZShzdGFydERpcik7XG5cblx0ICAgICAgLy8gUmV0dXJuIGVhcmx5IGlmIHdlIGFyZSBhdCByb290LCB0aGlzIGF2b2lkcyBkb2luZyBhIHBvaW50bGVzcyBsb29wXG5cdCAgICAgIC8vIGFuZCBhbHNvIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGR1cGxpY2F0ZSBlbnRyaWVzXG5cdCAgICAgIC8vIGUuZy4gW1wiL25vZGVfbW9kdWxlc1wiLCBcIi9ub2RlX21vZHVsZXNcIl1cblx0ICAgICAgaWYgKHN0YXJ0RGlyID09PSAnLycpIHtcblx0ICAgICAgICByZXR1cm4gWycvbm9kZV9tb2R1bGVzJ107XG5cdCAgICAgIH1cblx0ICAgICAgLy8gMS4gbGV0IFBBUlRTID0gcGF0aCBzcGxpdChTVEFSVClcblx0ICAgICAgY29uc3QgcGFydHMgPSBzdGFydERpci5zcGxpdCgnLycpO1xuXHQgICAgICAvLyAyLiBsZXQgSSA9IGNvdW50IG9mIFBBUlRTIC0gMVxuXHQgICAgICBsZXQgaSA9IHBhcnRzLmxlbmd0aCAtIDE7XG5cdCAgICAgIC8vIDMuIGxldCBESVJTID0gW11cblx0ICAgICAgY29uc3QgZGlycyA9IFtdO1xuXG5cdCAgICAgIC8vIDQuIHdoaWxlIEkgPj0gMCxcblx0ICAgICAgd2hpbGUgKGkgPj0gMCkge1xuXHQgICAgICAgIC8vIGEuIGlmIFBBUlRTW0ldID0gXCJub2RlX21vZHVsZXNcIiBDT05USU5VRVxuXHQgICAgICAgIGlmIChwYXJ0c1tpXSA9PT0gJ25vZGVfbW9kdWxlcycgfHwgcGFydHNbaV0gPT09ICcnKSB7XG5cdCAgICAgICAgICBpIC09IDE7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgLy8gYi4gRElSID0gcGF0aCBqb2luKFBBUlRTWzAgLi4gSV0gKyBcIm5vZGVfbW9kdWxlc1wiKVxuXHQgICAgICAgIGNvbnN0IGRpciA9IHBhdGguam9pbihwYXJ0cy5zbGljZSgwLCBpICsgMSkuam9pbignLycpLCAnbm9kZV9tb2R1bGVzJyk7XG5cdCAgICAgICAgLy8gYy4gRElSUyA9IERJUlMgKyBESVJcblx0ICAgICAgICBkaXJzLnB1c2goZGlyKTtcblx0ICAgICAgICAvLyBkLiBsZXQgSSA9IEkgLSAxXG5cdCAgICAgICAgaSAtPSAxO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIEFsd2F5cyBhZGQgL25vZGVfbW9kdWxlcyB0byB0aGUgc2VhcmNoIHBhdGhcblx0ICAgICAgZGlycy5wdXNoKCcvbm9kZV9tb2R1bGVzJyk7XG5cdCAgICAgIHJldHVybiBkaXJzO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYSBnaXZlbiBwYXRoIGFzIGEgZmlsZSBvciBkaXJlY3RvcnkuXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5vcm1hbGl6ZWRQYXRoIFRoZSBwYXRoIG9mIHRoZSBtb2R1bGUgdG8gbG9hZC5cblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSBUaGUgbG9hZGVkIG1vZHVsZS4gbnVsbCBpZiB1bmFibGUgdG8gbG9hZC5cblx0ICAgICAqL1xuXHQgICAgbG9hZEFzRmlsZU9yRGlyZWN0b3J5KG5vcm1hbGl6ZWRQYXRoKSB7XG5cdCAgICAgIC8vIGEuIExPQURfQVNfRklMRShZICsgWClcblx0ICAgICAgbGV0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZShub3JtYWxpemVkUGF0aCk7XG5cdCAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICByZXR1cm4gbG9hZGVkO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIGIuIExPQURfQVNfRElSRUNUT1JZKFkgKyBYKVxuXHQgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRBc0RpcmVjdG9yeShub3JtYWxpemVkUGF0aCk7XG5cdCAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICByZXR1cm4gbG9hZGVkO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIExvYWRzIGEgZ2l2ZW4gZmlsZSBhcyBhIEphdmFzY3JpcHQgZmlsZSwgcmV0dXJuaW5nIHRoZSBtb2R1bGUuZXhwb3J0cy5cblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gZmlsZW5hbWUgRmlsZSB3ZSdyZSBhdHRlbXB0aW5nIHRvIGxvYWRcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZX0gdGhlIGxvYWRlZCBtb2R1bGVcblx0ICAgICAqL1xuXHQgICAgbG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKSB7XG5cdCAgICAgIC8vIExvb2sgaW4gdGhlIGNhY2hlIVxuXHQgICAgICBpZiAoTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSkge1xuXHQgICAgICAgIHJldHVybiBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdO1xuXHQgICAgICB9XG5cdCAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoZmlsZW5hbWUsIHRoaXMpO1xuXHQgICAgICBtb2R1bGUubG9hZChmaWxlbmFtZSk7XG5cdCAgICAgIHJldHVybiBtb2R1bGU7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgYSBKU09OIGZpbGUgYnkgcmVhZGluZyBpdCdzIGNvbnRlbnRzLCBkb2luZyBhIEpTT04ucGFyc2UgYW5kIHJldHVybmluZyB0aGUgcGFyc2VkIG9iamVjdC5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGZpbGVuYW1lIEZpbGUgd2UncmUgYXR0ZW1wdGluZyB0byBsb2FkXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV9IFRoZSBsb2FkZWQgbW9kdWxlIGluc3RhbmNlXG5cdCAgICAgKi9cblx0ICAgIGxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKSB7XG5cdCAgICAgIC8vIExvb2sgaW4gdGhlIGNhY2hlIVxuXHQgICAgICBpZiAoTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSkge1xuXHQgICAgICAgIHJldHVybiBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdO1xuXHQgICAgICB9XG5cdCAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoZmlsZW5hbWUsIHRoaXMpO1xuXHQgICAgICBtb2R1bGUuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblx0ICAgICAgbW9kdWxlLnBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpO1xuXHQgICAgICBjb25zdCBzb3VyY2UgPSBhc3NldHMucmVhZEFzc2V0KGZpbGVuYW1lKTtcblxuXHQgICAgICAvLyBTdGljayBpdCBpbiB0aGUgY2FjaGVcblx0ICAgICAgTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSA9IG1vZHVsZTtcblx0ICAgICAgbW9kdWxlLmV4cG9ydHMgPSBKU09OLnBhcnNlKHNvdXJjZSk7XG5cdCAgICAgIG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbW9kdWxlO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYSBmaWxlIGJ5IGl0J3MgZnVsbCBmaWxlbmFtZSBhY2NvcmRpbmcgdG8gTm9kZUpTIHJ1bGVzLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgVGhlIGZpbGVuYW1lXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV8bnVsbH0gTW9kdWxlIGluc3RhbmNlIGlmIGxvYWRlZCwgbnVsbCBpZiBub3QgZm91bmQuXG5cdCAgICAgKi9cblx0ICAgIGxvYWRBc0ZpbGUoaWQpIHtcblx0ICAgICAgLy8gMS4gSWYgWCBpcyBhIGZpbGUsIGxvYWQgWCBhcyBKYXZhU2NyaXB0IHRleHQuICBTVE9QXG5cdCAgICAgIGxldCBmaWxlbmFtZSA9IGlkO1xuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICAvLyBJZiB0aGUgZmlsZSBoYXMgYSAuanNvbiBleHRlbnNpb24sIGxvYWQgYXMgSmF2YXNjcmlwdE9iamVjdFxuXHQgICAgICAgIGlmIChmaWxlbmFtZS5sZW5ndGggPiA1ICYmIGZpbGVuYW1lLnNsaWNlKC00KSA9PT0gJ2pzb24nKSB7XG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiB0aGlzLmxvYWRKYXZhc2NyaXB0VGV4dChmaWxlbmFtZSk7XG5cdCAgICAgIH1cblx0ICAgICAgLy8gMi4gSWYgWC5qcyBpcyBhIGZpbGUsIGxvYWQgWC5qcyBhcyBKYXZhU2NyaXB0IHRleHQuICBTVE9QXG5cdCAgICAgIGZpbGVuYW1lID0gaWQgKyAnLmpzJztcblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfVxuXHQgICAgICAvLyAzLiBJZiBYLmpzb24gaXMgYSBmaWxlLCBwYXJzZSBYLmpzb24gdG8gYSBKYXZhU2NyaXB0IE9iamVjdC4gIFNUT1Bcblx0ICAgICAgZmlsZW5hbWUgPSBpZCArICcuanNvbic7XG5cdCAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKTtcblx0ICAgICAgfVxuXHQgICAgICAvLyBmYWlsZWQgdG8gbG9hZCBhbnl0aGluZyFcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhIGRpcmVjdG9yeSBhY2NvcmRpbmcgdG8gTm9kZUpTIHJ1bGVzLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgVGhlIGRpcmVjdG9yeSBuYW1lXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV8bnVsbH0gTG9hZGVkIG1vZHVsZSwgbnVsbCBpZiBub3QgZm91bmQuXG5cdCAgICAgKi9cblx0ICAgIGxvYWRBc0RpcmVjdG9yeShpZCkge1xuXHQgICAgICAvLyAxLiBJZiBYL3BhY2thZ2UuanNvbiBpcyBhIGZpbGUsXG5cdCAgICAgIGxldCBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShpZCwgJ3BhY2thZ2UuanNvbicpO1xuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICAvLyBhLiBQYXJzZSBYL3BhY2thZ2UuanNvbiwgYW5kIGxvb2sgZm9yIFwibWFpblwiIGZpZWxkLlxuXHQgICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICAgIGlmIChvYmplY3QgJiYgb2JqZWN0LmV4cG9ydHMgJiYgb2JqZWN0LmV4cG9ydHMubWFpbikge1xuXHQgICAgICAgICAgLy8gYi4gbGV0IE0gPSBYICsgKGpzb24gbWFpbiBmaWVsZClcblx0ICAgICAgICAgIGNvbnN0IG0gPSBwYXRoLnJlc29sdmUoaWQsIG9iamVjdC5leHBvcnRzLm1haW4pO1xuXHQgICAgICAgICAgLy8gYy4gTE9BRF9BU19GSUxFKE0pXG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQXNGaWxlT3JEaXJlY3RvcnkobSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgLy8gMi4gSWYgWC9pbmRleC5qcyBpcyBhIGZpbGUsIGxvYWQgWC9pbmRleC5qcyBhcyBKYXZhU2NyaXB0IHRleHQuICBTVE9QXG5cdCAgICAgIGZpbGVuYW1lID0gcGF0aC5yZXNvbHZlKGlkLCAnaW5kZXguanMnKTtcblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfVxuXHQgICAgICAvLyAzLiBJZiBYL2luZGV4Lmpzb24gaXMgYSBmaWxlLCBwYXJzZSBYL2luZGV4Lmpzb24gdG8gYSBKYXZhU2NyaXB0IG9iamVjdC4gU1RPUFxuXHQgICAgICBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShpZCwgJ2luZGV4Lmpzb24nKTtcblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIFNldHVwIGEgc2FuZGJveCBhbmQgcnVuIHRoZSBtb2R1bGUncyBzY3JpcHQgaW5zaWRlIGl0LlxuXHQgICAgICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBleGVjdXRlZCBzY3JpcHQuXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgIFtkZXNjcmlwdGlvbl1cblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHJldHVybiB7Kn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICovXG5cdCAgICBfcnVuU2NyaXB0KHNvdXJjZSwgZmlsZW5hbWUpIHtcblx0ICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICAgIGZ1bmN0aW9uIHJlcXVpcmUocGF0aCkge1xuXHQgICAgICAgIHJldHVybiBzZWxmLnJlcXVpcmUocGF0aCk7XG5cdCAgICAgIH1cblx0ICAgICAgcmVxdWlyZS5tYWluID0gTW9kdWxlLm1haW47XG5cblx0ICAgICAgLy8gVGhpcyBcImZpcnN0IHRpbWVcIiBydW4gaXMgcmVhbGx5IG9ubHkgZm9yIGFwcC5qcywgQUZBSUNULCBhbmQgbmVlZHNcblx0ICAgICAgLy8gYW4gYWN0aXZpdHkuIElmIGFwcCB3YXMgcmVzdGFydGVkIGZvciBTZXJ2aWNlIG9ubHksIHdlIGRvbid0IHdhbnRcblx0ICAgICAgLy8gdG8gZ28gdGhpcyByb3V0ZS4gU28gYWRkZWQgY3VycmVudEFjdGl2aXR5IGNoZWNrLiAoYmlsbClcblx0ICAgICAgaWYgKHNlbGYuaWQgPT09ICcuJyAmJiAhdGhpcy5pc1NlcnZpY2UpIHtcblx0ICAgICAgICBnbG9iYWwucmVxdWlyZSA9IHJlcXVpcmU7XG5cblx0ICAgICAgICAvLyBjaGVjayBpZiB3ZSBoYXZlIGFuIGluc3BlY3RvciBiaW5kaW5nLi4uXG5cdCAgICAgICAgY29uc3QgaW5zcGVjdG9yID0ga3JvbGwuYmluZGluZygnaW5zcGVjdG9yJyk7XG5cdCAgICAgICAgaWYgKGluc3BlY3Rvcikge1xuXHQgICAgICAgICAgLy8gSWYgZGVidWdnZXIgaXMgZW5hYmxlZCwgbG9hZCBhcHAuanMgYW5kIHBhdXNlIHJpZ2h0IGJlZm9yZSB3ZSBleGVjdXRlIGl0XG5cdCAgICAgICAgICBjb25zdCBpbnNwZWN0b3JXcmFwcGVyID0gaW5zcGVjdG9yLmNhbGxBbmRQYXVzZU9uU3RhcnQ7XG5cdCAgICAgICAgICBpZiAoaW5zcGVjdG9yV3JhcHBlcikge1xuXHQgICAgICAgICAgICAvLyBGSVhNRSBXaHkgY2FuJ3Qgd2UgZG8gbm9ybWFsIE1vZHVsZS53cmFwKHNvdXJjZSkgaGVyZT9cblx0ICAgICAgICAgICAgLy8gSSBnZXQgXCJVbmNhdWdodCBUeXBlRXJyb3I6IENhbm5vdCByZWFkIHByb3BlcnR5ICdjcmVhdGVUYWJHcm91cCcgb2YgdW5kZWZpbmVkXCIgZm9yIFwiVGkuVUkuY3JlYXRlVGFiR3JvdXAoKTtcIlxuXHQgICAgICAgICAgICAvLyBOb3Qgc3VyZSB3aHkgYXBwLmpzIGlzIHNwZWNpYWwgY2FzZSBhbmQgY2FuJ3QgYmUgcnVuIHVuZGVyIG5vcm1hbCBzZWxmLWludm9raW5nIHdyYXBwaW5nIGZ1bmN0aW9uIHRoYXQgZ2V0cyBwYXNzZWQgaW4gZ2xvYmFsL2tyb2xsL1RpL2V0Y1xuXHQgICAgICAgICAgICAvLyBJbnN0ZWFkLCBsZXQncyB1c2UgYSBzbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIGNhbGxBbmRQYXVzZU9uU3RhcnQ6XG5cdCAgICAgICAgICAgIC8vIEl0IHdpbGwgY29tcGlsZSB0aGUgc291cmNlIGFzLWlzLCBzY2hlZHVsZSBhIHBhdXNlIGFuZCB0aGVuIHJ1biB0aGUgc291cmNlLlxuXHQgICAgICAgICAgICByZXR1cm4gaW5zcGVjdG9yV3JhcHBlcihzb3VyY2UsIGZpbGVuYW1lKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgLy8gcnVuIGFwcC5qcyBcIm5vcm1hbGx5XCIgKGkuZS4gbm90IHVuZGVyIGRlYnVnZ2VyL2luc3BlY3Rvcilcblx0ICAgICAgICByZXR1cm4gU2NyaXB0LnJ1bkluVGhpc0NvbnRleHQoc291cmNlLCBmaWxlbmFtZSwgdHJ1ZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBJbiBWOCwgd2UgdHJlYXQgZXh0ZXJuYWwgbW9kdWxlcyB0aGUgc2FtZSBhcyBuYXRpdmUgbW9kdWxlcy4gIEZpcnN0LCB3ZSB3cmFwIHRoZVxuXHQgICAgICAvLyBtb2R1bGUgY29kZSBhbmQgdGhlbiBydW4gaXQgaW4gdGhlIGN1cnJlbnQgY29udGV4dC4gIFRoaXMgd2lsbCBhbGxvdyBleHRlcm5hbCBtb2R1bGVzIHRvXG5cdCAgICAgIC8vIGFjY2VzcyBnbG9iYWxzIGFzIG1lbnRpb25lZCBpbiBUSU1PQi0xMTc1Mi4gVGhpcyB3aWxsIGFsc28gaGVscCByZXNvbHZlIHN0YXJ0dXAgc2xvd25lc3MgdGhhdFxuXHQgICAgICAvLyBvY2N1cnMgYXMgYSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgY29udGV4dCBkdXJpbmcgc3RhcnR1cCBpbiBUSU1PQi0xMjI4Ni5cblx0ICAgICAgc291cmNlID0gTW9kdWxlLndyYXAoc291cmNlKTtcblx0ICAgICAgY29uc3QgZiA9IFNjcmlwdC5ydW5JblRoaXNDb250ZXh0KHNvdXJjZSwgZmlsZW5hbWUsIHRydWUpO1xuXHQgICAgICByZXR1cm4gZih0aGlzLmV4cG9ydHMsIHJlcXVpcmUsIHRoaXMsIGZpbGVuYW1lLCBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpLCBUaXRhbml1bSwgVGksIGdsb2JhbCwga3JvbGwpO1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIExvb2sgdXAgYSBmaWxlbmFtZSBpbiB0aGUgYXBwJ3MgaW5kZXguanNvbiBmaWxlXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGZpbGVuYW1lIHRoZSBmaWxlIHdlJ3JlIGxvb2tpbmcgZm9yXG5cdCAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgIHRydWUgaWYgdGhlIGZpbGVuYW1lIGV4aXN0cyBpbiB0aGUgaW5kZXguanNvblxuXHQgICAgICovXG5cdCAgICBmaWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkge1xuXHQgICAgICBmaWxlbmFtZSA9ICdSZXNvdXJjZXMnICsgZmlsZW5hbWU7IC8vIFdoZW4gd2UgYWN0dWFsbHkgbG9vayBmb3IgZmlsZXMsIGFzc3VtZSBcIlJlc291cmNlcy9cIiBpcyB0aGUgcm9vdFxuXHQgICAgICBpZiAoIWZpbGVJbmRleCkge1xuXHQgICAgICAgIGNvbnN0IGpzb24gPSBhc3NldHMucmVhZEFzc2V0KElOREVYX0pTT04pO1xuXHQgICAgICAgIGZpbGVJbmRleCA9IEpTT04ucGFyc2UoanNvbik7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGZpbGVJbmRleCAmJiBmaWxlbmFtZSBpbiBmaWxlSW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIE1vZHVsZS5jYWNoZSA9IFtdO1xuXHQgIE1vZHVsZS5tYWluID0gbnVsbDtcblx0ICBNb2R1bGUud3JhcHBlciA9IFsnKGZ1bmN0aW9uIChleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgVGl0YW5pdW0sIFRpLCBnbG9iYWwsIGtyb2xsKSB7JywgJ1xcbn0pOyddO1xuXHQgIE1vZHVsZS53cmFwID0gZnVuY3Rpb24gKHNjcmlwdCkge1xuXHQgICAgcmV0dXJuIE1vZHVsZS53cmFwcGVyWzBdICsgc2NyaXB0ICsgTW9kdWxlLndyYXBwZXJbMV07XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIFtydW5Nb2R1bGUgZGVzY3JpcHRpb25dXG5cdCAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2UgICAgICAgICAgICBKUyBTb3VyY2UgY29kZVxuXHQgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgICAgICAgICAgRmlsZW5hbWUgb2YgdGhlIG1vZHVsZVxuXHQgICAqIEBwYXJhbSAge1RpdGFuaXVtLlNlcnZpY2V8bnVsbHxUaXRhbml1bS5BbmRyb2lkLkFjdGl2aXR5fSBhY3Rpdml0eU9yU2VydmljZSBbZGVzY3JpcHRpb25dXG5cdCAgICogQHJldHVybiB7TW9kdWxlfSAgICAgICAgICAgICAgICAgICBUaGUgbG9hZGVkIE1vZHVsZVxuXHQgICAqL1xuXHQgIE1vZHVsZS5ydW5Nb2R1bGUgPSBmdW5jdGlvbiAoc291cmNlLCBmaWxlbmFtZSwgYWN0aXZpdHlPclNlcnZpY2UpIHtcblx0ICAgIGxldCBpZCA9IGZpbGVuYW1lO1xuXHQgICAgaWYgKCFNb2R1bGUubWFpbikge1xuXHQgICAgICBpZCA9ICcuJztcblx0ICAgIH1cblx0ICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoaWQsIG51bGwpO1xuXHQgICAgLy8gRklYTUU6IEkgZG9uJ3Qga25vdyB3aHkgaW5zdGFuY2VvZiBmb3IgVGl0YW5pdW0uU2VydmljZSB3b3JrcyBoZXJlIVxuXHQgICAgLy8gT24gQW5kcm9pZCwgaXQncyBhbiBhcGluYW1lIG9mIFRpLkFuZHJvaWQuU2VydmljZVxuXHQgICAgLy8gT24gaU9TLCB3ZSBkb24ndCB5ZXQgcGFzcyBpbiB0aGUgdmFsdWUsIGJ1dCB3ZSBkbyBzZXQgVGkuQXBwLmN1cnJlbnRTZXJ2aWNlIHByb3BlcnR5IGJlZm9yZWhhbmQhXG5cdCAgICAvLyBDYW4gd2UgcmVtb3ZlIHRoZSBwcmVsb2FkIHN0dWZmIGluIEtyb2xsQnJpZGdlLm0gdG8gcGFzcyBhbG9uZyB0aGUgc2VydmljZSBpbnN0YW5jZSBpbnRvIHRoaXMgbGlrZSB3ZSBkbyBvbiBBbmRyb2lkP1xuXHQgICAgbW9kdWxlLmlzU2VydmljZSA9IFRpLkFwcC5jdXJyZW50U2VydmljZSAhPT0gbnVsbDtcblx0ICAgIGlmICghTW9kdWxlLm1haW4pIHtcblx0ICAgICAgTW9kdWxlLm1haW4gPSBtb2R1bGU7XG5cdCAgICB9XG5cdCAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoJ1Jlc291cmNlcy8nLCAnLycpOyAvLyBub3JtYWxpemUgYmFjayB0byBhYnNvbHV0ZSBwYXRocyAod2hpY2ggcmVhbGx5IGFyZSByZWxhdGl2ZSB0byBSZXNvdXJjZXMgdW5kZXIgdGhlIGhvb2QpXG5cdCAgICBtb2R1bGUubG9hZChmaWxlbmFtZSwgc291cmNlKTtcblx0ICAgIHJldHVybiBtb2R1bGU7XG5cdCAgfTtcblx0ICByZXR1cm4gTW9kdWxlO1xuXHR9XG5cblx0LyogZ2xvYmFscyBPU19BTkRST0lELCBPU19JT1MgKi9cblx0ZnVuY3Rpb24gYm9vdHN0cmFwJDEoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIHtcblx0ICAgIC8vIE9uIGlPUywgcmVhbGx5IHdlIGp1c3QgbmVlZCB0byBzZXQgdXAgdGhlIFRvcFRpTW9kdWxlIGJpbmRpbmcgc3R1ZmYsIHRoZW4gaGFuZyBsYXp5IHByb3BlcnR5IGdldHRlcnMgZm9yIHRoZSB0b3AtbGV2ZWwgbW9kdWxlcyBsaWtlIFVJLCBBUEksIGV0Y1xuXHQgICAgY29uc3QgVGkgPSBrcm9sbC5iaW5kaW5nKCd0b3BUaScpO1xuXHQgICAgY29uc3QgbW9kdWxlcyA9IFsnQWNjZWxlcm9tZXRlcicsICdBcHAnLCAnQVBJJywgJ0NhbGVuZGFyJywgJ0NvZGVjJywgJ0NvbnRhY3RzJywgJ0RhdGFiYXNlJywgJ0ZpbGVzeXN0ZW0nLCAnR2VvbG9jYXRpb24nLCAnR2VzdHVyZScsICdMb2NhbGUnLCAnTWVkaWEnLCAnTmV0d29yaycsICdQbGF0Zm9ybScsICdTdHJlYW0nLCAnVXRpbHMnLCAnVUknLCAnV2F0Y2hTZXNzaW9uJywgJ1hNTCddO1xuXHQgICAgZm9yIChjb25zdCBtb2ROYW1lIG9mIG1vZHVsZXMpIHtcblx0ICAgICAgLy8gVGhpcyBtYWtlcyB0aGUgbmFtZXNwYWNlIFwibGF6eVwiIC0gd2UgaW5zdGFudGlhdGUgaXQgb24gZGVtYW5kIGFuZCB0aGVuXG5cdCAgICAgIC8vIHJlcGxhY2UgdGhlIGxhenkgaW5pdCB3aXRoIHN0cmFpZ2h0IHByb3BlcnR5IHZhbHVlIHdoZW4gZG9uZVxuXHQgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGksIG1vZE5hbWUsIHtcblx0ICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG5cdCAgICAgICAgLy8gbXVzdCBiZSBjb25maWd1cmFibGUgdG8gYmUgYWJsZSB0byBjaGFuZ2UgdGhlIHByb3BlcnR5IHRvIHN0YXRpYyB2YWx1ZSBhZnRlciBhY2Nlc3Ncblx0ICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcblx0ICAgICAgICAvLyB3cml0YWJsZTogdHJ1ZSwgLy8gY2Fubm90IHNwZWNpZnkgd3JpdGFibGUgd2l0aCBhIGdldHRlclxuXHQgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgY29uc3QgcmVhbE1vZHVsZSA9IGtyb2xsLmJpbmRpbmcobW9kTmFtZSk7XG5cdCAgICAgICAgICAvLyBOb3cgcmVwbGFjZSBvdXIgbGF6eSBnZXR0ZXIgb24gdGhlIHByb3BlcnR5IHdpdGggYSB2YWx1ZVxuXHQgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpLCBtb2ROYW1lLCB7XG5cdCAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdCAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuXHQgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG5cdCAgICAgICAgICAgIHZhbHVlOiByZWFsTW9kdWxlXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICAgIHJldHVybiByZWFsTW9kdWxlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gVGk7XG5cdCAgfVxuXHR9XG5cblx0Ly8gVGhpcyBpcyB0aGUgZmlsZSBlYWNoIHBsYXRmb3JtIGxvYWRzIG9uIGJvb3QgKmJlZm9yZSogd2UgbGF1bmNoIHRpLm1haW4uanMgdG8gaW5zZXJ0IGFsbCBvdXIgc2hpbXMvZXh0ZW5zaW9uc1xuXG5cdC8qKlxuXHQgKiBtYWluIGJvb3RzdHJhcHBpbmcgZnVuY3Rpb25cblx0ICogQHBhcmFtIHtvYmplY3R9IGdsb2JhbCB0aGUgZ2xvYmFsIG9iamVjdFxuXHQgKiBAcGFyYW0ge29iamVjdH0ga3JvbGw7IHRoZSBrcm9sbCBtb2R1bGUvYmluZGluZ1xuXHQgKiBAcmV0dXJuIHt2b2lkfSAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRmdW5jdGlvbiBib290c3RyYXAoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIC8vIFdvcmtzIGlkZW50aWNhbCB0byBPYmplY3QuaGFzT3duUHJvcGVydHksIGV4Y2VwdFxuXHQgIC8vIGFsc28gd29ya3MgaWYgdGhlIGdpdmVuIG9iamVjdCBkb2VzIG5vdCBoYXZlIHRoZSBtZXRob2Rcblx0ICAvLyBvbiBpdHMgcHJvdG90eXBlIG9yIGl0IGhhcyBiZWVuIG1hc2tlZC5cblx0ICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KSB7XG5cdCAgICByZXR1cm4gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdCAgfVxuXHQgIGtyb2xsLmV4dGVuZCA9IGZ1bmN0aW9uICh0aGlzT2JqZWN0LCBvdGhlck9iamVjdCkge1xuXHQgICAgaWYgKCFvdGhlck9iamVjdCkge1xuXHQgICAgICAvLyBleHRlbmQgd2l0aCB3aGF0PyEgIGRlbmllZCFcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgbmFtZSBpbiBvdGhlck9iamVjdCkge1xuXHQgICAgICBpZiAoaGFzT3duUHJvcGVydHkob3RoZXJPYmplY3QsIG5hbWUpKSB7XG5cdCAgICAgICAgdGhpc09iamVjdFtuYW1lXSA9IG90aGVyT2JqZWN0W25hbWVdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpc09iamVjdDtcblx0ICB9O1xuXHQgIGZ1bmN0aW9uIHN0YXJ0dXAoKSB7XG5cdCAgICBnbG9iYWwuZ2xvYmFsID0gZ2xvYmFsOyAvLyBoYW5nIHRoZSBnbG9iYWwgb2JqZWN0IG9mZiBpdHNlbGZcblx0ICAgIGdsb2JhbC5rcm9sbCA9IGtyb2xsOyAvLyBoYW5nIG91ciBzcGVjaWFsIHVuZGVyIHRoZSBob29kIGtyb2xsIG9iamVjdCBvZmYgdGhlIGdsb2JhbFxuXHQgICAge1xuXHQgICAgICAvLyByb3V0ZSBrcm9sbC5leHRlcm5hbEJpbmRpbmcgdG8gc2FtZSBpbXBsIGFzIGJpbmRpbmcgLSB3ZSB0cmVhdCAxc3QgYW5kIDNyZCBwYXJ0eSBuYXRpdmUgbW9kdWxlcyB0aGUgc2FtZVxuXHQgICAgICBrcm9sbC5leHRlcm5hbEJpbmRpbmcgPSBrcm9sbC5iaW5kaW5nO1xuXHQgICAgfVxuXHQgICAgZ2xvYmFsLlRpID0gZ2xvYmFsLlRpdGFuaXVtID0gYm9vdHN0cmFwJDEoZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICBnbG9iYWwuTW9kdWxlID0gYm9vdHN0cmFwJDIoZ2xvYmFsLCBrcm9sbCk7XG5cdCAgfVxuXHQgIHN0YXJ0dXAoKTtcblx0fVxuXG5cdHJldHVybiBib290c3RyYXA7XG5cbn0pKCk7XG4iXSwidmVyc2lvbiI6M30=
