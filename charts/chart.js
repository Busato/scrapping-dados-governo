const newsJson = []

function renderChartPerCategory (result) {
    let resultCategory = getDataFromResult ("category", result);
    let colors = getRandomColors (resultCategory.length);

    var ctx = document.getElementById("myChartCategory").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: resultCategory.map(({ category }) => category),
            datasets: [{
                responsive: true,
                maintainAspectRatio: false,
                label: 'Number of news',
                data: resultCategory.map(({ value }) => value),
                backgroundColor: colors,
                borderColor: colors,
            }]
        },
    });
}

function renderChartPerCategorySentiment (result) {
    let resultCategory = getDataFromResultSentiment ("category", result);
    let colors = getRandomColors (resultCategory.length);

    var ctx = document.getElementById("myChartCategorySentiment").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: resultCategory.map(({ category }) => category),
            datasets: [{
                responsive: true,
                maintainAspectRatio: false,
                label: 'Sentiment of news',
                data: resultCategory.map(({ sentiment }) => sentiment),
                backgroundColor: colors,
                borderColor: colors,
            }]
        },
    });
  }
  
  function renderChartSentimentPerDateTrabalho (result) {
    let newsResult = result
    newsResult = sortByDate(newsResult)
    let colors = getRandomColors (newsResult.length);

    let resultCategoria = getDataFromResultSentiment("date", 
    getOnlyNewsFromCategory(newsResult, 'trabalho'));
    var ctx = document.getElementById("myChartDateTrabalho").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultCategoria.map(({ date }) => date),
            datasets: [
              {
                label: 'Sentimento para categoria trabalho por tempo',
                fill: false,
                data: resultCategoria.map(({ sentiment }) => sentiment),
                borderColor: colors[0],
                responsive: true,
                maintainAspectRatio: false,
              },
          ]
        },
    });
  }

  function renderChartSentimentPerDateSaude (result) {
    let newsResult = result
    newsResult = sortByDate(newsResult)
    let colors = getRandomColors (newsResult.length);

    let resultCategoria = getDataFromResultSentiment("date", 
    getOnlyNewsFromCategory(newsResult, 'saude'));
    console.log(resultCategoria)
    var ctx = document.getElementById("myChartDateSaude").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultCategoria.map(({ date }) => date),
            datasets: [
              {
                label: 'Sentimento para categoria saude por tempo',
                fill: false,
                data: resultCategoria.map(({ sentiment }) => sentiment),
                borderColor: colors[0],
                responsive: true,
                maintainAspectRatio: false,
              },
          ]
        },
    });
  }

  function renderChartPartidosLessSentimentEconomia (result) {
    let newsResult = result

    let resultCategoria = getOnlyNewsFromCategory(newsResult, 'economia');

    let arrayResults = findWordThatMostAppearsInString(resultCategoria, arrayPartidosPoliticos)

    let colors = getRandomColors (arrayResults.length);

    var ctx = document.getElementById("myChartChartPartidosLessSentimentEconomia").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayResults.map(({name}) => name),
            datasets: [
              {
                label: 'Sentimento relacionados a economia para partidos',
                fill: false,
                data: arrayResults.map(({sentiment}) => sentiment),
                borderColor: colors,
                backgroundColor: colors,
                responsive: true,
                maintainAspectRatio: false,
              },
          ]
        },
    });
  }

  function renderChartPartidosLessSentimentCultura (result) {
    let newsResult = result

    let resultCategoria = getOnlyNewsFromCategory(newsResult, 'cultura');

    let arrayResults = findWordThatMostAppearsInString(resultCategoria, arrayPartidosPoliticos)

    let colors = getRandomColors (arrayResults.length);

    var ctx = document.getElementById("myChartChartPartidosLessSentimentCultura").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayResults.map(({name}) => name),
            datasets: [
              {
                label: 'Sentimento relacionados a cultura para partidos',
                fill: false,
                data: arrayResults.map(({sentiment}) => sentiment),
                borderColor: colors,
                backgroundColor: colors,
                responsive: true,
                maintainAspectRatio: false,
              },
          ]
        },
    });
  }
