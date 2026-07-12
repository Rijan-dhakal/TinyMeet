import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Homepage from "./pages/Homepage";
import Room from "./pages/Room";
import MainLayout from "./layout/MainLayout";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/room/:id" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
