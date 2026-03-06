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
const [emailErro,setEmailErro] = useState("")

const [cidadeBusca,setCidadeBusca]=useState("")
const [cidadesFiltradas,setCidadesFiltradas]=useState([])
const [fuse,setFuse]=useState(null)
const [cidadeErro,setCidadeErro] = useState("")


useEffect(()=>{

async function carregarAssinaturas(){

try{

const res = await fetch(
"https://script.google.com/macros/s/AKfycbz-bf8QgHbKJwUa9nYXvcWDjvuuVfGNvy_1AvZRnpvmneSfj9RT5XvS-C4T0wh4-xbc/exec"
)

const data = await res.json()

setAssinaturas(data.assinaturas)

}catch(err){

console.log("Erro ao carregar contador")

}

}

carregarAssinaturas()

},[])


// CARREGAR CIDADES

useEffect(()=>{

const fuseInstance = new Fuse(cidadesMGJSON,{
keys:["nome"],
threshold:0.3,
ignoreLocation:true
})

setFuse(fuseInstance)

},[])


// BUSCA

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



useEffect(()=>{

const fecharSugestoes = (e) => {

if(!e.target.closest(".cidade-field")){
setCidadesFiltradas([])
}

}

document.addEventListener("click",fecharSugestoes)

return () => {
document.removeEventListener("click",fecharSugestoes)
}

},[])


// MASCARA TELEFONE

const formatPhone = (value) => {

value = value.replace(/\D/g,"").slice(0,11)

if(value.length <= 2) return value

if(value.length <= 6){
return `(${value.slice(0,2)}) ${value.slice(2)}`
}

if(value.length <= 10){
return `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`
}

return `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`
}



// MASCARA CPF

const formatCPF=(value)=>{

value = value.replace(/\D/g,"")

value=value.replace(/(\d{3})(\d)/,"$1.$2")
value=value.replace(/(\d{3})(\d)/,"$1.$2")
value=value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

return value.slice(0,14)

}



// VALIDADOR CPF

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


//Validar cidade
const validarCidadeMG = (cidade) => {

if(!cidade) return false

return cidadesMGJSON.some(c =>
c.nome.toLowerCase() === cidade.toLowerCase()
)

}



// TELEFONE

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



// EMAIL

const validarEmail = (email) => {

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

return regex.test(email)

}



// SUBMIT

const handleSubmit = async (e) => {

e.preventDefault()

const cpfNumeros = form.cpf.replace(/\D/g,"")

if(cpfNumeros.length !== 11 || !validarCPF(form.cpf)){
alert("CPF inválido")
return
}

if(!validarTelefoneBR(form.whatsapp)){
alert("Telefone inválido")
return
}

if(!validarCidadeMG(form.cidade)){
alert("Selecione uma cidade válida de Minas Gerais.")
return
}

if(!form.lgpd){
alert("Você precisa aceitar a política de privacidade.")
return
}

const formURL =
"https://docs.google.com/forms/d/e/1FAIpQLScn46xJuZuka4P4UnEQjKhQuz3r1vPCoTa06XtuhbMTkiPhhw/formResponse"

const data = new FormData()

const [year,month,day] = form.nascimento.split("-")

data.append("entry.841108454",form.nome)
data.append("entry.1979888784",form.cpf)
data.append("entry.2078748064_year",year)
data.append("entry.2078748064_month",month)
data.append("entry.2078748064_day",day)
data.append("entry.1963593262",form.whatsapp)
data.append("entry.1835698599",form.email)
data.append("entry.1434357970",form.cidade)
data.append("entry.1477377412","Aceito política de privacidade")

await fetch(formURL,{
method:"POST",
mode:"no-cors",
body:data
})

setForm({
nome:"",
cpf:"",
nascimento:"",
whatsapp:"",
email:"",
cidade:"",
lgpd:false
})

setCidadeBusca("")
setCidadesFiltradas([])

if(window.confirm("✅ Assinatura registrada com sucesso!\n\nDeseja compartilhar este abaixo-assinado no WhatsApp?")){
shareWhatsApp()
}

}



// SHARE

const shareWhatsApp = () => {

const url = encodeURIComponent("https://seusite.com")

const text = encodeURIComponent("Assine este abaixo-assinado contra o feminicídio em Minas Gerais.")

window.open(`https://wa.me/?text=${text}%20${url}`,"_blank")

}



