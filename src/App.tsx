import { Provider } from "react-redux";
import "./App.css";
import Canvas from "./components/Canvas";
import store from "./redux/store";
import InfiniteCanvas from "./components/InfiniteCanvas";

function App() {
  return (
    <>
      <Provider store={store}>
        <div style={{ overflow: "hidden" }}>
          <InfiniteCanvas />
        </div>
      </Provider>
    </>
  );
}

export default App;
