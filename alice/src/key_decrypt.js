(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var decryptKey2Exchange = function(importedKey, data)  {
    return window.crypto.subtle.importKey(
        "jwk", //can be "jwk" or "raw"
        importedKey,
        {   //this is the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-1"}, 
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      ).then
      (
          function(key) 
          {
              console.log(key);
              
              window.crypto.subtle.decrypt
              (
                {
                    name: "RSA-OAEP",
                    hash: {name: "SHA-1"}, 
                },
                key, //from generateKey or importKey above
                data
              )
              .then
              (
                  function(decrypted){
                    //returns an ArrayBuffer containing the encrypted data
                    var $csrTextArea = $('textarea[name="csr"]');
                    var keyString = ab2str(decrypted);
                    $csrTextArea.val(keyString);
                  }
              ); 
          }
        );
  }

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
  var onSubmit = function(evt) {
      evt.preventDefault();
      var aaKey = jQuery.parseJSON($('textarea[name="private_key"]').val());
      var data = Uint8Array.from(atob($('textarea[name="encrypted_key"]').val()), c => c.charCodeAt(0))
      decryptKey2Exchange(aaKey, data);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
