import Store from '../store';
import deepGet from "lodash/get";

class ReduxGetters {

    getHomeFeedUserId( id ){
        return  deepGet( Store.getState() ,  `home_feed_entities.id_${id}.payload.user_id` ); 
    }

    getHomeFeedVideoId( id ){
        return deepGet( Store.getState() ,  `home_feed_entities.id_${id}.payload.video_id` ) ; 
    }

    getVideoUrl( id ){
        return deepGet(  Store.getState() , `video_entities.id_${id}.resolutions.original.url`) || "";
    }

    getUser(id){
        return deepGet(  Store.getState() , `user_entities.id_${id}`) ;
    }

    getVideoImgUrl(id){
        let posterImageId = deepGet( Store.getState() ,  `video_entities.id_${id}.poster_image_id` );
        return deepGet(  Store.getState() , `image_entities.id_${posterImageId}.resolutions.750w.url`) || "";
    }

    getUserName( id ){
        return deepGet( Store.getState() ,  `user_entities.id_${id}.username` );
    }

    getName( id ){
        return deepGet( Store.getState() ,  `user_entities.id_${id}.name` );
    }

    getBio(id){
        return deepGet( Store.getState() ,  `user_profile_entities.id_${id}.bio.text` );
    }

    getVideoSupporters(id){
        return deepGet( Store.getState() ,  `video_stat_entities.id_${id}.total_contributed_by` );
    }

    getVideoBt(id){
        return deepGet( Store.getState() ,  `video_stat_entities.id_${id}.total_amount_raised_in_wei` );
    }

}

export default new ReduxGetters();