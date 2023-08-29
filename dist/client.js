/*!
 * 
 *   @ainias42/cordova-sites v0.8.9
 *   git+https://github.com/Ainias/cordova-sites.git
 *   Copyright (c) Silas Günther and project contributors.
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 932:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(537);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".sites__OatLI{height:100%;width:100%;display:flex;flex-direction:column}.siteContainer__D2V5n{flex:1;position:relative;width:100%;overflow:hidden}@media print{.siteContainer__D2V5n{overflow:initial}}", "",{"version":3,"sources":["webpack://./src/client/App/sites.scss"],"names":[],"mappings":"AAAA,cACE,WAAA,CACA,UAAA,CACA,YAAA,CACA,qBAAA,CAGF,sBACE,MAAA,CACA,iBAAA,CACA,UAAA,CACA,eAAA,CAGF,aACE,sBACE,gBAAA,CAAA","sourcesContent":[".sites {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\n.siteContainer {\n  flex: 1;\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n\n@media print {\n  .siteContainer {\n    overflow: initial;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"sites": "sites__OatLI",
	"siteContainer": "siteContainer__D2V5n"
};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(537);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".footer__e0cZe{width:100%;flex:none;padding:0;overflow:visible;z-index:1}", "",{"version":3,"sources":["webpack://./src/client/Site/Footer/footer.scss"],"names":[],"mappings":"AAAA,eACE,UAAA,CACA,SAAA,CACA,SAAA,CACA,gBAAA,CACA,SAAA","sourcesContent":[".footer {\n  width: 100%;\n  flex: none;\n  padding: 0;\n  overflow: visible;\n  z-index: 1;\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"footer": "footer__e0cZe"
};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(537);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(667);
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(766);
var ___CSS_LOADER_URL_IMPORT_1___ = __webpack_require__(973);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".backButtonImg__qXEsC{display:inline-block;width:1.31rem;height:1rem;background-repeat:no-repeat;background-size:contain}.flat-design .backButtonImg__qXEsC{background-image:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ")}.material-design .backButtonImg__qXEsC{background-image:url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ")}", "",{"version":3,"sources":["webpack://./src/client/Site/TopBar/backButton.scss","webpack://./node_modules/@ainias42/react-bootstrap-mobile/src/scss/_designMixin.scss"],"names":[],"mappings":"AAGA,sBACE,oBAAA,CACA,aAAA,CACA,WAAA,CACA,2BAAA,CACA,uBAAA,CCJW,mCDMT,wDAAA,CCNS,uCDUT,wDAAA","sourcesContent":["@import \"node_modules/@ainias42/react-bootstrap-mobile/src/scss/variables\";\n@import \"node_modules/@ainias42/react-bootstrap-mobile/src/scss/designMixin\";\n\n.backButtonImg {\n  display: inline-block;\n  width: 1.31rem;\n  height: 1rem;\n  background-repeat: no-repeat;\n  background-size: contain;\n  @include design($flat) {\n    background-image: url(\"../../img/arrowLeft.svg\");\n  }\n\n  @include design($material) {\n    background-image: url(\"../../img/back.png\");\n  }\n}\n","@use 'sass:selector';\n\n@mixin design($designName) {\n  @if & {\n    @at-root #{selector.nest(':global(.'+$designName+\")\", &)} {\n      @content\n    }\n  } @else {\n    :global(.#{$designName}) {\n      @content\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"backButtonImg": "backButtonImg__qXEsC"
};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 489:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(537);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".topBarImage__xzV8d{width:100%}.topBarImage__xzV8d img{object-fit:cover;height:100%;width:100%}", "",{"version":3,"sources":["webpack://./src/client/Site/TopBar/topBarImage.scss"],"names":[],"mappings":"AAAA,oBACE,UAAA,CACA,wBACE,gBAAA,CACA,WAAA,CACA,UAAA","sourcesContent":[".topBarImage {\n  width: 100%;\n  img {\n    object-fit: cover;\n    height: 100%;\n    width: 100%;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"topBarImage": "topBarImage__xzV8d"
};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 263:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(537);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".site__q98hh{position:absolute;top:0;left:0;right:0;bottom:0;background-color:#efeff4}.site__q98hh.hidden__PyBmW{display:none}.site__q98hh>div{display:flex;flex-direction:column;height:100%}.site__q98hh>div>div.container__Vb9ZW{flex-grow:1;overflow-y:auto;justify-content:flex-start}@media print{.site__q98hh>div>div.container__Vb9ZW{overflow-y:initial}}.site__q98hh>div>div.container__Vb9ZW .fullWidth__HJS0J{max-width:initial;padding:0}.site__q98hh>div>div.container__Vb9ZW>div{flex:1}", "",{"version":3,"sources":["webpack://./src/client/Site/siteContainer.scss"],"names":[],"mappings":"AAAA,aACE,iBAAA,CACA,KAAA,CACA,MAAA,CACA,OAAA,CACA,QAAA,CACA,wBAAA,CAEA,2BACE,YAAA,CAGF,iBACE,YAAA,CACA,qBAAA,CACA,WAAA,CAEA,sCACE,WAAA,CACA,eAAA,CACA,0BAAA,CAEA,aACE,sCACE,kBAAA,CAAA,CAIJ,wDACE,iBAAA,CACA,SAAA,CAGF,0CACE,MAAA","sourcesContent":[".site {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #efeff4;\n\n  &.hidden {\n    display: none;\n  }\n\n  > div {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n\n    > div.container {\n      flex-grow: 1;\n      overflow-y: auto;\n      justify-content: flex-start;\n\n      @media print {\n        & {\n          overflow-y: initial;\n        }\n      }\n\n      .fullWidth {\n        max-width: initial;\n        padding: 0;\n      }\n\n      > div {\n        flex: 1;\n      }\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"site": "site__q98hh",
	"hidden": "hidden__PyBmW",
	"container": "container__Vb9ZW",
	"fullWidth": "fullWidth__HJS0J"
};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 667:
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ 537:
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 492:
/***/ ((module, exports, __webpack_require__) => {


    var refs = 0;
    var css = __webpack_require__(932);
    var insertCss = __webpack_require__(718);
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) { var removeCss; }
  

/***/ }),

