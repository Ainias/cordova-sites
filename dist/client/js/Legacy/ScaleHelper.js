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
exports.ScaleHelper = void 0;
const js_helper_1 = require("js-helper");
class ScaleHelper {
    scaleTo(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animationDelay, addListener) {
        return __awaiter(this, void 0, void 0, function* () {
            addListener = js_helper_1.Helper.nonNull(addListener, true);
            animationDelay = js_helper_1.Helper.nonNull(animationDelay, 0);
            let newFontSize = yield this._getNewFontSize(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animationDelay === 0);
            if (animationDelay > 0) {
                yield new Promise(r => {
                    setTimeout(r, animationDelay);
                    fontElement.style.fontSize = newFontSize + "px";
                });
            }
            let self = this;
            let listener = function () {
                return new Promise(resolve => {
                    let timeout = (typeof addListener === 'number') ? addListener : 255;
                    setTimeout(() => {
                        resolve(self.scaleTo(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animationDelay, false));
                    }, timeout);
                });
            };
            if (addListener !== false) {
                window.addEventListener("resize", listener);
            }
            return listener;
        });
    }
    scaleToFull(fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animDelay, addListener) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scaleTo(1, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animDelay, addListener);
        });
    }
    _getNewFontSize(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, setFontSize) {
        return __awaiter(this, void 0, void 0, function* () {
            margin = js_helper_1.Helper.nonNull(margin, 10);
            ignoreHeight = js_helper_1.Helper.nonNull(ignoreHeight, false);
            ignoreWidth = js_helper_1.Helper.nonNull(ignoreWidth, false);
            fontWeight = js_helper_1.Helper.nonNull(fontWeight, fontElement.innerHTML.length);
            setFontSize = js_helper_1.Helper.nonNull(setFontSize, true);
            let hasNoTransitionClass = container.classList.contains("no-transition");
            if (!hasNoTransitionClass) {
                container.classList.add("no-transition");
            }
            const numChanged = 5;
            let oldDiffIndex = 0;
            let oldDiff = [];
            for (let i = 0; i < numChanged; i++) {
                oldDiff.push(0);
            }
            let beforeFontSize = fontElement.style.fontSize;
            let currentFontSize = 1;
            let widthDiff = 0;
            let heightDiff = 0;
            let containerWidth = 0;
            let containerHeight = 0;
            do {
                currentFontSize += oldDiff[oldDiffIndex] / (fontWeight + 1);
                fontElement.style.fontSize = currentFontSize + 'px';
                let containerStyle = window.getComputedStyle(container);
                containerWidth = parseFloat(containerStyle.getPropertyValue("width").replace('px', ''));
                containerHeight = parseFloat(containerStyle.getPropertyValue("height").replace('px', ''));
                widthDiff = containerWidth - fontElement.offsetWidth;
                heightDiff = containerHeight - fontElement.offsetHeight;
                oldDiffIndex = (oldDiffIndex + 1) % numChanged;
                let newDiff = (ignoreWidth ? heightDiff : (ignoreHeight ? widthDiff : Math.min(widthDiff, heightDiff)));
                if (newDiff === oldDiff[(oldDiffIndex + 1) % numChanged]) {
                    break;
                }
                oldDiff[oldDiffIndex] = newDiff;
            } while ((widthDiff > (1 - scale) * containerWidth || ignoreWidth) && (heightDiff > (1 - scale) * containerHeight || ignoreHeight));
            currentFontSize -= margin;
            fontElement.style.fontSize = ((setFontSize) ? currentFontSize + "px" : beforeFontSize);
            if (!hasNoTransitionClass) {
                yield new Promise((r) => {
                    setTimeout(r, 50);
                });
                container.classList.remove("no-transition");
            }
            return currentFontSize;
        });
    }
}
exports.ScaleHelper = ScaleHelper;
//# sourceMappingURL=ScaleHelper.js.map