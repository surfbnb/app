package com.pepo2;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.helpers.OkHttpCertificatePin;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Pepo2";
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