/***/ 677:
/***/ ((module, exports, __webpack_require__) => {


    var refs = 0;
    var css = __webpack_require__(735);
    var insertCss = __webpack_require__(718);
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) { var removeCss; }
  

/***/ }),

/***/ 977:
/***/ ((module, exports, __webpack_require__) => {


    var refs = 0;
    var css = __webpack_require__(941);
    var insertCss = __webpack_require__(718);
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) { var removeCss; }
  

/***/ }),

/***/ 107:
/***/ ((module, exports, __webpack_require__) => {


    var refs = 0;
    var css = __webpack_require__(489);
    var insertCss = __webpack_require__(718);
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) { var removeCss; }
  

/***/ }),

/***/ 623:
/***/ ((module, exports, __webpack_require__) => {


    var refs = 0;
    var css = __webpack_require__(263);
    var insertCss = __webpack_require__(718);
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) { var removeCss; }
  

/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
/*! Isomorphic Style Loader | MIT License | https://github.com/kriasoft/isomorphic-style-loader */



var inserted = {};

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode("0x" + p1);
  }));
}

function removeCss(ids) {
  ids.forEach(function (id) {
    if (--inserted[id] <= 0) {
      var elem = document.getElementById(id);

      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  });
}

function insertCss(styles, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$replace = _ref.replace,
      replace = _ref$replace === void 0 ? false : _ref$replace,
      _ref$prepend = _ref.prepend,
      prepend = _ref$prepend === void 0 ? false : _ref$prepend,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === void 0 ? 's' : _ref$prefix;

  var ids = [];

  for (var i = 0; i < styles.length; i++) {
    var _styles$i = styles[i],
        moduleId = _styles$i[0],
        css = _styles$i[1],
        media = _styles$i[2],
        sourceMap = _styles$i[3];
    var id = "" + prefix + moduleId + "-" + i;
    ids.push(id);

    if (inserted[id]) {
      if (!replace) {
        inserted[id]++;
        continue;
      }
    }

    inserted[id] = 1;
    var elem = document.getElementById(id);
    var create = false;

    if (!elem) {
      create = true;
      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.id = id;

      if (media) {
        elem.setAttribute('media', media);
      }
    }

    var cssText = css;

    if (sourceMap && typeof btoa === 'function') {
      cssText += "\n/*# sourceMappingURL=data:application/json;base64," + b64EncodeUnicode(JSON.stringify(sourceMap)) + "*/";
      cssText += "\n/*# sourceURL=" + sourceMap.file + "?" + id + "*/";
    }

    if ('textContent' in elem) {
      elem.textContent = cssText;
    } else {
      elem.styleSheet.cssText = cssText;
    }

    if (create) {
      if (prepend) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
      } else {
        document.head.appendChild(elem);
      }
    }
  }

  return removeCss.bind(null, ids);
}

module.exports = insertCss;
//# sourceMappingURL=insertCss.js.map


/***/ }),

/***/ 766:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iOS4wMDExMzAxbW0iCiAgIGhlaWdodD0iMTcuNjk5OTdtbSIKICAgdmlld0JveD0iMCAwIDkuMDAxMTI5OSAxNy42OTk5NzEiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzgiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImFycm93TGVmdC5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMyAoMjQwNTU0NiwgMjAxOC0wMy0xMSkiPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIxMS4yIgogICAgIGlua3NjYXBlOmN4PSItMTkuMDU0MDYyIgogICAgIGlua3NjYXBlOmN5PSIzMS45NDY2MzMiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgdW5pdHM9Im1tIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg2MSIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTc5IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNyIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkViZW5lIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuOTk1MTAxMjcsLTI4MC4zMDU3NikiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJzdHJva2U6YmxhY2s7ZmlsbDpub25lO3N0cm9rZS13aWR0aDoxLjc5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0iTSA2Ljk5ODQ2NTQsMjgxLjMxMTUgMCwyODkuMTYxNTMgNy4wMDE0MTg0LDI5NyIKICAgICAgIGlkPSJwYXRoMzc4OCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPC9nPgo8L3N2Zz4K";

/***/ }),

/***/ 973:
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,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";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "BackButton": () => (/* reexport */ BackButton),
  "ClassSiteAnimation": () => (/* reexport */ ClassSiteAnimation),
  "DefaultSiteAnimation": () => (/* reexport */ DefaultSiteAnimation),
  "DeviceReady": () => (/* reexport */ DeviceReady),
  "FinishSiteLink": () => (/* reexport */ FinishSiteLinkMemo),
  "Footer": () => (/* reexport */ FooterMemo),
  "SiteContainer": () => (/* reexport */ SiteContainerMemo),
  "SiteContainerContext": () => (/* reexport */ SiteContainerContext),
  "SiteIdContext": () => (/* reexport */ SiteIdContext),
  "SiteLink": () => (/* reexport */ SiteLinkMemo),
  "Sites": () => (/* reexport */ SitesWithRouter),
  "SitesContext": () => (/* reexport */ SitesContext),
  "TopBar": () => (/* reexport */ TopBar),
  "TopBarImage": () => (/* reexport */ TopBarImageMemo),
  "VisibleContext": () => (/* reexport */ VisibleContext),
  "initialFooterOptions": () => (/* reexport */ initialFooterOptions),
  "initialTopBarOptions": () => (/* reexport */ initialTopBarOptions),
  "useFooter": () => (/* reexport */ useFooter),
  "useIsVisible": () => (/* reexport */ useIsVisible),
  "useNavigation": () => (/* reexport */ useNavigation),
  "useSiteContainer": () => (/* reexport */ useSiteContainer),
  "useSiteId": () => (/* reexport */ useSiteId),
  "useSites": () => (/* reexport */ useSites),
  "useSitesState": () => (/* reexport */ useSitesState),
  "useToasts": () => (/* reexport */ useToasts),
  "useTopBar": () => (/* reexport */ useTopBar)
});

