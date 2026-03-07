import fs from "fs/promises"

const URL_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"

async function gerarJSON(){

const estados = await fetch(URL_ESTADOS).then(r=>r.json())

const resultado = []

for(const estado of estados){

console.log("baixando",estado.sigla)

const cidades = await fetch(
`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
).then(r=>r.json())

for(const cidade of cidades){

resultado.push({
id:cidade.id,
nome:cidade.nome,
uf:estado.sigla
})

}

}

await fs.writeFile(
"./src/data/cidadesBR.json",
JSON.stringify(resultado,null,2)
)

console.log("JSON gerado com",resultado.length,"cidades")

}

gerarJSON()