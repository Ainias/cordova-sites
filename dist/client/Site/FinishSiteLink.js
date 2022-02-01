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
exports.FinishSiteLink = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const SiteIdContext_1 = require("../App/SiteIdContext");
const Hooks_1 = require("../App/Hooks");
exports.FinishSiteLink = React.memo(({ style, children, className }) => {
    const id = SiteIdContext_1.useSiteId();
    const sites = Hooks_1.useSites();
    const onClickHandler = react_1.useCallback(() => {
        if (id) {
            sites === null || sites === void 0 ? void 0 : sites.removeSite(id);
        }
    }, [id, sites]);
    return (React.createElement("button", { style: style, onClick: onClickHandler, className: className, type: "button" }, children));
});
//# sourceMappingURL=FinishSiteLink.js.map