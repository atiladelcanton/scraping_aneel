const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");
const { Parser } = require("json2csv");
let dados = [];
async function extracao(site) {
  const html = await request.get(site);
  const $ = await cheerio.load(html);

  const padraoTabelaDados =
    "body > table > tbody > tr:nth-child(4) > td > table:nth-child(4) > tbody >";
  for (i = 2; i < 1003; i++) {
    let distribuidora = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(1)`
    )
      .text()
      .trim();
    let codigo = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(2)`)
      .text()
      .trim();
    let titular = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(3)`)
      .text()
      .trim();
    let classe = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(4)`)
      .text()
      .trim();
    let subgrupo = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(5)`
    )
      .text()
      .trim();
    let modalidade = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(6)`
    )
      .text()
      .trim();
    let qtd_ucs = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(7)`)
      .text()
      .trim();
    let municipio = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(8)`
    )
      .text()
      .trim();
    let uf = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(9)`)
      .text()
      .trim();
    let cep = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(10)`)
      .text()
      .trim();
    let data_conexao = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(11)`
    )
      .text()
      .trim();
    let fonte = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(12)`)
      .text()
      .trim();
    let kw = $(`${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(13)`)
      .text()
      .trim();
    let qtd_modulos = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(14)`
    )
      .text()
      .trim();
    let qtd_inversores = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(15)`
    )
      .text()
      .trim();
    let area_arranjo = $(
      `${padraoTabelaDados} tr:nth-child(${i}) > td:nth-child(16)`
    )
      .text()
      .trim();
    dados.push({
      distribuidora,
      codigo,
      titular,
      classe,
      subgrupo,
      modalidade,
      qtd_ucs,
      municipio,
      uf,
      cep,
      data_conexao,
      fonte,
      kw,
      qtd_modulos,
      qtd_inversores,
      area_arranjo
    });

    const parser = new Parser();
    const csv = parser.parse(dados);
    console.log(dados);
    fs.writeFileSync("./dados-aneel.csv", csv, "utf-8");
    await demora();
  }
}

async function demora() {
  await sleep(1000);
  await console.log(`Passando 1 Segundo...`);
}

async function sleep(ml) {
  return new Promise(resolve => setTimeout(resolve, ml));
}
let count = 0;
async function extraitodas(site) {
  const html = await request.get(site);
  const $ = await cheerio.load(html);
  let paginas = $(
    "body > table > tbody > tr:nth-child(4) > td > table:nth-child(4) > tbody > tr:nth-child(1) > td"
  )
    .text()
    .slice(0, -9)
    .trim()
    .split("   ").length;

  while (count <= paginas) {
    const urlsFilhos = `http://www2.aneel.gov.br/scg/gd/gd_fonte_detalhe.asp?tipo=12&pagina=${count}`;
    extracao(urlsFilhos);
    count++;
  }
}

extraitodas("http://www2.aneel.gov.br/scg/gd/gd_fonte_detalhe.asp?tipo=12");