;// CONCATENATED MODULE: external "react"
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_namespaceObject);
;// CONCATENATED MODULE: ./src/client/App/SiteIdContext.ts

const SiteIdContext = /*#__PURE__*/external_react_default().createContext(-1);
SiteIdContext.displayName = 'SiteIdContext';
function useSiteId() {
  return (0,external_react_namespaceObject.useContext)(SiteIdContext);
}
;// CONCATENATED MODULE: ./src/client/App/Hooks.ts



const SitesContext = /*#__PURE__*/external_react_namespaceObject.createContext(undefined);
SitesContext.displayName = 'Sites';
const SiteContainerContext = /*#__PURE__*/external_react_namespaceObject.createContext(undefined);
SiteContainerContext.displayName = 'SiteContainer';
function useSites() {
  return (0,external_react_namespaceObject.useContext)(SitesContext);
}
function useSiteContainer() {
  return (0,external_react_namespaceObject.useContext)(SiteContainerContext);
}
function useTopBar(optionsOrGenerator, dependencies = []) {
  const savedOptions = (0,external_react_namespaceObject.useMemo)(typeof optionsOrGenerator === 'function' ? optionsOrGenerator : () => optionsOrGenerator, dependencies);
  const siteContainer = useSiteContainer();
  (0,external_react_namespaceObject.useEffect)(() => {
    siteContainer === null || siteContainer === void 0 ? void 0 : siteContainer.updateTopBarOptions(savedOptions);
  }, [savedOptions, siteContainer]);
}
function useFooter(optionsOrGenerator, dependencies = []) {
  const savedOptions = (0,external_react_namespaceObject.useMemo)(typeof optionsOrGenerator === 'function' ? optionsOrGenerator : () => optionsOrGenerator, dependencies);
  const sites = useSites();
  const siteId = useSiteId();
  (0,external_react_namespaceObject.useEffect)(() => {
    sites === null || sites === void 0 ? void 0 : sites.updateFooterOptions(siteId, savedOptions);
  }, [savedOptions, sites, siteId]);
}
function useToasts() {
  const sites = useSites();
  return (0,external_react_namespaceObject.useCallback)(function addToast(text, action, duration) {
    return sites === null || sites === void 0 ? void 0 : sites.addToast(text, action, duration);
  }, [sites]);
}
;// CONCATENATED MODULE: external "@ainias42/js-helper"
const js_helper_namespaceObject = require("@ainias42/js-helper");
;// CONCATENATED MODULE: ./src/client/App/SiteAnimation/ClassSiteAnimation.ts
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

