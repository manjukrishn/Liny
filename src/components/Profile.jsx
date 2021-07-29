import React from "react";
import Avatar from "@material-ui/core/Avatar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PersonIcon from "@material-ui/icons/Person";
import TextField from "@material-ui/core/TextField";
import CakeIcon from "@material-ui/icons/Cake";
import db from "./firebase";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 245
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(0deg)"
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
  },
  media: {
    height: 151,
    width: 151
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "0",
    borderRadius: "15px"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #f50057",
    padding: theme.spacing(2, 4, 3),
    borderRadius: "15px",
    outline: "0"
  }
}));
export default function Profile(props) {
  const classes = useStyles();
  const delta = 6;
  let startX;
  let startY;
  const history = useHistory();
  const [imageEdit, setImageEdit] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editValues, setEditValues] = React.useState({
    fname: props.fName,
    sname: props.sName,
    birthday: props.birthday
  });
  const [image, setImage] = React.useState({ preview: "", raw: "" });
  const userId = localStorage.getItem("googleId");

  const handleClose = () => {
    setOpen(false);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleExpandClickAndEdit = () => {
    setExpanded(!expanded);
    setEditProfile(false);
    const toBeUpdated = db.collection("user").doc(userId);
    return toBeUpdated
      .update({
        first_name: editValues.fname,
        last_name: editValues.sname,
        birthday: editValues.birthday
      })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  };
  const editVals = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => {
      return { ...prev, [name]: value };
    });
    setEditProfile(true);
  };
  const handleAvatarChange = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    });
    console.log(image.preview);
  };
  return (
    <div style={{ marginTop: "100px", marginBottom: "5%", marginRight: "5%" }}>
      <Grid container spacing={3} justify="center" style={{ marginTop: "3vh" }}>
        <Grid item alignItems="center">
          {userId === props.userId ? (
            <div>
              {!imageEdit ? (
                <Avatar
                  aria-label="recipe"
                  style={{
                    height: "100px",
                    width: "100px",
                    display: "inline-block",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (!image.preview)
                      document.getElementById("files").click();
                    else {
                      setOpen(true);
                    }
                  }}
                >
                  {!image.preview ? (
                    <PersonIcon
                      fontSize="large"
                      style={{
                        width: "100px",
                        height: "100px",
                        marginTop: "-5%"
                      }}
                    />
                  ) : (
                    <img
                      src={image.preview}
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "20px"
                      }}
                      alt="avatar"
                      draggable="true"
                    />
                  )}
                </Avatar>
              ) : (
                <Avatar
                  aria-label="recipe"
                  style={{
                    height: "100px",
                    width: "100px",
                    display: "inline-block"
                  }}
                >
                  <img
                    src={image.preview}
                    style={{ position: "absolute", cursor: "grabbed" }}
                    alt="avatar"
                    id="avatar"
                    onMouseDown={(e) => {
                      startX = e.pageX;
                      startY = e.pageY;
                    }}
                    onMouseUp={(e) => {
                      const diffX = Math.abs(e.pageX - startX);
                      const diffY = Math.abs(e.pageY - startY);
                      if (diffX < delta && diffY < delta) {
                        setImageEdit(false);
                      } else {
                        document.getElementById("avatar").style.left =
                          e.pageY + "px";
                        document.getElementById("avatar").style.top =
                          e.pageX + "px";
                      }
                    }}
                  />
                </Avatar>
              )}
              <input
                type="file"
                id="files"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
          ) : !image.preview ? (
            <Avatar
              aria-label="recipe"
              style={{
                height: "100px",
                width: "100px",
                display: "inline-block"
              }}
            >
              <PersonIcon
                fontSize="large"
                style={{ width: "100px", height: "100px", marginTop: "-5%" }}
              />
            </Avatar>
          ) : (
            <img src={image.preview} alt="preview" />
          )}
        </Grid>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <table>
                <Button
                  style={{ height: "20%", width: "100%" }}
                  onClick={() => {
                    setImageEdit(true);
                    setOpen(false);
                  }}
                >
                  <tr>Edit Image</tr>
                </Button>
                <Button
                  style={{ height: "20%", width: "100%" }}
                  onClick={() => {
                    document.getElementById("files").click();
                    setOpen(false);
                  }}
                >
                  <tr>Change image</tr>
                </Button>
              </table>
            </div>
          </Fade>
        </Modal>
        <ul style={{ listStyle: "none", marginTop: "0.5vw" }}>
          <li>
            <Grid item spacing={2}>
              <Typography
                variant="h5"
                noWrap
                style={{
                  paddingLeft: "15px",
                  color: "black",
                  display: "inline",
                  fontSize: "5vh"
                }}
              >
                {props.fName + " " + props.sName}
              </Typography>
              {!!(props.userId === userId) &&
                (!editProfile ? (
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: "5vw" }}
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    style={{ marginLeft: "5vw" }}
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded
                    })}
                    onClick={handleExpandClickAndEdit}
                    aria-expanded={expanded}
                  >
                    Edit Profile
                  </Button>
                ))}
            </Grid>
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              style={{ marginTop: "5vh" }}
            >
              <ul style={{ listStyle: "none", marginLeft: "-5%" }}>
                <li>
                  <PersonIcon
                    style={{
                      marginTop: "10px",
                      color: "grey",
                      display: "inline"
                    }}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    name="fname"
                    label="First name"
                    onChange={editVals}
                    value={editValues.fname}
                    placeholder={!props.fName && "Your first name"}
                    variant="outlined"
                    style={{ marginLeft: "5%" }}
                  />
                </li>

                <li style={{ marginTop: "20px" }}>
                  <PersonIcon
                    style={{
                      marginTop: "10px",
                      color: "grey",
                      display: "inline"
                    }}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    name="sname"
                    label="Last name"
                    placeholder={!props.sName && "Your last name"}
                    value={editValues.sname}
                    onChange={editVals}
                    variant="outlined"
                    style={{ marginLeft: "5%" }}
                  />
                </li>

                <li style={{ marginTop: "20px" }}>
                  <CakeIcon style={{ marginTop: "10px", color: "grey" }} />
                  <TextField
                    id="outlined-email"
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={editValues.birthday}
                    onChange={editVals}
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    style={{ marginLeft: "5%" }}
                  />
                </li>
              </ul>
            </Collapse>
          </li>
          <li style={{ marginTop: "8%" }}>
            <Grid container spacing={3}>
              <Grid item spacing={3}>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "15px",
                    color: "black",
                    display: "inline",
                    fontWeight: "550"
                  }}
                >
                  0
                </Typography>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "5px",
                    color: "black",
                    display: "inline"
                  }}
                >
                  posts
                </Typography>
              </Grid>
              <Grid item spacing={3}>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "10px",
                    color: "black",
                    display: "inline",
                    fontWeight: "550",
                    marginLeft: "5%"
                  }}
                >
                  {props.followers}
                </Typography>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "5px",
                    color: "black",
                    display: "inline"
                  }}
                >
                  followers
                </Typography>
              </Grid>
              <Grid item spacing={3}>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "10px",
                    color: "black",
                    display: "inline",
                    fontWeight: "550",
                    marginLeft: "5%"
                  }}
                >
                  {props.following}
                </Typography>
                <Typography
                  variant="p"
                  noWrap
                  style={{
                    paddingLeft: "5px",
                    color: "black",
                    display: "inline"
                  }}
                >
                  following
                </Typography>
              </Grid>
            </Grid>
          </li>
        </ul>
      </Grid>
      <hr style={{ marginTop: "5vh" }}></hr>
      <Grid
        container
        spacing={2}
        justify="center"
        style={{ marginTop: "15px", marginLeft: "5%" }}
      >
        <Grid
          spacing={4}
          item
          alignItems="center"
          style={{ marginBottom: "2%", fontSize: "18px", marginRight: "7%" }}
        >
          <Typography
            variant="p"
            noWrap
            style={{ fontSize: "18px", fontWeight: 550 }}
          >
            POSTS
          </Typography>
        </Grid>
        <Grid
          spacing={2}
          container
          xs={12}
          justify="center"
          style={{ marginRight: "7%" }}
        >
          {props.post.length ? (
            props.post.map((item, index) => {
              return (
                <Grid spacing={2} item lg={3} alignItems="center">
                  <Card
                    variant="outlined"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push("/post/" + item.id);
                    }}
                  >
                    <CardMedia
                      style={{ width: "100%" }}
                      className={classes.media}
                      image={item.data().postImage}
                    />
                  </Card>
                </Grid>
              );
            })
          ) : userId == props.userId ? (
            <Button
              variant="p"
              noWrap
              style={{
                fontSize: "16px",
                fontWeight: 550,
                cursor: "pointer",
                marginLeft: "5px",
                textTransform: "none"
              }}
              onClick={() => history.push("home")}
            >
              Add a post!
            </Button>
          ) : (
            <Typography
              variant="p"
              noWrap
              style={{ fontSize: "18px", fontWeight: 550 }}
            >
              No posts from the user
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
