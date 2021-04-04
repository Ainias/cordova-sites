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
const NativeStoragePromise_1 = require("../../NativeStoragePromise");
const Toast_1 = require("../../Toast/Toast");
const template = require("../../../html/Framework/Fragment/abstractWindowTemplate.html");
class AbstractWindowFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view, position, title, id) {
        super(site, template);
        this.position = {
            x: 0,
            y: 0,
            fromTop: true,
            fromLeft: true
        };
        this.title = "";
        this._margin = { x: 0, y: 0 };
        this.saveData = {};
        this.state = "normal";
        this.popupWindow = null;
        this.translateTitle = true;
        this.position = Object.assign({ fromTop: true, fromLeft: true }, position);
        this.title = Helper_1.Helper.nonNull(title, "&nbsp;");
        if (id) {
            this.id = "window-" + id;
        }
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
            this._titleElement.appendChild(this.translateTitle ? Translator_1.Translator.makePersistentTranslation(title) : document.createTextNode(title));
        }
        this.title = title;
    }
    getDimension() {
        let computedStyle = window.getComputedStyle(this._container);
        let width = parseFloat(computedStyle.getPropertyValue("width"));
        let height = parseFloat(computedStyle.getPropertyValue("height"));
        return { x: Math.ceil(width) - this._margin.x, y: Math.ceil(height) - this._margin.y };
    }
    setDimension(x, y) {
        x += this._margin.x;
        y += this._margin.y;
        this._container.style.width = x + "px";
        this._container.style.height = y + "px";
        this.saveData.dimension = {
            x: x,
            y: y,
        };
        this.save();
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this._container = this.findBy(".window-container");
            if (this.position.width || this.position.height) {
                this._container.style.width = this.position.width + "px";
                this._container.style.height = this.position.height + "px";
            }
            this._window = this.findBy(".window");
            this._titleElement = this.findBy("#title");
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
            yield this.load();
            this._checkPositionAndDimension();
            // this.moveTo(this.position.x, this.position.y);
            this.setTitle(this.title);
            this.addListeners();
            const buttonContainer = this.findBy("#title-buttons");
            if (buttonContainer) {
                buttonContainer.remove();
                this._titleElement.parentNode.appendChild(buttonContainer);
                buttonContainer.querySelectorAll(".title-button").forEach(button => {
                    button.addEventListener("click", e => {
                        this.onButtonClick(button.id, button, e);
                    });
                });
            }
            return res;
        });
    }
    addListeners() {
        return __awaiter(this, void 0, void 0, function* () {
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
            let mouseDownPos = null;
            let pos = null;
            let moveStartListener = (x, y, e) => {
                if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                    mouseDownPos = { x: x, y: y };
                    pos = Object.assign({}, this.getPosition()); //Make copy
                    this._container.classList.add("moving");
                }
                this.makeActiveWindow();
            };
            this._container.addEventListener("mousedown", (e) => {
                moveStartListener(e.clientX, e.clientY, e);
            });
            this._container.addEventListener("touchstart", (e) => {
                if (e.touches.length === 1) {
                    moveStartListener(e.touches[0].clientX, e.touches[0].clientY, e);
                }
            });
            let moveListener = (x, y) => {
                if (resizeStart !== null) {
                    let diff = {
                        x: (x - resizeStart.x) * (multiplier.x),
                        y: (y - resizeStart.y) * (multiplier.y)
                    };
                    dimension = { x: dimension.x + diff.x, y: dimension.y + diff.y };
                    this.setDimension(dimension.x, dimension.y);
                    let moveDiff = { x: 0, y: 0 };
                    if (multiplier.x * (this.position.fromLeft ? 1 : -1) < 0) {
                        moveDiff.x = diff.x * (this.position.fromLeft ? -1 : 1);
                    }
                    if (multiplier.y * (this.position.fromTop ? 1 : -1) < 0) {
                        moveDiff.y = diff.y * (this.position.fromTop ? -1 : 1);
                    }
                    this.moveAt(moveDiff.x, moveDiff.y);
                    resizeStart = { x: x, y: y };
                }
                else if (mouseDownPos !== null) {
                    let diff = {
                        x: x - mouseDownPos.x,
                        y: y - mouseDownPos.y,
                    };
                    mouseDownPos = { x, y };
                    // const newPos = {x: pos.x + diff.x, y: pos.y + diff.y};
                    this.moveAt(diff.x, diff.y);
                }
            };
            window.addEventListener("mousemove", (e) => {
                moveListener(e.clientX, e.clientY);
            });
            window.addEventListener("touchmove", (e) => {
                if (e.touches.length === 1) {
                    moveListener(e.touches[0].clientX, e.touches[0].clientY);
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
                    endListener(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e);
                }
            });
            this._container.addEventListener("dblclick", (e) => {
                if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                    this.toggleMinimize();
                }
            });
            window.addEventListener("resize", () => {
                this._checkPositionAndDimension();
            });
            window.addEventListener("beforeunload", () => {
                if (this.popupWindow) {
                    this.id = null; //disable saving, since it should
                    this.popupWindow.close();
                }
            });
        });
    }
    makeActiveWindow() {
        let activeWindow = document.querySelector(".window-container.active-window");
        if (activeWindow && activeWindow !== this._container) {
            activeWindow.classList.remove("active-window");
        }
        this._container.classList.add("active-window");
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                const saveData = yield NativeStoragePromise_1.NativeStoragePromise.getItem(this.id);
                if (saveData) {
                    if (saveData.dimension) {
                        this.setDimension(saveData.dimension.x, saveData.dimension.y);
                    }
                    if (saveData.position) {
                        this.position = saveData.position;
                        this._checkPositionAndDimension();
                    }
                    if (saveData.state) {
                        switch (saveData.state) {
                            case "minimized": {
                                this.toggleMinimize();
                                break;
                            }
                            case "maximized": {
                                this.toggleMaximize();
                                break;
                            }
                            case "popup": {
                                this._viewLoadedPromise.then(() => {
                                    this.openInNewWindow();
                                });
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                yield NativeStoragePromise_1.NativeStoragePromise.setItem(this.id, this.saveData);
            }
        });
    }
    toggleMinimize() {
        if (this.state !== "popup") {
            this._container.classList.toggle("minimized");
            this._container.classList.remove("maximized");
            if (!this._container.classList.contains("minimized")) {
                this.resizeToContent();
                this.state = "normal";
            }
            else {
                this.state = "minimized";
            }
            this.saveData.state = this.state;
            this.save();
        }
    }
    toggleMaximize() {
        if (this.state !== "popup") {
            this._container.classList.toggle("maximized");
            this._container.classList.remove("minimized");
            if (!this._container.classList.contains("maximized")) {
                this.resizeToContent();
                this.state = "normal";
            }
            else {
                this.state = "maximized";
            }
            this.saveData.state = this.state;
            this.save();
        }
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
            if (this.state === "normal") {
                this.setDimension(dimension.x, dimension.y);
            }
            this._checkPositionAndDimension();
        }
    }
    _checkPositionAndDimension() {
        let dimension = this.getDimension();
        let setDimension = true;
        if (isNaN(dimension.x)) {
            dimension.x = 0;
            setDimension = false;
        }
        if (isNaN(dimension.y)) {
            dimension.y = 0;
            setDimension = false;
        }
        let maxPosition = { x: window.innerWidth - dimension.x, y: window.innerHeight - dimension.y };
        this.position = {
            x: Math.min(this.position.x, maxPosition.x),
            y: Math.min(this.position.y, maxPosition.y),
            fromTop: this.position.fromTop,
            fromLeft: this.position.fromLeft
        };
        if (this.position.x < 0) {
            if (maxPosition.x < 0) {
                dimension.x += this.position.x;
            }
            this.position.x = 0;
        }
        else if (maxPosition.x < 2 * this.position.x) {
            this.position.x = maxPosition.x - this.position.x;
            this.position.fromLeft = !this.position.fromLeft;
        }
        if (this.position.y < 0) {
            if (maxPosition.y < 0) {
                dimension.y += this.position.y;
            }
            this.position.y = 0;
        }
        else if (maxPosition.y < 2 * this.position.y) {
            this.position.y = maxPosition.y - this.position.y;
            this.position.fromTop = !this.position.fromTop;
        }
        if (this.position.fromTop) {
            this._container.style.top = this.position.y + "px";
            this._container.style.removeProperty("bottom");
        }
        else {
            this._container.style.bottom = this.position.y + "px";
            this._container.style.removeProperty("top");
        }
        if (this.position.fromLeft) {
            this._container.style.left = this.position.x + "px";
            this._container.style.removeProperty("right");
        }
        else {
            this._container.style.right = this.position.x + "px";
            this._container.style.removeProperty("left");
        }
        if (!this._container.classList.contains("minimized") && setDimension) {
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
        const dimension = this.getDimension();
        if (this.position.fromTop) {
            y += this.position.y;
        }
        else {
            y += window.innerHeight - this.position.y - dimension.y;
        }
        if (this.position.fromLeft) {
            x += this.position.x;
        }
        else {
            x += window.innerWidth - this.position.x - dimension.x;
        }
        return this.moveTo(x, y);
    }
    moveTo(x, y) {
        this.position = { x: x, y: y, fromLeft: true, fromTop: true };
        this._checkPositionAndDimension();
        this.saveData.position = this.position;
        this.save();
    }
    onButtonClick(id, button, e) {
        switch (id) {
            case "minimize-button": {
                this.toggleMinimize();
                break;
            }
            case "maximize-button": {
                this.toggleMaximize();
                break;
            }
            case "new-window-button": {
                this.openInNewWindow();
                break;
            }
        }
    }
    openInNewWindow() {
        if (this.state === "popup") {
            return;
        }
        const windowProxy = window.open("", "", "modal=yes");
        if (windowProxy === null) {
            new Toast_1.Toast("cannot open popups").show();
            return;
        }
        this.state = "popup";
        this.saveData.state = this.state;
        this.save();
        const baseElement = document.createElement("base");
        baseElement.href = window.location.href;
        windowProxy.document.head.appendChild(baseElement);
        const titleElement = document.createElement("title");
        titleElement.innerText = this.title;
        windowProxy.document.head.appendChild(titleElement);
        document.querySelectorAll("link[rel='stylesheet']").forEach(styleElem => {
            windowProxy.document.head.appendChild(styleElem.cloneNode());
        });
        const parent = this._view.parentNode;
        this._view.remove();
        this._container.classList.add("popup");
        this._container.classList.remove("minimized");
        this._container.classList.remove("maximized");
        const translationCallback = Translator_1.Translator.getInstance().addTranslationCallback((baseElement) => {
            if (baseElement !== this._container) {
                Translator_1.Translator.getInstance().updateTranslations(this._container);
            }
        }, false);
        windowProxy.document.body.appendChild(this._view);
        windowProxy.addEventListener("beforeunload", () => {
            this.state = "normal";
            this.saveData.state = this.state;
            this.save();
            this._view.remove();
            this._container.classList.remove("popup");
            this._container.classList.remove("minimized");
            this._container.classList.remove("maximized");
            parent.appendChild(this._view);
            this.popupWindow = null;
            Translator_1.Translator.getInstance().removeTranslationCallback(translationCallback);
        });
        this.popupWindow = windowProxy;
        document.body.classList.forEach(className => {
            console.log("adding class", className);
            windowProxy.document.body.classList.add(className);
        });
    }
    getPosition() {
        return this.position;
    }
}
exports.AbstractWindowFragment = AbstractWindowFragment;
//# sourceMappingURL=AbstractWindowFragment.js.map