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
    console.log(resultCategoria)
    var ctx = document.getElementById("myChartDateTrabalho").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultCategoria.map(({ date }) => date),
            datasets: [
              {
                label: 'Sentimento para categoria trabalho',
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
    getOnlyNewsFromCategory(newsResult, 'sem categoria'));
    console.log(resultCategoria)
    var ctx = document.getElementById("myChartDateSaude").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultCategoria.map(({ date }) => date),
            datasets: [
              {
                label: 'Sentimento para categoria saude',
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
    let colors = getRandomColors (newsResult.length);

    let resultSemCategoria = getOnlyNewsFromCategory(newsResult, 'economia');

    let arrayMostWords = findWordThatMostAppearsInString(resultSemCategoria[0].text, )
    console.log(arrayMostWords)
    var ctx = document.getElementById("myChartChartPartidosLessSentimentEconomia").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayMostWords.map.keys(),
            datasets: [
              {
                label: 'Sentimento para categoria sem categoria',
                fill: false,
                data: resultSemCategoria.map(({ value }) => value),
                borderColor: colors[0],
                responsive: true,
                maintainAspectRatio: false,
              },
          ]
        },
    });
  }