class ClassSiteAnimation {
  constructor(siteStartClass, siteEndClass, duration, removeClasses = true) {
    this.siteStartClass = siteStartClass;
    this.siteEndClass = siteEndClass;
    this.duration = duration;
    this.removeClasses = removeClasses;
  }
  animateSiteEnd(fromSite) {
    return __awaiter(this, void 0, void 0, function* () {
      fromSite.classList.add(this.siteEndClass);
      yield js_helper_namespaceObject.Helper.delay(this.duration);
      if (this.removeClasses) {
        fromSite.classList.remove(this.siteEndClass);
      }
    });
  }
  animateSitePopToFront(fromSite, toSite) {
    return this.animateSiteStart(fromSite, toSite);
  }
  animateSiteStart(_fromSite, toSite) {
    return __awaiter(this, void 0, void 0, function* () {
      toSite.classList.add(this.siteStartClass);
      yield js_helper_namespaceObject.Helper.delay(this.duration);
      if (this.removeClasses) {
        toSite.classList.remove(this.siteStartClass);
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/client/App/SiteAnimation/DefaultSiteAnimation.ts

class DefaultSiteAnimation extends ClassSiteAnimation {
  constructor() {
    super('animation-new-site', 'animation-end-site', 300, true);
  }
}
;// CONCATENATED MODULE: ./src/client/App/VisibleContext.ts

const VisibleContext = /*#__PURE__*/external_react_default().createContext(false);
VisibleContext.displayName = 'VisibleContext';
function useIsVisible() {
  return (0,external_react_namespaceObject.useContext)(VisibleContext);
}
;// CONCATENATED MODULE: external "@ainias42/react-bootstrap-mobile"
const react_bootstrap_mobile_namespaceObject = require("@ainias42/react-bootstrap-mobile");
// EXTERNAL MODULE: ./src/client/Site/TopBar/backButton.scss
var backButton = __webpack_require__(977);
var backButton_default = /*#__PURE__*/__webpack_require__.n(backButton);
;// CONCATENATED MODULE: external "zustand"
const external_zustand_namespaceObject = require("zustand");
;// CONCATENATED MODULE: ./src/client/useSitesState.ts

const initialState = {
  minimumActiveSiteId: Infinity
};
const actionsGenerator = (set, get) => ({
  clear() {
    set(Object.assign(Object.assign({}, actionsGenerator(set, get)), initialState), true);
  },
  setMinimumActiveSite(siteId) {
    set({
      minimumActiveSiteId: siteId
    });
  }
});
const useSitesState = (0,external_zustand_namespaceObject.create)((set, get) => Object.assign(Object.assign({}, initialState), actionsGenerator(set, get)));
;// CONCATENATED MODULE: ./src/client/Site/TopBar/BackButton.tsx







const BackButton = (0,react_bootstrap_mobile_namespaceObject.withMemo)(function BackButton() {
  const sites = useSites();
  const goBack = (0,external_react_namespaceObject.useCallback)(() => sites === null || sites === void 0 ? void 0 : sites.goBack(), [sites]);
  const siteId = useSiteId();
  const canGoBack = useSitesState(state => state.minimumActiveSiteId < siteId);
  if (canGoBack) {
    return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.TopBarButton, {
      onClick: goBack
    }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.InlineBlock, {
      className: (backButton_default()).backButtonImg
    }));
  }
  return null;
}, (backButton_default()));
;// CONCATENATED MODULE: ./src/client/Site/TopBar/TopBar.tsx




const TopBar = /*#__PURE__*/external_react_namespaceObject.memo(function TopBar({
  visible = true,
  backButton = undefined,
  title = '',
  rightButtons = [],
  leftButtons = [],
  transparent = false,
  drawBehind = false,
  numberButtons = 3,
  numberButtonsXS = 2,
  numberButtonsSM = 3,
  numberButtonsMD = 4,
  numberButtonsLG = 5,
  numberButtonsXL = 5,
  numberButtonsXXL = 5,
  className
}) {
  var _a;
  const realNumberButtons = (_a = (0,react_bootstrap_mobile_namespaceObject.useBreakpointSelect)([numberButtonsXS, numberButtonsSM, numberButtonsMD, numberButtonsXL, numberButtonsLG, numberButtonsXXL])) !== null && _a !== void 0 ? _a : numberButtons;
  const newLeftButtons = (0,external_react_namespaceObject.useMemo)(() => {
    const lButtons = [...leftButtons];
    let newBackButton = backButton;
    if (newBackButton === undefined) {
      newBackButton = {
        component: BackButton
      };
    }
    if (newBackButton !== false) {
      lButtons.unshift(newBackButton);
    }
    return lButtons;
  }, [backButton, leftButtons]);
  const [hiddenButtons, newRightButtons] = (0,external_react_namespaceObject.useMemo)(() => {
    const hButtons = [];
    const rButtons = [...rightButtons];
    if (rightButtons.length > realNumberButtons) {
      hButtons.push(...rButtons.splice(realNumberButtons - 1, rButtons.length));
    }
    return [hButtons, rButtons];
  }, [realNumberButtons, rightButtons]);
  if (!visible) {
    return null;
  }
  return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.TopBar, {
    title: title,
    rightButtons: newRightButtons,
    leftButtons: newLeftButtons,
    hiddenButtons: hiddenButtons,
    transparent: transparent,
    drawBehind: drawBehind,
    className: className
  });
});
// EXTERNAL MODULE: ./src/client/Site/siteContainer.scss
var siteContainer = __webpack_require__(623);
var siteContainer_default = /*#__PURE__*/__webpack_require__.n(siteContainer);
;// CONCATENATED MODULE: ./src/client/Site/SiteContainer.tsx
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }








const initialTopBarOptions = {
  visible: true,
  title: undefined,
  leftButtons: [],
  rightButtons: [],
  backButton: undefined,
  transparent: false,
  drawBehind: false
};
const initialFooterOptions = {
  visible: true,
  buttons: []
};
const SiteContainer_initialState = {
  topBarOptions: {},
  useFullWidth: false
};
class SiteContainer extends external_react_namespaceObject.PureComponent {
  constructor() {
    super(...arguments);
    this.state = SiteContainer_initialState;
    this.container = /*#__PURE__*/(0,external_react_namespaceObject.createRef)();
    this.child = /*#__PURE__*/(0,external_react_namespaceObject.createRef)();
  }
  componentDidMount() {
    const {
      visible,
      onContainerListener,
      id
    } = this.props;
    if (this.child.current && !visible) {
      this.child.current.remove();
    }
    if (onContainerListener) {
      onContainerListener(id, this.container);
    }
  }
  getSnapshotBeforeUpdate(prevProps) {
    const {
      visible
    } = this.props;
    if (!prevProps.visible && visible && this.container.current && this.child.current) {
      this.container.current.appendChild(this.child.current);
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    const {
      visible
    } = this.props;
    if (!visible && prevProps.visible && this.child.current) {
      this.child.current.remove();
    }
  }
  render() {
    var _a, _b;
    const {
      siteComponent,
      siteContainerStyle,
      siteProps,
      visible,
      id,
      siteContainerClass,
      defaultTopBarOptions
    } = this.props;
    const Base = siteComponent;
    const {
      topBarOptions,
      useFullWidth
    } = this.state;
    if (typeof topBarOptions.rightButtons === 'function') {
      topBarOptions.rightButtons = topBarOptions.rightButtons([...((_a = defaultTopBarOptions.rightButtons) !== null && _a !== void 0 ? _a : [])]);
    }
    if (typeof topBarOptions.leftButtons === 'function') {
      topBarOptions.leftButtons = topBarOptions.leftButtons([...((_b = defaultTopBarOptions.leftButtons) !== null && _b !== void 0 ? _b : [])]);
    }
    return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Block, {
      ref: this.container,
      style: siteContainerStyle,
      className: `${siteContainerClass !== null && siteContainerClass !== void 0 ? siteContainerClass : (siteContainer_default()).site} ${visible ? '' : (siteContainer_default()).hidden}`
    }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Block, {
      ref: this.child
    }, /*#__PURE__*/external_react_namespaceObject.createElement(SiteContainerContext.Provider, {
      value: this
    }, /*#__PURE__*/external_react_namespaceObject.createElement(SiteIdContext.Provider, {
      value: id
    }, /*#__PURE__*/external_react_namespaceObject.createElement(VisibleContext.Provider, {
      value: visible
    }, /*#__PURE__*/external_react_namespaceObject.createElement(TopBar, _extends({}, defaultTopBarOptions, topBarOptions)), /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Flex, {
      className: (siteContainer_default()).container
    }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Container, {
      fluid: "xxl",
      className: useFullWidth ? (siteContainer_default()).fullWidth : undefined
    }, /*#__PURE__*/external_react_namespaceObject.createElement(Base, siteProps))))))));
  }
  setUseFullWidth(useFullWidth) {
    this.setState({
      useFullWidth
    });
  }
  updateTopBarOptions(newOptions) {
    const {
      topBarOptions
    } = this.state;
    this.setState({
      topBarOptions: Object.assign(Object.assign({}, topBarOptions), newOptions)
    });
  }
}
const SiteContainerMemo = (0,react_bootstrap_mobile_namespaceObject.withMemo)(SiteContainer, (siteContainer_default()));

