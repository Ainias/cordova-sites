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
import { PureComponent } from 'react';
var defaultState = {};
var Site = /** @class */ (function (_super) {
    __extends(Site, _super);
    function Site() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Site.prototype.componentDidMount = function () {
        var _this = this;
        // Direction, call componentDidAppear after didMount
        setTimeout(function () { return _this.componentDidAppear(); }, 1);
    };
    Site.prototype.getSnapshotBeforeUpdate = function (prevProps) {
        var visible = this.props.visible;
        if (prevProps.visible !== visible) {
            if (visible) {
                this.componentWillAppear();
            }
            else {
                this.componentWillDisappear();
            }
        }
        return null;
    };
    Site.prototype.componentDidUpdate = function (prevProps) {
        var visible = this.props.visible;
        if (prevProps.visible !== visible) {
            if (visible) {
                this.componentDidAppear();
            }
            else {
                this.componentDidDisappear();
            }
        }
    };
    Site.prototype.componentWillUnmount = function () {
        this.componentWillDisappear();
    };
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    Site.prototype.componentWillAppear = function () { };
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    Site.prototype.componentWillDisappear = function () { };
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    Site.prototype.componentDidAppear = function () { };
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    Site.prototype.componentDidDisappear = function () { };
    return Site;
}(PureComponent));
export { Site };
//# sourceMappingURL=Site.js.map