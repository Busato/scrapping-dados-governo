function renderChart (data) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [ 
                'educação',
                'saúde',
                'segurança'
            ],
            datasets: [{
                label: 'Sentiment Analysis',
                data: data,
            }]
        },
    });
}

function getSentimentFromData (data) {
    let arraySentiments = []
    console.log(data)
    // if (data && data.news && data.news[0]) {
      console.log(data.news[0])
        data.news[0].forEach(element => {
          console.log(element)
            arraySentiments.push(element.sentiment)
        });
    //}
    console.log(arraySentiments)
    return arraySentiments
}
