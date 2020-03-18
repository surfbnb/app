package com.pepo2.zoom;

import android.content.Context;
import android.text.TextUtils;
import android.widget.Toast;

import us.zoom.sdk.JoinMeetingOptions;
import us.zoom.sdk.JoinMeetingParams;
import us.zoom.sdk.MeetingService;
import us.zoom.sdk.ZoomSDK;

public class JoinMeeting {

    public void perform(Context context, String meetingId, String userName) {

        // Step 1: Get meeting number from input field.
        String meetingNo = meetingId;
        // Check if the meeting number is empty.
        if(meetingNo.length() == 0) {
            Toast.makeText(context, "You need to enter a meeting number/ vanity id which you want to join.", Toast.LENGTH_LONG).show();
            return;
        }

        // Step 2: Get Zoom SDK instance.
        ZoomSDK zoomSDK = ZoomSDK.getInstance();
        // Check if the zoom SDK is initialized
        if(!zoomSDK.isInitialized()) {
            Toast.makeText(context, "ZoomSDK has not been initialized successfully", Toast.LENGTH_LONG).show();
            return;
        }

        // Step 3: Get meeting service from zoom SDK instance.
        MeetingService meetingService = zoomSDK.getMeetingService();

        // Step 4: Configure meeting options.
        JoinMeetingOptions opts = new JoinMeetingOptions();

        // Some available options
        //		opts.no_driving_mode = true;
        //		opts.no_invite = true;
        //		opts.no_meeting_end_message = true;
        //		opts.no_titlebar = true;
        //		opts.no_bottom_toolbar = true;
        //		opts.no_dial_in_via_phone = true;
        //		opts.no_dial_out_to_phone = true;
        //		opts.no_disconnect_audio = true;
        //		opts.no_share = true;
        //		opts.invite_options = InviteOptions.INVITE_VIA_EMAIL + InviteOptions.INVITE_VIA_SMS;
        //		opts.no_audio = true;
        //		opts.no_video = true;
        //		opts.meeting_views_options = MeetingViewsOptions.NO_BUTTON_SHARE;
        //		opts.no_meeting_error_message = true;
        //		opts.participant_id = "participant id";

        // Step 5: Setup join meeting parameters
        JoinMeetingParams params = new JoinMeetingParams();

        String displayName = "TestUser";
        if (TextUtils.isEmpty(userName)) {
            displayName = userName;
        }

        params.displayName = displayName;
        params.meetingNo = meetingNo;

        // Step 6: Call meeting service to join meeting
        meetingService.joinMeetingWithParams(context, params, opts);
    }
}
