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
      });

      // Removing renewals //TODO improve
      currencies = new Set(currencies);
      currencies = [...currencies];

      // if everything's fine, enclose PLN currency aswell and sort them :)
      if (currencies.length > 0) {

        currencies.push({
          currency: 'polski złoty',
          code: 'PLN',
          mid: 1
        });

        currencies = sortArrayBy(currencies, 'currency');
        currencies = removeRenewals(currencies);
        console.log(currencies);
      }
    });
  };

  var removeRenewals = function(array) {
    // If next element has got the same currency code that means renewal, so skip element
    return array.filter((el, index) => {
      if (index == array.length - 1)
        return el;
      if (el.code != array[index + 1].code)
        return el;
    });
  };


  // Gets char index in alphabet
  var alphabetIndex = function(name, index) {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    // If name variable isn't string return -1 (did not found)
    if (typeof name[index] != 'string')
      return -1;
    // Else
    return alphabet.indexOf(name[index].toLowerCase());
  };

  var sortArrayBy = function(array, prop) {

    // Sort numbers ascending
    let compareNumbers = function(a, b) {
      return a[prop] - b[prop];
    };

    // Sort strings alphabetical
    let compareStrings = function(a, b) {
      // Current checking letter index
      let comparingIndex = 0;
      // Infinite Loop
      do {
        if (alphabetIndex(a[prop], comparingIndex) < alphabetIndex(b[prop], comparingIndex)) {
          // swap
          return -1;
        } else if (alphabetIndex(a[prop], comparingIndex) > alphabetIndex(b[prop], comparingIndex)) {
          // no swap
          return 1;
          // If it's the last char
        } else if (comparingIndex == a[prop].length) {
          return -1;
        } else if (comparingIndex == b[prop].length) {
          return 1;
        } else {
          comparingIndex++;
        }
      } while (true);
    };

    if (typeof array[0][prop] == 'string')
      return array.sort(compareStrings);
    else
      return array.sort(compareNumbers);

  };

  // Simple getter
  var getCurrencies = () => currencies;

  var compareCurrencies = function(mainCurrency, secondaryCurrency) {
    // Comparing second currency to first one
    return mainCurrency / secondaryCurrency;
  };

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
  };

})();
