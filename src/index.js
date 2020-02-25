const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs')
const { Parser } = require('json2csv')

let data = []
let count = 0
const defaultDataTable =
	'body > table > tbody > tr:nth-child(4) > td > table:nth-child(4) > tbody >'

function prepareData($, index, position) {
	return $(
		`${defaultDataTable} tr:nth-child(${index}) > td:nth-child(${position})`
	)
		.text()
		.trim()
}

async function delay() {
	await sleep(1000)
	console.log(`Passando 1 Segundo...`)
}

async function sleep(ml) {
	setTimeout(() => {
		return Promise.resolve()
	}, ml)
}

async function extraction(site) {
	const html = await request.get(site)
	const $ = await cheerio.load(html)

	for (i = 2; i < 1003; i++) {
		const objData = {
			distribuidora: prepareData($, i, 1),
			codigo: prepareData($, i, 2),
			titular: prepareData($, i, 3),
			classe: prepareData($, i, 4),
			subgrupo: prepareData($, i, 5),
			modalidade: prepareData($, i, 6),
			qtd_ucs: prepareData($, i, 7),
			municipio: prepareData($, i, 8),
			uf: prepareData($, i, 9),
			cep: prepareData($, i, 10),
			data_conexao: prepareData($, i, 11),
			fonte: prepareData($, i, 12),
			kw: prepareData($, i, 13),
			qtd_modulos: prepareData($, i, 14),
			qtd_inversores: prepareData($, i, 15),
			area_arranjo: prepareData($, i, 16)
		}

		data.push(objData)

		const parser = new Parser()
		const csv = parser.parse(data)
		console.log(data)
		fs.writeFileSync('./dados-aneel.csv', csv, 'utf-8')
		await delay()
	}
}

async function extraitodas(site) {
	const html = await request.get(site)
	const $ = await cheerio.load(html)

	let paginas = $(
		'body > table > tbody > tr:nth-child(4) > td > table:nth-child(4) > tbody > tr:nth-child(1) > td'
	)
		.text()
		.slice(0, -9)
		.trim()
		.split('   ').length

	while (count <= paginas) {
		const urlsFilhos = `http://www2.aneel.gov.br/scg/gd/gd_fonte_detalhe.asp?tipo=12&pagina=${count}`
		extraction(urlsFilhos)
		count++
	}
}

extraitodas('http://www2.aneel.gov.br/scg/gd/gd_fonte_detalhe.asp?tipo=12')
