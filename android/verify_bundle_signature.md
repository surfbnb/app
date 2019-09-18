# Verify Bundle Signature

## Retrive Certificate information from KeyStore.
* locate your keystore and run following command.
> Do not forget to chnage the path.
```sh
keytool --list -v -keystore ./PepoV2Production
```
> Here `PepoV2Production` is PepoV2Production KeyStore.

## Retrive Certificate Information from bundle.

* Copy the `app.aab` file to an empty folder.

* Unzip it. 
> If it fails to unzip from Finder, use the `unzip` command from terminal.

* Go to terminal and go inside the folder.

* Run following command to locate `.RSA` file. 
> It is generally located in `META-INF` folder.
```sh
  keytool -printcert -file ./app/META-INF/PEPO2PRO.RSA
```
> Here PEPO2PRO.RSA is the name of `production` certificate file.
> The file name will change as per ennvironment.

