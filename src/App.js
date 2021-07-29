import React from "react";
import FriendPage from "./components/FriendPage";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import SharedPost from "./components/SharedPost";
document.body.style.overflowX = "hidden";

export default function MiniDrawer() {
  document.body.style.backgroundColor = "#f1f1f1";
  return (
    <Router>
      <Switch>
        <PublicRoute restricted={false} component={Login} path="/login" exact />
        <PrivateRoute exact path={"/home"} component={Home} />
        <PrivateRoute exact path="/friends" component={FriendPage} />
        <PrivateRoute exact path="/profile/:id" component={ProfilePage} />
        <PublicRoute exact path={"/post/:postId"} component={SharedPost} />
        <PrivateRoute exact path={"/"} component={Home} />
        <PublicRoute component={Page404} />
      </Switch>
    </Router>
  );
}
