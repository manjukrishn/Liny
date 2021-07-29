import React from "react";
import TopBar from "./TopBar";
import Post from "./Post";
import db from "./firebase";
import Loading from "./Loading";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router";
import Grid from "@material-ui/core/Grid";
import Page from "./Page404";

export default function SharedPost() {
  const location = useLocation();
  const path = location.pathname;
  const arr = path.split("/");
  const [item, loading, error] = useDocumentOnce(
    db.collection("post").doc(arr[2])
  );
  return (
    <div>
      {!loading ? (
        !(item.data() === undefined) ? (
          <div
            style={{
              overflowY: "scroll",
              overflowX: "hidden"
            }}
          >
            <TopBar />
            <Grid
              container
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <Grid
                item
                alignItems="center"
                style={{
                  marginTop: "10%",
                  marginBottom: "10%",
                  height: "100%",
                  overflow: "auto",
                  display: "inline-block"
                }}
              >
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
            </Grid>
          </div>
        ) : (
          <Page />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
