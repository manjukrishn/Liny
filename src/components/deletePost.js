import firebase from "firebase";
const storageService = firebase.storage();
const storageRef = storageService.ref();

export default function Delete(postId) {
  let desertRef = storageRef.child(`images/${postId}`);
  return desertRef.delete();
}
