import React from "react";
import ShareIcon from "@material-ui/icons/Share";
import IconButton from "@material-ui/core/IconButton";

export default function Share(props) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Post by ${props.author}`,
          text: `Check out this post by ${props.author}`,
          url: window.location.href + "/post/" + props.postId
        })
        .then(() => {
          console.log("Successfully shared");
        })
        .catch((error) => {
          console.error("Something went wrong sharing the blog", error);
        });
    }
  };
  return (
    <IconButton
      onClick={handleShare}
      style={{ marginTop: "-48px", marginLeft: "50px" }}
    >
      <ShareIcon style={{ color: "black" }} />
    </IconButton>
  );
}
