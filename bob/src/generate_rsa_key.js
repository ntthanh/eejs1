(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var generateKeyPair = function() {
    return webCrypto.generateKey(
      {
          name: "RSA-OAEP",
          modulusLength: 2048, //can be 1024, 2048, or 4096
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    );
}

  var exportKeyPair = function(key)  {
      var promises = [
      // public key extraction
      webCrypto.exportKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        key.publicKey //can be a publicKey or privateKey, as long as extractable was true
      ).then(function(jwk) {
        console.log('public jwk', jwk);
        //return KEYUTIL.getPEM(KEYUTIL.getKey(jwk));
        var $csrTextArea = $('textarea[name="csr"]');
        $csrTextArea.val(JSON.stringify(jwk));
     
    }).catch(function(err) { alert(arguments); }),
      // private key extraction
      webCrypto.exportKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        key.privateKey //can be a publicKey or privateKey, as long as extractable was true
      ).then(function(jwk) {
        //console.log('private jwk util', KEYUTIL.getKey(jwk));
        //return KEYUTIL.getKey(jwk);
        console.log('private jwk util', jwk);
        var $keyTextArea = $('textarea[name="private-key"]');
        $keyTextArea.val(JSON.stringify(jwk));  
      })
    ];
  }

    var onSubmit = function(evt) {
    evt.preventDefault();
    generateKeyPair().then(exportKeyPair);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
