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
exports.MatomoDelegateSite = void 0;
const DelegateSite_1 = require("../Context/Delegate/DelegateSite");
const js_helper_1 = require("js-helper");
const MatomoHelper_1 = require("js-helper/dist/client/MatomoHelper");
class MatomoDelegateSite extends DelegateSite_1.DelegateSite {
    onStart(pauseArguments) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onStart.call(this, pauseArguments);
            this.update();
        });
    }
    update() {
        if (js_helper_1.Helper.isNotNull(MatomoDelegateSite.currentUrl)) {
            MatomoHelper_1.MatomoHelper.apiCall('setReferrerUrl', MatomoDelegateSite.currentUrl);
        }
        MatomoDelegateSite.currentUrl = window.location.pathname + window.location.search;
        MatomoHelper_1.MatomoHelper.apiCall('setCustomUrl', MatomoDelegateSite.currentUrl);
        // MatomoHelper.apiCall('setDocumentTitle', title);
        // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
        MatomoHelper_1.MatomoHelper.apiCall('deleteCustomVariables', 'page');
        MatomoHelper_1.MatomoHelper.apiCall('setGenerationTimeMs', 0);
        MatomoHelper_1.MatomoHelper.apiCall('trackPageView');
        // make Matomo aware of newly added content
        var content = document.getElementById('site-content');
        MatomoHelper_1.MatomoHelper.apiCall('MediaAnalytics::scanForMedia', content);
        MatomoHelper_1.MatomoHelper.apiCall('FormAnalytics::scanForForms', content);
        MatomoHelper_1.MatomoHelper.apiCall('trackContentImpressionsWithinNode', content);
        MatomoHelper_1.MatomoHelper.apiCall('enableLinkTracking');
    }
}
exports.MatomoDelegateSite = MatomoDelegateSite;
//# sourceMappingURL=MatomoDelegateSite.js.map