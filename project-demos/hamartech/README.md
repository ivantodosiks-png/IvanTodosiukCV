# HamarTech CTF – kort guide

hamar-tech.1im.imkatta.no

## Hva er dette?
En liten offline CTF med to flagg og en takkeside. Alt ligger lokalt, ingen server trengs.

## Struktur
- `index.html` – startside, timer og input for to flagg. Etter begge riktige flagg sendes du til `thanks.html`.
- `home.html` – hovedlandingsside/vitrine.
- `admin.html` – lokal admin-side (innlogging/skattekart).
- `hidden/flag.html` – skjult side med flagg #2.
- `script.js`, `styles.css` – logikk og stil.
- `thanks.html` – gratulasjon med sertifikat og utskriftsknapp.

## Flagg
- Flagg #1: bak innloggingen i `admin.html`.
- Flagg #2: i skjult katalog `hidden/flag.html`.

## Hint for bruteforce/enum
- Brute-force innlogging: Burp Suite Intruder (eller tilsvarende) mot login-formen i `admin.html`.
- Finn skjulte sider/kataloger: `gobuster` eller `ffuf` med wordlist; målet er katalogen `hidden/`.

## Løype
1) Åpne `index.html`.
2) Finn begge flagg (admin-panel + skjult katalog).
3) Lim inn begge flagg på `index.html` – du sendes automatisk til `thanks.html`.
4) På `thanks.html` kan du skrive ut/lagre sertifikatet og gå videre til neste oppgave (`hidden/flag.html`) eller avslutte (`index.html`).

## Lokal kjøring
Åpne filene rett i nettleseren (dobbelklikk eller drag-and-drop). Ingen nett-tilgang kreves.

