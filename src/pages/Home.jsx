import { useState, useEffect } from "react"
import Fuse from "fuse.js"
import cidadesMGJSON from "../data/cidadesMG.json"
import cidadesBR from "../data/cidadesBR.json"
import { track } from "@vercel/analytics"
import ModalPortal from "../components/ModalPortal"

function Home(){

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
const [ufs,setUfs] = useState([])
const [cidades,setCidades] = useState([])

const normalizar = (texto) =>
texto
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.toLowerCase()


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

//CARREGAR UF

useEffect(()=>{

fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
.then(res => res.json())
.then(data => setUfs(data))

},[])

useEffect(()=>{

setCidadeBusca("")
setForm({...form, cidade:""})

},[form.uf])


// CARREGAR CIDADES DA UF

useEffect(()=>{

if(!form.uf){
setCidades([])
setFuse(null)
return
}

const cidadesFiltradasUF = cidadesBR.filter(
cidade => cidade.uf === form.uf
)

/* cria campo normalizado */

const cidadesPreparadas = cidadesFiltradasUF.map(c => ({
...c,
nomeBusca: normalizar(c.nome)
}))

setCidades(cidadesPreparadas)

const fuseInstance = new Fuse(cidadesPreparadas,{
keys:["nomeBusca"],
threshold:0.3,
ignoreLocation:true
})

setFuse(fuseInstance)

},[form.uf])


// BUSCA

useEffect(()=>{

if(!fuse || cidadeBusca.length < 2){
setCidadesFiltradas([])
return
}

const termo = normalizar(cidadeBusca)

const resultado = fuse
.search(termo)
.slice(0,6)
.map(r => r.item)

/* se já selecionado não mostrar lista */

if(
resultado.length === 1 &&
normalizar(resultado[0].nome) === termo
){
setCidadesFiltradas([])
return
}

setCidadesFiltradas(resultado)

},[cidadeBusca,fuse])


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
const validarCidade = (cidade) => {

if(!cidade) return false

const termo = normalizar(cidade)

return cidades.some(c =>
normalizar(c.nome) === termo
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

if(!validarCidade(form.cidade)){
alert("Selecione uma cidade válida.")
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
data.append("entry.1397297655", form.uf)
data.append("entry.1434357970",form.cidade)
data.append("entry.1477377412","Aceito política de privacidade")

await fetch(formURL,{
method:"POST",
mode:"no-cors",
body:data
})

track("assinatura_enviada")

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

track("share_whatsapp")

const url = encodeURIComponent("https://minascontraofeminicidio.org/")
const text = encodeURIComponent("Pressione o governo de Minas Gerais a assinar o Pacto Nacional de prevenção ao feminicídio")

window.open(`https://wa.me/?text=${text}%20${url}`,"_blank")

}



// RENDER

return(

<div>

<header
className="hero"
style={{
backgroundImage:"url('/CAPA - bandeirada.webp')"
}}
>

<div className="container hero-content fade">

<h1>MINAS CONTRA O FEMINICÍDIO</h1>

<p className="subtitle">
Minas Gerais é o segundo estado com mais feminicídios no país. <br/>
Mesmo assim, o governo estadual ainda não assinou o <strong>Pacto Nacional de Prevenção aos Feminicídios.</strong><br/>
Pressione agora para que MG integre essa rede. 
</p>

<div className="hero-actions">

{/* 
<p className="counter">
<strong>{`${assinaturas} pessoas já assinaram`}</strong>
</p>
*/}

<a
href="#assinar"
className="cta glow"
onClick={() => track("click_assinar")}
>
Assine já!
</a>

<button className="cta whatsapp glow" onClick={shareWhatsApp}>
Compartilhar no WhatsApp
</button>

</div>

</div>

</header>


<section className="info-section pacto">

<div className="container">

<div className="info-grid">

<img src="/punho.webp" className="info-icon"/>

<div>

<section class="content-page">

<div class="container">

<h2>O que é o Pacto Nacional de Prevenção aos Feminicídios</h2>

<p>
O <strong>Pacto Nacional de Prevenção aos Feminicídios</strong> é uma iniciativa do governo federal que reúne os três poderes federais, estados e municípios para fortalecer políticas públicas de prevenção, proteção e responsabilização nos casos de violência contra mulheres.
</p>

<p>
O pacto prevê ações integradas entre segurança pública, justiça, assistência social e políticas para mulheres, garantindo atendimento mais rápido às vítimas, proteção às mulheres em risco e responsabilização dos agressores.
</p>

<p>
Ao aderir ao pacto, os estados assumem compromissos concretos para ampliar a rede de proteção, melhorar o atendimento às vítimas e implementar políticas de prevenção à violência de gênero.
</p>

</div>

</section>

</div>

</div>

</div>

</section>



<section className="info-section minas">

<div className="container">

<div className="info-grid">

<div>

<h2>Qual é a situação das mulheres em Minas Gerais?</h2>

<p>
Minas Gerais é o segundo estado com mais feminicídios do Brasil, com números crescentes ao longo dos últimos anos. Mulheres são assassinadas pela opressão de gênero, muitas vezes após ciclos prolongados de violência doméstica, ameaças e agressões.
</p>

<p>
Apesar da gravidade do problema, o governo de Minas Gerais ainda não implementou políticas realmente efetivas capazes de mudar essa realidade. O estado também não aderiu formalmente ao <strong>Pacto Nacional de Prevenção aos Feminicídios</strong>, o que limita a integração com políticas federais e o acesso a recursos e programas específicos de proteção às mulheres.
</p>

<p>
A adesão ao pacto pode fortalecer a rede de enfrentamento à violência, ampliar políticas de prevenção e contribuir para salvar vidas. Este abaixo-assinado cobra do governador <strong>Romeu Zema</strong> um compromisso concreto com a proteção das mulheres mineiras.
</p>

</div>

<img src="/calado.webp" className="info-icon"/>

</div>

</div>

</section>



<section id="assinar" className="form-section">

<div className="container">

<div className="form-card">

<h2>Junte-se a esse movimento</h2>

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


<select
value={form.uf}
onChange={(e)=>setForm({...form,uf:e.target.value})}
required
>

<option value="">Estado</option>

{ufs.map((uf)=>(
<option key={uf.id} value={uf.sigla}>
{uf.nome}
</option>
))}

</select>


<div className="cidade-field">

<input
placeholder="Cidade"
value={cidadeBusca}
autoComplete="off"

onClick={(e)=>e.stopPropagation()}

onBlur={()=>setTimeout(()=>setCidadesFiltradas([]),150)}

onChange={(e)=>{

const value = e.target.value

setCidadeBusca(value)

setForm({
...form,
cidade:value
})

if(value.length > 2){

const existe = cidades.some(c =>
normalizar(c.nome) === normalizar(value)
)

if(!existe){
setCidadeErro("Selecione uma cidade válida")
}else{
setCidadeErro("")
setCidadesFiltradas([])
}

}else{
setCidadeErro("")
}

}}

onKeyDown={(e)=>{
if(e.key === "Enter"){
setCidadesFiltradas([])
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

{cidadesFiltradas.map((cidade,index)=>(

<div
key={cidade.id || cidade.nome || index}
className="cidade-item"

onMouseDown={()=>{

/* usa onMouseDown para evitar bug de blur */

setForm({
...form,
cidade:cidade.nome
})

setCidadeBusca(cidade.nome)

setCidadeErro("")

setCidadesFiltradas([])

}}
>

{cidade.nome}

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
Assine
</button>

<button type="button" className="whatsapp-share glow" onClick={shareWhatsApp}>
Compartilhar no WhatsApp
</button>

</form>

</div>

</div>

</section>



{showPrivacy && (

<ModalPortal>

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
Este abaixo-assinado é uma iniciativa do <strong>mandato da Vereadora Iza Lourença,
da Câmara Municipal de Belo Horizonte</strong>, voltada à mobilização da sociedade
civil pela adesão do Estado de Minas Gerais ao
<strong> Pacto Nacional de Enfrentamento ao Feminicídio</strong>.
</p>

<p>
Os dados coletados neste formulário — como nome, CPF, data de nascimento,
cidade, telefone e e-mail — têm como única finalidade validar e contabilizar
as assinaturas do abaixo-assinado e demonstrar apoio público à iniciativa.
</p>

<p>
As informações fornecidas não serão comercializadas nem compartilhadas
com terceiros para fins comerciais. O tratamento dos dados ocorre de acordo
com os princípios da <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>.
</p>

<p>
O mandato da Vereadora Iza Lourença é o responsável institucional pela
iniciativa e pelo tratamento dos dados coletados nesta página, comprometendo-se
a utilizá-los exclusivamente para fins relacionados à mobilização e
encaminhamento institucional do abaixo-assinado.
</p>

<p>
Ao prosseguir com a assinatura, você declara estar ciente e de acordo com
o uso dessas informações para os fins descritos acima.
</p>

</div>

</div>

</ModalPortal>

)}

</div>

)

}

export default Home