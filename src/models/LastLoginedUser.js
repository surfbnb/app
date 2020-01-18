import merge from "lodash/merge";
import deepGet from "lodash/get";
import Utilities from '../services/Utilities';
import ReduxGetters from '../services/ReduxGetters';
import AppConfig from "../constants/AppConfig";

const ServiceTypes =AppConfig.authServiceTypes;

class LastLoginedUser {

    constructor(){
        this.lastLoginUser = {};
        this.initialize();
    }

    /**
     * Update local user from AS
     */
    initialize( ) {
        /**
         * Get current login user from AS 
         */
        this.getUserAS().then((user={})=> {
             /**
             * Cache loacally.
             */
            if(typeof user == "string"){
                user = JSON.parse(user); 
            }
            this.lastLoginUser = user || {} ;
        }).catch((error)=> {
            console.log("Cant fetch last login user");
        })   
    }

    clearLastLoginUser() {
        this.lastLoginUser = {};
        return Utilities.saveItem(this._getASKey(),  {});
    }

    getUserAS() {
        return Utilities.getItem(this._getASKey());
    }

    getUser(){
        return this.lastLoginUser ;
    }

    updateASUserOnLogin( res ){
        if(!res) return;
        const user = this.getUserFromRes(res);
        this._saveCurrentUser(user);
    }

    getUserFromRes(apiResponse) {
        const resultType = deepGet(apiResponse, 'data.result_type');
        const data = deepGet(apiResponse, 'data', {});
        const user = deepGet(apiResponse, `data.${resultType}`, {}); 
        const userDetails = deepGet( data , `users.${user['user_id']}`  );
        const service = deepGet(data,  "meta.service_type");

        const userObj = this._getUserObj( userDetails );
        if(userObj && service){
            userObj['service'] = service;
        }

        return userObj;
    }

    updateASUserOnLogout(currentId){
        const user = this.getUserDataFromRedux( currentId );
        this._saveCurrentUser(user , this.lastLoginUser.userId);
    }

    getUserDataFromRedux(userId){
        const userDetails = ReduxGetters.getUser(userId);
        const profileImage = ReduxGetters.getProfileImage(ReduxGetters.getProfileImageId(userId));
        const userObj = this._getUserObj(userDetails);
        if(userObj && profileImage ){
            userObj[profileImage] = profileImage;
        }
        return userObj;
    }

    _getUserObj(userDetails){
        if(!userDetails) return null;
        const user = {
            userId : userDetails["id"],
            name: userDetails['name'],
            userName: userDetails['user_name'] 
        }
        return user;
    }

    _saveCurrentUser(user , expectedUserId ) {
        if(!user) return;
        let userId = user["userId"];
        if (expectedUserId == userId) {
            user = merge({} , this.lastLoginUser,  user);
        }
        this.lastLoginUser = user ;
        Utilities
          .saveItem(this._getASKey(userId), user)
          .then(() => {})
          .catch(()=> {
              console.log("Unable to save lastlogin user");
          })
      }

    _getASKey() {
        return "lastLoginUser";
    }

    getServices() {
        return ServiceTypes ;
    }

    getLastLoginServiceType() {
        return this.lastLoginUser["service"];
    }
    
    getUserName(){
        return this.lastLoginUser["userName"];
    }

    getProfileImage(){
        return this.lastLoginUser["profileImage"];
    }

    getName(){
        return this.lastLoginUser["name"];
    }

    getUserId(){
        return this.lastLoginUser["userId"];
    }

    isTwitterLoggedIn(){
        return ServiceTypes["twitter"] == this.getLastLoginServiceType();
    }

    isGamilLoggedIn(){
        return ServiceTypes["google"] == this.getLastLoginServiceType();
    }

    isAppleLoggedIn(){
        return ServiceTypes["apple"] == this.getLastLoginServiceType();
    }

    isGitHubLoggedIn(){
        return ServiceTypes["github"] == this.getLastLoginServiceType();
    }
}


export default new LastLoginedUser();