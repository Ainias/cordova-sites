import {DelegateSite} from "../Context/Delegate/DelegateSite";
import {Helper} from "js-helper";
import {MatomoHelper} from "js-helper/dist/client/MatomoHelper";

export class MatomoDelegateSite extends DelegateSite{

    private static currentUrl: string

    async onStart(pauseArguments): Promise<void> {
        super.onStart(pauseArguments);
        this.update();
    }

    update(){
        if (Helper.isNotNull(MatomoDelegateSite.currentUrl)) {
            MatomoHelper.apiCall('setReferrerUrl', MatomoDelegateSite.currentUrl);
        }
        MatomoDelegateSite.currentUrl = window.location.pathname + window.location.search;
        MatomoHelper.apiCall('setCustomUrl', MatomoDelegateSite.currentUrl);
        // MatomoHelper.apiCall('setDocumentTitle', title);

        // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
        MatomoHelper.apiCall('deleteCustomVariables', 'page');
        MatomoHelper.apiCall('setGenerationTimeMs', 0);
        MatomoHelper.apiCall('trackPageView');

        // make Matomo aware of newly added content
        var content = document.getElementById('site-content');
        MatomoHelper.apiCall('MediaAnalytics::scanForMedia', content);
        MatomoHelper.apiCall('FormAnalytics::scanForForms', content);
        MatomoHelper.apiCall('trackContentImpressionsWithinNode', content);
        MatomoHelper.apiCall('enableLinkTracking');
    }
}
