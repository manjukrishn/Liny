import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ShareIcon from "@material-ui/icons/Share";
import IconButton from "@material-ui/core/IconButton";
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "0",
    borderRadius: "15px"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid red",
    padding: theme.spacing(2, 4, 3),
    borderRadius: "15px",
    outline: "0"
  }
}));

export default function Share(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const url = window.location.href + "/post/" + props.postId;
  return (
    <div>
      <IconButton onClick={handleOpen}>
        <ShareIcon size={32} round={true} style={{ color: "#ff9100" }} />
      </IconButton>
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
            <table style={{ marginLeft: "-5%" }}>
              <tr>
                <td>
                  <FacebookShareButton
                    url={url}
                    quote={`Share this post by ${props.author}`}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <FacebookShareButton
                    url={url}
                    quote={`Share this post by ${props.author}`}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      fontWeight: "550",
                      outline: "none"
                    }}
                  >
                    Share on Facebook
                  </FacebookShareButton>
                </td>
              </tr>
              <tr>
                <td>
                  <LinkedinShareButton
                    title={"Post by " + props.author}
                    summary={props.desc}
                    source={window.location.href}
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <LinkedinShareButton
                    title={"Post by " + props.author}
                    summary={props.desc}
                    source={window.location.href}
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      fontWeight: "550",
                      outline: "none"
                    }}
                  >
                    Share on Linkedin
                  </LinkedinShareButton>
                </td>
              </tr>

              <tr>
                <td>
                  <RedditShareButton
                    url={url}
                    title={"Post by " + props.author}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <RedditIcon size={32} round={true} />
                  </RedditShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    outline: "none"
                  }}
                >
                  <RedditShareButton
                    url={url}
                    title={"Post by " + props.author}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      fontWeight: "550",
                      outline: "none"
                    }}
                  >
                    Share on Reddit
                  </RedditShareButton>
                </td>
              </tr>

              <tr>
                <td>
                  <TelegramShareButton
                    title={"Post by " + props.author}
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <TelegramIcon size={32} round={true} />
                  </TelegramShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <TelegramShareButton
                    title={"Post by " + props.author}
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      fontWeight: "550",
                      outline: "none"
                    }}
                  >
                    Share on Telegram
                  </TelegramShareButton>
                </td>
              </tr>

              <tr>
                <td>
                  <TwitterShareButton
                    url={url}
                    title={"Post by " + props.author}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <TwitterShareButton
                    url={url}
                    title={"Post by " + props.author}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      fontWeight: "550",
                      outline: "none"
                    }}
                  >
                    Share on Twitter
                  </TwitterShareButton>
                </td>
              </tr>
              <tr>
                <td>
                  <WhatsappShareButton
                    title={"Post by " + props.author}
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>
                </td>
                <td
                  style={{
                    padding: "10%",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    fontWeight: "550"
                  }}
                >
                  <WhatsappShareButton
                    url={url}
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      outline: "none"
                    }}
                  >
                    Share on Whatsapp
                  </WhatsappShareButton>
                </td>
              </tr>
            </table>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
