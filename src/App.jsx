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

<footer className="site-footer">

<div className="container footer-content">

<p>
Esta mobilização é uma iniciativa do <strong>mandato da Vereadora Iza Lourença</strong>,
da Câmara Municipal de Belo Horizonte.
</p>

<p className="footer-copy">
© {new Date().getFullYear()} Minas contra o feminicídio
</p>

</div>

</footer>

</BrowserRouter>

)

}

export default App