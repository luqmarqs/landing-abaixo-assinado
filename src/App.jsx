import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Home from "./pages/Home"
import Feminicidio from "./pages/Feminicidio"
import Pacto from "./pages/Pacto"
import Denuncia from "./pages/Denuncie"
import ScrollToTop from "./components/ScrollToTop"
import AnalyticsTracker from "./components/AnalyticsTracker"

function App(){

return(

<BrowserRouter>

<ScrollToTop/>

<AnalyticsTracker/>

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
Esta mobilização é uma iniciativa do
<strong> mandato da Vereadora Iza Lourença</strong>,
da Câmara Municipal de Belo Horizonte.
</p>

<a
href="https://www.instagram.com/izalourenca/"
target="_blank"
rel="noopener noreferrer"
className="footer-instagram"
>
<svg
xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="currentColor"
>
<path d="M7.75 2C4.575 2 2 4.575 2 7.75v8.5C2 19.425 4.575 22 7.75 22h8.5C19.425 22 22 19.425 22 16.25v-8.5C22 4.575 19.425 2 16.25 2h-8.5zm0 2h8.5C18.56 4 20 5.44 20 7.75v8.5C20 18.56 18.56 20 16.25 20h-8.5C5.44 20 4 18.56 4 16.25v-8.5C4 5.44 5.44 4 7.75 4zm9.25 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
</svg>

@izalourenca

</a>

<p className="footer-copy">
© {new Date().getFullYear()} Minas contra o feminicídio
</p>

</div>

</footer>

</BrowserRouter>

)

}

export default App