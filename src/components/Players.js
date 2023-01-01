import React from "react";
export default function Players(props) {
  let val = props.homePage.num_players;
  return (
    <div className="d-flex">
      <p>Players: </p>
      <input
        className="num-players"
        type="number"
        value={val}
        onChange={(e) => {
          if (e.target.value <= 9 && e.target.value >= 3) {
            let new_homepage = props.homePage;
            new_homepage.num_players = e.target.value;
            props.updateHomePage(new_homepage);
          }
        }}
      />
      {/*
      <div className="num-players-controller">
        <button className="num-players-button">+</button>
        <button className="num-players-button">-</button>
      </div>
         */}
    </div>
  );
}
