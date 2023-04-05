/*!
 * 
 *   @ainias42/cordova-sites v0.8.4
 *   git+https://github.com/Ainias/cordova-sites.git
 *   Copyright (c) Silas Günther and project contributors.
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shared.ts":
/*!***********************!*\
  !*** ./src/shared.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"encodeUrl\": () => (/* reexport safe */ _shared_helper_encodeUrl__WEBPACK_IMPORTED_MODULE_0__.encodeUrl),\n/* harmony export */   \"redirectFromInitialProps\": () => (/* reexport safe */ _shared_helper_redirectFromInitialProps__WEBPACK_IMPORTED_MODULE_1__.redirectFromInitialProps)\n/* harmony export */ });\n/* harmony import */ var _shared_helper_encodeUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/helper/encodeUrl */ \"./src/shared/helper/encodeUrl.ts\");\n/* harmony import */ var _shared_helper_redirectFromInitialProps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/helper/redirectFromInitialProps */ \"./src/shared/helper/redirectFromInitialProps.ts\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2hhcmVkLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AYWluaWFzNDIvY29yZG92YS1zaXRlcy8uL3NyYy9zaGFyZWQudHM/NWQ0NiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL3NoYXJlZC9oZWxwZXIvZW5jb2RlVXJsJztcbmV4cG9ydCAqIGZyb20gJy4vc2hhcmVkL2hlbHBlci9yZWRpcmVjdEZyb21Jbml0aWFsUHJvcHMnO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/shared.ts\n");

/***/ }),

/***/ "./src/shared/helper/encodeUrl.ts":
/*!****************************************!*\
  !*** ./src/shared/helper/encodeUrl.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"encodeUrl\": () => (/* binding */ encodeUrl)\n/* harmony export */ });\nfunction encodeUrl(strings, ...values) {\n  let encodedUrl = strings[0];\n  values.forEach((val, i) => {\n    encodedUrl += encodeURIComponent(val) + strings[i + 1];\n  });\n  return encodedUrl;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2hhcmVkL2hlbHBlci9lbmNvZGVVcmwudHMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFNLFNBQVVBLFNBQVNBLENBQUNDLE9BQTZCLEVBQUUsR0FBR0MsTUFBcUM7RUFDN0YsSUFBSUMsVUFBVSxHQUFHRixPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQzNCQyxNQUFNLENBQUNFLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLENBQUMsS0FBSTtJQUN0QkgsVUFBVSxJQUFJSSxrQkFBa0IsQ0FBQ0YsR0FBRyxDQUFDLEdBQUdKLE9BQU8sQ0FBQ0ssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMxRCxDQUFDLENBQUM7RUFDRixPQUFPSCxVQUFVO0FBQ3JCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFpbmlhczQyL2NvcmRvdmEtc2l0ZXMvLi9zcmMvc2hhcmVkL2hlbHBlci9lbmNvZGVVcmwudHM/MzI4MCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZW5jb2RlVXJsKHN0cmluZ3M6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKVtdKSB7XG4gICAgbGV0IGVuY29kZWRVcmwgPSBzdHJpbmdzWzBdO1xuICAgIHZhbHVlcy5mb3JFYWNoKCh2YWwsIGkpID0+IHtcbiAgICAgICAgZW5jb2RlZFVybCArPSBlbmNvZGVVUklDb21wb25lbnQodmFsKSArIHN0cmluZ3NbaSArIDFdO1xuICAgIH0pO1xuICAgIHJldHVybiBlbmNvZGVkVXJsO1xufVxuIl0sIm5hbWVzIjpbImVuY29kZVVybCIsInN0cmluZ3MiLCJ2YWx1ZXMiLCJlbmNvZGVkVXJsIiwiZm9yRWFjaCIsInZhbCIsImkiLCJlbmNvZGVVUklDb21wb25lbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/shared/helper/encodeUrl.ts\n");

/***/ }),

/***/ "./src/shared/helper/redirectFromInitialProps.ts":
/*!*******************************************************!*\
  !*** ./src/shared/helper/redirectFromInitialProps.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"redirectFromInitialProps\": () => (/* binding */ redirectFromInitialProps)\n/* harmony export */ });\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction redirectFromInitialProps(newLocation, res) {\n  if (res) {\n    res.writeHead(307, {\n      Location: newLocation\n    });\n    res.end();\n    return new Promise(() => {});\n  }\n  return next_router__WEBPACK_IMPORTED_MODULE_0___default().replace(newLocation);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2hhcmVkL2hlbHBlci9yZWRpcmVjdEZyb21Jbml0aWFsUHJvcHMudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ2lDO0FBRTNCLFNBQVVDLHdCQUF3QkEsQ0FBQ0MsV0FBbUIsRUFBRUMsR0FBb0I7RUFDOUUsSUFBSUEsR0FBRyxFQUFFO0lBQ0xBLEdBQUcsQ0FBQ0MsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUFFQyxRQUFRLEVBQUVIO0lBQVcsQ0FBRSxDQUFDO0lBQzdDQyxHQUFHLENBQUNHLEdBQUcsRUFBRTtJQUNULE9BQU8sSUFBSUMsT0FBTyxDQUFNLE1BQUssQ0FBRSxDQUFDLENBQUM7O0VBRXJDLE9BQU9QLDBEQUFjLENBQUNFLFdBQVcsQ0FBaUI7QUFDdEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AYWluaWFzNDIvY29yZG92YS1zaXRlcy8uL3NyYy9zaGFyZWQvaGVscGVyL3JlZGlyZWN0RnJvbUluaXRpYWxQcm9wcy50cz9iMDI4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgUm91dGVyIGZyb20gJ25leHQvcm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZGlyZWN0RnJvbUluaXRpYWxQcm9wcyhuZXdMb2NhdGlvbjogc3RyaW5nLCByZXM/OiBTZXJ2ZXJSZXNwb25zZSkge1xuICAgIGlmIChyZXMpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDcsIHsgTG9jYXRpb246IG5ld0xvY2F0aW9uIH0pO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KCgpID0+IHt9KTtcbiAgICB9XG4gICAgcmV0dXJuIFJvdXRlci5yZXBsYWNlKG5ld0xvY2F0aW9uKSBhcyBQcm9taXNlPGFueT47XG59XG4iXSwibmFtZXMiOlsiUm91dGVyIiwicmVkaXJlY3RGcm9tSW5pdGlhbFByb3BzIiwibmV3TG9jYXRpb24iLCJyZXMiLCJ3cml0ZUhlYWQiLCJMb2NhdGlvbiIsImVuZCIsIlByb21pc2UiLCJyZXBsYWNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/shared/helper/redirectFromInitialProps.ts\n");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("next/router");

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
/******/ 			// no module.id needed
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/shared.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});