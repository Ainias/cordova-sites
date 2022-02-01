"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackButton = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const react_bootstrap_mobile_1 = require("react-bootstrap-mobile");
const Hooks_1 = require("../../App/Hooks");
exports.BackButton = React.memo(({}) => {
    const sites = Hooks_1.useSites();
    const goBack = react_1.useCallback(() => sites === null || sites === void 0 ? void 0 : sites.goBack(), [sites]);
    if (sites === null || sites === void 0 ? void 0 : sites.canGoBack()) {
        return (React.createElement(react_bootstrap_mobile_1.TopBarButton, { onClick: goBack },
            React.createElement("span", { className: "back-button-img" })));
    }
    return null;
});
//# sourceMappingURL=BackButton.js.map