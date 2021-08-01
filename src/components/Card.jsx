import React from "react";
import Button from "@material-ui/core/Button";
import Comment from "./CommentModal";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIconFilled from "@material-ui/icons/Favorite";
import TextField from "@material-ui/core/TextField";
import DeletePost from "./DeletePost";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/AccountCircleRounded";
import { useHistory } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import firestore from "./firestore";
import db from "./firebase";
import Loading from "./Loading";
import SharePostAvail from "./ShareLinkAvailable";
import SharePostNotAvail from "./ShareLinkNotAvailable";

export default function Card(props) {
  const [num, setNum] = React.useState(70);
  const [hidden, setHidden] = React.useState(false);
  const [txtvalue, setValue] = React.useState();
  const [open, setOpen] = React.useState(false);
  const text = props.desc;
  const onClose = () => {
    setOpen(false);
  };
  const clss = "updatePost" + props.postId;
  const [validExtension, setValidExtenstion] = React.useState(1);
  const [edit, setEditable] = React.useState(false);
  const [clickedTwice, setClickedTwice] = React.useState(0);
  const userId = localStorage.getItem("googleId");
  const [isAvailable, setAvailable] = React.useState(false);
  const [image, setImage] = React.useState({ preview: props.img, raw: "" });
  const [liked, setLiked] = React.useState(false);
  const history = useHistory();
  const [openD, setOpenD] = React.useState(false);
  React.useEffect(() => {
    navigator.share && setAvailable(true);
    if (props.like) {
      let found = props.like.some((item, index) => {
        return item === userId;
      });
      found && setLiked(true);
    }
  }, []);

  const ID = localStorage.getItem("googleId");
  const [value, loading, error] = useCollection(
    db.collection("comment").where("postId", "==", props.postId),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  const getDate = () => {
    let date = new Date(Number(props.date));
    return moment(date).fromNow();
  };
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
  function handleUpdateClick(e) {
    console.log(e.target.innerText);
    let arr = null;
    const brr = [".png", ".jpg"];
    if (image.raw) arr = image.raw.name.split(".");
    else arr = brr;
    if (image.raw) {
      firestore(props.postId, image.raw, arr[1]);
    }
    let toBeUpdated = db.collection("post").doc(props.postId);
    let postUpdateDiv = document.getElementsByClassName(clss);
    let content = null;
    setEditable(false);
    for (let i = 0; i < postUpdateDiv.length; i++)
      content = postUpdateDiv[i].innerText;
    return toBeUpdated
      .update({
        post_description: content
      })
      .then(function () {
        console.log("Document Post successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
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
  const removeLike = (array) => {
    let index = array.indexOf(userId);
    if (index > -1) {
      array.splice(index, 1);
    }
    setLiked(false);
    return array;
  };
  const addLike = (array) => {
    array.push(userId);
    setLiked(true);
    return array;
  };
  const handleLike = () => {
    let toBeLiked = db.collection("post").doc(props.postId);
    let likes = props.like;
    if (!likes) likes = [];
    likes = clickedTwice ? removeLike(likes) : addLike(likes);
    setClickedTwice(!clickedTwice);
    return toBeLiked
      .update({
        like: likes
      })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  };
  if (loading) return <Loading />;
  return (
    <div style={{ marginBottom: "50px" }}>
      <div id="card">
        <div className="card-header">
          <PersonIcon
            style={{ fontSize: "50px" }}
            onClick={() => {
              history.push(`/profile/${props.userId}`);
            }}
          />
          <p
            onClick={() => {
              history.push(`/profile/${props.userId}`);
            }}
            style={{ marginLeft: "15px", marginTop: "5px" }}
          >
            {props.author}
            <p style={{ fontSize: "14px", color: "grey" }}>{getDate()}</p>
          </p>
          {props.userId === userId && (
            <div style={{ marginLeft: "auto", marginTop: "5px" }}>
              <EditIcon
                onClick={() => {
                  setEditable(!edit);
                }}
                style={{
                  color: "#2196f3",
                  marginRight: "20px",
                  cursor: "pointer"
                }}
              />
              <DeleteIcon
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={() => {
                  setOpenD(true);
                }}
              />

              {openD && (
                <DeletePost
                  close={() => setOpenD(false)}
                  postId={props.postId}
                  open={openD}
                />
              )}
            </div>
          )}
        </div>
        <img
          src={image.preview}
          alt="img"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        {!!edit &&
          (!!validExtension ? (
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
          ))}
      </div>

      <div id="card-content">
        {liked ? (
          <IconButton onClick={handleLike}>
            <FavoriteIconFilled style={{ color: "#f50057" }} />
          </IconButton>
        ) : (
          <IconButton onClick={handleLike}>
            <FavoriteIcon style={{ color: "black" }} />
          </IconButton>
        )}
        {isAvailable ? (
          <SharePostAvail postId={props.postId} author={props.author} />
        ) : (
          <SharePostNotAvail
            postId={props.postId}
            author={props.author}
            desc={props.desc}
          />
        )}
        <div
          style={{
            wordBreak: "break-all",
            width: "99%",
            fontSize: "15px",
            height: "auto"
          }}
        >
          {!!edit && (
            <p
              variant="p"
              contentEditable={edit}
              className={clss}
              color="textPrimary"
              component="p"
              style={{
                overflow: "hidden",
                fontSize: "16px",
                wordBreak: "break-all"
              }}
            >
              {props.desc}
            </p>
          )}
          {text.length > 70 && (
            <div>
              {text.substr(0, num)}
              {!hidden && (
                <span
                  style={{ color: "grey", cursor: "pointer" }}
                  onClick={() => {
                    setNum(text.length);
                    setHidden(true);
                  }}
                >
                  ...more
                </span>
              )}
            </div>
          )}
          {text.length <= 70 && text}
        </div>
        {edit &&
          (!!validExtension ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleUpdateClick}
              style={{
                borderRadius: "20px",
                marginTop: "5%",
                marginLeft: "5%"
              }}
            >
              Update This
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{
                borderRadius: "20px",
                marginTop: "5%",
                marginLeft: "5%"
              }}
              disabled
            >
              Update This
            </Button>
          ))}
        {value.docs.length > 0 && (
          <div
            style={{
              color: "grey",
              fontSize: "14px",
              marginTop: "10px",
              cursor: "pointer"
            }}
            onClick={() => setOpen(true)}
          >
            View {value.docs.length} Comment{value.docs.length > 1 && "s"}{" "}
            comments
          </div>
        )}
        {value.docs.length === 0 && (
          <div
            style={{
              color: "grey",
              fontSize: "14px",
              marginTop: "10px",
              cursor: "pointer"
            }}
            onClick={() => setOpen(true)}
          >
            No comments
          </div>
        )}
        {open && <Comment close={onClose} comments={value.docs} />}
        <div
          style={{
            color: "grey",
            fontSize: "12px",
            marginTop: "10px",
            marginRight: "15px",
            marginBottom: "10px"
          }}
        >
          <TextField
            style={{
              width: "100%",
              height: "auto",
              fontSize: "12px"
            }}
            variant="standard"
            multiline
            onChange={(e) => setValue(e.target.value)}
            value={txtvalue}
            name="content"
            placeholder="Comment something"
            InputProps={{
              disableUnderline: true,
              fontSize: "12px"
            }}
          />
          <Button
            color="primary"
            style={{ fontSize: "13px", marginLeft: "-5px" }}
          >
            Post this
          </Button>
        </div>
      </div>
    </div>
  );
}
