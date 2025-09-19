(function () {
  const $ = (sel) => document.querySelector(sel);
  const format = (v) => {
    if (!isFinite(v)) return '—';
    return Number(v).toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const inRange = (val, min, max) => (val >= min && val <= max);

  const STORAGE_KEYS = {
    tezina: 'kalkulator_testo_tezina',
    hidratacija: 'kalkulator_testo_hidratacija',
    scald: 'kalkulator_testo_scald'
  };

  function loadState() {
    const savedTezina = localStorage.getItem(STORAGE_KEYS.tezina);
    const savedHidratacija = localStorage.getItem(STORAGE_KEYS.hidratacija);
    const savedScald = localStorage.getItem(STORAGE_KEYS.scald);

    if (savedTezina !== null) $('#tezina').value = savedTezina;
    if (savedHidratacija !== null) $('#hidratacija').value = savedHidratacija;
    if (savedScald !== null) $('#scald').checked = (savedScald === '1');
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEYS.tezina, $('#tezina').value || '');
    localStorage.setItem(STORAGE_KEYS.hidratacija, $('#hidratacija').value || '');
    localStorage.setItem(STORAGE_KEYS.scald, $('#scald').checked ? '1' : '0');
  }

  function compute() {
    const C3 = parseFloat($('#tezina').value);
    const C4 = parseFloat($('#hidratacija').value);
    const C5 = $('#scald').checked;

    const warn = $('#upozorenje');
    warn.classList.add('d-none');

    // toggle scald card
    $('#scald-card').style.display = C5 ? '' : 'none';

    if (!isFinite(C3) || !isFinite(C4) || C3 <= 0 || !inRange(C4, 1, 120)) {
      ['g6', 'g5', 'g7', 'h4', 'h5', 'h6', 'i6', 'i5', 'j6', 'j5'].forEach(id => $('#' + id).textContent = '—');
      return;
    }

    const G6 = C3 / (100 + C4) * 100;
    const G5 = G6 / 100 * C4;
    const G7 = G6 * 0.022;

    const H4 = 0.03 * C3;
    const H5 = 4 * H4;
    const H6 = 4 * H4;

    const I6 = C5 ? (G6 / 100 * 10) : 0;
    const I5 = C5 ? (I6 * 2) : 0;

    const J6 = G6 - H6 - I6;
    const J5 = G5 - H5 - I5;

    if (J6 < 0 || J5 < 0) {
      warn.classList.remove('d-none');
    }

    $('#g6').textContent = format(G6);
    $('#g5').textContent = format(G5);
    $('#g7').textContent = format(G7);

    $('#h4').textContent = format(H4);
    $('#h5').textContent = format(H5);
    $('#h6').textContent = format(H6);

    $('#i6').textContent = format(I6);
    $('#i5').textContent = format(I5);

    $('#j6').textContent = format(J6);
    $('#j5').textContent = format(J5);
  }

  ['#tezina', '#hidratacija', '#scald'].forEach(sel => {
    $(sel).addEventListener('input', () => {
      saveState();
      compute();
    });
  });

  loadState();
  compute();
})();
// === Export u PDF (html2pdf pristup) ===
function exportToPDF() {
  window.scrollTo(0, 0);

  const tezina = parseFloat(document.getElementById("tezina").value);
  const hidratacija = parseFloat(document.getElementById("hidratacija").value);

  // ✅ Provera obaveznih polja
  if (!tezina || !hidratacija || tezina <= 0 || hidratacija <= 0) {
    alert("Molimo unesite Težinu i Hidrataciju pre izvoza u PDF.");
    return; // prekidamo dalje izvođenje
  }

  const scaldChecked = document.getElementById("scald").checked;

  // Rezultati sa ekrana
  const g6 = document.getElementById("g6").innerText || "—"; // Brašno
  const g5 = document.getElementById("g5").innerText || "—"; // Voda
  const g7 = document.getElementById("g7").innerText || "—"; // So

  const h4 = document.getElementById("h4").innerText || "—"; // Albert ukupno
  const h5 = document.getElementById("h5").innerText || "—"; // Voda u Albertu
  const h6 = document.getElementById("h6").innerText || "—"; // Brašno u Albertu

  const i6 = document.getElementById("i6").innerText || "—"; // Scald brašno
  const i5 = document.getElementById("i5").innerText || "—"; // Scald voda

  const j6 = document.getElementById("j6").innerText || "—"; // Brašno u zamesu
  const j5 = document.getElementById("j5").innerText || "—"; // Voda u zamesu

  const printArea = document.getElementById("print-area");

  // Sastojci (lista) - po tvom formatu
  let sastojci = `
      <li>Brašno: ${g6} g</li>
      <li>Voda: ${g5} g</li>
      <li>So: ${g7} g</li>
      <li>Albert (ukupno): ${h4} g</li>
      <li>Voda u Albertu: ${h5} g</li>
      <li>Brašno u Albertu: ${h6} g</li>
      ${scaldChecked ? `<li>Brašno za scald: ${i6} g</li>` : ``}
      ${scaldChecked ? `<li>Voda za scald: ${i5} g</li>` : ``}
      <li>Brašno u zamesu: ${j6} g</li>
      <li>Voda u zamesu: ${j5} g</li>
    `;

  // (Opcionalno) kratko uputstvo – možeš da zameniš svojim tekstom
  const uputstvoHTML = scaldChecked
    ? "1) Pripremi scald (ožari brašno vodom). 2) Pomešaj sastojke, odmori testo, fermentacija, oblikovanje i pečenje."
    : "1) Pomešaj sastojke, autoliza (po želji), dodaj so, fermentacija, oblikovanje i pečenje.";

  printArea.innerHTML = `
    <h2 style="margin-bottom:0">Recept za testo</h2>
    <p style="margin-top:6px;color:#666">Generisano iz Kalkulatora za testo</p>

    <p><strong>Težina hleba:</strong> ${tezina} g</p>
    <p><strong>Hidratacija:</strong> ${hidratacija}%</p>
    <p><strong>Scald:</strong> ${scaldChecked ? "✅ Da" : "❌ Ne"}</p>

    <h4>Osnovni proračuni</h4>
    <ul>
      <li>Brašno: ${g6} g</li>
      <li>Voda: ${g5} g</li>
      <li>So: ${g7} g</li>
    </ul>

    <h4>Podizač (Albert)</h4>
    <ul>
      <li>Albert (ukupno): ${h4} g</li>
      <li>Voda u Albertu: ${h5} g</li>
      <li>Brašno u Albertu: ${h6} g</li>
    </ul>

    ${
      scaldChecked
        ? `
      <h4>Scald</h4>
      <ul>
        <li>Brašno za scald: ${i6} g</li>
        <li>Voda za scald: ${i5} g</li>
      </ul>
    `
        : ""
    }

    <h4>Zames</h4>
    <ul>
      <li>Brašno u zamesu: ${j6} g</li>
      <li>Voda u zamesu: ${j5} g</li>
      <li>So: ${g7} g</li>
    </ul>

    <!-- <h4>Uputstvo za pripremu</h4>
    <p>${uputstvoHTML}</p> -->
  `;

  printArea.style.display = "block";

  const opt = {
    margin: 40,
    filename: "recept-za-testo.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, y: 0 },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(printArea)
    .save()
    .then(() => {
      printArea.style.display = "none";
    });
}

// Klik na dugme
document.getElementById("export-pdf").addEventListener("click", exportToPDF);

