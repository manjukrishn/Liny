import React from "react";
import Profile from "./Profile";
import TopBar from "./TopBar";
import { useLocation } from "react-router";
import db from "./firebase";
import Loading from "./Loading";
import { useDocumentOnce, useCollection } from "react-firebase-hooks/firestore";

export default function ProfilePage() {
  const location = useLocation();
  const path = location.pathname;
  const arr = path.split("/");
  let count = 0;
  const [value2, loading2, error2] = useCollection(db.collection("user"));
  const [value1, loading1, error1] = useCollection(
    db
      .collection("post")
      .where("user_id", "==", arr[2])
      .orderBy("date", "desc"),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  const [item, loading, error] = useDocumentOnce(
    db.collection("user").doc(arr[2])
  );

  if (!loading2 && !loading) {
    value2.docs.map((item) => {
      const arr1 = item.data().friends;
      if (arr1.indexOf(arr[2]) !== -1) ++count;
    });
  }
  return !loading && !loading1 && !loading2 ? (
    <div
      style={{
        overflowY: "scroll",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <TopBar />
      <Profile
        fName={item.data().first_name}
        sName={item.data().last_name}
        userId={item.id}
        following={item.data().friends.length}
        followers={count}
        post={value1.docs}
        birthday={item.data().birthday ? item.data().birthday : null}
      />
    </div>
  ) : (
    <Loading />
  );
}