// EXTERNAL MODULE: ./src/client/Site/Footer/footer.scss
var footer = __webpack_require__(677);
var footer_default = /*#__PURE__*/__webpack_require__.n(footer);
;// CONCATENATED MODULE: ./src/client/Site/Footer/Footer.tsx




function Footer({
  buttons,
  visible = false,
  activeTab = undefined
}) {
  // Variables
  // States
  // Refs
  // Callbacks
  const onTabSelect = (0,external_react_namespaceObject.useCallback)(newTab => {
    var _a, _b;
    (_b = (_a = buttons[newTab]) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a);
  }, [buttons]);
  // Effects
  // Other
  // Render Functions
  if (!visible || buttons.length === 0) {
    return null;
  }
  return /*#__PURE__*/external_react_namespaceObject.createElement("div", {
    className: (footer_default()).footer
  }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.TabBar, {
    buttons: buttons,
    activeTab: activeTab,
    onTabChange: onTabSelect
  }));
}
const FooterMemo = (0,react_bootstrap_mobile_namespaceObject.withMemo)(Footer, (footer_default()));

;// CONCATENATED MODULE: external "next/router"
const router_namespaceObject = require("next/router");
// EXTERNAL MODULE: ./src/client/App/sites.scss
var App_sites = __webpack_require__(492);
var sites_default = /*#__PURE__*/__webpack_require__.n(App_sites);
;// CONCATENATED MODULE: ./src/client/App/Sites.tsx
function Sites_extends() { Sites_extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Sites_extends.apply(this, arguments); }
var Sites_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};











