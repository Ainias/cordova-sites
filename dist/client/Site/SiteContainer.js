var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { createRef } from 'react';
import { SiteIdContext } from '../App/SiteIdContext';
import { TopBar } from './TopBar/TopBar';
import { SiteContainerContext } from '../App/Hooks';
import { Container } from 'react-bootstrap';
var initialTopBarOptions = {
    title: undefined,
    leftButtons: [],
    rightButtons: [],
    backButton: undefined,
};
var initialState = {
    topBarOptions: initialTopBarOptions,
};
var SiteContainer = /** @class */ (function (_super) {
    __extends(SiteContainer, _super);
    function SiteContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = initialState;
        _this.container = createRef();
        _this.child = createRef();
        return _this;
    }
    SiteContainer.prototype.componentDidMount = function () {
        var _a = this.props, visible = _a.visible, onContainerListener = _a.onContainerListener, id = _a.id;
        if (this.child.current && !visible) {
            this.child.current.remove();
        }
        if (onContainerListener) {
            onContainerListener(id, this.container);
        }
    };
    SiteContainer.prototype.getSnapshotBeforeUpdate = function (prevProps) {
        var visible = this.props.visible;
        if (!prevProps.visible && visible && this.container.current && this.child.current) {
            this.container.current.appendChild(this.child.current);
        }
        return null;
    };
    SiteContainer.prototype.componentDidUpdate = function (prevProps) {
        var visible = this.props.visible;
        if (!visible && prevProps.visible && this.child.current) {
            this.child.current.remove();
        }
    };
    SiteContainer.prototype.render = function () {
        var _a = this.props, siteComponent = _a.siteComponent, siteContainerStyle = _a.siteContainerStyle, siteProps = _a.siteProps, visible = _a.visible, id = _a.id, leaving = _a.leaving, siteContainerClass = _a.siteContainerClass;
        var Base = siteComponent;
        var _b = this.state.topBarOptions, title = _b.title, rightButtons = _b.rightButtons, leftButtons = _b.leftButtons, backButton = _b.backButton;
        return (React.createElement("div", { ref: this.container, style: siteContainerStyle, className: siteContainerClass || 'site' },
            React.createElement("div", { ref: this.child },
                React.createElement(SiteContainerContext.Provider, { value: this },
                    React.createElement(SiteIdContext.Provider, { value: id },
                        React.createElement(TopBar, { title: title, rightButtons: rightButtons, leftButtons: leftButtons, backButton: backButton }),
                        React.createElement(Container, { fluid: "xxl" },
                            React.createElement(Base, __assign({ visible: visible, leaving: leaving }, siteProps, { id: id }))))))));
    };
    SiteContainer.prototype.updateTopBarOptions = function (newOptions) {
        var topBarOptions = this.state.topBarOptions;
        this.setState({
            topBarOptions: __assign(__assign({}, topBarOptions), newOptions),
        });
    };
    return SiteContainer;
}(React.PureComponent));
export { SiteContainer };
//# sourceMappingURL=SiteContainer.js.map