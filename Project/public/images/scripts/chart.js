const Chart = require('chart.js');

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {}
};

const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, config);