import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("./pages/CreateService/Page"));

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Routes>
        <Route path="/" element={<Page />} />
      </Routes>
    </Suspense>
  );
}

export default App;
