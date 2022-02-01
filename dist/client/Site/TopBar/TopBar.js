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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopBar = void 0;
const React = __importStar(require("react"));
const BackButton_1 = require("./BackButton");
const react_bootstrap_mobile_1 = require("react-bootstrap-mobile");
const react_i18next_1 = require("react-i18next");
const react_1 = require("react");
exports.TopBar = React.memo(function TopBar(_a) {
    var _b;
    var { visible = true, backButton = undefined, title = '', rightButtons = [], leftButtons = [], transparent = false, drawBehind = false, numberButtons = 3, numberButtonsXS = 2, numberButtonsSM = 3, numberButtonsMD = 4, numberButtonsLG = 5, numberButtonsXL = 5, numberButtonsXXL = 5, translate = true } = _a, translationProps = __rest(_a, ["visible", "backButton", "title", "rightButtons", "leftButtons", "transparent", "drawBehind", "numberButtons", "numberButtonsXS", "numberButtonsSM", "numberButtonsMD", "numberButtonsLG", "numberButtonsXL", "numberButtonsXXL", "translate"]);
    const realNumberButtons = (_b = react_bootstrap_mobile_1.useBreakpointSelect([
        numberButtonsXS,
        numberButtonsSM,
        numberButtonsMD,
        numberButtonsXL,
        numberButtonsLG,
        numberButtonsXXL,
    ])) !== null && _b !== void 0 ? _b : numberButtons;
    const { t } = react_i18next_1.useTranslation();
    const translateButton = react_1.useCallback((button) => {
        if (button.title && button.translate !== false) {
            const buttonTitle = 'translationArgs' in button ? t(button.title, button.translationArgs) : t(button.title);
            button = Object.assign(Object.assign({}, button), { title: buttonTitle });
        }
        return button;
    }, [t]);
    if (backButton === undefined) {
        backButton = { component: BackButton_1.BackButton };
    }
    if (backButton !== false) {
        leftButtons = leftButtons.slice(0, leftButtons.length);
        leftButtons.unshift(backButton);
    }
    let hiddenButtons = [];
    if (rightButtons.length > realNumberButtons) {
        rightButtons = [...rightButtons];
        hiddenButtons.push(...rightButtons.splice(realNumberButtons - 1, rightButtons.length));
    }
    rightButtons = rightButtons.map(translateButton);
    leftButtons = leftButtons.map(translateButton);
    hiddenButtons = hiddenButtons.map(translateButton);
    if (!visible) {
        return null;
    }
    if (title && translate) {
        title = 'translationArgs' in translationProps ? t(title, translationProps.translationArgs) : t(title);
    }
    return (React.createElement(react_bootstrap_mobile_1.TopBar, { title: title, rightButtons: rightButtons, leftButtons: leftButtons, hiddenButtons: hiddenButtons, transparent: transparent, drawBehind: drawBehind }));
});
//# sourceMappingURL=TopBar.js.map