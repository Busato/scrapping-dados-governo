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

    let resultCategoria = getDataFromResultSentiment("formatedDate",
    getOnlyNewsFromCategory(newsResult, 'Trabalho'));
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
    console.log(newsResult);
    let colors = getRandomColors (newsResult.length);

    let resultCategoria = getDataFromResultSentiment("formatedDate",
    getOnlyNewsFromCategory(newsResult, 'Saúde'));

    var ctx = document.getElementById("myChartDateSaude").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultCategoria.map(({ date }) => date),
            datasets: [
              {
                label: 'Sentimento para categoria saúde por tempo',
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

    let resultCategoria = getOnlyNewsFromCategory(newsResult, 'Economia');

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

  function renderChartPartidosLessSentimentSegurança (result) {
    let newsResult = result

    let resultCategoria = getOnlyNewsFromCategory(newsResult, 'Segurança');

    let arrayResults = findWordThatMostAppearsInString(resultCategoria, arrayPartidosPoliticos)

    let colors = getRandomColors (arrayResults.length);

    var ctx = document.getElementById("myChartChartPartidosLessSentimentSegurança").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayResults.map(({name}) => name),
            datasets: [
              {
                label: 'Sentimento relacionados a segurança para partidos',
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

  function renderChartSentimentPerMinistros (result) {
    let newsResult = result

    let arrayResults = findSentenceThatMostAppearsInString(newsResult, arrayMinistros)
    console.log(arrayResults);
    let colors = getRandomColors (arrayResults.length);

    var ctx = document.getElementById("myChartSentimentPerMinistros").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayResults.map(({name}) => name),
            datasets: [
              {
                label: 'Sentimento de ministros',
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