import React, { useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import firestore from "./firestore";
import Loading from "./Loading";
import db from "./firebase";
import { useHistory } from "react-router-dom";

export default function Modal(props) {
  const [validExtension, setValidExtenstion] = React.useState(1);
  const [image, setImage] = React.useState({ preview: "", raw: "" });
  const [postContent, setPostContent] = React.useState({ content: "" });
  const userId = localStorage.getItem("googleId");
  const postRef = useRef();

  function isValidExtension(extension) {
    switch (extension) {
      case "png":
      case "jpeg":
      case "jpg":
      case "svg":
        setValidExtenstion(1);
        return true;
      default:
        setValidExtenstion(0);
        return false;
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPostContent((prev) => {
      return { ...prev, [name]: value };
    });
  }
  const clickOutside = (e) => {
    if (!postRef.current.contains(e.target)) {
      props.close();
    }
  };

  function handlePostClick() {
    if (postContent.content && image.raw) {
      props.close();
      alert("Refresh to see the new post!");
      const fName = localStorage.getItem("userFName");
      const sName = localStorage.getItem("userSName");
      const time = Date.now().toString();
      const postId = userId + time;
      const postIdRef = db.collection("post").doc(postId);
      let arr = null;
      const brr = [".png", ".jpg"];
      if (image.preview) arr = image.raw.name.split(".");
      else arr = brr;
      firestore(postId, image.raw, arr[1]).then((url) => {
        db.runTransaction(function (transaction) {
          return transaction.get(postIdRef).then(function (post) {
            if (!post.exists) {
              db.collection("post")
                .doc(postId)
                .set({
                  post_description: postContent.content,
                  user_id: userId,
                  date: time,
                  author: fName + " " + sName,
                  postImage: url,
                  like: []
                })
                .then(() => {});
            }
          });
        });
        setPostContent({ content: "" });
        setImage({ preview: "", raw: "" });
      });
    }
  }

  function handleImage(e) {
    if (e.target.files.length) {
      const arr = e.target.files[0].name.split(".");
      isValidExtension(arr[1]) &&
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
    }
  }
  React.useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  });

  return (
    <div className="modal-container" id="modal">
      <div className="modal-content" ref={postRef}>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.close();
          }}
        />
        <p style={{ width: "100%" }}>
          {
            image.raw && <img src={image.preview} alt="preview" />
            /*need to be corrected */
          }

          {!!validExtension ? (
            <div>
              <div className="file-input">
                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                ></input>
                <span className="button">Choose</span>
                <span class="label" data-js-label>
                  {image.raw ? "1 File selected " : "No file selected"}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="file-input">
                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                ></input>
                <span className="button-1">Choose</span>
                <span class="label" data-js-label style={{ color: "#f50057" }}>
                  Invalid File
                </span>
              </div>
            </div>
          )}
          <TextField
            style={{
              width: "100%",
              height: "auto"
            }}
            multiline
            rows={5}
            variant="outlined"
            name="content"
            placeholder="Write Something..."
            onChange={handleChange}
            value={postContent.content}
          />
          {!validExtension && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled
              style={{ marginTop: "20px" }}
            >
              Post This
            </Button>
          )}

          {!!validExtension && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginTop: "20px" }}
              onClick={handlePostClick}
            >
              Post This
            </Button>
          )}
        </p>
      </div>
    </div>
  );
}
