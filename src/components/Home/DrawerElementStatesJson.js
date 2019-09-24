
export default DrawerElementStates=  {
  "CREATED" : {
    "icon": "info",
    "header": "Please restart the App.",
    "desc": "",
    "cta": null
  },
  "REGISTERED": {
    "icon": "pepo",
    "header": "Please restart the App",
    "desc": "",
    "cta": {
      "ctaText": "Recover Device",
      "ctaAction": "GO_TO_WALLET_SETTINGS"
    }
  },
  "AUTHORIZING": {
    "icon": "info",
    "header": "Please try after sometime.",
    "desc": "",
    "cta": null
  },
  "REVOKING": {
    "icon": "info",
    "header": "Your device is being revoked",
    "desc": "You can abort the recovery.",
    "cta": {
      "ctaText": "Abort Recovery",
      "ctaAction": "GO_TO_WALLET_SETTINGS"
    }
  },
  "RECOVERING": {
    "icon": "info",
    "header": "This device is recovering.",
    "desc": "Please try after your recovery is completed.",
    "cta": null
  },
  "REVOKED": {
    "icon": "info",
    "header": "This device has been revoked.",
    "desc": "Please restart the app and authorize the device.",
    "cta": null
  }
}



