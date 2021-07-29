import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    overflowX: "hidden !important"
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto !important"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
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
  }
}));

export default function TopBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const history = useHistory();
  const auth = localStorage.getItem("authenticate");
  const fName = localStorage.getItem("userFName");
  const userId = localStorage.getItem("googleId");

  let view = 0;
  if (document.documentElement.clientWidth < 601) {
    view = 1;
  }
  document.body.style.overflow = "hidden";
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = "primary-search-account-menu";

  const renderMobileMenu = (
    <div>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        style={{ width: "550px" }}
      >
        {!!view && (
          <MenuItem
            display={{ xl: "none", lg: "none", md: "none" }}
            disabled="true"
            style={{ color: "black" }}
          >
            <Typography
              variant="h4"
              noWrap
              style={{
                fontFamily: "'Acme', sans-serif",
                paddingLeft: "30px",
                color: "black"
              }}
            >
              Liny
            </Typography>
          </MenuItem>
        )}

        <div onClick={() => history.push("/home")}>
          <MenuItem>
            <IconButton color="inherit" style={{ color: "black" }}>
              <HomeIcon />
            </IconButton>
            <p style={{ marginLeft: "2px" }}>Home</p>
          </MenuItem>
        </div>
        <div
          onClick={() => {
            history.push("/friends");
          }}
        >
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton color="inherit" style={{ color: "black" }}>
              <PeopleAltIcon />
            </IconButton>
            <p style={{ marginLeft: "2px" }}>Friends</p>
          </MenuItem>
        </div>
        {!!auth && (
          <div
            onClick={() => {
              history.push("/login");
              localStorage.setItem("authenticate", 0);
            }}
          >
            <MenuItem onClick={handleProfileMenuOpen}>
              <IconButton color="inherit" style={{ color: "black" }}>
                <ExitToAppIcon />
              </IconButton>
              <p style={{ marginLeft: "2px" }}>Logout</p>
            </MenuItem>
          </div>
        )}
        {!!auth ? (
          <MenuItem
            onClick={() => {
              history.push(`/profile/${userId}`);
            }}
          >
            <IconButton color="inherit" style={{ color: "black" }}>
              <AccountCircle />
            </IconButton>
            <p style={{ marginLeft: "2px" }}>{fName}</p>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              history.push("/login");
            }}
          >
            <IconButton color="inherit" style={{ color: "black" }}>
              <AccountCircle />
            </IconButton>
            <p style={{ marginLeft: "2px" }}>SignIn</p>
          </MenuItem>
        )}
      </Menu>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <ArrowBackIcon
            style={{ marginRight: "3%", cursor: "pointer" }}
            onClick={() => {
              history.push("/home");
            }}
          />

          <Typography
            className={classes.title}
            variant="h4"
            noWrap
            style={{
              fontFamily: "'Acme', sans-serif",
              marginRight: "2%",
              cursor: "default"
            }}
            onClick={() => history.push("/home")}
          >
            Liny
          </Typography>
          <div className={classes.grow} />
          {/* larger screen */}
          <div>
            <div className={classes.sectionDesktop}>
              <IconButton
                onClick={() => history.push("/home")}
                color="inherit"
                style={{ marginRight: "50px" }}
              >
                <HomeIcon style={{ fontSize: "27px" }} />
              </IconButton>
              <IconButton
                color="inherit"
                style={{ marginRight: "50px" }}
                onClick={() => history.push("/friends")}
              >
                <PeopleAltIcon style={{ fontSize: "27px" }} />
              </IconButton>
              {!!auth && (
                <Button
                  style={{
                    marginRight: "45px",
                    color: "white",
                    fontSize: "18px"
                  }}
                  onClick={() => {
                    history.push("/login");
                    localStorage.setItem("authenticate", 0);
                  }}
                >
                  LOGOUT
                </Button>
              )}
              {!!auth ? (
                <Button
                  style={{
                    marginRight: "20px",
                    color: "white",
                    textTransform: "capitalize"
                  }}
                  onClick={() => {
                    history.push(`/profile/${userId}`);
                  }}
                >
                  <AccountCircle fontSize="large" />
                  <Typography
                    variant="p"
                    noWrap
                    style={{
                      paddingLeft: "10px",
                      fontSize: "18px",
                      wordSpacing: "4px"
                    }}
                    textTransform="none"
                  >
                    {fName}
                  </Typography>
                </Button>
              ) : (
                <Button
                  style={{
                    marginRight: "20px",
                    color: "white",
                    textTransform: "capitalize"
                  }}
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  <AccountCircle fontSize="large" />
                  <Typography
                    variant="p"
                    noWrap
                    style={{
                      paddingLeft: "10px",
                      fontSize: "18px",
                      wordSpacing: "4px"
                    }}
                    textTransform="none"
                  >
                    {fName}
                  </Typography>
                </Button>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}
