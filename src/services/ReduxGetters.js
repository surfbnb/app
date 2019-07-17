import deepGet from "lodash/get";
import Store from '../store';
import CurrentUser from "../models/CurrentUser";



class ReduxGetters {

    getHomeFeedUserId( id , state ){
        state =  state || Store.getState() ; 
        return  deepGet( state ,  `home_feed_entities.id_${id}.payload.user_id` ); 
    }

    getHomeFeedVideoId( id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state,  `home_feed_entities.id_${id}.payload.video_id` ) ; 
    }

    getVideoUrl( id  , state ){
        state =  state || Store.getState() ; 
        return deepGet(  state , `video_entities.id_${id}.resolutions.original.url`) || "";
    }

    getUser(id ,  state ){
        state =  state || Store.getState() ; 
        if( CurrentUser.getUserId() == id ){
            return deepGet( state , "current_user"); 
        }
        return deepGet( state , `user_entities.id_${id}`) ;
    }

    getVideoImgUrl(id , state ){
        state =  state || Store.getState() ; 
        let posterImageId = deepGet( state ,  `video_entities.id_${id}.poster_image_id` );
        return deepGet(  state , `image_entities.id_${posterImageId}.resolutions.750w.url`) || "";
    }

    getUserName( id , state ){
        state =  state || Store.getState() ; 
        if( CurrentUser.getUserId() == id ){
            return deepGet( state,  `current_user.user_name` );
        }
        return deepGet( state,  `user_entities.id_${id}.user_name` );
    }

    getName( id , state ){
        state =  state || Store.getState() ; 
        if( CurrentUser.getUserId() == id ){
            return deepGet( state ,  `current_user.name` );
        }
        return deepGet( state,  `user_entities.id_${id}.name` );
    }

    getBio(id , state ){
        state =  state || Store.getState() ; 
        return deepGet(state,  `user_profile_entities.id_${id}.bio.text` );
    }

    getVideoSupporters(id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `video_stat_entities.id_${id}.total_contributed_by` );
    }

    getVideoBt(id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `video_stat_entities.id_${id}.total_amount_raised_in_wei` );
    }

    isVideoSupported(id , state ){
        state =  state || Store.getState() ; 
        return !!deepGet( state ,  `video_contribution_entities.id_${id}` );
    }  
    
    getUserSupporters( id  , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_stat_entities.id_${id}.total_contributed_by` );
    }

    getUsersSupporting( id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_stat_entities.id_${id}.total_contributed_to` );
    }

    getUsersBt(  id , state  ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_stat_entities.id_${id}.total_amount_raised_in_wei` );
    }

    getUserCoverVideoId( id ,  state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_profile_entities.id_${id}.cover_video_id` );
    }

    getUserCoverImageId(id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_profile_entities.id_${id}.cover_image_id` );
    }

    getImage(id  , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `image_entities.id_${id}.resolutions.750w.url` ) || 
         deepGet( state ,  `image_entities.id_${id}.resolutions.original.url` );
    }

    getUserLink(id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `user_profile_entities.id_${id}.link_ids[0]` );
    }

    getLink(id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `link_entities.id_${id}.url` );
    }

    getVideoTimeStamp( id , state ){
        state =  state || Store.getState() ; 
        return deepGet( state ,  `video_entities.id_${id}.uts` );
    }

    getProfileImageId(id , state ){
      state =  state || Store.getState() ;
      if( CurrentUser.getUserId() == id ){
        return deepGet( state ,  `current_user.profile_image_id` );
      }
      return deepGet( state,  `user_entities.id_${id}.profile_image_id` );
    }

}

export default new ReduxGetters();