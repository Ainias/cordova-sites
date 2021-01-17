import {AbstractFragment} from "../AbstractFragment";
import {ViewInflater} from "../../ViewInflater";
import {Helper} from "js-helper/dist/shared/Helper";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {Translator} from "../../Translator";
import {NativeStoragePromise} from "../../NativeStoragePromise";
import {Toast} from "../../Toast/Toast";

const template = require("../../../html/Framework/Fragment/abstractWindowTemplate.html");

export class AbstractWindowFragment extends AbstractFragment {
    private _position: any = {x: 0, y: 0}
    protected _container;
    private _title: string = "";
    private _titleElement: any;
    private _window;
    private _margin: any = {x: 0, y: 0}
    private _resizeElements: any;
    private id: string;
    private saveData: { [key: string]: any } = {};
    private state: "minimized" | "maximized" | "popup" | "normal" = "normal";
    private popupWindow: Window = null;

    constructor(site, view, position: any, title?: string, id?: string) {
        super(site, template);
        this._position = position;
        this._title = Helper.nonNull(title, "&nbsp;");
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
            this._titleElement.appendChild(Translator.makePersistentTranslation(title))
        }
        this._title = title;
    }

    getDimension() {
        let computedStyle = window.getComputedStyle(this._container);
        let width = parseFloat(computedStyle.getPropertyValue("width"));
        let height = parseFloat(computedStyle.getPropertyValue("height"));

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

        this.moveTo(this._position.x, this._position.y);
        this.setTitle(this._title);

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

        let moveStartListener = (x, y, e) => {
            if (e.target === this._container || e.target.closest("#title") === this._titleElement) {
                mouseDownPos = {x: x, y: y};
                this._container.classList.add("moving")
            }
            let activeWindow = document.querySelector(".window-container.active-window");
            if (activeWindow && activeWindow !== this._container) {
                activeWindow.classList.remove("active-window");
            }
            this._container.classList.add("active-window");
        }

        let mouseDownPos = null;
        this._container.addEventListener("mousedown", (e) => {
            moveStartListener(e.clientX, e.clientY, e);
        });
        this._container.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                moveStartListener(e.touches[0].clientX, e.touches[0].clientY, e);
            }
        });

        let moveListener = (x, y, e) => {
            if (resizeStart !== null) {
                let diff = {
                    x: (x - resizeStart.x) * (multiplier.x),
                    y: (y - resizeStart.y) * (multiplier.y)
                }
                dimension = {x: dimension.x + diff.x, y: dimension.y + diff.y}

                this.setDimension(dimension.x, dimension.y)

                let moveDiff = {x: 0, y: 0};
                if (multiplier.x < 0) {
                    moveDiff.x = -diff.x;
                }
                if (multiplier.y < 0) {
                    moveDiff.y = -diff.y;
                }

                this.moveAt(moveDiff.x, moveDiff.y);

                resizeStart = {x: x, y: y};
            } else if (mouseDownPos !== null) {
                let diff = {
                    x: x - mouseDownPos.x,
                    y: y - mouseDownPos.y,
                }
                mouseDownPos = {x: x, y: y};
                this.moveAt(diff.x, diff.y);
            }
        }
        window.addEventListener("mousemove", (e) => {
            moveListener(e.clientX, e.clientY, e)
        });
        window.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1) {
                moveListener(e.touches[0].clientX, e.touches[0].clientY, e);
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
                moveListener(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e);
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
            console.log("beforeunload!");
            if (this.popupWindow) {
                this.id = null; //disable saving, since it should
                this.popupWindow.close();
            }
        })
    }

    private async load() {
        if (this.id) {
            const saveData = await NativeStoragePromise.getItem(this.id);
            if (saveData) {
                if (saveData.dimension) {
                    this.setDimension(saveData.dimension.x, saveData.dimension.y);
                }
                if (saveData.position) {
                    this.moveTo(saveData.position.x, saveData.position.y);
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
            }
        }
    }

    private async save() {
        if (this.id) {
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

    _checkPositionAndDimension() {

        let dimension = this.getDimension();

        if (isNaN(dimension.x) || isNaN(dimension.y)) {
            return;
        }

        let maxPosition = {x: window.innerWidth - dimension.x, y: window.innerHeight - dimension.y};

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

    async onStart(pauseArguments): Promise<void> {
        let res = super.onStart(pauseArguments);

        this._checkPositionAndDimension();

        return res;
    }

    moveAt(x, y) {
        return this.moveTo(this._position.x + x, this._position.y + y);
    }

    moveTo(x, y) {
        this._position = {x: x, y: y};
        this._container.style.left = x + "px";
        this._container.style.top = y + "px";

        this._checkPositionAndDimension();

        this.saveData.position = this._position;
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
        titleElement.innerText = this._title;
        windowProxy.document.head.appendChild(titleElement);

        document.querySelectorAll("link[rel='stylesheet']").forEach(styleElem => {
            windowProxy.document.head.appendChild(styleElem.cloneNode());
        });

        const parent = this._container.parentNode;

        this._container.remove();
        this._container.classList.add("popup");
        this._container.classList.remove("minimized");
        this._container.classList.remove("maximized");

        const translationCallback = Translator.getInstance().addTranslationCallback(() => {
            Translator.getInstance().updateTranslations(this._container);
        }, false);

        windowProxy.document.body.appendChild(this._container);
        windowProxy.addEventListener("beforeunload", () => {
            this.state = "normal";
            this.saveData.state = this.state;
            this.save();

            this._container.remove();
            this._container.classList.remove("popup");
            this._container.classList.remove("minimized");
            this._container.classList.remove("maximized");
            parent.appendChild(this._container);
            this.popupWindow = null;

            Translator.getInstance().removeTranslationCallback(translationCallback);
        });
        this.popupWindow = windowProxy;
    }
}