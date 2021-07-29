import firebase from "firebase";
const storageService = firebase.storage();
const storageRef = storageService.ref();

export default function Upload(imageId, filename, extension) {
  function isValidExtension(extension) {
    switch (extension) {
      case "png":
      case "jpeg":
      case "jpg":
      case "svg":
        return true;
      default:
        return false;
    }
  }
  if (isValidExtension) {
    let metadata = {
      contentType: `image/${extension}`
    };
    let uploadTask = storageRef
      .child(`images/${imageId}`)
      .put(filename, metadata);
  }
}
