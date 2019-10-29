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

const arrayCategoriesFilteredWords = 
[ 
    'educação',
    'saúde',
    'segurança',
    'economia',
    'cultura',
    'trabalho',
    'meio ambiente',
]

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

    appendNewsToJson: arrayOfNews => {
        fs.readFile('news.json', function (err, data) {
            let json = []
            if (data.length > 0) {
                json = JSON.parse(data)
                json.push(arrayOfNews)
            }
            
            fs.writeFile('news.json', JSON.stringify(json, null, 2), (err) => {
                if (err) console.error(err)
                console.log('News data written to file \n')
            })
        })        
    },

    writeSiteLog: url => {
        fs.appendFile('site-log.txt', `Visited: ${url} \n`, (err) => {
          if (err) console.error(err)
        })
    },
    
    getCategoryFromText: text => {
        let arrayCategories = []
        arrayCategoriesFilteredWords.forEach(category => {
            let count = (text.match(new RegExp(category, "g")) || []).length;
            arrayCategories.push({ category, count})
        });

        let res = Math.max.apply(Math, arrayCategories.map((element) => { return element.count; }))

        let obj = arrayCategories.find(function(o){ return o.count == res; })

        return (obj.count !== 0) ? obj.category : "sem categoria" 
    },
    arrayCategoriesFilteredWords
}
