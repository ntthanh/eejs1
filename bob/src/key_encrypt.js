(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var encryptKey2Exchange = function(importedKey, data)  {
    return window.crypto.subtle.importKey(
        "jwk", //can be "jwk" or "raw"
        importedKey,
        {   //this is the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-1"}, 
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      ).then
      (
          function(key) 
          {
            alert('BB');
              return window.crypto.subtle.encrypt
              (
                {
                    name: "RSA-OAEP",
                    hash: {name: "SHA-1"}, 
                    //Don't re-use initialization vectors!
                    //Always generate a new iv every time your encrypt!
                },
                key, //from generateKey or importKey above
                data //ArrayBuffer of data you want to encrypt
              )
              .then
              (
                  function(encrypted){
                    //returns an ArrayBuffer containing the encrypted data
                    var $csrTextArea = $('textarea[name="csr"]');
                    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
                    $csrTextArea.val(base64String);
                  }
              ); 
          }
        );
  }

  var $key = $('textarea[name="key"]');

  function str2ab(str) {
      var buf = new ArrayBuffer(str.length); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
    }
      return buf;
    }

  var onSubmit = function(evt) {
      evt.preventDefault();
      var data = str2ab($key.val());
      var aaKey = jQuery.parseJSON($('textarea[name="public_key"]').val());
      var encryptedData = encryptKey2Exchange(aaKey, data);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
