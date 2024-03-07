import { Provider } from "react-redux";
import "./App.css";
import Canvas from "./components/Canvas";
import store from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <div>
          <Canvas />
          <ModeSelector />
        </div>
      </Provider>
    </>
  );
}

export default App;
