package com.helpers;

import android.content.Context;

import com.datatheorem.android.trustkit.TrustKit;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;

public class OkHttpCertificatePin implements OkHttpClientFactory {
    private static String hostname = "stagingpepo.com";
    private static final String TAG = "OkHttpCertPin";

    public OkHttpCertificatePin(Context context) {
        TrustKit.initializeWithNetworkSecurityConfiguration(context.getApplicationContext());
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {

        try {
            hostname = new URL(hostname).getHost();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        OkHttpClient.Builder client = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.MILLISECONDS)
                .readTimeout(30, TimeUnit.MILLISECONDS)
                .writeTimeout(30, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer())
                .sslSocketFactory(TrustKit.getInstance().getSSLSocketFactory(hostname),TrustKit.getInstance().getTrustManager(hostname));

        return client.build();
    }
}
