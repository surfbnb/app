import DeviceInfo from 'react-native-device-info';

class DeviceInfoCache {

    constructor(){
        this.deviceName = "";
        this.userAgent = null;
    }

    perform (){
       return Promise.all([this.setDeviceName() , this.setUserAgent() ]);
    }

    setDeviceName = async() => {
        try{
            this.deviceName = await DeviceInfo.getDeviceName();
            return this.deviceName;
        }catch(error){
            console.warn("Failed to get deviceName",  error);
        }
    }

    setUserAgent = async() => {
        try {
            this.userAgent = await DeviceInfo.getUserAgent();
            return this.userAgent;
        }catch(error){
            console.warn("Failed to get userAgent",  error);
        }
    }

    getDeviceName(){
        return this.deviceName;
    }

    getUserAgent(){
        return this.userAgent;
    }

}


export default new DeviceInfoCache();
