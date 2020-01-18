import merge from "lodash/merge";
import deepGet from "lodash/get";
import ReduxGetters from '../services/ReduxGetters';
import AppConfig from "../constants/AppConfig";

let Utilities;
import('../services/Utilities').then((imports) => {
  Utilities = imports.default;
});

const ServiceTypes =AppConfig.authServiceTypes;

class LastLoginedUser {

    constructor(){
        this.lastLoginUser = {};
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
        const userDetails = deepGet( data , `users.${user['user_id']}`);
        if(!userDetails) return;
        const service = deepGet(data,  "meta.service_type");
        const profileImageId = userDetails["profile_image_id"] ;
        const image = this._getProfileImage(profileImageId, data);

        const userObj = this._getUserObj( userDetails );
        if(userObj && service){
            userObj['service'] = service;
        }

        if(userObj && image){
          userObj['profileImage'] = image;
        }

        return userObj;
    }

      _getProfileImage(id , data){
        return deepGet(data, `images.${id}.resolutions.${AppConfig.profileImageConstants.imageWidth}.url`) ||
          deepGet(data, `images.${id}.resolutions.original.url`)
      }

    updateASUserOnLogout(currentId){
        const user = this.getUserDataFromRedux( currentId );
        this._saveCurrentUser(user , this.lastLoginUser.userId);
    }

    getUserDataFromRedux(userId){
        const userDetails = ReduxGetters.getUser(userId);
        if(!userDetails) return;
        const profileImage = ReduxGetters.getProfileImage(ReduxGetters.getProfileImageId(userId));
        const userObj = this._getUserObj(userDetails);
        if(userObj && profileImage ){
            userObj['profileImage'] = profileImage;
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