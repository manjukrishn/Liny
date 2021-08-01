import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PersonIcon from "@material-ui/icons/Person";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import DeletePost from "./DeletePost";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import firestore from "./firestore";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Comment from "./Comment";
import WriteComment from "./WriteComment";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import db from "./firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import EditIcon from "@material-ui/icons/Edit";
import SharePostAvail from "./ShareLinkAvailable";
import SharePostNotAvail from "./ShareLinkNotAvailable";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 545,
    width: "100%",
    height: "100%"
  },
  media: {
    height: 300
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },

  expandComments: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpenComments: {
    transform: "rotate(180deg)"
  }
}));

export default function Post(props) {
  const classes = useStyles();
  const clss = "updatePost" + props.postId;
  const [showMore, setShowMore] = React.useState(false);
  const [validExtension, setValidExtenstion] = React.useState(1);
  const [edit, setEditable] = React.useState(false);
  const [expandedComments, setExpandedComments] = React.useState(false);
  const [clickedTwice, setClickedTwice] = React.useState(0);
  const userId = localStorage.getItem("googleId");
  const auth = localStorage.getItem("authenticate");
  const [isAvailable, setAvailable] = React.useState(false);
  const [image, setImage] = React.useState({ preview: props.img, raw: "" });
  const [liked, setLiked] = React.useState(false);
  const history = useHistory();
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
  const handleExpandClickComments = () => {
    setExpandedComments(!expandedComments);
  };
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
    return array;
  };
  const addLike = (array) => {
    array.push(userId);
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
  return (
    <div className={classes.root}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push(`/profile/${props.userId}`);
              }}
            >
              <PersonIcon />
            </Avatar>
          }
          action={
            props.userId === userId && (
              <div style={{ marginLeft: "-15%" }}>
                <IconButton
                  onClick={() => {
                    setEditable(!edit);
                  }}
                >
                  <EditIcon style={{ color: "#2196f3" }} />
                </IconButton>
                <DeletePost postId={props.postId} />
              </div>
            )
          }
          title={
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push(`/profile/${props.userId}`);
              }}
            >
              {props.author}
            </div>
          }
          subheader={getDate()}
        />
        <div className={classes.media}>
          <img
            src={image.preview}
            style={{
              padding: 0,
              display: "block",
              margin: "0 auto",
              maxHeight: "100%",
              maxWidth: "100%"
            }}
            alt="preview"
          />
        </div>
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
        <CardContent>
          {!!edit ? (
            <Typography
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
            </Typography>
          ) : (
            <Typography
              variant="p"
              contentEditable={edit}
              color="textPrimary"
              component="p"
              style={{
                overflow: "hidden",
                fontSize: "16px",
                wordBreak: "break-all"
              }}
            >
              {showMore ? props.desc : props.desc.slice(0, 27)}

              {props.desc.length > 30 && !showMore && (
                <span
                  onClick={() => setShowMore(true)}
                  style={{ fontSize: "12px", color: "grey" }}
                >
                  {" "}
                  more...
                </span>
              )}
              {props.desc.length > 30 && showMore && (
                <span
                  onClick={() => setShowMore(false)}
                  style={{ fontSize: "12px", color: "grey" }}
                >
                  {" "}
                  show less
                </span>
              )}
            </Typography>
          )}
        </CardContent>
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
        <CardActions disableSpacing>
          {liked ? (
            <IconButton>
              <FavoriteIcon style={{ color: "#f50057" }} />
            </IconButton>
          ) : clickedTwice ? (
            <IconButton onClick={handleLike}>
              <FavoriteIcon style={{ color: "#f50057" }} />
            </IconButton>
          ) : (
            <IconButton onClick={handleLike}>
              <FavoriteBorderOutlinedIcon style={{ color: "#f50057" }} />
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
        </CardActions>

        {!!props.like &&
          (props.like.length < 10001 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ margin: "0 0 5% 5%" }}
            >
              {props.like.length} {props.like.length > 1 ? " likes" : " like"}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ margin: "0 0 5% 5%" }}
            >
              {"10000+ likes"}
            </Typography>
          ))}
        {!!auth && <WriteComment id={props.postId} authorId={ID} />}
        {!loading ? (
          <CardContent>
            {value.docs.length > 0 && (
              <Typography variant="body2" color="textPrimary" component="p">
                <span
                  className={clsx(classes.expandComments, {
                    [classes.expandOpenComments]: expandedComments
                  })}
                  onClick={handleExpandClickComments}
                  aria-expanded={expandedComments}
                  aria-label="show more"
                  style={{
                    color: "grey",
                    cursor: "default",
                    userSelect: "none"
                  }}
                >
                  View {value.docs.length} Comment{value.docs.length > 1 && "s"}
                </span>
              </Typography>
            )}
            <Collapse in={expandedComments} timeout="auto" unmountOnExit>
              {value.docs.map((item, index) => {
                if (item.data().comment_description)
                  return (
                    <div>
                      <Comment
                        desc={item.data().comment_description}
                        date={item.data().comment_date}
                        author={item.data().author}
                        userId={item.data().author_id}
                        commentId={item.id}
                      />
                      {value.docs.length - 1 !== index && <hr></hr>}
                    </div>
                  );
              })}
            </Collapse>
          </CardContent>
        ) : (
          <CircularProgress />
        )}
      </Card>
    </div>
  );
}