const Sites_initialState = {
  isInitialized: true,
  currentSiteId: 1,
  sites: [],
  animation: null,
  defaultTopBarOptions: initialTopBarOptions,
  defaultFooterOptions: initialFooterOptions,
  footerOptions: {},
  toasts: []
};
class SitesInner extends external_react_namespaceObject.PureComponent {
  constructor(props) {
    super(props);
    this.currentSiteId = -1;
    this.sites = new Map();
    this.lastToastId = 0;
    this.toasts = new Map();
    this.pushingNewSite = true;
    this.isInternalNavigation = false;
    this.dismissedToast = toast => {
      if (toast && this.toasts.has(toast.id)) {
        this.toasts.delete(toast.id);
        this.setState({
          toasts: Array.from(this.toasts.values())
        });
      }
    };
    this.setContainerForSite = (id, containerRef) => {
      const siteData = this.sites.get(id);
      if (siteData && !siteData.finished) {
        siteData.containerRefPromise.resolve(containerRef);
      }
    };
    this.onPopState = e => {
      var _a;
      console.log('LOG-d state', e.state);
      // only back button triggers this. Therefore push again the state and handle internal change
      window.history.pushState(null, '', (_a = this.sites.get(this.currentSiteId)) === null || _a === void 0 ? void 0 : _a.url);
      this.goBack();
      // if (e.state?.obsolete) {
      //     window.history.go(-1);
      // } else if (this.isInternalNavigation) {
      //     // window.history.replaceState({ obsolete: true }, '');
      //     window.history.pushState({ obsolete: true }, '');
      //     this.isInternalNavigation = false;
      // } else if (e.state !== null && !e.state.forward) {
      //     // HandleBrowser navigation
      //     console.log('LOG-d handle Browser Navigation');
      //
      //     window.history.pushState(e.state, '', '');
      //     this.goBack();
      // }
      return false;
    };
    const {
      defaultTopBarOptions,
      defaultFooterOptions
    } = this.props;
    if (props.animationHandler) {
      this.animationHandler = props.animationHandler;
    } else {
      this.animationHandler = new DefaultSiteAnimation();
    }
    this.sites.set(this.currentSiteId, Object.assign(Object.assign({}, props.currentSite), {
      id: this.currentSiteId,
      containerRefPromise: new js_helper_namespaceObject.PromiseWithHandlers(),
      footerOptions: {},
      finished: false,
      url: props.router.asPath
    }));
    // eslint-disable-next-line react/state-in-constructor
    this.state = Object.assign(Object.assign({}, Sites_initialState), {
      currentSiteId: this.currentSiteId,
      animation: null,
      sites: this.getActiveSites(),
      defaultFooterOptions: Object.assign(Object.assign({}, initialFooterOptions), defaultFooterOptions !== null && defaultFooterOptions !== void 0 ? defaultFooterOptions : {}),
      defaultTopBarOptions: Object.assign(Object.assign({}, initialTopBarOptions), defaultTopBarOptions !== null && defaultTopBarOptions !== void 0 ? defaultTopBarOptions : {})
    });
  }
  componentDidMount() {
    const {
      router
    } = this.props;
    router.beforePopState(() => false);
    window.history.replaceState(null, '');
    window.history.pushState(null, '', router.asPath);
    window.onpopstate = e => this.onPopState(e);
    // router.events.on('beforeHistoryChange', () => {
    //     console.log('LOG-d beforeHistoryChange!', window.history.state);
    //     setTimeout(() => {
    //         console.log('LOG-d stateChange?', window.history.state);
    //     }, 1);
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currentSite,
      defaultTopBarOptions,
      defaultFooterOptions
    } = this.props;
    const {
      currentSiteId,
      animation,
      defaultFooterOptions: stateDefaultFooterOptions,
      defaultTopBarOptions: stateDefaultTopBarOptions
    } = this.state;
    if (defaultTopBarOptions !== prevProps.defaultTopBarOptions) {
      this.setState({
        defaultTopBarOptions: Object.assign(Object.assign({}, stateDefaultTopBarOptions), defaultTopBarOptions)
      });
    }
    if (defaultFooterOptions !== prevProps.defaultFooterOptions) {
      this.setState({
        defaultFooterOptions: Object.assign(Object.assign({}, stateDefaultFooterOptions), defaultFooterOptions)
      });
    }
    if (currentSite !== prevProps.currentSite) {
      if (this.pushingNewSite) {
        this.currentSiteId++;
        this.pushingNewSite = false;
      }
      this.addOrUpdateCurrentSite(currentSite);
    }
    if (prevState.currentSiteId !== currentSiteId) {
      if (animation !== null) {
        const leavingSiteData = this.sites.get(animation.leavingSite);
        const currentSiteData = this.sites.get(currentSiteId);
        if (leavingSiteData && currentSiteData) {
          // Handle animation
          Promise.all([leavingSiteData.containerRefPromise, currentSiteData.containerRefPromise]).then(([oldElementRef, newElementRef]) => Sites_awaiter(this, void 0, void 0, function* () {
            var _a;
            const oldElement = oldElementRef === null || oldElementRef === void 0 ? void 0 : oldElementRef.current;
            const newElement = newElementRef === null || newElementRef === void 0 ? void 0 : newElementRef.current;
            if (oldElement && newElement) {
              switch (animation === null || animation === void 0 ? void 0 : animation.type) {
                case 'start':
                  {
                    yield this.animationHandler.animateSiteStart(oldElement, newElement);
                    break;
                  }
                case 'end':
                  {
                    yield this.animationHandler.animateSiteEnd(oldElement, newElement);
                    for (let i = 0; i < ((_a = animation.sitesToDelete) !== null && _a !== void 0 ? _a : 1); i++) {
                      this.sites.delete(animation.leavingSite - i);
                    }
                    break;
                  }
              }
              const {
                animation: newAnimation
              } = this.state;
              const activeSite = this.sites.get(currentSiteId);
              this.setState({
                animation: animation === newAnimation ? null : newAnimation,
                sites: this.getActiveSites(),
                footerOptions: activeSite ? activeSite.footerOptions : {}
              });
            }
          }));
        }
      }
    }
  }
  render() {
    const {
      isInitialized,
      currentSiteId,
      animation,
      defaultFooterOptions,
      defaultTopBarOptions,
      footerOptions,
      toasts
    } = this.state;
    let {
      sites
    } = this.state;
    const {
      style,
      className,
      siteContainerClass,
      contentWrapper
    } = this.props;
    if (!isInitialized) {
      return null;
    }
    if (animation && animation.type === 'end') {
      const animationSite = this.sites.get(animation.leavingSite);
      if (animationSite) {
        sites = [...sites, animationSite];
      }
    }
    const content = /*#__PURE__*/external_react_namespaceObject.createElement(SitesContext.Provider, {
      value: this
    }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.DialogContainer, null, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Flex, {
      className: (sites_default()).sites
    }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Block, {
      style: style,
      className: className || (sites_default()).siteContainer
    }, sites.map(data => {
      return /*#__PURE__*/external_react_namespaceObject.createElement(SiteContainerMemo, {
        visible: data.id === currentSiteId || data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite),
        leaving: data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite),
        siteComponent: data.Component,
        key: data.id,
        id: data.id,
        siteProps: data.pageProps,
        siteContainerClass: siteContainerClass,
        onContainerListener: this.setContainerForSite,
        defaultTopBarOptions: defaultTopBarOptions
      });
    })), /*#__PURE__*/external_react_namespaceObject.createElement(FooterMemo, Sites_extends({}, defaultFooterOptions, footerOptions)), /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.ToastContainer, null, toasts.map(toast => {
      return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Toast, Sites_extends({}, toast, {
        key: toast.id,
        timeToShow: toast.duration,
        onDismissed: this.dismissedToast,
        onDismissedData: toast
      }), /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Text, null, toast.text));
    })))));
    if (contentWrapper) {
      const Wrapper = contentWrapper;
      return /*#__PURE__*/external_react_namespaceObject.createElement(Wrapper, null, content);
    }
    return content;
  }
  addOrUpdateCurrentSite(nextPage) {
    const id = this.currentSiteId;
    const {
      currentSiteId
    } = this.state;
    const {
      router
    } = this.props;
    if (this.sites.has(id)) {
      const currentData = this.sites.get(id);
      if (currentData) {
        this.sites.set(id, Object.assign(Object.assign({}, currentData), {
          pageProps: nextPage.pageProps
        }));
      } else {
        // TODO Sollte nicht vorkommen!
        throw new Error('Not possible!');
      }
    } else {
      this.sites.set(id, Object.assign(Object.assign({}, nextPage), {
        id,
        containerRefPromise: new js_helper_namespaceObject.PromiseWithHandlers(),
        footerOptions: {},
        finished: false,
        url: router.asPath
      }));
    }
    const newState = {
      currentSiteId: id,
      sites: this.getActiveSites(),
      footerOptions: {}
    };
    if (id > currentSiteId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newState.animation = {
        type: 'start',
        leavingSite: currentSiteId
      };
    }
    this.setState(newState);
  }
  getActiveSites() {
    let minSiteId = Infinity;
    const sites = Array.from(this.sites.values()).filter(s => {
      if (!s.finished) {
        minSiteId = Math.min(minSiteId, s.id);
        return true;
      }
      return false;
    });
    useSitesState.getState().setMinimumActiveSite(minSiteId);
    return sites;
  }
  canGoBack() {
    const {
      sites
    } = this.state;
    return sites.length >= 2;
  }
  addToast(text, action, duration = 2500) {
    this.lastToastId++;
    const id = this.lastToastId;
    let toast = {
      id,
      text,
      duration
    };
    if (action) {
      toast = Object.assign(Object.assign({}, toast), {
        actionName: action.name,
        onClick: action.action,
        onClickData: action.actionData
      });
    }
    this.toasts.set(id, toast);
    this.setState({
      toasts: Array.from(this.toasts.values())
    });
  }
  goBack(callOnBackListener = true) {
    const {
      currentSiteId
    } = this;
    if (callOnBackListener) {
      const siteData = this.sites.get(currentSiteId);
      if (siteData && !siteData.finished) {
        const listener = siteData.onBackListener;
        if (listener && listener()) {
          return undefined;
        }
      }
    }
    return this.finish(currentSiteId);
  }
  push(url, as, options) {
    const {
      router
    } = this.props;
    this.pushingNewSite = true;
    return router.replace(url, as, options);
  }
  prefetch(url, as, prefetchOptions) {
    const {
      router
    } = this.props;
    return router.prefetch(url, as, prefetchOptions);
  }
  finish(siteId) {
    return Sites_awaiter(this, void 0, void 0, function* () {
      const siteData = this.sites.get(siteId);
      if (siteData && !siteData.finished) {
        siteData.finished = true;
        this.checkCurrentSite();
      }
    });
  }
  checkCurrentSite() {
    var _a, _b;
    let deletedSites = 0;
    while ((_a = this.sites.get(this.currentSiteId)) === null || _a === void 0 ? void 0 : _a.finished) {
      this.currentSiteId--;
      deletedSites++;
    }
    if (!this.sites.get(this.currentSiteId)) {
      this.allSitesFinished();
      return;
    }
    // console.log('LOG-d deletedSites', deletedSites, this.currentSiteId);
    const newState = {
      currentSiteId: this.currentSiteId,
      sites: this.getActiveSites(),
      footerOptions: {}
    };
    if (deletedSites > 0) {
      this.isInternalNavigation = true;
      window.history.replaceState(null, '', (_b = this.sites.get(this.currentSiteId)) === null || _b === void 0 ? void 0 : _b.url);
      newState.animation = {
        type: 'end',
        leavingSite: this.currentSiteId + deletedSites,
        sitesToDelete: deletedSites
      };
    }
    this.setState(newState);
  }
  allSitesFinished() {
    // Finished application, go back
    window.history.go(-2);
  }
  getSiteDataById(siteId) {
    return this.sites.get(siteId);
  }
  setOnBackListener(siteId, listener) {
    const siteData = this.sites.get(siteId);
    if (siteData && !siteData.finished) {
      siteData.onBackListener = listener;
    }
  }
  // updateDefaultTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions) {
  //     const { defaultTopBarOptions } = this.state;
  //
  //     if (typeof newOptions.rightButtons === 'function') {
  //         newOptions.rightButtons = newOptions.rightButtons(defaultTopBarOptions.rightButtons ?? []);
  //     }
  //     if (typeof newOptions.leftButtons === 'function') {
  //         newOptions.leftButtons = newOptions.leftButtons(defaultTopBarOptions.leftButtons ?? []);
  //     }
  //
  //     this.setState({
  //         defaultTopBarOptions: {
  //             ...defaultTopBarOptions,
  //             ...(newOptions as TopBarOptions),
  //         },
  //     });
  // }
  //
  // updateDefaultFooterOptions(newOptions: FooterOptions) {
  //     const { defaultFooterOptions } = this.state;
  //     this.setState({
  //         defaultFooterOptions: {
  //             ...defaultFooterOptions,
  //             ...newOptions,
  //         },
  //     });
  // }
  updateFooterOptions(siteId, newOptions) {
    const site = this.sites.get(siteId);
    const {
      currentSiteId
    } = this.state;
    if (!site || site.finished) {
      return;
    }
    site.footerOptions = Object.assign(Object.assign({}, site.footerOptions), newOptions);
    if (currentSiteId === siteId) {
      this.setState({
        footerOptions: site.footerOptions
      });
    }
  }
}
const SitesWithRouter = (0,router_namespaceObject.withRouter)((0,react_bootstrap_mobile_namespaceObject.withMemo)(SitesInner, (sites_default())));

