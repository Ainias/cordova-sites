import {AbstractFragment} from "../AbstractFragment";
import {ViewInflater} from "../../ViewInflater";
import {Helper} from "js-helper/dist/shared/Helper";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {Translator} from "../../Translator";
import {NativeStoragePromise} from "../../NativeStoragePromise";
import {Toast} from "../../Toast/Toast";
import {WindowPositionInterface} from "./WindowPositionInterface";
import {AbstractSite} from "../AbstractSite";

const template = require("../../../html/Framework/Fragment/abstractWindowTemplate.html");

export class AbstractWindowFragment<ct extends AbstractSite> extends AbstractFragment<ct> {
    private position: WindowPositionInterface = {
        x: 0,
        y: 0,
        anchorY: "top",
        anchorX: "left"
    }
    protected _container;
    private title: string = "";
    private _titleElement: any;
    private _window;
    private _margin: any = {x: 0, y: 0}
    private _resizeElements: any;
    private id: string;
    private saveData: { [key: string]: any } = {};
    private state: "minimized" | "maximized" | "popup" | "normal" = "normal";
    private popupWindow: Window = null;
    protected translateTitle: boolean = true;

    constructor(site, view, position: WindowPositionInterface, title?: string, id?: string) {
        super(site, template);
        this.position = Object.assign({anchorY: "top", anchorX: "left"}, position);

        this.title = Helper.nonNull(title, "&nbsp;");
        if (id) {
            this.id = "window-" + id;
        }

        this._viewPromise = Promise.all([this._viewPromise, ViewInflater.getInstance().load(view)]).then(res => {
            res[0].querySelector("#child-view").replaceWith(res[1]);
            ViewInflater.replaceWithChildren(res[1]);
            this._view = res[0];
            return res[0];
        }).catch(e => console.error(e));
    }

    setTitle(title) {
        if (this._titleElement) {
            ViewHelper.removeAllChildren(this._titleElement);
            this._titleElement.appendChild(this.translateTitle ? Translator.makePersistentTranslation(title) : document.createTextNode(title))
        }
        this.title = title;
    }

