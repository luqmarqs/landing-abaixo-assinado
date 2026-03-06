import { useState, useEffect } from "react"
import InstagramVideo from "./InstagramVideo"
import Fuse from "fuse.js"
import cidadesMGJSON from "./data/cidadesMG.json"

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
const [telefoneErro,setTelefoneErro]=useState("")

const [cidadesMG,setCidadesMG]=useState([])
const [cidadeBusca,setCidadeBusca]=useState("")
const [cidadesFiltradas,setCidadesFiltradas]=useState([])
const [fuse,setFuse]=useState(null)

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

/* CARREGAR CIDADES */

useEffect(()=>{

setCidadesMG(cidadesMGJSON)

const fuseInstance = new Fuse(cidadesMGJSON,{
keys:["nome"],
threshold:0.3,
ignoreLocation:true
})

setFuse(fuseInstance)

},[])

/* BUSCA CIDADES */

useEffect(()=>{

if(!fuse || cidadeBusca.length < 2){
setCidadesFiltradas([])
return
}

const resultado = fuse
.search(cidadeBusca)
.slice(0,6)
.map(r => r.item)

setCidadesFiltradas(resultado)

},[cidadeBusca,fuse])

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

const validarTelefoneBR = (telefone) => {

const numero = telefone.replace(/\D/g,"")

if(numero.length !== 10 && numero.length !== 11) return false
if(/^(\d)\1+$/.test(numero)) return false

const ddd = parseInt(numero.substring(0,2))

if(ddd < 11 || ddd > 99) return false

if(numero.length === 11 && numero[2] !== "9") return false

if(numero.length === 10){
const primeiro = parseInt(numero[2])
if(primeiro < 2 || primeiro > 5) return false
}

return true

}

const handleChange=(e)=>{

const {name,value,type,checked}=e.target

setForm({
...form,
[name]: type==="checkbox" ? checked : value
})

}

const handleSubmit = async (e) => {

e.preventDefault()

if(!validarCPF(form.cpf)){
alert("CPF inválido")
return
}

if(!validarTelefoneBR(form.whatsapp)){
alert("Telefone inválido")
return
}

if(!form.lgpd){
alert("Você precisa aceitar a política de privacidade.")
return
}

const formURL =
"https://docs.google.com/forms/d/e/1FAIpQLScn46xJuZuka4P4UnEQjKhQuz3r1vPCoTa06XtuhbMTkiPhhw/formResponse"

const data = new FormData()

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

<div className="hero-actions">

<p className="counter">
<strong>{`${assinaturas} pessoas já assinaram`}</strong>
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

<div className="date-field">

<label className="date-label">
<span className="date-icon">📅</span>
Data de nascimento
</label>

<input
type="date"
name="nascimento"
value={form.nascimento}
onChange={handleChange}
required
/>

</div>

<input
name="whatsapp"
placeholder="WhatsApp"
value={form.whatsapp}
onChange={(e)=>{

const masked = formatPhone(e.target.value)

setForm({...form,whatsapp:masked})

const numero = masked.replace(/\D/g,"")

if(numero.length >= 10){

if(!validarTelefoneBR(masked)){
setTelefoneErro("Telefone inválido")
}else{
setTelefoneErro("")
}

}else{
setTelefoneErro("")
}

}}
required
/>

{telefoneErro && (
<p className="erro-cpf">{telefoneErro}</p>
)}

<input
type="email"
name="email"
placeholder="E-mail"
value={form.email}
onChange={handleChange}
required
/>

<input
placeholder="Cidade (MG)"
value={cidadeBusca}
onChange={(e)=>{

const value = e.target.value

setCidadeBusca(value)

setForm({
...form,
cidade:value
})

}}
required
/>

{cidadesFiltradas.length > 0 && (

<div className="cidade-sugestoes">

{cidadesFiltradas.map((cidade)=>(
<div
key={cidade.id}
className="cidade-item"
onClick={()=>{

setForm({...form,cidade:cidade.nome})
setCidadeBusca(cidade.nome)
setCidadesFiltradas([])

}}
>

{cidade.nome} - MG

</div>
))}

</div>

)}

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
<li>CPF</li>
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