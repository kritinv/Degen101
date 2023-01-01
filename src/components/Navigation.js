import Players from "./Players.js";

function Navigation(props) {
  return (
    <div className="webtitle d-flex justify-content-between align-items-center">
      <div className="webtitletext d-flex">
        <div className="degen">DEGEN101</div>
        <div className="mx-3">|</div>
        <Players
          updateHomePage={(i) => props.updateHomePage(i)}
          homePage={props.homePage}
        ></Players>
      </div>
      <div className="nav">
        {/*<button
          className="page"
          onClick={() => {
            props.changePage("homePage");
          }}
        >
          Home
        </button>
        <button
          className="page"
          onClick={() => {
            props.changePage("rangeConstructorPage");
          }}
        >
          Range Constructor
        </button>*/}
      </div>
    </div>
  );
}

export default Navigation;
