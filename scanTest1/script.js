
    // Barcode Generator
    const barcodeForm = document.getElementById('barcode-form');
    const barcodeTextInput = document.getElementById('barcode-text');
    const barcodeTypeSelect = document.getElementById('barcode-type');
    const barcodeOutput = document.getElementById('barcode-output');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');

    let svgElement;

    function generateBarcode() {
      const text = barcodeTextInput.value.trim();
      const type = barcodeTypeSelect.value;

      if (!text) {
        barcodeOutput.innerHTML = '';
        return;
      }

      barcodeOutput.innerHTML = '';
      svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgElement.setAttribute('aria-label', 'Generated barcode');
      svgElement.setAttribute('role', 'img');
      svgElement.style.maxWidth = '100%';
      svgElement.style.height = 'auto';

      barcodeOutput.appendChild(svgElement);

      try {
        JsBarcode(svgElement, text, {
          format: type,
          lineColor: "#000",
          width: 2,
          height: 100,
          displayValue: true,
          fontOptions: "bold",
          margin: 10
        });
      } catch (err) {
        barcodeOutput.innerHTML = '<p style="color: #bb1f1f; font-weight: 700;">Error generating barcode: ' + err.message + '</p>';
      }
    }

    generateBtn.addEventListener('click', generateBarcode);

    clearBtn.addEventListener('click', () => {
      barcodeTextInput.value = '';
      barcodeOutput.innerHTML = '';
      barcodeTextInput.focus();
    });

    // Barcode Reader with QuaggaJS
    const video = document.getElementById('scanner-video');
    const videoContainer = document.getElementById('video-container');
    const startScanBtn = document.getElementById('start-scan-btn');
    const stopScanBtn = document.getElementById('stop-scan-btn');
    const scanResult = document.getElementById('scan-result');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const barcodeFileInput = document.getElementById('barcode-file-input');

    let scanning = false;

    function startScanner() {
      if (scanning) return;

      scanResult.textContent = '';
      videoPlaceholder.style.display = 'none';
      video.style.display = 'block';

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoContainer,
            constraints: {
              facingMode: "environment",
              width: { min: 640 },
              height: { min: 480 },
            },
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
              "2of5_reader",
              "code_93_reader",
            ],
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency || 4,
          frequency: 10,
          singleChannel: false,
          multiple: false,
        },
        function (err) {
          if (err) {
            scanResult.textContent = "Error starting scanner: " + err.message;
            videoPlaceholder.style.display = 'flex';
            video.style.display = 'none';
            return;
          }
          Quagga.start();
          scanning = true;
          startScanBtn.style.display = 'none';
          stopScanBtn.style.display = 'inline-flex';
        }
      );

      Quagga.onDetected(onDetectedHandler);
    }

    function stopScanner() {
      if (!scanning) return;
      Quagga.stop();
      Quagga.offDetected(onDetectedHandler);
      scanning = false;
      startScanBtn.style.display = 'inline-flex';
      stopScanBtn.style.display = 'none';
      videoPlaceholder.style.display = 'flex';
      video.style.display = 'none';
    }

    function onDetectedHandler(result) {
      if (result && result.codeResult && result.codeResult.code) {
        scanResult.textContent = 'Detected code: ' + result.codeResult.code;
        // Optionally stop after first detection
        stopScanner();
      }
    }

    startScanBtn.addEventListener('click', () => {
      startScanner();
    });

    stopScanBtn.addEventListener('click', () => {
      stopScanner();
    });

    // Scan from image upload
    barcodeFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      scanResult.textContent = '';
      if (!file) return;

      const img = document.createElement('img');
      img.onload = function() {
        Quagga.decodeSingle(
          {
            src: img.src,
            numOfWorkers: 0,
            inputStream: {
              size: 800,
            },
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader",
                "2of5_reader",
                "code_93_reader",
              ],
            }
          },
          function(result) {
            if (result && result.codeResult) {
              scanResult.textContent = 'Detected code from image: ' + result.codeResult.code;
            } else {
              scanResult.textContent = 'No barcode detected in image.';
            }
          }
        );
      };
      img.onerror = () => {
        scanResult.textContent = 'Failed to load image for scanning.';
      };

      const reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
