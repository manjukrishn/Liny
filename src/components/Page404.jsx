import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

export default function Page() {
  const history = useHistory();

  return (
    <div class="container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The Page you are looking for doesn't exist or an other error occured. Go
        to{" "}
        <span onClick={() => history.push("/home")} style={{ cursor: "pointer" }}>
          Home Page.
        </span>
      </p>
    </div>
  );
}
