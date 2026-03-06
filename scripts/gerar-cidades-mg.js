import fs from "fs"

async function gerar(){

const res = await fetch(
"https://servicodados.ibge.gov.br/api/v1/localidades/estados/31/municipios"
)

const data = await res.json()

const cidades = data.map((c,i)=>({
id: i + 1,
nome: c.nome
}))

fs.writeFileSync(
"./cidadesMG.json",
JSON.stringify(cidades, null, 2)
)

console.log("JSON de cidades de MG criado com sucesso.")

}

gerar()