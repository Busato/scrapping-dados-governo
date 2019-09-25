const arrayFilteredWords = 
[ 
    'governo',
    'bolsonaro',
    'guedes',
    'politica',
    'congresso',
    'ministro',
    'stf',
    'presidente'
]

module.exports = {
    verifiyGovernmentNews: (arrayLinks) => {
        let arraLinksFiltered = []

        arrayLinks.map(currentLink => {
            arrayFilteredWords.map(filteredWord => {
                if (currentLink.includes(filteredWord)) {
                    arraLinksFiltered.push(currentLink)
                }
            })       
        })

        return arraLinksFiltered
    }
}