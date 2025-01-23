// array vuoto
let lista = [];
let totaleSum = 0;
function toArray () {
  // prendere i valori
  let element = document.getElementById('element').value;
  let prezzo = parseInt(document.getElementById('prezzo').value);
  let quantity = parseInt(document.getElementById('quantity').value);
  let sconto = parseInt(document.getElementById('sconto').value);
  
  // oggetto 
  let prodotto = {
    element: element,
    prezzo: prezzo,
    quantity: quantity,
    sconto: sconto,
  }

  // faccio tute le verifiche 
  if (!element || element.trim() === '' || lista.some(prodotto => prodotto.element === element)) {
    alert ('ERRORE: Elemento non valido o già inserito!');
    return;
  }
  if (!prezzo || isNaN(prezzo) || prezzo <= 0) {
    alert ('ERRORE: Prezzo non valido o già inserito!');
    return;
  }
  if (!quantity || isNaN(quantity) || quantity <= 0 || quantity >= 100) {
    alert ('ERRORE: Quantità non valido o già inserito!');
    return;
  }
  if (isNaN(sconto) || sconto < 0 || sconto >= 100) {
    alert ('ERRORE: Sconto non valido o già inserito!');
    return;
  }

  // pusho l'elemento
  lista.push(prodotto);
  // console.log(lista);

  // aggiorno la lista automaticamente
  showBtn();
}
function showBtn () {
  let selectElement = document.getElementById('lista-select');

  selectElement.innerHTML = '';

  // crea <option>
  for (let i = 0; i < lista.length; i++) {
    let option = document.createElement('option');
    option.value = lista[i].element;
    option.id = i;
    option.textContent = `Nome: ${lista[i].element}. Quantità: ${lista[i].quantity}`;
    selectElement.appendChild(option);
  }
}
function remove () {
  let selezionato = document.getElementById('lista-select').value;
  
  let index = lista.findIndex(item => item.element === selezionato);
  
  if (index !== -1) {
    lista.splice(index, 1);
    showBtn();
    console.log(`Ho rimosso dalla lista: ${selezionato}`);
  } else {
    console.log('ERRORE: Elemento non trovato!');
  }
}
function modifyQuantity () {
  // così vedo il dataset 'quantity' dell'elemento
  let selectElement = document.getElementById('lista-select');
  let selectedOption = selectElement.options[selectElement.selectedIndex]; // ottengo l'option selezionata
  // console.log(selectedOption.id);
  let i = selectedOption.id;
  
  // prendo la nuova quantità
  let newQuantity = parseInt(document.getElementById('modQuantity').value);
  // faccio un rapido controllo di tutto
  if (!newQuantity || isNaN(newQuantity) || newQuantity <= 0 || newQuantity >= 100) {
    alert ('ERRORE: La nuova quantità non è valida! NON è STATA MODIFICATA!');
    return;
  }
  // modifico l'effettiva quantità
  lista[i].quantity = newQuantity;
  showBtn (); // aggiorno la lista
  // console.log(lista)
  // notificare quantità modificata
  alert (`Hai modificato la quantità di ${lista[i].element}. Adesso è: ${lista[i].quantity}`);
}
function checkBudget () {
  let budget = document.getElementById('budget').value;
  // controllo
  if (isNaN(budget) || budget < 0 || budget > 10000) {
    alert ('ERRORE: Valore del budget non valido! Riprova.');
    return;
  }
  // se è 0 ==> no budget => non controllo
  if (budget != 0) {
    if (budget >= totaleSum) {
      alert (`Hai abbastanza soldi! Puoi ancora spendere ${budget - totaleSum}€`);
    } else {
      alert (`Non hai abbastanza soldi! Togli qualcosa: saresti in negativo di ${totaleSum - budget}€`);
    }
  }
}
// tutti i calcoli 🔽
function totale () {
  // faccio il calcolo elemento per elemento
  lista.forEach(prodotto => {
    let parziale = prodotto.prezzo * prodotto.quantity;
    let sconto = parziale * (prodotto.sconto)/100; // con diviso 100 non ho problemi con sconto === 0 => 0/100 = 0
    let parzialeScontato = parziale - sconto;
    console.log(`Il parziale con sconto è: ${parzialeScontato}`);
    totaleSum = totaleSum + parzialeScontato;
  });
  totaleSum = Math.round(totaleSum);
  console.log(totaleSum)
  checkBudget ()
  document.getElementById('pdf-btn').style.display = 'flex';
}
// jsPDF
function creaPDF() {
  const { jsPDF } = window.jspdf; // assicurati di accedere correttamente a jsPDF
  const doc = new jsPDF();
  
  // titolo
  doc.setFontSize(18);
  doc.text("Dettagli Ordine", 10, 10); // posizione del titolo
  
  // aggiungi un hr
  doc.setLineWidth(0.5);
  doc.line(10, 15, 200, 15); // linea orizzontale
  
  // inizia a scrivere i dettagli degli acquisti
  let yPosition = 20; // posizione iniziale dell'asse Y per il corpo del testo
  
  // font
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  lista.forEach(prodotto => {
    // aggiungo il testo con le coordinate x e y
    doc.text(`Hai acquistato ${prodotto.quantity} ${prodotto.element} per un prezzo a prodotto di ${prodotto.prezzo}€ con uno sconto di ${prodotto.sconto}%.`, 10, yPosition);
    
    // aggiungo uno spazio tra le righe per non sovrapporre il testo
    yPosition += 10;
  });
  
  doc.text(`Il totale è ${totaleSum}€`, 10, yPosition);

  // footer
  doc.setFontSize(10);
  doc.text("Grazie per il tuo ordine!", 10, yPosition + 10);
  
  doc.save("ordine.pdf");
}
