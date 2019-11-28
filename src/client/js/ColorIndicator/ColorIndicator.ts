import {Singleton} from "../Singleton";
import {Helper} from "../Legacy/Helper";

export class ColorIndicator extends Singleton {
    getAverageImgColor(imgEl, areaWidth, areaHeight) {
        //https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
        let blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r: 255, g: 255, b: 255}, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4*blockSize, //start with first pixel
            length,
            rgb = {r: 0, g: 0, b: 0},
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        areaWidth = Helper.nonNull(areaWidth, width);
        areaHeight = Helper.nonNull(areaWidth, height);

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, Math.min(width, areaWidth), Math.min(height, areaHeight));
        } catch (e) {
            /* security error, img on diff domain */
            console.error(e);
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;
    }

    invertColorBW(r, g, b) {
        return this.invertColor(r, g, b, true);
    }

    invertColor(r, g, b, bw) {
        if (typeof r === "object"){
            bw = g || bw;
            g = r.g;
            b = r.b;
            r = r.r;
        }

        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? {r:0,g:0,b:0}
                : {r:255,g:255,b:255};
        }
        // invert color components
        r = (255 - r);
        g = (255 - g);
        b = (255 - b);
        // pad each with zeros and return
        return {
            r: r,
            g: g,
            b: b,
        }
    }

    toHEX(r,g,b){
        if (typeof r === "object"){
            g = r.g;
            b = r.b;
            r = r.r;
        }

        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        return "#" + Helper.padZero(r) + Helper.padZero(g) + Helper.padZero(b);
    }
}