import React from "react";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/AccountCircleRounded";
import CloseIcon from "@material-ui/icons/Close";

export default function Modal(props) {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getDate = (dateC) => {
    let date = new Date(Number(dateC));
    return moment(date).fromNow();
  };
  return (
    <div className="modal-container" id="modal">
      <div className="modal-content">
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.close();
          }}
        />
        <div
          style={{
            margin: "auto",
            fontWeight: 660,
            fontSize: "18px",
            display: "block"
          }}
        >
          Comments
        </div>
        {props.comments.map((item, index) => {
          if (item.data().comment_description)
            return (
              <div style={{ width: "100%", margin: "auto", marginTop: "30px" }}>
                <div className="card-header" style={{ height: "auto" }}>
                  <PersonIcon style={{ fontSize: "50px" }} />
                  <p style={{ marginLeft: "15px", marginTop: "5px" }}>
                    {item.data().author}
                    <p style={{ fontSize: "14px", color: "grey" }}>
                      {getDate(item.data().comment_date)}
                    </p>
                    <div
                      style={{
                        margin: "auto",
                        position: "absolute",
                        marginTop: "-30px",
                        marginLeft: "120px"
                      }}
                    >
                      <EditIcon
                        style={{
                          color: "#2196f3",
                          marginRight: "20px",
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                      />
                      <DeleteIcon
                        style={{
                          marginRight: "10px",
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "grey",
                        width: "auto",
                        wordBreak: "break-all",
                        marginTop: "10px"
                      }}
                    >
                      {item.data().comment_description}
                    </p>
                  </p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