// RENDER

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

<button className="cta whatsapp glow" onClick={shareWhatsApp}>
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
onChange={(e)=>setForm({...form,nome:e.target.value})}
required
/>



<input
name="cpf"
placeholder="CPF"
value={form.cpf}
inputMode="numeric"
autoComplete="off"
onChange={(e)=>{

const masked = formatCPF(e.target.value)

setForm({...form,cpf:masked})

const numero = masked.replace(/\D/g,"")

if(numero.length>0 && numero.length<11){
setCpfErro("CPF incompleto")
return
}

if(numero.length===11){

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

{cpfErro && <p className="erro-cpf">{cpfErro}</p>}


<label className="date-label">
<span className="date-icon">📅</span>
Data de nascimento
</label>
<input
type="date"
name="nascimento"
value={form.nascimento}
onChange={(e)=>setForm({...form,nascimento:e.target.value})}
required
/>



<input
name="whatsapp"
placeholder="WhatsApp"
value={form.whatsapp}
inputMode="numeric"
autoComplete="tel"
onChange={(e)=>{

const masked=formatPhone(e.target.value)

setForm({...form,whatsapp:masked})

const numero = masked.replace(/\D/g,"")

if(numero.length>0 && numero.length<10){
setTelefoneErro("Telefone incompleto")
return
}

if(numero.length===10 || numero.length===11){

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

{telefoneErro && <p className="erro-cpf">{telefoneErro}</p>}



<input
type="email"
name="email"
placeholder="E-mail"
value={form.email}
autoComplete="email"
onInput={(e)=>{

const value = e.target.value

setForm({...form,email:value})

if(value.length > 3){

if(!validarEmail(value)){
setEmailErro("E-mail inválido")
}else{
setEmailErro("")
}

}else{
setEmailErro("")
}

}}
required
/>

{emailErro && <p className="erro-cpf">{emailErro}</p>}




<div className="cidade-field">

<input
placeholder="Cidade (MG)"
value={cidadeBusca}
autoComplete="off"
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>{

const value = e.target.value

setCidadeBusca(value)

setForm({
...form,
cidade:value
})

if(value.length > 2){

const existe = cidadesMGJSON.some(c =>
c.nome.toLowerCase() === value.toLowerCase()
)

if(!existe){
setCidadeErro("Selecione uma cidade válida de Minas Gerais")
}else{
setCidadeErro("")
}

}else{
setCidadeErro("")
}

}}
required
/>

{cidadeErro && (
<p className="erro-cpf">{cidadeErro}</p>
)}

{cidadesFiltradas.length > 0 && (

<div
className="cidade-sugestoes"
onClick={(e)=>e.stopPropagation()}
>

{cidadesFiltradas.map((cidade)=>(

<div
key={cidade.id}
className="cidade-item"
onClick={()=>{

setForm({
...form,
cidade:cidade.nome
})

setCidadeBusca(cidade.nome)
setCidadeErro("")
setCidadesFiltradas([])

}}
>

{cidade.nome} - MG

</div>

))}

</div>

)}

</div>



<label className="lgpd">

<input
type="checkbox"
name="lgpd"
checked={form.lgpd}
onChange={(e)=>setForm({...form,lgpd:e.target.checked})}
/>

<span>
Eu concordo com o uso dos meus dados conforme a{" "}
<span className="privacy-link" onClick={()=>setShowPrivacy(true)}>
política de privacidade
</span>
</span>

</label>



<button type="submit" className="glow">
Assinar abaixo-assinado
</button>

<button type="button" className="whatsapp-share glow" onClick={shareWhatsApp}>
Compartilhar no WhatsApp
</button>

</form>

</div>

</div>

</section>



{showPrivacy && (

<div className="modal-overlay" onClick={()=>setShowPrivacy(false)}>

<div className="modal" onClick={(e)=>e.stopPropagation()}>

<button className="close" onClick={()=>setShowPrivacy(false)}>✕</button>

<h2>Política de Privacidade</h2>

<p>
Este abaixo-assinado é uma iniciativa do
<strong> Gabinete da Vereadora Iza Lourença — Câmara Municipal de Belo Horizonte.</strong>
</p>

</div>

</div>

)}

</div>

)

}

export default App