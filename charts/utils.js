const arrayPartidosPoliticos = 
[
    'MDB', 'PT', 'PSDB', 'PP', 'PP', 'PDT', 'PTB', 'DEM',
    'PL', 'PSB', 'PSC', 'PCdoB', 'PV', 'PSD', 'PSL', 'PMN',
    'PTC', 'DC', 'PODE', 'PSOL', 'PRTB', 'PROS', 'PMB', 'NOVO',
    'REDE', 'PSTU', 'PCB', 'PCO',
]

const arrayMinistros = 
[
    'Tereza Cristina', 'Osmar Terra', 'Marcos Pontes', 'Fernando Azevedo e Silva', 'Gustavo Canuto',
    'Paulo Guedes', 'Abraham Weintraub', 'Tarcísio Gomes de Freitas',
    'Sérgio Moro', 'Ricardo Salles', 'Bento Albuquerque', 'Damares Alves',
    'Ernesto Araújo', 'Luiz Henrique Mandetta', 'Marcelo Álvaro Antônio', 'Wagner Rosário',
    'Luiz Eduardo Ramos', 'Jorge Oliveira', 'André Luiz de Almeida Mendonça',
    'Roberto Campos Neto', 'Onyx Lorenzoni', 'Augusto Heleno',
]

const getDataFromResult = (dataName, result) => {
    let arrayResults = []
    
    result.forEach(currentNews => {
      let attributeFound = arrayResults.find((element)=>{
        return element && element[dataName] === currentNews[dataName]
      })

      if (typeof attributeFound === 'undefined') {
        let currentObj = {}
        currentObj[dataName] = currentNews[dataName]
        currentObj.value =  1
        arrayResults.push(currentObj)
      } else {
        arrayResults = arrayResults.map((element)=>{
          if (element && element[dataName] === currentNews[dataName]) {
            element.value += 1
          }
          return element
        })
      }
    });
    return arrayResults
}

const getOnlyNewsFromCategory = (results, categoryName) => {
    let resultsFiltered = results.filter((currentNews)=> { 
      return currentNews.category === categoryName
    })
    return resultsFiltered
}

const getDataFromResultSentiment = (dataName, result) => {
    let arrayResults = []
    result.forEach(currentNews => {
      let attributeFound = arrayResults.find((element)=>{
        return element && element[dataName] === currentNews[dataName]
      })

      if (typeof attributeFound === 'undefined') {
        let currentObj = {}
        currentObj[dataName] = currentNews[dataName]
        currentObj.sentiment =  currentNews.sentiment
        currentObj.date =  currentNews.date
        arrayResults.push(currentObj)
      } else {
        arrayResults = arrayResults.map((element)=>{
          if (element && element[dataName] === currentNews[dataName]) {
            element.sentiment += currentNews.sentiment
          }
          return element
        })
      }
    });
    return arrayResults
}

const getRandomColors = (howManyColors) => {
    let arrayOfColors = []
    for (let index = 0; index < howManyColors; index++) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);

      arrayOfColors.push("rgb(" + r + "," + g + "," + b + ")")
    }
    return arrayOfColors;   
}

const sortByDate = (result) => {  
    return result.sort((a,b) => new Date(a.formatedDate) - new Date(b.formatedDate));
};

const findWordThatMostAppearsInString = (arrayResults, arrayOfWords) => {
  let wordCounts = []

  arrayResults.forEach(result => {
    if (!result.text || result.text === '') return

    let arrayString = result.text.split(/\s+/);

    arrayString.forEach(word => {
      arrayOfWords.forEach(wordToMatch => {
        if (wordToMatch === word) {
          let attributeFound = wordCounts.find((element)=>{
            return element && element.name === wordToMatch
          })

          if (typeof attributeFound === 'undefined') {
            let currentObj = {}
            currentObj.name =  word
            currentObj.sentiment =  result.sentiment
            wordCounts.push(currentObj)
          } else {
            wordCounts = wordCounts.map((element)=>{
                if (element && element.name === wordToMatch) {
                  element.sentiment += result.sentiment
                }
                return element
              })
          }
        } 
      });
    });
  });
    return wordCounts
}

const findSentenceThatMostAppearsInString = (arrayResults, arrayOfWords) => {
  let wordCounts = []

  arrayResults.forEach(result => {
    if (!result.text || result.text === '') return

    arrayOfWords.forEach(wordToMatch => {
      let regexp = new RegExp(wordToMatch, "g")
      let arrayString = result.text.match(regexp);
        if (arrayString && arrayString.length > 0) {
          let attributeFound = wordCounts.find((element)=>{
            return element && element.name === wordToMatch
          })

          if (typeof attributeFound === 'undefined') {
            let currentObj = {}
            currentObj.name =  wordToMatch
            currentObj.sentiment =  arrayString.length*result.sentiment
            wordCounts.push(currentObj)
          } else {
            wordCounts = wordCounts.map((element)=>{
                if (element && element.name === wordToMatch) {
                  element.sentiment += arrayString.length*result.sentiment
                }
                return element
              })
          }
        } 
    });
  });
    return wordCounts
}
const clickHandler = function(e) {
    e.preventDefault()
    $('.btn').css('display', 'none');
    $('.spinner-border').css('display', '');
      $.ajax({
        url: "http://localhost:3000/analize",
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        crossDomain: true,
        success: function(result){
          $('.spinner-border').css('display', 'none');
        },
        error: function (req, status, error) {
          alert(error)
          $('#failure-message').css('display', '');
          console.log(error)
        }
    })
  }

  $('.btn').one('click', clickHandler);

  const clickHandlerGraph = function(e) {
    e.preventDefault()
      $.ajax({
        url: "http://localhost:3000/news",
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        crossDomain: true,
        success: function(result){
          $('.spinner-border').css('display', 'none');
          renderChartPerCategory(result);
          renderChartPerCategorySentiment(result);
          renderChartSentimentPerDateTrabalho(result);
          renderChartSentimentPerDateSaude(result);
          renderChartPartidosLessSentimentEconomia(result)
          renderChartPartidosLessSentimentSegurança(result)
          renderChartSentimentPerMinistros(result)
        },
        error: function (req, status, error) {
          alert(error)
          $('#failure-message').css('display', '');
          console.log(error)
        }
    })
  }

  $('.btn-graph').one('click', clickHandlerGraph);

