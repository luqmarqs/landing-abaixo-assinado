import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Home from "./pages/Home"
import Feminicidio from "./pages/Feminicidio"
import Pacto from "./pages/Pacto"
import Denuncia from "./pages/Denuncie"
import ScrollToTop from "./components/ScrollToTop"

function App(){

return(

<BrowserRouter>

<ScrollToTop/>

<Header/>

<main>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/o-que-e-feminicidio" element={<Feminicidio/>} />

<Route path="/pacto-contra-o-feminicidio" element={<Pacto/>} />

<Route path="/denunciar-violencia" element={<Denuncia/>} />

</Routes>

</main>

</BrowserRouter>

)

}

export default App