import moment from 'moment';

import Config from 'config';

export default class AppService {

    static registerApp() {
        let appData = localStorage.getItem(Config.APP_NAME);

        if (appData === null) {
            localStorage.setItem(Config.APP_NAME, JSON.stringify({
                appCount: 1,
                sessionStart: moment()
            }));
        }
        else {
            let data = JSON.parse(appData);
            data.appCount = data.appCount + 1;
            localStorage.setItem(Config.APP_NAME, JSON.stringify(data));
        }
    }

    static isAppCountExceeded() {
        let appData = localStorage.getItem(Config.APP_NAME);

        if (appData !== null) {
            let data = JSON.parse(appData);
            let sessionLifetime = moment().valueOf() - moment(data.sessionStart).valueOf();
            
            if (data.appCount >= Config.MAX_APP_INSTANCES && sessionLifetime < Config.APP_SESSION_LIFETIME) {
                this.clearAppCount();
                return true;
            }
        }
        
        return false;
    }

    static clearAppCount() {
        let appData = localStorage.getItem(Config.APP_NAME);

        if (appData !== null) {
            localStorage.removeItem(Config.APP_NAME);
        }
    }
}
