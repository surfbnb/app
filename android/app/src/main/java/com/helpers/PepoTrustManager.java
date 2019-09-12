package com.helpers;

import com.datatheorem.android.trustkit.TrustKit;

import java.security.cert.CertificateException;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.net.ssl.X509TrustManager;

public class PepoTrustManager implements X509TrustManager {

    private String defaultHostName = "stagingpepo.com";

    public PepoTrustManager() {

    }
    private X509TrustManager getDefaultTrustManager() {
        return TrustKit.getInstance().getTrustManager(defaultHostName);
    }

    private X509TrustManager trustManagerFor(String hostName) {
        return TrustKit.getInstance().getTrustManager(hostName);
    }

    @Override
    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        // TrustKit always throws CertificateException, so, we can use default manager here.
        getDefaultTrustManager().checkClientTrusted(chain, authType);
    }

    @Override
    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        List<String> altNames = getSubjectAltNames(chain[0]);
        if (altNames.isEmpty()) {
            throw new CertificateException("Certificate validation failed. Please ensure Certificate contains hostname.");
        } else {
            trustManagerFor(altNames.get(0)).checkServerTrusted(chain, authType);
        }
    }

    private static List<String> getSubjectAltNames(X509Certificate certificate) {
        List<String> result = new ArrayList<>();
        try {
            Collection<?> subjectAltNames = certificate.getSubjectAlternativeNames();
            if (subjectAltNames == null) {
                return Collections.emptyList();
            }
            for (Object subjectAltName : subjectAltNames) {
                List<?> entry = (List<?>) subjectAltName;
                if (entry == null || entry.size() < 2) {
                    continue;
                }
                Integer altNameType = (Integer) entry.get(0);
                if (altNameType == null) {
                    continue;
                }
                int type = 2;
                if (altNameType == type) {
                    String altName = (String) entry.get(1);
                    if (altName != null) {
                        result.add(altName);
                    }
                }
            }
            return result;
        } catch (CertificateParsingException e) {
            return Collections.emptyList();
        }
    }

    @Override
    public X509Certificate[] getAcceptedIssuers() {
        return new X509Certificate[0];
    }
}