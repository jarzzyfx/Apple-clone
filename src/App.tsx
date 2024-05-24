import { Hero, Highlight, Navbar } from "./components";
import { Model } from "./components/Model";

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Highlight />
      <Model />
    </div>
  );
};

export default App;
