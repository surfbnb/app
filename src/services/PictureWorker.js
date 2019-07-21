import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import Store from '../store';
import { upsertProfilePicture, clearProfilePicture, updateCurrentUser, upsertImageEntities } from '../actions';
import appConfig from '../constants/AppConfig';
import UploadToS3 from './UploadToS3';
import ReduxGetters from './ReduxGetters';
import PepoApi from './PepoApi';
import ImageResizer from 'react-native-image-resizer';
import createObjectForRedux from '../helpers/createObjectForRedux';

const capturedPictureStates = ['cropped_image', 'cleaned_cropped_image', 's3_cropped_image'];

class PictureWorker extends PureComponent {
  constructor() {
    super();
  }

  getCleanCroppedImage = () => {
    console.log('getCleanCroppedImage:');
    if (!this.props.profile_picture.cropped_image) return;

    if (Platform.OS === 'ios') {
      const outputPath = `${RNFS.CachesDirectoryPath}/Pepo/${new Date().getTime()}.jpg`;
      // The imageStore path here is "rct-image-store://0"
      ImageResizer.createResizedImage(
        this.props.profile_picture.cropped_image,
        appConfig.cameraCropConstants.WIDTH,
        appConfig.cameraCropConstants.HEIGHT,
        'JPEG',
        25,
        0,
        outputPath
      )
        .then(async (success) => {
          Store.dispatch(
            upsertProfilePicture({
              cleaned_cropped_image: success.path
            })
          );
        })
        .catch((err) => {
          console.log('Could not get resized image', err);
        });
    } else {
      Store.dispatch(
        upsertProfilePicture({
          cleaned_cropped_image: this.props.profile_picture.cropped_image
        })
      );
    }
  };

  processImage() {
    if (Object.keys(this.props.current_user).length === 0 || Object.keys(this.props.profile_picture).length === 0) {
      console.log('processVideo :: Nothing to process');
      return;
    }

    if (this.props.profile_picture.cropped_image && !this.props.profile_picture.cleaned_cropped_image) {
      this.getCleanCroppedImage();
    }
    if (
      this.props.profile_picture.cleaned_cropped_image &&
      !this.props.profile_picture.s3_cropped_image &&
      !this.props.profile_picture.s3_cropped_image_uploading &&
      !this.props.profile_picture.s3_upload_processing
    ) {
      Store.dispatch(
        upsertProfilePicture({
          s3_upload_processing: true
        })
      );
      this.updateProfilePicture(this.props.profile_picture.cleaned_cropped_image);
      this.uploadToS3();
    }
    if (this.props.profile_picture.s3_cropped_image && !this.props.profile_picture.saved_to_server) {
      this.saveToServer();
    }
  }
  updateProfilePicture(profileImage) {
    let imageObject = createObjectForRedux.createImageObject({
      url: profileImage,
      height: appConfig.cameraConstants.VIDEO_HEIGHT,
      width: appConfig.cameraConstants.VIDEO_WIDTH,
      size: '1'
    });

    Store.dispatch(upsertImageEntities(imageObject.value));
    Store.dispatch(
      updateCurrentUser({
        ...ReduxGetters.getUser(this.props.current_user.id),
        ...{ profile_image_id: imageObject.key }
      })
    );
  }

  saveToServer = () => {
    console.log(this.props.profile_picture.s3_cropped_image, 'this.props.profile_picture.s3_cropped_image');
    let oThis = this;
    new PepoApi(`/users/${this.props.current_user.id}/profile-image`)
      .post({
        image_url: this.props.profile_picture.s3_cropped_image
      })
      .catch((error) => {
        console.log('Profile image could not be saved to server', error);
      })
      .then((res) => {
        console.log(this.props.profile_picture.s3_cropped_image, 'this.props.profile_picture.s3_cropped_image in then');
        Store.dispatch(clearProfilePicture());

        console.log('Profile image saved to server', res);
        // this.closeCropper();
      });
  };

  async cleanUp() {
    Store.dispatch(clearProfilePicture());
  }

  async removeFile(file) {
    if (!file) {
      return;
    }
    let isFileExists = await RNFS.exists(file);
    if (isFileExists) {
      await RNFS.unlink(file);
      return true;
    }
    return false;
  }

  async uploadToS3() {
    console.log('uploadToS3:');
    Store.dispatch(
      upsertProfilePicture({
        s3_cropped_image_uploading: true
      })
    );

    let uploadToS3 = new UploadToS3(this.props.profile_picture.cleaned_cropped_image, 'image');
    uploadToS3
      .perform()
      .then((s3ProfileImage) => {
        Store.dispatch(
          upsertProfilePicture({
            s3_cropped_image: s3ProfileImage
          })
        );
      })
      .catch(() => {
        Store.dispatch(
          upsertProfilePicture({
            s3_cropped_image_uploading: false
          })
        );
      });
  }

  render() {
    this.processImage();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ profile_picture, current_user }) => ({ profile_picture, current_user });

export default connect(mapStateToProps)(PictureWorker);
