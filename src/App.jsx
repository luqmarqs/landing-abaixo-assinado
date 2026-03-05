import { useState, useEffect } from "react"
import InstagramVideo from "./InstagramVideo"

function App(){

const [form,setForm]=useState({
nome:"",
nascimento:"",
whatsapp:"",
email:"",
cidade:"",
lgpd:false
})

const [showPrivacy,setShowPrivacy]=useState(false)
const [assinaturas,setAssinaturas]=useState(0)

/* CONTADOR DE ASSINATURAS */

useEffect(()=>{

fetch("https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json")
.then(res=>res.text())
.then(data=>{

const json = JSON.parse(data.substring(47).slice(0,-2))
const rows = json.table.rows.length

setAssinaturas(rows)

})
.catch(()=>setAssinaturas(0))

},[])

/* MASCARA WHATSAPP */

const formatPhone=(value)=>{

value=value.replace(/\D/g,"")
value=value.replace(/^(\d{2})(\d)/g,"($1) $2")
value=value.replace(/(\d{5})(\d)/,"$1-$2")

return value.slice(0,15)

}

const handleChange=(e)=>{

const {name,value,type,checked}=e.target

setForm({
...form,
[name]: type==="checkbox" ? checked : value
})

}

const handleSubmit=async(e)=>{

e.preventDefault()

if(!form.lgpd){
alert("Você precisa aceitar a política de privacidade.")
return
}

const formURL =
"https://docs.google.com/forms/d/e/1FAIpQLScn46xJuZuka4P4UnEQjKhQuz3r1vPCoTa06XtuhbMTkiPhhw/formResponse"

const data=new FormData()

data.append("entry.XXXX1",form.nome)
data.append("entry.XXXX2",form.nascimento)
data.append("entry.XXXX3",form.whatsapp)
data.append("entry.XXXX4",form.email)
data.append("entry.XXXX5",form.cidade)
data.append("entry.XXXX6","Aceito política de privacidade")

await fetch(formURL,{
method:"POST",
mode:"no-cors",
body:data
})

alert("Assinatura registrada!")

}

return(

<div>

<header className="hero">

<div className="container hero-content fade">

<h1>Minas precisa agir contra o feminicídio</h1>

<p className="subtitle">
Minas Gerais é o segundo estado com mais feminicídios no Brasil.
Exigimos que o governo estadual assine o
<strong> Pacto Nacional de Enfrentamento ao Feminicídio.</strong>
</p>

<p className="counter">
<strong>{assinaturas}</strong> pessoas já assinaram
</p>

<a href="#assinar" className="cta glow">
Assinar abaixo-assinado
</a>

</div>

</header>


<section className="video-section">

<div className="container">

<h2>Por que essa mobilização é urgente?</h2>

<InstagramVideo/>

</div>

</section>


<section id="assinar" className="form-section">

<div className="container">

<div className="form-card">

<h2>Junte-se ao abaixo-assinado</h2>

<p>
Esta mobilização é uma iniciativa do
<strong> Gabinete da Vereadora Iza Lourença
(Câmara Municipal de Belo Horizonte)</strong>.
</p>

<form onSubmit={handleSubmit}>

<input
name="nome"
placeholder="Nome completo"
value={form.nome}
onChange={handleChange}
required
/>

<input
type="date"
name="nascimento"
value={form.nascimento}
onChange={handleChange}
required
/>

<input
name="whatsapp"
placeholder="WhatsApp"
value={form.whatsapp}
onChange={(e)=>{

const masked=formatPhone(e.target.value)
setForm({...form,whatsapp:masked})

}}
required
/>

<input
type="email"
name="email"
placeholder="E-mail"
value={form.email}
onChange={handleChange}
required
/>

<input
name="cidade"
placeholder="Cidade"
value={form.cidade}
onChange={handleChange}
required
/>

<label className="lgpd">

<input
type="checkbox"
name="lgpd"
checked={form.lgpd}
onChange={handleChange}
/>

<span>
Eu concordo com o uso dos meus dados conforme a{" "}
<span
className="privacy-link"
onClick={()=>setShowPrivacy(true)}
>
política de privacidade
</span>
</span>

</label>

<button type="submit" className="glow">
Assinar abaixo-assinado
</button>

</form>

</div>

</div>

</section>


<footer className="footer">

<div className="container footer-content">

<p>
Iniciativa do <strong>Gabinete da Vereadora Iza Lourença</strong>
</p>

<p>
Câmara Municipal de Belo Horizonte
</p>

</div>

</footer>


{/* MODAL */}

{showPrivacy && (

<div
className="modal-overlay"
onClick={()=>setShowPrivacy(false)}
>

<div
className="modal"
onClick={(e)=>e.stopPropagation()}
>

<button
className="close"
onClick={()=>setShowPrivacy(false)}
>
✕
</button>

<h2>Política de Privacidade</h2>

<p>
Este abaixo-assinado é uma iniciativa do
<strong> Gabinete da Vereadora Iza Lourença
— Câmara Municipal de Belo Horizonte.</strong>
</p>

<h3>Objetivo</h3>

<p>
Mobilizar a sociedade para pressionar o Governo de Minas Gerais
a aderir ao Pacto Nacional de Enfrentamento ao Feminicídio.
</p>

<h3>Dados coletados</h3>

<ul>
<li>Nome completo</li>
<li>Data de nascimento</li>
<li>WhatsApp</li>
<li>E-mail</li>
<li>Cidade</li>
</ul>

<h3>Contato</h3>

<p>contato-temporario@exemplo.com</p>

</div>

</div>

)}

</div>

)

}

export default App