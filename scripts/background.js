window.Currencies = (function() {

  var currencies = [];
  var tables = ['a', 'b', 'c'];

  var loadCurrencies = function() {
    console.log(
      'LOAD'
    )
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

  // Simple getter
  var getCurrencies = () => currencies;

  var compareCurrencies = function(mainCurrency, secondaryCurrency) {
    // Comparing second currency to first one
    return mainCurrency / secondaryCurrency;
  }

  var init = function() {
    // Loop (every 10 seconds)
    setInterval(function() {
      // if currencies are not loaded, load them.
      if (currencies.length < 1)
        loadCurrencies();
      // If currencies are already loaded, clear interval.
      else
        clearInterval(this);
    }, 1000 * 10);
  }();

  return {
    get: getCurrencies,
    compare: compareCurrencies
  }

})();
