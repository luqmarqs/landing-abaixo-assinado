import { useState, useEffect } from "react"
import InstagramVideo from "./InstagramVideo"

function App(){

const [form,setForm]=useState({
nome:"",
cpf:"",
nascimento:"",
whatsapp:"",
email:"",
cidade:"",
lgpd:false
})

const [cpfErro,setCpfErro]=useState("")
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

/* MASCARA CPF */

const formatCPF=(value)=>{

value=value.replace(/\D/g,"")
value=value.replace(/(\d{3})(\d)/,"$1.$2")
value=value.replace(/(\d{3})(\d)/,"$1.$2")
value=value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

return value.slice(0,14)

}

/* VALIDADOR CPF */

const validarCPF = (cpf) => {

cpf = cpf.replace(/\D/g, "")

if (cpf.length !== 11) return false
if (/^(\d)\1+$/.test(cpf)) return false

let soma = 0
let resto

for (let i = 1; i <= 9; i++)
soma += parseInt(cpf.substring(i-1, i)) * (11 - i)

resto = (soma * 10) % 11

if (resto === 10 || resto === 11)
resto = 0

if (resto !== parseInt(cpf.substring(9, 10)))
return false

soma = 0

for (let i = 1; i <= 10; i++)
soma += parseInt(cpf.substring(i-1, i)) * (12 - i)

resto = (soma * 10) % 11

if (resto === 10 || resto === 11)
resto = 0

if (resto !== parseInt(cpf.substring(10, 11)))
return false

return true

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

if(cpfErro){
alert("CPF inválido")
return
}

if(!form.lgpd){
alert("Você precisa aceitar a política de privacidade.")
return
}

const formURL =
"https://docs.google.com/forms/d/e/1FAIpQLScn46xJuZuka4P4UnEQjKhQuz3r1vPCoTa06XtuhbMTkiPhhw/formResponse"

const data=new FormData()

data.append("entry.XXXX1",form.nome)
data.append("entry.XXXXCPF",form.cpf)
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

const shareWhatsApp = () => {

const url = encodeURIComponent("https://seusite.com")
const text = encodeURIComponent("Assine este abaixo-assinado contra o feminicídio em Minas Gerais.")

window.open(`https://wa.me/?text=${text}%20${url}`,"_blank")

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

<button
className="cta whatsapp glow"
onClick={shareWhatsApp}
>
Compartilhar no WhatsApp
</button>

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

<form onSubmit={handleSubmit}>

<input
name="nome"
placeholder="Nome completo"
value={form.nome}
onChange={handleChange}
required
/>

<input
name="cpf"
placeholder="CPF"
value={form.cpf}
onChange={(e)=>{

const masked = formatCPF(e.target.value)

setForm({...form, cpf: masked})

if(masked.length === 14){

if(!validarCPF(masked)){
setCpfErro("CPF inválido")
}else{
setCpfErro("")
}

}else{
setCpfErro("")
}

}}
required
/>

{cpfErro && (
<p className="erro-cpf">{cpfErro}</p>
)}

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

<button
type="button"
className="whatsapp-share glow"
onClick={shareWhatsApp}
>
Compartilhar no WhatsApp
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

</div>

)

}

export default App