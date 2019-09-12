package com.helpers;

import android.content.Context;

import com.datatheorem.android.trustkit.TrustKit;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import okhttp3.OkHttpClient;

public class OkHttpCertificatePin implements OkHttpClientFactory {
    private static final String TAG = "OkHttpCertPin";

    public OkHttpCertificatePin(Context context) {
        TrustKit.initializeWithNetworkSecurityConfiguration(context.getApplicationContext());
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {

        OkHttpClient.Builder client = new OkHttpClient.Builder()
                .cookieJar(new ReactCookieJarContainer())
                .sslSocketFactory(
                        new PepoSSLSocketFactory(),
                        new PepoTrustManager()
                );

        return client.build();
    }
}