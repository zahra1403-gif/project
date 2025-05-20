import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BarcodeGenerator = () => {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [barcodeFormat, setBarcodeFormat] = useState('EAN13');
  const [quantity, setQuantity] = useState(1);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const barcodeContainerRef = useRef(null);

  const validateBarcode = (value: string, format: string) => {
    if (!/^\d+$/.test(value)) return false;

    if (format === 'EAN13') return value.length === 13;
    if (format === 'UPC') return value.length === 12;
    return true;
  };

  const generateBarcodes = () => {
    if (!validateBarcode(barcodeValue, barcodeFormat)) {
      alert(`Invalid ${barcodeFormat} code, babe.`);
      return;
    }

    const newBarcodes = Array.from({ length: quantity }, () => barcodeValue);
    setBarcodes(newBarcodes);
  };

  useEffect(() => {
    barcodes.forEach((code, index) => {
      const canvas = document.getElementById(`barcode-${index}`);
      if (canvas) {
        JsBarcode(canvas, code, {
          format: barcodeFormat,
          lineColor: "#000",
          width: 2,
          height: 100,
          displayValue: true,
        });
      }
    });
  }, [barcodes, barcodeFormat]);

  const downloadAsPNG = () => {
    if (!barcodeContainerRef.current) {
      alert('No barcodes to download, dumbass.');
      return;
    }
    html2canvas(barcodeContainerRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'barcodes.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const downloadAsPDF = () => {
    if (!barcodeContainerRef.current) {
      alert('No barcodes to download, dumbass.');
      return;
    }
    html2canvas(barcodeContainerRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('barcodes.pdf');
    });
  };

  const printBarcodes = () => {
    if (!barcodeContainerRef.current) {
      alert('No barcodes to print, dumbass.');
      return;
    }
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('Failed to open print window.');
      return;
    }
    const htmlContent = barcodeContainerRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head><title>Print Barcodes</title></head>
        <body onload="window.print(); window.close();">${htmlContent}</body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyBarcodesToClipboard = () => {
    if (!barcodeContainerRef.current) {
      alert('No barcodes to copy, dumbass.');
      return;
    }
    html2canvas(barcodeContainerRef.current).then(canvas => {
      if (!canvas) {
        alert('Failed to generate canvas.');
        return;
      }
      canvas.toBlob(blob => {
        if (!blob) {
          alert('Failed to copy: no blob.');
          return;
        }
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(() => {
          alert("Barcodes copied to clipboard!");
        }).catch(err => {
          alert("Failed to copy: " + err);
        });
      });
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Barcode Generator</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Barcode Value: </label>
        <input
          value={barcodeValue}
          onChange={(e) => setBarcodeValue(e.target.value)}
          placeholder="e.g., 1234567890123"
        />

        <label style={{ marginLeft: '1rem' }}>Format: </label>
        <select value={barcodeFormat} onChange={(e) => setBarcodeFormat(e.target.value)}>
          <option value="EAN13">EAN-13</option>
          <option value="UPC">UPC-A</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Quantity: </label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setQuantity(val > 0 ? val : 1);
          }}
        />
        
        <button style={{ marginLeft: '1rem' }} onClick={generateBarcodes}>
          Generate
        </button>
      </div>

      {barcodes.length > 0 && (
        <div>
          <div
            ref={barcodeContainerRef}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
          >
            {barcodes.map((code, index) => (
              <canvas key={`${code}-${index}`} id={`barcode-${index}`} />
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={downloadAsPNG}>Download PNG</button>
            <button onClick={downloadAsPDF} style={{ marginLeft: '1rem' }}>
              Download PDF
            </button>
            <button onClick={printBarcodes} style={{ marginLeft: '1rem' }}>
              Print
            </button>
            <button onClick={copyBarcodesToClipboard} style={{ marginLeft: '1rem' }}>
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeGenerator;
