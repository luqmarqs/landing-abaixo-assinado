import { useState } from "react"
import "./style.css"

function App(){

const [form,setForm]=useState({
nome:"",
nascimento:"",
whatsapp:"",
email:"",
cidade:"",
lgpd:false
})

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

const data = new FormData()

data.append("entry.XXXX1", form.nome)
data.append("entry.XXXX2", form.nascimento)
data.append("entry.XXXX3", form.whatsapp)
data.append("entry.XXXX4", form.email)
data.append("entry.XXXX5", form.cidade)
data.append("entry.XXXX6", "Aceito a política de privacidade")

await fetch(formURL,{
method:"POST",
mode:"no-cors",
body:data
})

alert("Assinatura registrada!")

setForm({
nome:"",
nascimento:"",
whatsapp:"",
email:"",
cidade:"",
lgpd:false
})

}

return(

<div>

<header className="hero">

<div className="container">

<h1>Assine o abaixo-assinado</h1>

<p>
Defenda esta causa e ajude a mobilizar mais pessoas.
</p>

<a href="#assinar" className="cta">
Quero assinar
</a>

</div>

</header>


<section id="assinar" className="form-section">

<div className="container">

<div className="form-card">

<h2>Assine agora</h2>

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
onChange={handleChange}
required
/>

<input
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

Eu concordo com o uso dos meus dados para fins desta mobilização,
de acordo com a política de privacidade.

</span>

</label>

<button type="submit">
Assinar abaixo-assinado
</button>

</form>

</div>

</div>

</section>

<footer className="footer">
<div className="container">
Mobilização cidadã · 2026
</div>
</footer>

</div>

)

}

export default App