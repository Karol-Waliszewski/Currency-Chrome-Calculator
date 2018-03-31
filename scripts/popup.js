const Background = chrome.extension.getBackgroundPage();
const {
  console,
  Currencies
} = Background;

// Error catching on popup.js (otherwise errors won't show up :/)
window.onerror = function(message, file, line, col, error) {
  console.error(message, "from", error.stack);
};

const Module = (function() {

  // DOM ($ mean DOM element)
  var $mainCurrency = document.getElementById('mainCurrency'),
    $secondaryCurrency = document.getElementById('secondaryCurrency'),
    $mainCurrencyInput = document.getElementById('mainCurrencyInput'),
    $secondaryCurrencyResult = document.getElementById('secondaryCurrencyResult'),
    $swapButton = document.getElementById('swap');

  var currencies = [];

  var importCurrencies = function() {
    // Fetched currencies
    currencies = Currencies.get();
    // HTML string
    let options = '';
    for (let currency of currencies) {
      options += `<option value=${currency.mid}>${currency.currency} (${currency.code})</option>`;
    }
    $mainCurrency.innerHTML = options;
    $secondaryCurrency.innerHTML = options;
  };

  var findCurrencyByCode = function(code) {
    if (currencies.length < 1)
      return -1;
    else {
      let codes = currencies.map(el => el.code);
      return currencies[codes.indexOf(code)];
    }
  };

  var setDefaultCurrencies = function() {
    // Getting default currencies from options.
    // If there is no defaults they'll be USD and EUR
    chrome.storage.sync.get({
      primary: 'USD',
      secondary: 'EUR'
    }, function(defaults) {
      // Getting currencies
      let primaryCurrency = findCurrencyByCode(defaults.primary);
      let secondaryCurrency = findCurrencyByCode(defaults.secondary);
      // Setting defaults
      $mainCurrency.value = primaryCurrency.mid;
      $secondaryCurrency.value = secondaryCurrency.mid;
    });
  };

  var swap = function() {
    // Currencies swapping
    let currencyStorage = $mainCurrency.value;
    $mainCurrency.value = $secondaryCurrency.value;
    $secondaryCurrency.value = currencyStorage;

    // Values swapping
    let valueStorage = $mainCurrencyInput.value;
    $mainCurrencyInput.value = $secondaryCurrencyResult.value;
    $secondaryCurrencyResult.value = valueStorage;
  };

  var convert = function() {
    let mainCurrency = $mainCurrency.value;
    let secondaryCurrency = $secondaryCurrency.value;
    let mainCurrencyValue = $mainCurrencyInput.value;
    // Rounding result to 2 decimal places and then
    $secondaryCurrencyResult.value = (Currencies.compare(mainCurrency, secondaryCurrency) * mainCurrencyValue).toFixed(2);
  };

  // On Popup show function
  var init = function() {
    // Initials
    importCurrencies();
    setDefaultCurrencies();
    //Listeners
    $swapButton.addEventListener('click', swap);
    $mainCurrency.addEventListener('change', convert);
    $secondaryCurrency.addEventListener('change', convert);
    $mainCurrencyInput.addEventListener('input', convert);
    $mainCurrencyInput.addEventListener('change', function() {
      // Always shows 2 decimals (estetic :))
      $mainCurrencyInput.value = Number($mainCurrencyInput.value).toFixed(2);
    });
    // Last but not least
    setTimeout(convert, 20);
  }();

})();
