## Memory Cards Game – Sigma Memory Card 67.

### Teknologi
- **HTML / CSS / JavaScript**
- Ingen rammeverk eller byggverktøy – alt kjører direkte i nettleseren.

### Hvordan starte spillet
- **Alternativ 1 (det enkleste)**  
  Åpne bare `index.html` med et dobbeltklikk eller via nettleseren (Chrome / Edge / Firefox).

- **Alternativ 2 (via lokal server – anbefalt)**  
  Dette unngår mulige begrensninger i nettleseren ved filtilgang.
  1. Installer Node.js (hvis du ikke allerede har det).
  2. I rotmappen til prosjektet, kjør:
     ```bash
     npx serve .
     ```
  3. Gå til adressen som vises i terminalen (vanligvis `http://localhost:3000` eller lignende).

### Hvordan spille
- På brettet ligger kortene med baksiden opp.
- Klikk på et kort for å snu det.
- Snu **to kort om gangen**:
  - hvis bildene er like, regnes paret som funnet og forblir åpent;
  - hvis de er ulike, vil kortene riste litt og snu seg tilbake.
- Nederst ser du en informasjonslinje:
  - **Time** – gjenværende tid;
  - **Flips** – hvor mange ganger du har snudd kort;
  - **Refresh** – starter spillet på nytt (stokker kortene og nullstiller tid/trekk).

### Prosjektstruktur
- `index.html` – markup for spillbrettet og panelet med tid/trekk.
- `style.css` – styling: bakgrunn, kortanimasjoner, neoneffekt på tittel og panel.
- `script.js` – spill-logikk: stokking av kort, sammenligning av par, tidsmåling og telling av trekk.
- `images/` – spørsmålstegnikon og bildene for kortene.

### Tilpasning
- **Kortbilder** kan byttes ved å erstatte filer i `images/` og/eller oppdatere filbaner i `index.html`.
- **Fargepalett og stil** kan lett endres i `style.css`:
  - sidebakgrunn (`body`),
  - utseende på kort (`.card`, `.front-view`, `.back-view`),
  - panelet nederst (`.details`),
  - spillets overskrift (`.game-title`).
