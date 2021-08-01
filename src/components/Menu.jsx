import React, { useRef } from "react";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import db from "./firebase";

export default function Menu(props) {
  const [open, setOpen] = React.useState(false);
  const [clickedOutside, setClickedOutside] = React.useState(false);
  const myRef = useRef();
  const userId = localStorage.getItem("googleId");

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      setClickedOutside(true);
      setOpen(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const handleFollow = (user) => {
    let toBeUpdated = db.collection("user").doc(userId);
    return toBeUpdated
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(user)
      })
      .then(function () {
        console.log("Document Post successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  };
  return (
    <div ref={myRef}>
      <ExploreOutlinedIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setOpen(!open);
          setClickedOutside(false);
        }}
      />
      {!clickedOutside && open && (
        <div id="menu">
          <ul
            style={{
              zIndex: 5,
              position: "absolute",
              background: "white",
              maxHeight: "500px",
              width: "300px",
              float: "center",
              padding: 0,
              margin: 0,
              borderRadius: "10px",
              marginLeft: "-260px",
              marginTop: "-10px",
              backgroundColor: "#f1f1f1",
              minWidth: "200px",
              boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              overflowX: "hidden",
              overflow: "auto"
            }}
          >
            <h3
              style={{
                position: "absolute",
                marginLeft: "85px",
                marginTop: "10px"
              }}
            >
              Make friends
            </h3>
            {props.suggested.length === 0 && (
              <div
                style={{
                  marginTop: "50px",
                  marginLeft: "65px",
                  fontSize: "18px"
                }}
              >
                No friends to make!
              </div>
            )}
            <div
              style={{
                paddingTop: "20px",
                marginLeft: "-20px",
                marginTop: "40px"
              }}
            >
              {props.suggested.map((item, index) => {
                return (
                  <div
                    style={{
                      overflow: "hidden",
                      height: "50px",
                      marginBottom: "10px",
                      display: "flex"
                    }}
                  >
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
                      height="35px"
                      width="35px"
                      style={{
                        borderRadius: "50%",
                        display: "inline",
                        marginLeft: "30px",
                        cursor: "pointer"
                      }}
                      alt="friend"
                    />
                    <span style={{ marginLeft: "10px", marginTop: "5px" }}>
                      {item.data().first_name}
                    </span>
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      size="small"
                      onClick={() => handleFollow(item.id)}
                      style={{
                        overflow: "hidden",
                        marginLeft: "auto",
                        height: "25px",
                        padding: "3px",
                        marginRight: "10px",
                        fontSize: "12px",
                        marginTop: "5px"
                      }}
                    >
                      Follow
                    </Button>
                  </div>
                );
              })}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}
