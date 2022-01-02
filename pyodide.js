globalThis.pyodide={},globalThis.loadPyodide=async function(e={}){if(globalThis.__pyodideLoading)throw globalThis.languagePluginURL?new Error("Pyodide is already loading because languagePluginURL is defined."):new Error("Pyodide is already loading.");globalThis.__pyodideLoading=!0;let o={},n=e.indexURL||"https://cdn.jsdelivr.net/pyodide/v0.17.0/full/";n.endsWith(".js")&&(n=n.substr(0,n.lastIndexOf("/"))),n.endsWith("/")||(n+="/");const t="default channel",a=/^.*?([^\/]*)\.js$/;function r(e){let o=a.exec(e);if(o)return o[1]}let i;if(self.document)i=e=>new Promise(((o,n)=>{const t=self.document.createElement("script");t.src=e,t.onload=o,t.onerror=n,self.document.head.appendChild(t)}));else{if(!self.importScripts)throw new Error("Cannot determine runtime environment");i=async e=>{self.importScripts(e)}}function l(e,n,a,i){const l=o.packages.dependencies,s=o.loadedPackages,d=o.packages.shared_library,c=new Map,u=e=>{if(!c.has(e)&&(c.set(e,t),void 0===s[e]))for(let o of l[e])u(o)};for(let o of e){const e=r(o);if(void 0!==e){if(c.has(e)&&c.get(e)!==o){a(`Loading same package ${e} from ${o} and ${c.get(e)}`);continue}c.set(e,o)}else o in l?u(o):a(`Skipping unknown package '${o}'`)}if(i){let e=new Map;for(let o of c)o[0]in d&&e.set(o[0],c.get(o[0]));return e}return c}async function s(e,a,r){let s,d,c=l(e,0,r);if(o.locateFile=e=>{let o=e.replace(/\.data$/,"");if(c.has(o)){let e=c.get(o);if(e!=t)return e.replace(/\.js$/,".data")}return n+e},0===c.size)return Promise.resolve("No new packages to load");a(`Loading ${Array.from(c.keys()).join(", ")}`);d=self.document?new Promise(((e,o)=>{s=e=>{r("Unhandled error. We don't know what it is or whether it is related to 'loadPackage' but out of an abundance of caution we will assume that loading failed."),r(e),o(e.message)},self.addEventListener("error",s)})):new Promise((()=>{}));let u=[];for(let[e,l]of c){let s=o.loadedPackages[e];if(void 0!==s){if(s===l||l===t){a(`${e} already loaded from ${s}`);continue}r(`URI mismatch, attempting to load package ${e} from ${l} while it is already loaded from ${s}. To override a dependency, load the custom package first.`);continue}let d=l===t?`${n}${e}.js`:l;a(`Loading ${e} from ${d}`),u.push(i(d).catch((()=>{r(`Couldn't load package from URL ${d}`),c.delete(e)})))}let y=Promise.all(u).then((function(){const e=new Promise((e=>{o.monitorRunDependencies=o=>{0===o&&e()}}));return o.addRunDependency("dummy"),o.removeRunDependency("dummy"),e}));try{await Promise.race([y,d])}finally{delete o.monitorRunDependencies,s&&self.removeEventListener("error",s)}let p,g=[];for(let[e,n]of c)o.loadedPackages[e]=n,g.push(e);if(g.length>0){p=`Loaded ${g.join(", ")}`}else p="No packages loaded";o.reportUndefinedSymbols(),a(p),o.runPythonSimple("import importlib\nimportlib.invalidate_caches()\n")}let d=Promise.resolve();o.loadedPackages={},o.loadPackage=async function(e,n,t){if(o.isPyProxy(e)){let o;try{o=e.toJs()}finally{e.destroy()}e=o}Array.isArray(e)||(e=[e]);let a,r=[];try{let o=l(e,0,t,!0);for(let e of o)r.push(e[0])}catch(e){}for(let e in o.preloadPlugins)if(o.preloadPlugins[e].canHandle("test.so")){a=o.preloadPlugins[e];break}let i={get:function(e,n){return"handle"===n?function(t,a){e[n].apply(e,arguments),this.asyncWasmLoadPromise=this.asyncWasmLoadPromise.then((function(){o.loadDynamicLibrary(a,{global:!0,nodelete:!0})}))}:e[n]}};var c=new Proxy(a,i);o.preloadPlugins.unshift(c);let u=d.then((()=>s(r,n||console.log,t||console.error)));d=d.then((()=>u.catch((()=>{})))),await u,o.preloadPlugins.shift(c),u=d.then((()=>s(e,n||console.log,t||console.error))),d=d.then((()=>u.catch((()=>{})))),await u};let c=["globals","pyodide_py","version","loadPackage","loadPackagesFromImports","loadedPackages","isPyProxy","pyimport","runPython","runPythonAsync","registerJsModule","unregisterJsModule","setInterruptBuffer","toPy","PythonError"];o.noImageDecoding=!0,o.noAudioDecoding=!0,o.noWasmDecoding=!1,o.preloadedWasm={};let u=!1;o.fatal_error=function(e){if(u)return console.error("Recursive call to fatal_error. Inner error was:"),void console.error(e);u=!0,console.error("Pyodide has suffered a fatal error. Please report this to the Pyodide maintainers."),console.error("The cause of the fatal error was:"),console.error(e);try{let n=1;o.__Py_DumpTraceback(n,o._PyGILState_GetThisThreadState());for(let e of c)"version"!==e&&Object.defineProperty(o.public_api,e,{enumerable:!0,configurable:!0,get:()=>{throw new Error("Pyodide already fatally failed and can no longer be used.")}});o.on_fatal&&o.on_fatal(e)}catch(e){console.error("Another error occurred while handling the fatal error:"),console.error(e)}throw e},o.pyodide_py={},o.globals={},o.PythonError=class{constructor(){this.message}},o.version="",o.runPythonSimple=function(e){let n,t=o.stringToNewUTF8(e);try{n=o._run_python_simple_inner(t)}catch(e){o.fatal_error(e)}finally{o._free(t)}-1===n&&o._pythonexc2js()},o.runPython=function(e,n=o.globals){return o.pyodide_py.eval_code(e,n)},o.loadPackagesFromImports=async function(e,n,t){let a=o.pyodide_py.find_imports(e).toJs();if(0===a.length)return;let r=o.packages.import_name_to_package_name,i=new Set;for(let e of a)e in r&&i.add(r[e]);i.size&&await o.loadPackage(Array.from(i.keys()),n,t)},o.pyimport=e=>(console.warn("Access to the Python global namespace via pyodide.pyimport is deprecated and will be removed in version 0.18.0. Use pyodide.globals.get('key') instead."),o.globals.get(e)),o.runPythonAsync=async function(e,n,t){await o.loadPackagesFromImports(e,n,t);let a=o.pyodide_py.eval_code_async(e,o.globals);try{return await a}finally{a.destroy()}},o.registerJsModule=function(e,n){o.pyodide_py.register_js_module(e,n)},o.unregisterJsModule=function(e){o.pyodide_py.unregister_js_module(e)},o.toPy=function(e,n=-1){switch(typeof e){case"string":case"number":case"boolean":case"bigint":case"undefined":return e}if(!e||o.isPyProxy(e))return e;let t=0,a=0,r=0;try{if(t=o.hiwire.new_value(e),a=o.__js2python_convert(t,new Map,n),0===a&&o._pythonexc2js(),o._JsProxy_Check(a))return e;r=o._python2js(a),0===r&&o._pythonexc2js()}finally{o.hiwire.decref(t),o._Py_DecRef(a)}return o.hiwire.pop_value(r)},o.isPyProxy=function(e){return!!e&&void 0!==e.$$&&"PyProxy"===e.$$.type},o.locateFile=e=>n+e;let y=new Promise((e=>o.postRun=e));const p=`${n}pyodide.asm.js`;await i(p),await _createPyodideModule(o),await y,o.runPythonSimple("\ndef temp(Module):\n  import pyodide\n  import __main__\n  import builtins\n\n  globals = __main__.__dict__\n  globals.update(builtins.__dict__)\n\n  Module.version = pyodide.__version__\n  Module.globals = globals\n  Module.builtins = builtins.__dict__\n  Module.pyodide_py = pyodide\n"),o.saveState=()=>o.pyodide_py._state.save_state(),o.restoreState=e=>o.pyodide_py._state.restore_state(e),o.init_dict.get("temp")(o),o.globals=o.wrapNamespace(o.globals);let g=await fetch(`${n}packages.json`);o.packages=await g.json(),function(e){let o=0;try{!function e(){o+=1,e()}()}catch(e){}let n=o/50;n>1e3&&(n=1e3),e.runPythonSimple(`import sys; sys.setrecursionlimit(int(${n}))`)}(o);let f=function(e,o){let n={_module:e};e.public_api=n;for(let t of o)n[t]=e[t];return n}(o,c);return o.registerJsModule("js",globalThis),o.registerJsModule("pyodide_js",f),globalThis.pyodide=f,f},globalThis.languagePluginUrl&&(console.warn("languagePluginUrl is deprecated and will be removed in version 0.18.0, instead use loadPyodide({ indexURL : <some_url>})"),globalThis.languagePluginUrl,globalThis.languagePluginLoader=loadPyodide({indexURL:globalThis.languagePluginUrl}));