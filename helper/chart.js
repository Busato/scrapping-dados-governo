function renderChart (data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'This week',
                data: data,
            }]
        },
    });
}

function getSentimentFromData (data) {
    let arraySentiments = []
    if (data && data.news && data.news[0]) {
        data.news[0].forEach(element => {
            arraySentiments.push(element.sentiment)
        });
    }
    console.log(arraySentiments)
    return arraySentiments
}

$('.btn').on('click', function() {
    $('.spinner-border').css('display', '');

    $.ajax({
      url: "http://localhost:3000/analize",
      contentType: "application/json",
      dataType: 'json',
      success: function(result){
          $('.spinner-border').css('display', 'none');
          console.log(result)
          renderChart(getSentimentFromData(result), labels =  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]);
      }
    })
});
