const fs = require('fs')

const arrayFilteredWords = 
[ 
    'governo',
    'jair',
    'bolsonaro',
    'weintraub',
    'guedes',
    'politica',
    'congresso',
    'ministro',
    'ministério',
    'stf',
    'presidente',
    'moro',
    'corrupcao',
    'legislativo',
    'democracia',
    'executivo',
    'judiciario',
]

const dictionary = {
    edu: 'Educação',
    sau: "Saúde",
    seg: 'Segurança',
    eco: 'Economia',
    cul: 'Cultura',
    tur: 'Turismo',
    jus: 'Política e Justiça',
    tra: 'Trabalho',
    amb: 'Meio Ambiente',
    ext: 'Relações Exteriores'
}

const categories = {
    edu: ['educação', 'estudos',"univerisade", "escola", "Weintraub", "MEC", "vestibular", "ENEM", "pesquisa", "pesquisador", 'estudante', 'professor', 'Ministério da Educação'],
    sau: ['saúde', 'SUS', 'Sistema Único de Saúde','medico', 'médicos', 'hospital', 'hospitais', 'clima', 'climática', 'tratamento','Mandetta', 'Ministério da Saúde'],
    seg: ['Segurança', 'segurança', 'polícia', 'militar', 'Polícia Civil', 'Polícia Federal', 'Polícia Militar'],
    eco: ['Economia', 'economia', 'dólar', 'inflação','Guedes', 'investimento', 'investir', 'investidor', 'empreendimento', 'empreender', 'empreendedor', 'empresa', 'imposto'],
    cul: ['Cultura', 'cultura', 'Secretaria de Cultura', 'Ancine'],
    tur: ['Turismo', 'turismo', 'Ministério do Turismo'],
    jus: ['Justiça', 'justiça', 'STF', 'STJ', 'Moro', 'judiciário', 'Judiciário', 'CCJ', 'Lava Jato'],
    tra: ['trabalho', 'funcionario', 'aposentadoria', 'empresa', 'emprego','Previdência', 'FGTS', 'CLT', 'desemprego', 'trabalho informal', 'licença-maternidade', 'seguro desemprego', 'salário', 'carteira assinada'],
    amb: ['Meio Ambiente', 'Agricultura', 'Amazônia','Ibama','aquecimento global', 'Aquecimento Global', 'climáticas', 'óleo', 'Salles', 'Ministério do Meio Ambiente', 'MMA'],
    ext: ['Relações Exteriores', 'América do Sul','Mercosul', 'Bolívia', 'Chile', 'Argentina', 'Uruguai', 'México', 'Equador','Venezuela', 'EUA', 'Estados Unidos', 'Europa', 'China','Ernesto Araújo', 'embaixada', 'diplomata', 'diplomacia']
}

const stopwords = (fs.readFileSync('stopwords.txt')).toString().split('\n');

module.exports = {
    verifiyGovernmentNews: (arrayLinks) => {
        let arraLinksFiltered = []

        arrayLinks.map(currentLink => {
            arrayFilteredWords.map(filteredWord => {
                if (currentLink.match(new RegExp(`\\b${filteredWord}\\b`, "g")) &&
                currentLink.match(new RegExp(`\\b${filteredWord}\\b`, "g")).length > 0) {
                    arraLinksFiltered.push(currentLink)
                }
            })       
        })

        return arraLinksFiltered
    },

    writeSiteLog: url => {
        fs.appendFile('site-log.txt', `Visited: ${url} \n`, (err) => {
          if (err) console.error(err)
        })
    },

    getCategoryFromText: text => {
    let arrayCategories = [];
    for(let c in categories) {
        let category = categories[c];
        let count = 0;
        category.forEach(word => {
            count += (text.match(new RegExp(word, "g")) || []).length;
        });
        arrayCategories.push({ category: dictionary[c], count})
    }

    let res = Math.max.apply(Math, arrayCategories.map((element) => { return element.count; }))

    let obj = arrayCategories.find(function(o){ return o.count == res; })

    return (obj.count !== 0) ? obj.category : "Sem categoria"
    },

    removeStopWords: text => {
        let textFiltered = text
        for(let word of stopwords) {
            let regexp = new RegExp(`\\s${word.trim()}\\s`, "gi")
            if(textFiltered.match(regexp))
                textFiltered = textFiltered.replace(regexp, " ")
        }
        return textFiltered;
    },

    allowCrawl: (url) => {
        let forbidden = [
            'facebook.com',
            'twitter.com',
            'instagram.com',
            'linkedin.com',
            'plus.google.com',
            'pinterest',
            'api.whatsapp',
            'web.whatsapp',
            'whatsapp:',
            'mailto',
            'checkout',
            'server',
            'acesse',
            'assine',
            'assinante',
            'cadastre',
            'login',
            'logout',
            'paywall',
            'send?text',
            'fb-messenger',
            'tools'
        ];

        for (let dont of forbidden) {
            let reg = new RegExp(dont);
            if(reg.test(url))
                return false;
        }
        return true;
    }
}
