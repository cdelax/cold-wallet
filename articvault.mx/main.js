// Registro de Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('Service Worker registrado');
    });
  }
  
  const generateBtn = document.getElementById('generate-wallet');
  const importBtn = document.getElementById('import-wallet');
  const mnemonicInput = document.getElementById('mnemonic');
  const ethAddressSpan = document.getElementById('eth-address');
  const bsvAddressSpan = document.getElementById('bsv-address');
  const qrcodeCanvas = document.getElementById('qrcode');
  
  const signTxBtn = document.getElementById('sign-tx');
  const txDataInput = document.getElementById('tx-data');
  const signedTxOutput = document.getElementById('signed-tx');
  
  let walletEth;
  let walletBsv;
  
  // QR Generation (simple text)
  function generateQR(text) {
    qrcodeCanvas.innerHTML = '';
    const qr = new QRious({
      element: qrcodeCanvas,
      value: text,
      size: 200,
    });
  }
  
  // Generar Wallet Nueva
  generateBtn.addEventListener('click', async () => {
    const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
    mnemonicInput.value = mnemonic;
  
    walletEth = ethers.Wallet.fromMnemonic(mnemonic);
    walletBsv = bsv.HDPrivateKey.fromSeed(mnemonic);
  
    showAddresses(walletEth, walletBsv);
    saveWallet(mnemonic);
  });
  
  // Importar Wallet Existente
  importBtn.addEventListener('click', async () => {
    const mnemonic = mnemonicInput.value.trim();
    if (!mnemonic) {
      alert('Ingrese una passphrase válida.');
      return;
    }
    walletEth = ethers.Wallet.fromMnemonic(mnemonic);
    walletBsv = bsv.HDPrivateKey.fromSeed(mnemonic);
    showAddresses(walletEth, walletBsv);
    saveWallet(mnemonic);
  });
  
  // Mostrar Direcciones
  function showAddresses(walletEth, walletBsv) {
    ethAddressSpan.textContent = walletEth.address;
    bsvAddressSpan.textContent = walletBsv.publicKey.toAddress().toString();
    generateQR(walletEth.address);
  
    document.getElementById('address-section').classList.remove('hidden');
    document.getElementById('sign-section').classList.remove('hidden');
  }
  
  // Guardar Wallet Cifrada
  function saveWallet(mnemonic) {
    const pass = prompt('Crear contraseña para cifrar la wallet:');
    if (pass) {
      const ciphertext = CryptoJS.AES.encrypt(mnemonic, pass).toString();
      localStorage.setItem('wallet', ciphertext);
      document.cookie = `wallet=${ciphertext}; path=/;`;
    }
  }
  
  // Firmar Transacción
  signTxBtn.addEventListener('click', () => {
    const txData = txDataInput.value.trim();
    if (!txData) {
      alert('Ingrese datos de transacción.');
      return;
    }
    // Firmado dummy (solo demo)
    signedTxOutput.value = CryptoJS.SHA256(txData).toString();
  });
  
  