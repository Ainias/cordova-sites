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
exports.MasterSite = void 0;
const AbstractSite_1 = require("../AbstractSite");
const Helper_1 = require("../../Legacy/Helper");
class MasterSite extends AbstractSite_1.AbstractSite {
    constructor(siteManager, view) {
        super(siteManager, view);
        this._delegates = [];
    }
    addDelegate(delegateSite) {
        this._delegates.push(delegateSite);
    }
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onConstruct.call(this, constructParameters);
            yield Helper_1.Helper.asyncForEach(this._delegates, (delegate) => __awaiter(this, void 0, void 0, function* () {
                yield delegate.onConstruct(constructParameters);
            }));
            return res;
        });
    }
    onStart(pauseArguments) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onStart.call(this, pauseArguments);
            yield Helper_1.Helper.asyncForEach(this._delegates, (delegate) => __awaiter(this, void 0, void 0, function* () {
                yield delegate.onStart(pauseArguments);
            }));
        });
    }
    onBackPressed() {
        super.onBackPressed();
        this._delegates.forEach(delegate => {
            delegate.onBackPressed();
        });
    }
    onMenuPressed() {
        super.onMenuPressed();
        this._delegates.forEach(delegate => {
            delegate.onMenuPressed();
        });
    }
    onSearchPressed() {
        super.onSearchPressed();
        this._delegates.forEach(delegate => {
            delegate.onSearchPressed();
        });
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            yield Helper_1.Helper.asyncForEach(this._delegates, (delegate) => __awaiter(this, void 0, void 0, function* () {
                yield delegate.onViewLoaded();
            }));
            return res;
        });
    }
    onPause() {
        const _super = Object.create(null, {
            onPause: { get: () => super.onPause }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onPause.call(this);
            yield Helper_1.Helper.asyncForEach(this._delegates, (delegate) => __awaiter(this, void 0, void 0, function* () {
                yield delegate.onPause();
            }));
        });
    }
    onDestroy() {
        const _super = Object.create(null, {
            onDestroy: { get: () => super.onDestroy }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onDestroy.call(this);
            yield Helper_1.Helper.asyncForEach(this._delegates, (delegate) => __awaiter(this, void 0, void 0, function* () {
                yield delegate.onDestroy();
            }));
        });
    }
}
exports.MasterSite = MasterSite;
//# sourceMappingURL=MasterSite.js.map