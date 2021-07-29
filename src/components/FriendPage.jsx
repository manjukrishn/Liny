import React from "react";
import Friend from "./Friend";
import TopBar from "./TopBar";

export default function Home() {
  return (
    <div
      style={{
        overflowY: "scroll",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <TopBar />
      <Friend />
    </div>
  );
}
