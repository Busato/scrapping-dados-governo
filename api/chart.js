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