const Background = chrome.extension.getBackgroundPage();
const {
  console,
  Currencies
} = Background

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

  var importCurrencies = function() {
    // Fetched currencies
    let currencies = Currencies.get();
    // HTML string
    let options = '';
    for (let currency of currencies) {
      options += `<option value=${currency.mid}>${currency.currency} (${currency.code})</option>`
    }
    $mainCurrency.innerHTML = options;
    $secondaryCurrency.innerHTML = options;
  }

  var setDefaultCurrencies = function() {
    $mainCurrency.value = Currencies.get()[2].mid; // USD
    $secondaryCurrency.value = Currencies.get()[7].mid; // EUR
  }

  var swap = function() {
    // Currencies swapping
    let currencyStorage = $mainCurrency.value;
    $mainCurrency.value = $secondaryCurrency.value;
    $secondaryCurrency.value = currencyStorage;

    // Values swapping
    let valueStorage = $mainCurrencyInput.value
    $mainCurrencyInput.value = $secondaryCurrencyResult.value;
    $secondaryCurrencyResult.value = valueStorage;
  }

  var convert = function() {
    let mainCurrency = $mainCurrency.value;
    let secondaryCurrency = $secondaryCurrency.value;
    let mainCurrencyValue = $mainCurrencyInput.value;
    // Rounding result to 2 decimal places and then
    $secondaryCurrencyResult.value = (Currencies.compare(mainCurrency, secondaryCurrency) * mainCurrencyValue).toFixed(2);
  }

  // On Popup show function
  var init = function() {
    // Initials
    importCurrencies();
    setDefaultCurrencies();
    //Listeners
    $swapButton.addEventListener('click', swap);
    $mainCurrency.addEventListener('change', convert);
    $secondaryCurrency.addEventListener('change', convert);
    $mainCurrencyInput.addEventListener('input', function() {
      // Main Event
      convert();
      // Always shows 2 decimals (estetic :))
      $mainCurrencyInput.value = Number($mainCurrencyInput.value).toFixed(2);
    });
    // Last but not least
    convert();
  }

  init();

})();
