import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import firestore from "./firestore";
import db from "./firebase";
import { useHistory } from "react-router-dom";

export default function Post() {
  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 450,
      height: "auto"
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    grow: {
      flexGrow: 1
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    }
  }));
  const [postContent, setPostContent] = React.useState({ content: "" });
  const [image, setImage] = React.useState({ preview: "", raw: "" });
  const userId = localStorage.getItem("googleId");
  const [validExtension, setValidExtenstion] = React.useState(1);
  const history = useHistory();

  function handleChange(e) {
    const { name, value } = e.target;
    setPostContent((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function getTime() {
    return new Date().getTime().toString();
  }
  function handlePostClick() {
    if (postContent.content && image.raw) {
      const fName = localStorage.getItem("userFName");
      const sName = localStorage.getItem("userSName");
      const postId = userId + getTime();
      const postIdRef = db.collection("post").doc(postId);
      let arr = null;
      const brr = [".png", ".jpg"];
      if (image.preview) arr = image.raw.name.split(".");
      else arr = brr;
      firestore(postId, image.raw, arr[1]);
      db.runTransaction(function (transaction) {
        return transaction.get(postIdRef).then(function (post) {
          if (!post.exists) {
            db.collection("post")
              .doc(postId)
              .set({
                post_description: postContent.content,
                user_id: userId,
                date: getTime(),
                author: fName + " " + sName,
                postImage: `https://firebasestorage.googleapis.com/v0/b/liny-de878.appspot.com/o/images%2F${postId}?alt=media&token=50664360-a6fe-4eac-86d4-ea277156d3a1`,
                like: []
              });
          }
        });
      });
      setPostContent({ content: "" });
      setImage({ preview: "", raw: "" });
      history.push("/");
    }
  }
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
  const classes = useStyles();

  const renderMobileMenu = (
    <div
      className={classes.sectionMobile}
      style={{ marginLeft: "2%", marginTop: "5%" }}
    >
      {!!validExtension ? (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handlePostClick}
          style={{ borderRadius: "20px" }}
        >
          Post This
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ borderRadius: "20px" }}
          disabled
        >
          Post This
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Card className={classes.root}>
        <CardContent>
          {image.raw && (
            <CardMedia
              className={classes.media}
              image={image.preview}
              title="Paella dish"
            />
          )}

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
        </CardContent>
        <form
          noValidate
          autoComplete="off"
          style={{
            width: "100%",
            height: "auto"
          }}
        >
          <TextField
            onChange={handleChange}
            id="outlined-multiline-static"
            style={{ width: "100%", height: "auto" }}
            multiline
            rows={5}
            name="content"
            value={postContent.content}
            placeholder="Write Something..."
          />
        </form>
      </Card>
      <div className={classes.grow}>
        <div className={classes.grow} />
        {/* larger screen */}
        <div
          className={classes.sectionDesktop}
          style={{ marginLeft: "1%", marginTop: "2%" }}
        >
          {!!validExtension ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handlePostClick}
              style={{ borderRadius: "20px" }}
            >
              Post This
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ borderRadius: "20px" }}
              disabled
            >
              Post This
            </Button>
          )}
        </div>
        {renderMobileMenu}
      </div>
    </div>
  );
}
