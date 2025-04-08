document.querySelector('.btn2').addEventListener('click', function(event) {
    event.preventDefault();

    const data = {
        sport: document.getElementById('pridat-sport').value.toUpperCase(),
        podnazev: document.getElementById('pridat-podnazev').value.toUpperCase(),
        gym: document.getElementById('pridat-gym').value.toUpperCase(),
        trener: document.getElementById('pridat-trener').value.toUpperCase(),
        datum: document.getElementById('pridat-datum').value,
        zacatek: document.getElementById('pridat-zacatek').value.slice(0,5),
        konec: document.getElementById('pridat-konec').value.slice(0,5),
        dovednost: [
            document.getElementById('pridat-dovednost-a').checked ? 'A' : '',
            document.getElementById('pridat-dovednost-b').checked ? 'B' : '',
            document.getElementById('pridat-dovednost-c').checked ? 'C' : ''
        ].filter(Boolean), // Odstraní prázdné hodnoty
        kategorie: [
            document.getElementById('pridat-kategorie-muz').checked ? 'Muž' : '',
            document.getElementById('pridat-kategorie-zena').checked ? 'Žena' : '',
            document.getElementById('pridat-kategorie-dite').checked ? 'Dítě' : ''
        ].filter(Boolean)
    };

    fetch('/api/pridat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Server response:', result);
            alert('Úspěšně uloženo!');
        })
        .catch(error => console.error('Chyba při odesílání:', error));
});

    const vypis = document.createElement("p");
    vypis.innerHTML = sport + podnazev + gym + trener + zacatek + kategorie;
    document.body.appendChild(vypis);

    // Tady můžete pokračovat s odesláním dat na server nebo jinou akcí
