(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var decryptAESKey = function(importedKey, data, defaultIV)  {
    return window.crypto.subtle.importKey(
        "jwk", //can be "jwk" or "raw"
        {   //this is an example jwk key, "raw" would be an ArrayBuffer
            kty: "oct",
            k: importedKey,
            alg: "A256CBC",
            ext: true,
        },
        {   //this is the algorithm options
            name: "AES-CBC",
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      ).then
      (
          function(key) 
          {
              console.log(key);
              
              window.crypto.subtle.decrypt
              (
                {
                    name: "AES-CBC",
                    iv: defaultIV, //The initialization vector you used to encrypt
                },
                key, //from generateKey or importKey above
                data
              )
              .then
              (
                  function(decrypted){
                    //returns an ArrayBuffer containing the encrypted data
                    var $csrTextArea = $('textarea[name="csr"]');
                    var dataString = ab2str(decrypted);
                    $csrTextArea.val(dataString);
                  }
              ); 
          }
        );
  }

  var defaultIV = new Uint8Array([0,1,2,3,4,5,6,7,8,9,1,1,1,1,1,1]).buffer;
  

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

  var onSubmit = function(evt) {

      evt.preventDefault();


      var $key = $('textarea[name="key"]');
      var aaKey = $key.val();

      var $data = $('textarea[name="data"]');
      var data = Uint8Array.from(atob($data.val()), c => c.charCodeAt(0));
      decryptAESKey(aaKey, data, defaultIV);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
