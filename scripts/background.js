var euro, dolar;

window.Currencies = (function() {

  var currencies = [];
  var tables = ['a', 'b', 'c'];

  var loadCurrencies = function() {
    // Getting tables from NBP api
    Promise.all(tables.map(table =>
      fetch(`http://api.nbp.pl/api/exchangerates/tables/${table}`).then(responses => responses.json())
    )).then(data => {
      // Getting currencies from [{rates: [...]}]
      data.map(table => {
        // Pushing everything to one array
        currencies.push(...table[0].rates);
      })
    })
  }

  var getCurrencies = () => currencies;

  var compareCurrencies = function(mainCurrency, secondaryCurrency) {
    // Comparing second currency to first one
    return mainCurrency / secondaryCurrency;
  }

  loadCurrencies();

  return {
    get: getCurrencies,
    compare: compareCurrencies
  }

})();
