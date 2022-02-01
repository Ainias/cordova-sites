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
exports.SiteContainer = exports.initialFooterOptions = exports.initialTopBarOptions = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const SiteIdContext_1 = require("../App/SiteIdContext");
const VisibleContext_1 = require("../App/VisibleContext");
const TopBar_1 = require("./TopBar/TopBar");
const Hooks_1 = require("../App/Hooks");
const react_bootstrap_1 = require("react-bootstrap");
exports.initialTopBarOptions = {
    visible: true,
    title: undefined,
    leftButtons: [],
    rightButtons: [],
    backButton: undefined,
    transparent: false,
    drawBehind: false,
};
exports.initialFooterOptions = {
    visible: true,
    buttons: [],
};
const initialState = {
    topBarOptions: {},
};
class SiteContainer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = initialState;
        this.container = react_1.createRef();
        this.child = react_1.createRef();
    }
    componentDidMount() {
        const { visible, onContainerListener, id } = this.props;
        if (this.child.current && !visible) {
            this.child.current.remove();
        }
        if (onContainerListener) {
            onContainerListener(id, this.container);
        }
    }
    getSnapshotBeforeUpdate(prevProps) {
        const { visible } = this.props;
        if (!prevProps.visible && visible && this.container.current && this.child.current) {
            this.container.current.appendChild(this.child.current);
        }
        return null;
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (!visible && prevProps.visible && this.child.current) {
            this.child.current.remove();
        }
    }
    render() {
        var _a, _b;
        const { siteComponent, siteContainerStyle, siteProps, visible, id, siteContainerClass, defaultTopBarOptions } = this.props;
        const Base = siteComponent;
        const { topBarOptions } = this.state;
        if (typeof topBarOptions.rightButtons === 'function') {
            topBarOptions.rightButtons = topBarOptions.rightButtons([...((_a = defaultTopBarOptions.rightButtons) !== null && _a !== void 0 ? _a : [])]);
        }
        if (typeof topBarOptions.leftButtons === 'function') {
            topBarOptions.leftButtons = topBarOptions.leftButtons([...((_b = defaultTopBarOptions.leftButtons) !== null && _b !== void 0 ? _b : [])]);
        }
        return (React.createElement("div", { ref: this.container, style: siteContainerStyle, className: (siteContainerClass !== null && siteContainerClass !== void 0 ? siteContainerClass : 'site') + (visible ? ' visible' : ' hidden') },
            React.createElement("div", { ref: this.child },
                React.createElement(Hooks_1.SiteContainerContext.Provider, { value: this },
                    React.createElement(SiteIdContext_1.SiteIdContext.Provider, { value: id },
                        React.createElement(VisibleContext_1.VisibleContext.Provider, { value: visible },
                            React.createElement(TopBar_1.TopBar, Object.assign({}, defaultTopBarOptions, topBarOptions)),
                            React.createElement(react_bootstrap_1.Container, { fluid: "xxl", style: { overflowX: 'hidden', padding: 0 } },
                                React.createElement(Base, Object.assign({}, siteProps)))))))));
    }
    updateTopBarOptions(newOptions) {
        const { topBarOptions } = this.state;
        this.setState({
            topBarOptions: Object.assign(Object.assign({}, topBarOptions), newOptions),
        });
    }
}
exports.SiteContainer = SiteContainer;
//# sourceMappingURL=SiteContainer.js.map