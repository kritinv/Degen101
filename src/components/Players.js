import React from "react";
export default function Players(props) {
  let val = props.homePage.num_players;
  return (
    <div className=" d-flex">
      <div>Players: </div>
      <input
        className="players-joyride num-players-input"
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
    </div>
  );
}
