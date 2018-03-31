const {
  Currencies
} = chrome.extension.getBackgroundPage();

const Options = (function() {

  // DOM
  $primaryDefaults = document.getElementById('primaryDefault');
  $secondaryDefaults = document.getElementById('secondaryDefault');

  // Functions

  var importCurrencies = function () {
    // Fetched currencies
    let currencies = Currencies.get();
    // HTML string
    let options = '';
    for (let currency of currencies) {
      options += `<option value=${currency.code}>${currency.currency} (${currency.code})</option>`;
    }
    $primaryDefaults.innerHTML = options;
    $secondaryDefaults.innerHTML = options;
  };

  var getDefaults = function() {
    chrome.storage.sync.get({
      primary: 'USD',
      secondary: 'EUR'
    }, function(values) {
      $primaryDefaults.value = values.primary;
      $secondaryDefaults.value = values.secondary;
    });
  };

  var setDefaults = function() {
    chrome.storage.sync.set({
      primary: $primaryDefaults.value,
      secondary: $secondaryDefaults.value
    });
  };

  var init = function() {
    importCurrencies();
    getDefaults();
    // Listeners
    $primaryDefaults.addEventListener('change', setDefaults);
    $secondaryDefaults.addEventListener('change', setDefaults);
  }();

})();
