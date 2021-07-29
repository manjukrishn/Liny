import React from "react";
import Box from "@material-ui/core/Box";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect, Route } from "react-router";
import firebase from "firebase";
import db from "./firebase";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Made with <span style={{ color: "red" }}> ❤ </span> from Liny .
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  google: {
    margin: theme.spacing(3, 0, 2),
    height: "50px",
    background: "#2196f3",
    borderRadius: 3,
    border: 0,
    fontSize: "16px",
    fontWeight: "550",
    width: "100%",
    color: "white",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  },
  facebook: {
    margin: theme.spacing(3, 0, 2),
    height: "50px",
    background: "#4267B2",
    borderRadius: 3,
    border: 0,
    fontSize: "16px",
    fontWeight: "550",
    fontFamily: "'Noto Sans', sans-serif",
    width: "100%",
    color: "white",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  }
}));

function SignIn(props) {
  const history = useHistory();
  const classes = useStyles();
  const auth = firebase.auth();
  const responseFacebook = (response) => {
    console.log(response);
    history.push("/");
  };

  const providerGoogle = new firebase.auth.GoogleAuthProvider();
  // function onSuccess(user) {
  //   console.log("Logged in as: " + user.getBasicProfile().getName());
  //   history.push("/home");
  //   console.log(user.getBasicProfile());
  //   localStorage.setItem("authenticate", 1);
  //   localStorage.setItem("googleId", user.getBasicProfile().getId());
  //   localStorage.setItem("userFName", user.getBasicProfile().getGivenName());
  //   localStorage.setItem("userSName", user.getBasicProfile().getFamilyName());
  //   const userIdRef = db.collection("user").doc(user.getBasicProfile().getId());
  //   db.runTransaction(function (transaction) {
  //     return transaction.get(userIdRef).then(function (userId) {
  //       if (!userId.exists) {
  //         db.collection("user").doc(user.getBasicProfile().getId()).set({
  //           first_name: user.getBasicProfile().getGivenName(),
  //           last_name: user.getBasicProfile().getFamilyName(),
  //           user_id: user.getBasicProfile().getId(),
  //           friends: [],
  //           followers: 0,
  //           following: 0
  //         });
  //       }
  //     });
  //   });
  // }
  const singInWithGoogle = () => {
    auth
      .signInWithPopup(providerGoogle)
      .then((res) => {
        const firstName = res.user.displayName.split(" ")[0];
        const lastName = res.user.displayName.split(" ")[1];
        const uid = res.user.uid;

        localStorage.setItem("authenticate", 1);
        localStorage.setItem("googleId", uid);
        localStorage.setItem("userFName", firstName);
        localStorage.setItem("userSName", lastName);
        const userIdRef = db.collection("user").doc(uid);
        db.runTransaction(function (transaction) {
          return transaction.get(userIdRef).then(function (userId) {
            if (!userId.exists) {
              db.collection("user").doc(res.user.uid).set({
                first_name: firstName,
                last_name: lastName,
                user_id: uid,
                friends: [],
                followers: 0,
                following: 0
              });
            }
          });
        });
        history.push("home");
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography variant="h6" component="h4">
          Sign In
        </Typography>
        <Button
          onClick={singInWithGoogle}
          variant="outlined"
          style={{
            textTransform: "none",
            paddingRight: "60px",
            marginTop: "50px",
            background: "white"
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBRF__vDRer9N3lzmW-FJTnaiCi1Vd7TvcHrdcjzU28RHD2kcpRVdZIQhLvZaksbBPpak&usqp=CAU"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "60px"
            }}
            alt="google"
          />
          Log in with Google
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default SignIn;