;// CONCATENATED MODULE: ./src/client/App/useNavigation.ts
var useNavigation_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



function useNavigation() {
  const siteId = useSiteId();
  const sites = useSites();
  const finish = (0,external_react_namespaceObject.useCallback)(() => sites === null || sites === void 0 ? void 0 : sites.finish(siteId), [siteId, sites]);
  const push = (0,external_react_namespaceObject.useCallback)((url, as, options) => sites === null || sites === void 0 ? void 0 : sites.push(url, as, options), [sites]);
  const prefetch = (0,external_react_namespaceObject.useCallback)((url, as, prefetchOptions) => sites === null || sites === void 0 ? void 0 : sites.prefetch(url, as, prefetchOptions), [sites]);
  const finishAndPush = (0,external_react_namespaceObject.useCallback)((url, as, options) => useNavigation_awaiter(this, void 0, void 0, function* () {
    yield push(url, as, options);
    yield finish();
  }), [finish, push]);
  return {
    finish,
    push,
    prefetch,
    finishAndPush
  };
}
;// CONCATENATED MODULE: ./src/client/DeviceReady.tsx


const DeviceReady = /*#__PURE__*/external_react_namespaceObject.memo(({
  style,
  className,
  children
}) => {
  const [isReady, setIsReady] = (0,external_react_namespaceObject.useState)(false);
  (0,external_react_namespaceObject.useEffect)(() => {
    document.addEventListener('deviceready', () => setIsReady(true));
  }, []);
  if (isReady) {
    return /*#__PURE__*/external_react_namespaceObject.createElement("span", {
      style: style,
      className: className
    }, children);
  }
  return null;
});
;// CONCATENATED MODULE: ./src/client/Site/FinishSiteLink.tsx





