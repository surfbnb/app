package com.helpers;

import com.datatheorem.android.trustkit.TrustKit;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.net.ssl.SSLSocketFactory;

public class PepoSSLSocketFactory extends SSLSocketFactory {
    private String defaultHostName = "stagingpepo.com";
    private static SSLSocketFactory defaultTrustKitSslSocketFactory = null;
    private SSLSocketFactory defaultFactory() {
        if (null == defaultTrustKitSslSocketFactory) {
            defaultTrustKitSslSocketFactory = factoryFor(defaultHostName);
        }
        return defaultTrustKitSslSocketFactory;
    }

    private SSLSocketFactory factoryFor(String host) {
        return TrustKit.getInstance().getSSLSocketFactory(host);
    }

    @Override
    public String[] getDefaultCipherSuites() {
        return defaultFactory().getDefaultCipherSuites();
    }

    @Override
    public String[] getSupportedCipherSuites() {
        return defaultFactory().getSupportedCipherSuites();
    }

    @Override
    public Socket createSocket(Socket s, String host, int port, boolean autoClose) throws IOException {
        return factoryFor(host).createSocket(s, host, port, autoClose);
    }

    @Override
    public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
        return factoryFor(host).createSocket(host, port);
    }

    @Override
    public Socket createSocket(String host, int port, InetAddress localHost, int localPort) throws IOException, UnknownHostException {
        return factoryFor(host).createSocket(host, port, localHost, localPort);
    }

    @Override
    public Socket createSocket(InetAddress host, int port) throws IOException {
        return factoryFor(host.getHostName()).createSocket(host, port);
    }

    @Override
    public Socket createSocket(InetAddress address, int port, InetAddress localAddress, int localPort) throws IOException {
        return factoryFor(address.getHostName()).createSocket(address, port, localAddress, localPort);
    }
}