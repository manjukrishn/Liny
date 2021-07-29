import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import db from "./firebase";

export default function WriteComment(props) {
  const [Comment, setComment] = React.useState({ content: "" });
  function handleChange(e) {
    const { name, value } = e.target;
    setComment((prev) => {
      return { ...prev, [name]: value };
    });
  }
  function getTime() {
    return new Date().getTime().toString();
  }
  function handleClick() {
    if (Comment.content) {
      const commentId = props.id + getTime();
      const commentIdRef = db.collection("comment").doc(commentId);
      const fName = localStorage.getItem("userFName");
      const sName = localStorage.getItem("userSName");

      db.runTransaction(function (transaction) {
        return transaction.get(commentIdRef).then(function (comment) {
          if (!comment.exists) {
            db.collection("comment")
              .doc(commentId)
              .set({
                comment_date: getTime(),
                author: fName + sName,
                author_id: props.authorId,
                comment_description: Comment.content,
                postId: props.id
              });
          }
        });
      });
    }
    setComment({ content: "" });
  }
  return (
    <div>
      <form
        noValidate
        autoComplete="off"
        style={{ width: "94%", marginLeft: "2.7%", marginBottom: "5%" }}
      >
        <TextField
          onChange={handleChange}
          style={{ width: "100%" }}
          multiline
          rows={5}
          name="content"
          value={Comment.content}
          placeholder="Write Comment..."
          variant="outlined"
        />
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleClick}
          style={{
            borderRadius: "20px",
            marginTop: "5%",
            backgroundColor: "#3d5afe"
          }}
        >
          Comment
        </Button>
      </form>
    </div>
  );
}