function FinishSiteLink({
  style,
  children,
  className
}) {
  const id = useSiteId();
  const sites = useSites();
  const onClickHandler = (0,external_react_namespaceObject.useCallback)(() => {
    if (id) {
      sites === null || sites === void 0 ? void 0 : sites.finish(id);
    }
  }, [id, sites]);
  return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Clickable, {
    style: style,
    onClick: onClickHandler,
    className: className,
    __allowChildren: "all"
  }, children);
}
const FinishSiteLinkMemo = (0,react_bootstrap_mobile_namespaceObject.withMemo)(FinishSiteLink);

;// CONCATENATED MODULE: ./src/client/Site/SiteLink.tsx




const SiteLink = function SiteLink({
  href,
  prefetch = true,
  shallow = false,
  scroll = true,
  finishCurrentSite = false,
  style,
  className,
  children
}) {
  const sites = useSites();
  const currentSiteId = useSiteId();
  const linkRef = (0,external_react_namespaceObject.useRef)(null);
  const isInViewport = (0,react_bootstrap_mobile_namespaceObject.useInViewport)(linkRef);
  const [prefetched, setPrefetched] = (0,external_react_namespaceObject.useState)(false);
  const onClickHandler = (0,external_react_namespaceObject.useCallback)(() => {
    sites === null || sites === void 0 ? void 0 : sites.push(href, undefined, {
      scroll,
      shallow
    });
    if (finishCurrentSite) {
      sites === null || sites === void 0 ? void 0 : sites.finish(currentSiteId);
    }
  }, [finishCurrentSite, sites, href, scroll, shallow, currentSiteId]);
  (0,external_react_namespaceObject.useEffect)(() => {
    if (isInViewport && prefetch && !prefetched) {
      const options = typeof prefetch === 'object' ? prefetch : undefined;
      sites === null || sites === void 0 ? void 0 : sites.prefetch(href, undefined, options);
      setPrefetched(true);
    }
  }, [isInViewport, href, prefetch, prefetched, sites]);
  return /*#__PURE__*/external_react_default().createElement(react_bootstrap_mobile_namespaceObject.Clickable, {
    interactable: true,
    style: style,
    onClick: onClickHandler,
    href: href,
    ref: linkRef,
    __allowChildren: "text",
    className: className
  }, children);
};
const SiteLinkMemo = (0,react_bootstrap_mobile_namespaceObject.withMemo)(SiteLink, undefined, 'text');

// EXTERNAL MODULE: ./src/client/Site/TopBar/topBarImage.scss
var topBarImage = __webpack_require__(107);
var topBarImage_default = /*#__PURE__*/__webpack_require__.n(topBarImage);
;// CONCATENATED MODULE: ./src/client/Site/TopBar/TopBarImage.tsx





function TopBarImage({
  image,
  maxHeight
}) {
  // Variables
  // States
  const [transparentTopBar, setTransparentTopBar] = (0,external_react_namespaceObject.useState)(true);
  // Refs
  // Callbacks
  const onInViewportChange = (0,external_react_namespaceObject.useCallback)(inViewport => {
    setTransparentTopBar(inViewport);
  }, [setTransparentTopBar]);
  // Effects
  useTopBar({
    transparent: transparentTopBar,
    drawBehind: true
  }, [transparentTopBar]);
  // Other
  // Render Functions
  return /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.InViewport, {
    onInViewportChange: onInViewportChange,
    threshold: 0.1,
    className: (topBarImage_default()).topBarImage
  }, /*#__PURE__*/external_react_namespaceObject.createElement(react_bootstrap_mobile_namespaceObject.Image, {
    style: maxHeight ? {
      maxHeight
    } : undefined,
    src: image
  }));
}
const TopBarImageMemo = (0,react_bootstrap_mobile_namespaceObject.withMemo)(TopBarImage, (topBarImage_default()));

;// CONCATENATED MODULE: ./src/client.ts

















})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=client.js.map