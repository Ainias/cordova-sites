"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractWindowFragment = void 0;
const AbstractFragment_1 = require("../AbstractFragment");
const ViewInflater_1 = require("../../ViewInflater");
const Helper_1 = require("js-helper/dist/shared/Helper");
const ViewHelper_1 = require("js-helper/dist/client/ViewHelper");
const Translator_1 = require("../../Translator");
const template = require("../../../html/Framework/Fragment/abstractWindowTemplate.html");
class AbstractWindowFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view, position, title) {
        super(site, template);
        this._position = { x: 0, y: 0 };
        this._title = "";
        this._margin = { x: 0, y: 0 };
        this._position = position;
        this._title = Helper_1.Helper.nonNull(title, "&nbsp;");
        this._viewPromise = Promise.all([this._viewPromise, ViewInflater_1.ViewInflater.getInstance().load(view)]).then(res => {
            res[0].querySelector("#child-view").replaceWith(res[1]);
            ViewInflater_1.ViewInflater.replaceWithChildren(res[1]);
            this._view = res[0];
            return res[0];
        }).catch(e => console.error(e));
    }
    setTitle(title) {
        if (this._titleElement) {
            ViewHelper_1.ViewHelper.removeAllChildren(this._titleElement);
            this._titleElement.appendChild(Translator_1.Translator.makePersistentTranslation(title));
        }
        this._title = title;
    }
    getDimension() {
        let computedStyle = window.getComputedStyle(this._container);
        let width = parseFloat(computedStyle.getPropertyValue("width"));
        let height = parseFloat(computedStyle.getPropertyValue("height"));
        console.log("dim", width, height);
        return { x: Math.ceil(width) - this._margin.x, y: Math.ceil(height) - this._margin.y };
    }
    setDimension(x, y) {
        x += this._margin.x;
        y += this._margin.y;
        this._container.style.width = x + "px";
        this._container.style.height = y + "px";
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this._container = this.findBy(".window-container");
            this._window = this.findBy(".window");
            let resizeStart = null;
            let multiplier;
            let dimension;
            let resizeStartListener = (x, y, e) => {
                if (e.target.classList.contains("window-resize")) {
                    e.stopPropagation();
                    resizeStart = { x: x, y: y };
                    let direction = e.target.dataset["direction"].split(",");
                    multiplier = { x: parseInt(direction[0]), y: parseInt(direction[1]) };
                    dimension = this.getDimension();
                }
            };
            this.findBy(".window-resize", true).forEach(element => {
                element.addEventListener("mousedown", (e) => {
                    resizeStartListener(e.clientX, e.clientY, e);
                });
            });
            let moveStartListener = (x, y, e) => {
                if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                    mouseDownPos = { x: x, y: y };
                    this._container.classList.add("moving");
                }
                let activeWindow = document.querySelector(".window-container.active-window");
                if (activeWindow && activeWindow !== this._container) {
                    activeWindow.classList.remove("active-window");
                }
                this._container.classList.add("active-window");
            };
            let mouseDownPos = null;
            this._container.addEventListener("mousedown", (e) => {
                moveStartListener(e.clientX, e.clientY, e);
            });
            this._container.addEventListener("touchstart", (e) => {
                if (e.touches.length === 1) {
                    moveStartListener(e.touches[0].clientX, e.touches[0].clientY, e);
                }
            });
            this._titleElement = this.findBy("#title");
            let moveListener = (x, y, e) => {
                if (resizeStart !== null) {
                    let diff = {
                        x: (x - resizeStart.x) * (multiplier.x),
                        y: (y - resizeStart.y) * (multiplier.y)
                    };
                    dimension = { x: dimension.x + diff.x, y: dimension.y + diff.y };
                    this.setDimension(dimension.x, dimension.y);
                    let moveDiff = { x: 0, y: 0 };
                    if (multiplier.x < 0) {
                        moveDiff.x = -diff.x;
                    }
                    if (multiplier.y < 0) {
                        moveDiff.y = -diff.y;
                    }
                    this.moveAt(moveDiff.x, moveDiff.y);
                    resizeStart = { x: x, y: y };
                }
                else if (mouseDownPos !== null) {
                    let diff = {
                        x: x - mouseDownPos.x,
                        y: y - mouseDownPos.y,
                    };
                    mouseDownPos = { x: x, y: y };
                    this.moveAt(diff.x, diff.y);
                }
            };
            window.addEventListener("mousemove", (e) => {
                moveListener(e.clientX, e.clientY, e);
            });
            window.addEventListener("touchmove", (e) => {
                if (e.touches.length === 1) {
                    console.log("touchmove");
                    moveListener(e.touches[0].clientX, e.touches[0].clientY, e);
                }
            });
            let endListener = (x, y, e) => {
                mouseDownPos = null;
                resizeStart = null;
                this._container.classList.remove("moving");
            };
            window.addEventListener("mouseup", (e) => {
                endListener(e.clientX, e.clientY, e);
            });
            window.addEventListener("touchend", (e) => {
                if (e.touches.length === 0 && e.changedTouches.length === 1) {
                    moveListener(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e);
                }
            });
            this._container.addEventListener("dblclick", (e) => {
                if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                    this._container.classList.toggle("minimized");
                }
            });
            window.addEventListener("resize", () => {
                this._checkPositionAndDimension();
            });
            this._resizeElements = {
                x: [
                    this._window,
                    this.findBy(".window-resize.left"),
                    this.findBy(".window-resize.right")
                ],
                y: [
                    this._window,
                    this._titleElement,
                    this.findBy(".window-resize.top"),
                    this.findBy(".window-resize.bottom")
                ],
            };
            this.moveTo(this._position.x, this._position.y);
            this.setTitle(this._title);
            return res;
        });
    }
    resizeToContent() {
        if (this._window) {
            let diff = {
                x: this._window.scrollWidth - this._window.clientWidth,
                y: this._window.scrollHeight - this._window.clientHeight,
            };
            let dimension = this.getDimension();
            if (diff.x === 0) {
                let sum = 0;
                this._resizeElements.x.forEach(e => sum += parseFloat(window.getComputedStyle(e).getPropertyValue("width")));
                diff.x = Math.ceil(sum) - dimension.x;
            }
            if (diff.y === 0) {
                let sum = 0;
                this._resizeElements.y.forEach(e => sum += parseFloat(window.getComputedStyle(e).getPropertyValue("height")));
                diff.y = Math.ceil(sum) - dimension.y;
            }
            dimension.x += diff.x;
            dimension.y += diff.y;
            if (!this._container.classList.contains("minimized")) {
                this.setDimension(dimension.x, dimension.y);
            }
            this._checkPositionAndDimension();
        }
    }
    _checkPositionAndDimension() {
        let dimension = this.getDimension();
        if (isNaN(dimension.x) || isNaN(dimension.y)) {
            return;
        }
        let maxPosition = { x: window.innerWidth - dimension.x, y: window.innerHeight - dimension.y };
        this._position = {
            x: Math.min(this._position.x, maxPosition.x),
            y: Math.min(this._position.y, maxPosition.y)
        };
        if (this._position.x < 0) {
            dimension.x += this._position.x;
            this._position.x = 0;
        }
        if (this._position.y < 0) {
            dimension.y += this._position.y;
            this._position.y = 0;
        }
        this._container.style.left = this._position.x + "px";
        this._container.style.top = this._position.y + "px";
        if (!this._container.classList.contains("minimized")) {
            this.setDimension(dimension.x, dimension.y);
        }
    }
    onStart(pauseArguments) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onStart.call(this, pauseArguments);
            this._checkPositionAndDimension();
            return res;
        });
    }
    moveAt(x, y) {
        return this.moveTo(this._position.x + x, this._position.y + y);
    }
    moveTo(x, y) {
        this._position = { x: x, y: y };
        this._container.style.left = x + "px";
        this._container.style.top = y + "px";
        this._checkPositionAndDimension();
    }
}
exports.AbstractWindowFragment = AbstractWindowFragment;
//# sourceMappingURL=AbstractWindowFragment.js.map