    getDimension() {
        let computedStyle = window.getComputedStyle(this._container);
        let width = parseFloat(computedStyle.getPropertyValue("width"));
        let height = parseFloat(computedStyle.getPropertyValue("height"));

        if (isNaN(width)){
            width = parseFloat(this._container.style.width);
        }
        if (isNaN(height)){
            height = parseFloat(this._container.style.height);
        }

        return {x: Math.ceil(width) - this._margin.x, y: Math.ceil(height) - this._margin.y};
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

    async onViewLoaded(): Promise<unknown[]> {
        let res = super.onViewLoaded();

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
        }
        await this.load();

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
                })
            })
        }

        return res;
    }

    private async addListeners() {
        let resizeStart = null;
        let multiplier;
        let dimension;

        let resizeStartListener = (x, y, e) => {
            if (e.target.classList.contains("window-resize")) {
                e.stopPropagation();
                resizeStart = {x: x, y: y}

                let direction = e.target.dataset["direction"].split(",");
                multiplier = {x: parseInt(direction[0]), y: parseInt(direction[1])};

                dimension = this.getDimension();
            }
        }

        this.findBy(".window-resize", true).forEach(element => {
            element.addEventListener("mousedown", (e) => {
                resizeStartListener(e.clientX, e.clientY, e);
            });
        });

        let mouseDownPos = null;
        let pos = null;
        let moveStartListener = (x, y, e) => {
            if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                mouseDownPos = {x: x, y: y};
                pos = Object.assign({}, this.getPosition()); //Make copy
                this._container.classList.add("moving")
            }
            this.makeActiveWindow()
        }

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
                let localMultiplier = {
                    x: multiplier.x,
                    y: multiplier.y,
                }

                let diff = {
                    x: (x - resizeStart.x) * (localMultiplier.x),
                    y: (y - resizeStart.y) * (localMultiplier.y)
                }
                dimension = {x: dimension.x + diff.x, y: dimension.y + diff.y}

                this.setDimension(dimension.x, dimension.y)
                const realDimension = this.getDimension();
                if (dimension.x !== realDimension.x) {
                    localMultiplier.x = 0;
                }
                if (dimension.y !== realDimension.y) {
                    localMultiplier.y = 0;
                }

                this._checkPositionAndDimension();

                //TODO diff für Center berechnen...
                let moveDiff = {x: 0, y: 0};
                if (localMultiplier.x !== 0) {
                    if (this.position.anchorX === "center") {
                        moveDiff.x = diff.x * localMultiplier.x / 2;
                    } else if (localMultiplier.x * (this.position.anchorX === "left" ? 1 : -1) < 0) {
                        moveDiff.x = diff.x * localMultiplier.x;
                    }
                }

                if (localMultiplier.y !== 0) {
                    if (this.position.anchorY === "center") {
                        moveDiff.y = diff.y * localMultiplier.y / 2;
                    } else if (localMultiplier.y * (this.position.anchorY === "top" ? 1 : -1) < 0) {
                        moveDiff.y = diff.y * localMultiplier.y;
                    }
                }

                this.moveAt(moveDiff.x, moveDiff.y);

                resizeStart = {x: x, y: y};
            } else if (mouseDownPos !== null) {
                let diff = {
                    x: x - mouseDownPos.x,
                    y: y - mouseDownPos.y,
                }
                mouseDownPos = {x, y};
                // const newPos = {x: pos.x + diff.x, y: pos.y + diff.y};
                this.moveAt(diff.x, diff.y);
            }
        }
        window.addEventListener("mousemove", (e) => {
            moveListener(e.clientX, e.clientY)
        });
        window.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1) {
                moveListener(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        let endListener = (x, y, e) => {
            mouseDownPos = null;
            resizeStart = null;
            this._container.classList.remove("moving")
        }
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
        })
    }

    makeActiveWindow() {
        let activeWindow = document.querySelector(".window-container.active-window");
        if (activeWindow && activeWindow !== this._container) {
            activeWindow.classList.remove("active-window");
        }
        this._container.classList.add("active-window");
    }

    private async load() {
        if (this.id) {
            const saveData = await NativeStoragePromise.getItem(this.id);
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
                            })
                            break;
                        }
                    }
                }
                this.saveData = saveData;
                this.save();
            }
        }
    }

    private async save() {
        if (this.id) {
            // console.log("save", this.id, this.saveData);
            await NativeStoragePromise.setItem(this.id, this.saveData);
        }
    }

    public toggleMinimize() {
        if (this.state !== "popup") {
            this._container.classList.toggle("minimized");
            this._container.classList.remove("maximized");

            if (!this._container.classList.contains("minimized")) {
                this.resizeToContent();
                this.state = "normal";
            } else {
                this.state = "minimized";
            }
            this.saveData.state = this.state;
            this.save();
        }
    }

    public toggleMaximize() {
        if (this.state !== "popup") {
            this._container.classList.toggle("maximized");
            this._container.classList.remove("minimized");

            if (!this._container.classList.contains("maximized")) {
                this.resizeToContent();
                this.state = "normal";
            } else {
                this.state = "maximized";
            }
            this.saveData.state = this.state;
            this.save();
        }
    }

    public resizeToContent() {
        if (this._window) {
            let diff = {
                x: this._window.scrollWidth - this._window.clientWidth,
                y: this._window.scrollHeight - this._window.clientHeight,
            }

            let dimension = this.getDimension();

            if (diff.x === 0) {
                let sum = 0;
                this._resizeElements.x.forEach(e => sum += parseFloat(window.getComputedStyle(e).getPropertyValue("width")));
                diff.x = Math.ceil(sum) - dimension.x
            }
            if (diff.y === 0) {
                let sum = 0;
                this._resizeElements.y.forEach(e => sum += parseFloat(window.getComputedStyle(e).getPropertyValue("height")));
                diff.y = Math.ceil(sum) - dimension.y
            }

            dimension.x += diff.x;
            dimension.y += diff.y;

            if (this.state === "normal") {
                this.setDimension(dimension.x, dimension.y);
            }

            this._checkPositionAndDimension();
        }
    }

    private getTopLeftCornerPosition() {
        const dimension = this.getDimension();

        let x = this.position.x;
        if (this.position.anchorX === "center") {
            x += window.innerWidth / 2 - dimension.x / 2;
        } else if (this.position.anchorX === "right") {
            x += window.innerWidth - dimension.x;
        }

        let y = this.position.y;


        if (this.position.anchorY === "center") {
            y += window.innerHeight / 2 - dimension.y / 2;
        } else if (this.position.anchorY === "bottom") {
            y += window.innerHeight - dimension.y;
        }

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        return {x, y};
    }

    private getCenterCenterPosition() {
        const dimension = this.getDimension();

        const topLeft = this.getTopLeftCornerPosition();
        return {
            x: (topLeft.x + dimension.x / 2) - window.innerWidth / 2,
            y: (topLeft.y + dimension.y / 2) - window.innerHeight / 2
        }
    }

    private getBottomRightPosition() {
        const dimension = this.getDimension();

        const topLeft = this.getTopLeftCornerPosition();
        return {
            x: Math.min((topLeft.x + dimension.x) - window.innerWidth, 0),
            y: Math.min((topLeft.y + dimension.y) - window.innerHeight, 0),
        }
    }

    _checkPositionAndDimension() {
        let dimension = this.getDimension();
        let setDimension = true;
        let dimensionChanged = false;

        if (isNaN(dimension.x)) {
            dimension.x = 0;
            setDimension = false;
        }
        if (isNaN(dimension.y)) {
            dimension.y = 0;
            setDimension = false;
        }

        let posTopLeft = this.getTopLeftCornerPosition();
        let posCenterCenter = this.getCenterCenterPosition();
        let posBottomRight = this.getBottomRightPosition();

        if (dimension.x > window.innerWidth) {
            dimensionChanged = true;
            dimension.x = window.innerWidth;
            this.position.x = 0;
            this.position.anchorX = "left";
        } else {
            if (posTopLeft.x <= Math.abs(posCenterCenter.x) && posTopLeft.x <= -1 * posBottomRight.x) {
                this.position.x = posTopLeft.x;
                this.position.anchorX = "left";
            } else if (-1 * posBottomRight.x <= Math.abs(posCenterCenter.x)) {
                this.position.x = posBottomRight.x;
                this.position.anchorX = "right";
            } else {
                this.position.x = posCenterCenter.x;
                this.position.anchorX = "center";
            }
        }

        if (dimension.y > window.innerHeight) {
            dimensionChanged = true;
            dimension.y = window.innerHeight;
            this.position.y = 0;
            this.position.anchorY = "top";
        } else {
            if (posTopLeft.y <= Math.abs(posCenterCenter.y) && posTopLeft.y <= -1 * posBottomRight.y) {
                this.position.y = posTopLeft.y;
                this.position.anchorY = "top";
            } else if (-1 * posBottomRight.y <= Math.abs(posCenterCenter.y)) {
                this.position.y = posBottomRight.y;
                this.position.anchorY = "bottom";
            } else {
                this.position.y = posCenterCenter.y;
                this.position.anchorY = "center";
            }
        }

        if (this.position.anchorY === "top") {
            this._container.style.top = this.position.y + "px";
            this._container.style.removeProperty("bottom");
        } else if (this.position.anchorY === "bottom") {
            this._container.style.bottom = (-1 * this.position.y) + "px";
            this._container.style.removeProperty("top");
        } else {
            this._container.style.top = "calc(50% + " + this.position.y.toString() + "px - " + (dimension.y / 2).toString() + "px)";
            this._container.style.removeProperty("bottom");
        }

        if (this.position.anchorX === "left") {
            this._container.style.left = this.position.x + "px";
            this._container.style.removeProperty("right");
        } else if (this.position.anchorX === "right") {
            this._container.style.right = (-1 * this.position.x) + "px";
            this._container.style.removeProperty("left");
        } else {
            this._container.style.left = "calc(50% + " + this.position.x.toString() + "px - " + (dimension.x / 2).toString() + "px)";
            this._container.style.removeProperty("right");
        }

        this.saveData.position = this.position;
        if (!this._container.classList.contains("minimized") && setDimension && dimensionChanged) {
            this.setDimension(dimension.x, dimension.y);
        }
    }

    async onStart(pauseArguments): Promise<void> {
        let res = super.onStart(pauseArguments);

        this._checkPositionAndDimension();

        return res;
    }

    moveAt(x, y) {
        const posTopLeft = this.getTopLeftCornerPosition();
        return this.moveTo(x + posTopLeft.x, y + posTopLeft.y);
    }

    moveTo(x, y) {
        this.position = {x: x, y: y, anchorX: "left", anchorY: "top"};
        this._checkPositionAndDimension();
        this.save();
    }

    public onButtonClick(id: string, button: HTMLElement, e: MouseEvent) {
        switch (id) {
            case "minimize-button": {
                this.toggleMinimize()
                break;
            }
            case "maximize-button": {
                this.toggleMaximize()
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
            new Toast("cannot open popups").show();
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

        const translationCallback = Translator.getInstance().addTranslationCallback((baseElement) => {
            if (baseElement !== this._container) {
                Translator.getInstance().updateTranslations(this._container);
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

            Translator.getInstance().removeTranslationCallback(translationCallback);
        });
        this.popupWindow = windowProxy;

        document.body.classList.forEach(className => {
            console.log("adding class", className);
            windowProxy.document.body.classList.add(className)
        });
    }

    private getPosition() {
        return this.position;
    }
}
