import { Form } from "./components/Form";
import "../styles/globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Result } from "./components/Result";
import { Interview } from "./components/Interview";
import { Toaster } from "sonner";

export function App() {
  return <BrowserRouter>
  <Routes>
  <Route path="/form" element={<Form></Form>}></Route>
  <Route path="/result" element={<Result></Result>}></Route>
  <Route path="/interview" element={<Interview></Interview>}></Route>
 
  </Routes>
  <Toaster position="bottom-left"></Toaster>
  </BrowserRouter>
 
}

export default App;
