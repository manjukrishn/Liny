import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import db from "./firebase";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import Loading from "./Loading";
import { useHistory } from "react-router-dom";
import SuggestedFriends from "./SuggestedFriend";

const useStyles = makeStyles({
  root: {
    maxWidth: 275
  },
  cover: {
    height: 171,
    width: 151
  },
  title: {
    fontSize: 14
  }
});
export default function SimpleCard() {
  const classes = useStyles();
  let suggestedArr = [];
  const reqSugArr = [];
  const reqfriendArr = [];
  const history = useHistory();
  const userId = localStorage.getItem("googleId");
  const [value1, loading1, error1] = useDocument(
    db.collection("user").doc(userId),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  const [value2, loading2, error2] = useCollection(db.collection("user"));

  if (!loading2 && !loading1) {
    value2.docs.map((item1) => {
      let index = value1.data().friends.indexOf(item1.id);
      if (index === -1 && item1.id !== userId) suggestedArr.push(item1.id);
    });
    if (suggestedArr.length > 10) suggestedArr = suggestedArr.slice(0, 9);
    value2.docs.map((item) => {
      let index = suggestedArr.indexOf(item.id);
      if (index !== -1) reqSugArr.push(item);
    });
    value2.docs.map((item) => {
      if (value1 !== undefined) {
        let index = value1.data().friends.indexOf(item.id);
        if (index !== -1) reqfriendArr.push(item);
      }
    });
  }

  return !loading1 || !loading2 ? (
    <div
      style={{
        marginTop: "100px",
        width: "90%",
        marginLeft: "2%",
        height: "100%",
        marginBottom: "5%"
      }}
    >
      {!!value1.data().friends.length && (
        <Grid container justify="center" spacing={2}>
          <Grid
            spacing={4}
            item
            alignItems="center"
            style={{ marginBottom: "2%", fontSize: "18px", marginRight: "5%" }}
          >
            {" "}
            <h3
              style={{
                marginBottom: "2%",
                fontSize: "24px",
                marginRight: "5%"
              }}
            >
              Friends
            </h3>
          </Grid>
          <Grid
            spacing={2}
            container
            xs={12}
            justify="center"
            style={{ marginLeft: "3%" }}
          >
            {reqfriendArr.map((item, index) => {
              if (item)
                return (
                  <Grid
                    item
                    spacing={2}
                    lg={4}
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push(`/profile/${item.id}`)}
                  >
                    <Card
                      className={classes.root}
                      style={{ paddingBottom: "-2%" }}
                    >
                      <table>
                        <tr>
                          <td>
                            <CardMedia
                              className={classes.cover}
                              image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"
                              title="Live from space album cover"
                            />
                          </td>
                          <td>
                            <CardContent>
                              <Typography component="h5" variant="h5">
                                {item.data().first_name}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {item.data().first_name +
                                  " " +
                                  item.data().last_name}
                              </Typography>
                            </CardContent>
                          </td>
                        </tr>
                      </table>
                    </Card>
                  </Grid>
                );
            })}
          </Grid>
        </Grid>
      )}
      {!value1.data().friends && !suggestedArr.length() && (
        <Grid container justify="center">
          <Grid item alignItems="center">
            <Typography
              component="h5"
              variant="h5"
              style={{
                fontWeight: "550",
                marginLeft: "5%",
                marginTop: "5px",
                fontSize: "24px"
              }}
            >
              {"Nothing much to say "}
            </Typography>
          </Grid>
        </Grid>
      )}
      {!!suggestedArr.length && (
        <Grid
          container
          justify="center"
          style={{
            marginTop: "15px"
          }}
        >
          <Grid
            item
            style={{
              fontSize: "24px",
              marginBottom: "7%",
              fontWeight: "550"
            }}
          >
            {!value1.data().friendss
              ? "Try making new friends!"
              : "Suggested friends"}
          </Grid>
          <Grid
            spacing={2}
            container
            justify="center"
            style={{ marginLeft: "3%" }}
          >
            {reqSugArr.map((item, index) => {
              return (
                <Grid
                  item
                  spacing={2}
                  lg={4}
                  alignItems="center"
                  onClick={() => {
                    history.push(`/profile/${item.id}`);
                  }}
                >
                  <SuggestedFriends
                    first_name={item.data().first_name}
                    last_name={item.data().last_name}
                    userId={item.id}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </div>
  ) : (
    <Loading />
  );
}
