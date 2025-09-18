(function(){
  const $ = (sel) => document.querySelector(sel);
  const format = (v) => {
    if (!isFinite(v)) return '—';
    return Number(v).toLocaleString('sr-RS', {minimumFractionDigits:2, maximumFractionDigits:2});
  };

  const inRange = (val, min, max) => (val >= min && val <= max);

  const STORAGE_KEYS = {
    tezina: 'kalkulator_testo_tezina',
    hidratacija: 'kalkulator_testo_hidratacija',
    scald: 'kalkulator_testo_scald'
  };

  function loadState(){
    const savedTezina = localStorage.getItem(STORAGE_KEYS.tezina);
    const savedHidratacija = localStorage.getItem(STORAGE_KEYS.hidratacija);
    const savedScald = localStorage.getItem(STORAGE_KEYS.scald);

    if (savedTezina !== null) $('#tezina').value = savedTezina;
    if (savedHidratacija !== null) $('#hidratacija').value = savedHidratacija;
    if (savedScald !== null) $('#scald').checked = (savedScald === '1');
  }

  function saveState(){
    localStorage.setItem(STORAGE_KEYS.tezina, $('#tezina').value || '');
    localStorage.setItem(STORAGE_KEYS.hidratacija, $('#hidratacija').value || '');
    localStorage.setItem(STORAGE_KEYS.scald, $('#scald').checked ? '1' : '0');
  }

  function compute(){
    const C3 = parseFloat($('#tezina').value);
    const C4 = parseFloat($('#hidratacija').value);
    const C5 = $('#scald').checked;

    const warn = $('#upozorenje');
    warn.classList.add('d-none');

    // toggle scald card
    $('#scald-card').style.display = C5 ? '' : 'none';

    if(!isFinite(C3) || !isFinite(C4) || C3 <= 0 || !inRange(C4, 1, 120)){
      ['g6','g5','g7','h4','h5','h6','i6','i5','j6','j5'].forEach(id => $('#'+id).textContent = '—');
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