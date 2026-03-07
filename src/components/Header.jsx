import { useState } from "react"
import { Link } from "react-router-dom"

function Header(){

const [open,setOpen] = useState(false)

return(

<header className="site-header">

<div className="header-container">

<Link to="/" className="logo">

<img
src="/bandeira 1.webp"
alt="Símbolo da campanha"
className="logo-icon"
/>

<span className="logo-text">
Minas contra o feminicídio
</span>

</Link>

<button
className="menu-button"
onClick={()=>setOpen(!open)}
>
☰
</button>

</div>

{open && (

<nav className="mobile-menu">

<Link to="/" onClick={()=>setOpen(false)}>
Abaixo-assinado
</Link>

<Link to="/o-que-e-feminicidio" onClick={()=>setOpen(false)}>
O que é feminicídio?
</Link>

<Link to="/pacto-contra-o-feminicidio" onClick={()=>setOpen(false)}>
O que é o pacto contra o feminicídio? 
</Link>

<Link to="/denunciar-violencia" onClick={()=>setOpen(false)}>
Denuncie a violência!
</Link>

</nav>

)}

</header>

)

}

export default Header