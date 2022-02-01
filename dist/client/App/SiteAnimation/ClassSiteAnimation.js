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
exports.ClassSiteAnimation = void 0;
const js_helper_1 = require("js-helper");
class ClassSiteAnimation {
    constructor(siteStartClass, siteEndClass, duration, removeClasses = true) {
        this.siteStartClass = siteStartClass;
        this.siteEndClass = siteEndClass;
        this.duration = duration;
        this.removeClasses = removeClasses;
    }
    animateSiteEnd(fromSite) {
        return __awaiter(this, void 0, void 0, function* () {
            fromSite.classList.add(this.siteEndClass);
            yield js_helper_1.Helper.delay(this.duration);
            if (this.removeClasses) {
                fromSite.classList.remove(this.siteEndClass);
            }
        });
    }
    animateSitePopToFront(fromSite, toSite) {
        return this.animateSiteStart(fromSite, toSite);
    }
    animateSiteStart(_fromSite, toSite) {
        return __awaiter(this, void 0, void 0, function* () {
            toSite.classList.add(this.siteStartClass);
            yield js_helper_1.Helper.delay(this.duration);
            if (this.removeClasses) {
                toSite.classList.remove(this.siteStartClass);
            }
        });
    }
}
exports.ClassSiteAnimation = ClassSiteAnimation;
//# sourceMappingURL=ClassSiteAnimation.js.map