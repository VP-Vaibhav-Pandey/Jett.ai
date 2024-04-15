// Function to handle file input change
$(document).ready(function() {
    $('#imageInput').on('change', function(e) {
      var file = e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function() {
          var imageSrc = reader.result;
          processImage(imageSrc);
        };
        reader.readAsDataURL(file);
      }
    });
  });
  
  // Function to process the uploaded image
  function processImage(imageSrc) {
    Tesseract.recognize(
      imageSrc,
      'eng',
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      $('#output').text(text);
    });
  }
  
  // Function to translate text using Google Translate API
  function translateText() {
    var originalText = $('#output').text();
    var targetLang = 'es'; // Change this to the desired target language code
  
    // Send a POST request to Google Translate API
    $.ajax({
      url: 'https://translation.googleapis.com/language/translate/v2',
      type: 'POST',
      data: {
        q: originalText,
        target: targetLang,
        key: 'YOUR_GOOGLE_TRANSLATE_API_KEY'
      },
      success: function(response) {
        var translatedText = response.data.translations[0].translatedText;
        $('#output').text(translatedText);
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  }
  