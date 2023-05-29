const dgram = require('dgram');
const pcmUtil = require('pcm-util');
const fs = require('fs');

const host = '192.168.1.96'; // Remplacez par l'adresse IP de votre module ESP32
const port = 12345; // Port utilisé pour la communication UDP

const socket = dgram.createSocket('udp4');

// Lire le fichier audio ou obtenir l'échantillon audio d'une autre source
// par exemple, à l'aide d'un microphone USB ou d'une source audio externe
// Dans cet exemple, nous allons utiliser un fichier audio au format WAV

const filePath = 'sounds/inuit.wav';

// Fonction pour envoyer les données audio via UDP
function sendAudioData(data) {
  const buffer = Buffer.from(data);

  socket.send(buffer, 0, buffer.length, port, host, (err) => {
    if (err) {
      console.error('Erreur lors de l\'envoi des données audio :', err);
    }
  });
}

// Fonction pour lire le fichier audio et envoyer les échantillons par UDP
function sendAudioFile() {
  const audioData = pcmUtil.convert(fs.readFileSync(filePath), { format: pcmUtil.FMT_S16_LE });
  
  // Envoyer les échantillons audio en tranches (paquets) pour éviter les délais excessifs
  const packetSize = 1024; // Taille du paquet en octets
  let offset = 0;
  
  while (offset < audioData.byteLength) {
    console.error("wtf", audioData, audioData.byteLength);
    const chunk = audioData.slice(offset, offset + packetSize);
    sendAudioData(chunk);

    offset += packetSize;
  }
}



// Démarrer l'envoi du fichier audio
sendAudioFile();