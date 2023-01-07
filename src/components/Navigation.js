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
        {props.curr_page === "homePage" ? (
          <button
          className="page text-white fw-bold btn-block"
          onClick={() => {
            props.endTutorial();
            props.changePage("homePage");
          }}
          >
            Home
          </button>
        ):(
          <button
          className="page btn-block"
          onClick={() => {
            props.endTutorial();
            props.changePage("homePage");
          }}
          >
            Home
          </button>
        )}
        
        {props.curr_page === "rangeConstructorPage" ? (
          <button
          className="endTutorial page range-constructor-button-joyride btn-block text-white fw-bold"
          onClick={() => {
            props.endTutorial();
            props.changePage("rangeConstructorPage");
          }}
          >
            Range Constructor
          </button>
        ):(
          <button
          className="endTutorial page range-constructor-button-joyride btn-block"
          onClick={() => {
            props.endTutorial();
            props.changePage("rangeConstructorPage");
          }}
          >
            Range Constructor
          </button>
        )}
        
        <button
          className="tutorial"
          onClick={() => {
            props.startTutorial();
          }}
        >
          Tutorial
        </button>
      </div>
    </div>
  );
}

export default Navigation;
