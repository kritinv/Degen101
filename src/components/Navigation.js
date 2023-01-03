import Players from "./Players.js";

function Navigation(props) {
  return (
    <div className="navigation d-flex align-items-center justify-content-between">
      <div className="web-title d-flex">
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
