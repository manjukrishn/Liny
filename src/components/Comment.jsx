import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import db from "./firebase";
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200
  },
  avatar: {
    backgroundColor: getRandomColor()
  }
}));

export default function Comment(props) {
  const classes = useStyles();
  const userId = localStorage.getItem("googleId");
  const [edit, setEdit] = React.useState(false);
  const clssComment = "updatePost" + props.commentId;

  const getDate = () => {
    let date = new Date(Number(props.date));
    return moment(date).fromNow();
  };
  function handleUpdateClick(e) {
    console.log(e.target.innerText);
    let toBeUpdated = db.collection("comment").doc(props.commentId);
    let commentUpdateDiv = document.getElementsByClassName(clssComment);
    let content = null;
    setEdit(false);
    for (let i = 0; i < commentUpdateDiv.length; i++)
      content = commentUpdateDiv[i].innerText;
    return toBeUpdated
      .update({
        comment_description: content
      })
      .then(function () {
        console.log("Document Post successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }
  function deleteComment() {
    db.collection("comment")
      .doc(props.commentId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
  return (
    <div className={classes.root}>
      <table style={{ marginLeft: "-5%" }}>
        <tr>
          <td>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {props.author ? props.author.charAt(0) : " "}
                </Avatar>
              }
              title={props.author}
              subheader={getDate()}
            />
          </td>
          {props.userId === userId && (
            <td style={{ color: "grey", fontSize: "13px" }}>
              <div style={{ cursor: "pointer" }} onClick={() => setEdit(!edit)}>
                {" "}
                Edit
              </div>
              <div style={{ cursor: "pointer" }} onClick={deleteComment}>
                Delete
              </div>
            </td>
          )}
        </tr>
      </table>
      <CardContent
        style={{ wordBreak: "break-all", fontSize: "13px" }}
        className={clssComment}
        contentEditable={edit}
      >
        {props.desc}
      </CardContent>
      {!!edit && (
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
      )}
    </div>
  );
}
