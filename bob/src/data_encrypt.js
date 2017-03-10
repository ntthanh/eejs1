(function() {
  'use strict';

  var webCrypto = crypto.subtle;

  var encryptAESKey = function(importedKey, data, defaultIV)  {
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
              return window.crypto.subtle.encrypt
              (
                {
                    name: "AES-CBC",
                    //Don't re-use initialization vectors!
                    //Always generate a new iv every time your encrypt!
                    iv: defaultIV,
                },
                key, //from generateKey or importKey above
                data //ArrayBuffer of data you want to encrypt
              )
              .then
              (
                  function(encrypted){
                    //returns an ArrayBuffer containing the encrypted data
                    //return encrypted;

                    var $csrTextArea = $('textarea[name="csr"]');
                    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
                    $csrTextArea.val(base64String);
                  }
              ); 
          }
        );
  }

  function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

  var defaultIV = new Uint8Array([0,1,2,3,4,5,6,7,8,9,1,1,1,1,1,1]).buffer;
  var onSubmit = function(evt) {
      evt.preventDefault();
      var $key = $('textarea[name="key"]');
      var aaKey = $key.val();

      var $data = $('textarea[name="data"]');
      var data = str2ab($data.val());
      var encryptedData = encryptAESKey(aaKey, data, defaultIV);
  };

  // set up form submission handler
  $(function() {
    $("form").submit(onSubmit);
  });

})();
