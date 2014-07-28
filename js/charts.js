var Charts = (function () {

  return {
    //main function to initiate the module

    init: function () {
      App.addResponsiveHandler(function () {
        Charts.initResultsChart();
      });

    },

    initResultsChart: function (labels, results) {

      if (!jQuery.plot) {
          return;
      }

      /*var series = Math.floor(Math.random() * 10) + 1;
      series = series < 5 ? 5 : series;*/

      /*for (var i=0; i < series; i++) {
        data[i] = {
          label: "Series" + (i + 1),
          data: Math.floor(Math.random() * 100) + 1
        }
      }*/

      var data = [];

      for (var i = 0; i < labels.length; i++) {
        data[i] = {
          label: labels[i],
          data: data[i]
        }
      }

      $.plot($("#resultsChart"), data, {
        series: {
          pie: {
            show: true
          }
        },
        legend: {
          show: false
        }
      });

    }
  };
})();