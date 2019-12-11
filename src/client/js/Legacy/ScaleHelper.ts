import {Helper} from "js-helper";

export class ScaleHelper {
    async scaleTo(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animationDelay, addListener) {

        addListener = Helper.nonNull(addListener, true);
        animationDelay = Helper.nonNull(animationDelay, 0);

        let newFontSize = await this._getNewFontSize(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animationDelay === 0);

        if (animationDelay > 0) {
            await new Promise(r => {
                setTimeout(r, animationDelay);
                fontElement.style.fontSize = newFontSize + "px";
            })
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
    }

    async scaleToFull(fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animDelay, addListener) {
        return this.scaleTo(1, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, animDelay, addListener);
    }

    async _getNewFontSize(scale, fontElement, container, ignoreHeight, ignoreWidth, margin, fontWeight, setFontSize) {
        margin = Helper.nonNull(margin, 10);
        ignoreHeight = Helper.nonNull(ignoreHeight, false);
        ignoreWidth = Helper.nonNull(ignoreWidth, false);
        fontWeight = Helper.nonNull(fontWeight, fontElement.innerHTML.length);
        setFontSize = Helper.nonNull(setFontSize, true);

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

            oldDiffIndex = (oldDiffIndex+1)%numChanged;
            let newDiff = (ignoreWidth ? heightDiff : (ignoreHeight ? widthDiff : Math.min(widthDiff, heightDiff)));
            if (newDiff === oldDiff[(oldDiffIndex+1)%numChanged]) {
                break;
            }
            oldDiff[oldDiffIndex] = newDiff;
        } while ((widthDiff > (1 - scale) * containerWidth || ignoreWidth) && (heightDiff > (1 - scale) * containerHeight || ignoreHeight));

        currentFontSize -= margin;
        fontElement.style.fontSize = ((setFontSize) ? currentFontSize + "px" : beforeFontSize);

        if (!hasNoTransitionClass) {
            await new Promise((r) => {
                setTimeout(r, 50);
            });
            container.classList.remove("no-transition");
        }

        return currentFontSize;
    }
}