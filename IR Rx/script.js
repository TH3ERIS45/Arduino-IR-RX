let receivedData = [];
let buffer = ""; 
const displayElement = document.getElementById('received-data');
const connectButton = document.getElementById('connect-serial');


async function connectToSerial() {
  try {
    const port = await navigator.serial.requestPort(); 
    await port.open({ baudRate: 9600 }); 

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    connectButton.disabled = true; 
    displayElement.innerText = "Nenhum dado recebido.";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break; 
      
      buffer += value; // Adiciona os dados recebidos ao buffer
      
      if (buffer.includes("\n")) {
        const lines = buffer.split("\n"); 
        buffer = lines.pop(); 
        
        lines.forEach(line => {
          const cleanedData = line.trim(); 
          if (cleanedData) {
            receivedData.push(cleanedData); 
            displayElement.innerText = `Recebidos: ${receivedData.join(', ')}`;
          }
        });
      }
    }
  } catch (err) {
    alert('Erro ao conectar ao dispositivo: ' + err.message);
  }
}

document.getElementById('save-pdf').addEventListener('click', () => {
  if (receivedData.length === 0) {
    alert('Nenhum dado recebido para salvar.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  doc.text("Dados recebidos:", 10, 10); 
  let y = 20;

  
  receivedData.forEach((data, index) => {
    doc.text(`${index + 1}: ${data}`, 10, y);
    y += 10; 
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save('dados_recebidos.pdf');
});

connectButton.addEventListener('click', connectToSerial);
