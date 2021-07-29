import React from "react";
import TopBar from "./TopBar";
import WritePost from "./WritePost";
import Post from "./Post";
import db from "./firebase";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Loading from "./Loading";
const useStyles = makeStyles((theme) => ({
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
export default function Home() {
  const classes = useStyles();
  const userId = localStorage.getItem("googleId");
  const [value, loading, error] = useCollection(
    db.collection("post").where("user_id", "==", userId),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  const reqarr = [];

  const [value1, loading1, error1] = useCollection(db.collection("post"), {
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  const [value2, loading2, error2] = useDocument(
    db.collection("user").doc(userId),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  if (!loading && !loading1 && !loading2) {
    value.docs.map((item) => {
      reqarr.push(item);
    });
    value1.docs.map((item) => {
      if (value2.data().friends.indexOf(item.data().user_id) !== -1) {
        reqarr.push(item);
      }
    });
    reqarr.sort((a, b) => {
      return b.data().date - a.data().date;
    });
  }
  const renderMobile = (
    <div style={{ overflowY: "scroll" }}>
      {!loading ? (
        <div>
          <TopBar />
          <div className={classes.sectionMobile}>
            <Grid
              container
              justify="center"
              style={{
                width: "100%",
                paddingTop: "25%",
                paddingLeft: "12%",
                paddingRight: "9%"
              }}
            >
              <Grid
                item
                lg={6}
                style={{ marginBottom: "10%" }}
                alignItems="center"
              >
                <WritePost />
              </Grid>

              <Grid item lg={6} alignItems="center">
                {reqarr.length!==0 ? (
                  reqarr.map((item) => {
                    if (item.data().post_description)
                      return (
                        <Grid style={{ marginBottom: "10%" }}>
                          <Post
                            date={item.data().date}
                            author={item.data().author}
                            desc={item.data().post_description}
                            img={item.data().postImage}
                            userId={item.data().user_id}
                            postId={item.id}
                            like={item.data().like}
                          />
                        </Grid>
                      );
                  })
                ) : (
                  <div style={{marginBottom:"10%"}}>
                    <Typography variant="p" color="textPrimary" component="h2">
                      No posts to show!
                    </Typography>

                    <Typography variant="p" color="textPrimary" component="p">
                      Add a post or make new friends!
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
  return (
    <div style={{ overflowY: "scroll", height: "100vh" }}>
      {!loading ? (
        <div>
          <div className={classes.sectionDesktop}>
            <TopBar />
            <Grid
              container
              justify="center"
              style={{
                width: "100%",
                paddingTop: "8%",
                paddingLeft: "9%",
                paddingRight: "9%"
              }}
            >
              <Grid
                item
                lg={6}
                style={{ marginBottom: "10%", zIndex: "1" }}
                alignItems="center"
              >
                <WritePost />
              </Grid>
              <Grid item lg={6} alignItems="center">
                {reqarr.length ? (
                  reqarr.map((item) => {
                    if (item.data().post_description)
                      return (
                        <Grid style={{ marginBottom: "10%" }}>
                          <Post
                            date={item.data().date}
                            author={item.data().author}
                            desc={item.data().post_description}
                            img={item.data().postImage}
                            userId={item.data().user_id}
                            postId={item.id}
                            like={item.data().like}
                          />
                        </Grid>
                      );
                  })
                ) : (
                  <div style={{marginBottom:"10%"}}> 
                    <Typography variant="h2" color="textPrimary" component="h2">
                      No posts to show!
                    </Typography>

                    <Typography variant="h5" color="textPrimary" component="h5" style={{marginTop:"2%",marginLeft:"10%"}}>
                      Add a post or make new friends!
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
          {renderMobile}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
