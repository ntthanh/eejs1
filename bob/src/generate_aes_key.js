(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var generateAESKey = function() {
    return webCrypto.generateKey(
    {
        name: "AES-CBC",
        length: 256, //can be  128, 192, or 256
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );
  };

  var exportAESKey = function(key)  {
      webCrypto.exportKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        key
      ).then(function(jwk) {
        //console.log('public jwk', jwk);
        var $csrTextArea = $('textarea[name="csr"]');
        $csrTextArea.val(jwk.k);
      }).catch(function(err) { alert(arguments); });
  }

    var onSubmit = function(evt) {
    evt.preventDefault();

    generateAESKey()
    .then(exportAESKey);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
