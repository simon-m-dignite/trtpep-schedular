import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import SuccessPage from "./pages/CreateService/SuccessPage";
const Page = lazy(() => import("./pages/CreateService/Page"));
const SchedulerPage = lazy(() => import("./pages/CreateService/SchedulerPage"));
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Routes>
        <Route path="/:doctorId" element={<SchedulerPage />} />
        {/* <Route path="/" element={<Page />} /> */}
        {/* <Route path="/message" element={<SuccessPage />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
