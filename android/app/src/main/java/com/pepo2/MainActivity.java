package com.pepo2;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.helpers.OkHttpCertificatePin;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Pepo2";
    }

    //THIS is explict addition for RNGestureHandlerEnabledRootView done manually. Should be done and kept
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
     return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        rebuildOkHttp();
    }

    private void rebuildOkHttp() {
        OkHttpClientProvider.setOkHttpClientFactory(new OkHttpCertificatePin(getApplicationContext()));
    }
}