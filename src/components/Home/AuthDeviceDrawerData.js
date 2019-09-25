export default {
  "CREATED" : {
    "icon": "info",
    "header": "Creating wallet",
    "desc": "You need to restart the app in order to perform this action",
    "cta": null
  },
  "REGISTERED": {
    "icon": "fingerprint",
    "header": "Authorize your device",
    "desc": "This device needs to be authorized in order to perform this action",
    "cta": {
      "ctaText": "Authorize Device",
      "ctaAction": "GO_TO_WALLET_SETTINGS"
    }
  },
  "AUTHORIZING": {
    "icon": "info",
    "header": "Authorizing device",
    "desc": "Your device is being authorized, please try again in a few moments",
    "cta": null
  },
  "REVOKING": {
    "icon": "fingerprint",
    "header": "Device revocation",
    "desc": "The recovery of your wallet has been initiated on another device",
    "cta": {
      "ctaText": "Abort Recovery",
      "ctaAction": "GO_TO_WALLET_SETTINGS"
    }
  },
  "RECOVERING": {
    "icon": "info",
    "header": "Recovering device",
    "desc": "This device is currently recovering. You will be notified as the recovery is completed.",
    "cta": null
  },
  "REVOKED": {
    "icon": "info",
    "header": "Device revoked",
    "desc": "This device has been revoked. Please restart the app to authorize again this device.",
    "cta": null
  }
}