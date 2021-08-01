import React, { useRef } from "react";
import "./styles.css";
import TopTopbar from "./TopTopbar";
import AddCircleIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import AddPost from "./Modal";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import db from "./firebase";
import Loading from "./Loading";
import Card from "./Card";

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(true);
  const [wrote, setWrote] = React.useState(0);
  const [reqarr, setReqArr] = React.useState([]);
  let suggestedArr = [];
  const reqSugArr = [];
  const reqfriendArr = [];

  const userId = localStorage.getItem("googleId");

  React.useEffect(() => {
    const arr = [];
    setReqArr([]);
    setLoad(true);
    let friend = [];
    let lastArr = [];
    db.collection("user")
      .doc(userId)
      .get()
      .then((docR) => {
        friend = docR.data().friends;
      });
    const tres = db
      .collection("post")
      .get()
      .then((query) => {
        query.forEach((docR) => {
          let obj = docR.data();
          obj["id"] = docR.id;
          if (docR.data().date !== undefined) arr.push(obj);
        });
      });
    tres.then(() => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].user_id === userId) lastArr.push(arr[i]);
        else if (friend.indexOf(arr[i].user_id) !== -1) lastArr.push(arr[i]);
      }
      lastArr.sort((a, b) => b.date - a.date);
      setReqArr(lastArr);
      setLoad(false);
    });
  }, []);
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
  const close = () => {
    setOpen(false);
  };
  function getLoad() {
    return load || loading1 || loading2;
  }
  if (getLoad()) return <Loading />;

  return (
    <div style={{ width: "100%" }}>
      <TopTopbar suggested={reqSugArr} />
      {reqfriendArr.length > 0 && (
        <div className="friends">
          {reqfriendArr.map((item, index) => {
            return (
              <div
                style={{
                  background: "white",
                  overflow: "hidden",
                  marginLeft: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap"
                }}
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
                  height="40px"
                  width="40px"
                  style={{ borderRadius: "50%" }}
                  alt="friend"
                />
                <div
                  style={{
                    fontSize: "16px",
                    marginTop: "10px",
                    fontWeight: 660,
                    overflow: "hidden"
                  }}
                >
                  {item.data().first_name}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <AddCircleIcon
        style={{
          marginLeft: "50%",
          marginTop: "20px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
        onClick={() => {
          setOpen(!open);
        }}
      />
      {reqarr.map((item, index) => {
        if (item.post_description !== undefined)
          return (
            <Card
              date={item.date}
              author={item.author}
              desc={item.post_description}
              img={item.postImage}
              userId={item.user_id}
              postId={item.id}
              like={item.like}
            />
          );
      })}
      {open && (
        <div>
          <AddPost close={close} />
        </div>
      )}
    </div>
  );
}
