import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import db from "./firebase";
import deletePost from "./deletePost";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

export default function DeletPost(props) {
  const [val, load, error] = useCollection(db.collection("comment"));

  const handleClose = () => {
    props.close();
  };

  const handleDeletePost = () => {
    deletePost(props.postId).then(() => {
      if (!load) {
        val.docs.map((item) => {
          if (item.data().postId === props.postId) {
            db.collection("comment")
              .doc(item.id)
              .delete()
              .then(function () {
                console.log("Document successfully deleted!");
              })
              .catch(function (error) {
                console.error("Error removing document: ", error);
              });
          }
        });
      }
      db.collection("post")
        .doc(props.postId)
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      handleClose();
    });
  };
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete this post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted, this post cannot be retrieved. Make sure this is not
            an important post.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePost} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
