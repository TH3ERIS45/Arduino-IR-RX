let receivedData = [];
let buffer = ""; // Buffer para armazenar dados temporários
const displayElement = document.getElementById('received-data');
const connectButton = document.getElementById('connect-serial');

// Função para conectar ao dispositivo serial
async function connectToSerial() {
  try {
    const port = await navigator.serial.requestPort(); // Solicita acesso ao dispositivo serial
    await port.open({ baudRate: 9600 }); // Define a taxa de transmissão

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    connectButton.disabled = true; // Desativa o botão de conexão após sucesso
    displayElement.innerText = "Nenhum dado recebido.";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break; // Conexão encerrada
      
      buffer += value; // Adiciona os dados recebidos ao buffer
      
      // Verifica se há um delimitador de fim de dado, como '\n' ou '\r\n'
      if (buffer.includes("\n")) {
        const lines = buffer.split("\n"); // Divide os dados por linhas
        buffer = lines.pop(); // Mantém o que sobrou no buffer
        
        lines.forEach(line => {
          const cleanedData = line.trim(); // Remove espaços extras
          if (cleanedData) {
            receivedData.push(cleanedData); // Armazena o dado completo
            displayElement.innerText = `Recebidos: ${receivedData.join(', ')}`;
          }
        });
      }
    }
  } catch (err) {
    alert('Erro ao conectar ao dispositivo: ' + err.message);
  }
}

// Função para salvar os dados em PDF
document.getElementById('save-pdf').addEventListener('click', () => {
  if (receivedData.length === 0) {
    alert('Nenhum dado recebido para salvar.');
    return;
  }

  // Criar um PDF usando jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  doc.text("Dados recebidos:", 10, 10); // Título
  let y = 20; // Posição inicial

  // Adicionar cada dado recebido em uma nova linha
  receivedData.forEach((data, index) => {
    doc.text(`${index + 1}: ${data}`, 10, y);
    y += 10; // Incrementa a posição vertical
    if (y > 280) {
      doc.addPage(); // Adiciona nova página, se necessário
      y = 10;
    }
  });

  // Salvar o PDF
  doc.save('dados_recebidos.pdf');
});

// Evento para conectar ao dispositivo ao clicar no botão
connectButton.addEventListener('click', connectToSerial);