# Fork wifi75/spiderweb

Fork di [coulisse/spiderweb](https://github.com/coulisse/spiderweb) (v2.5.8) usato per il portale
https://webcluster.iu3cyv.eu/ (DXSpider su `dxspider`, 192.168.1.111, porta 7300).
Il codice originale resta com'è: le personalizzazioni sono in file nuovi, così gli aggiornamenti
dell'originale si riportano senza conflitti.

## Correzioni al codice originale

| File | Cosa |
|---|---|
| `lib/cty.py` | Un paese mancante in `cfg/country.json` non blocca più il portale: ISO `xx` e un solo avviso nel log. Alias `Cabo Verde` → `Cape Verde` |
| `webapp.py` | Paese e ISO con valori di riserva (`unknown country`, `xx`); route robots/sitemap/Google; CSP per Umami; `TIMER_WHO = 60` |
| `lib/dxtelnet.py` | Attesa del prompt telnet con tempo massimo di 20 s (issue upstream #78) |
| `cfg/country.json` | ISO corretti: Macedonia del Nord `mk`, RD Congo `cd` |

Causa del guasto di novembre 2026 (spot che non arrivavano): in `country.json` mancava "Cabo Verde"
e ogni spot da Capo Verde faceva fallire l'intera lista (`KeyError 'iso'`, issue upstream #106).

## Personalizzazioni grafiche e funzioni

File aggiunti, caricati da `templates/_base.html`:

- `static/css/custom/theme.css` — tema chiaro/scuro, barra filtri, tabella, banner Aurora, menu a pulsanti
- `static/js/custom/theme.js` — tema, filtri rapidi, ricerca nel testo, modo dello spot, WebSDR, bip, banner
- `static/js/custom/i18n.js` — 9 lingue (it, en, pt, es, ru, fr, de, ja, zh), scelta automatica dal browser
- `static/images/custom/` — `hero.svg`, `aurora-icon.png`

Funzioni: filtri rapidi per banda/modo, casella "Cerca nel testo" (spazio = tutte le parole, virgola = alternative),
colonna Modo con filtro a clic, pulsante WebSDR (Twente, finestra staccata), righe nuove evidenziate con bip
disattivabile, banner Aurora, nomi dei paesi tradotti. I filtri e le preferenze restano nel browser
(`localStorage`: `wc-theme`, `wc-lang`, `wc-sound`, `wc-filters`, `wc-textfilter`, `wc-promo-hidden-until`).

## Regole da ricordare

- I file `static/js/rel/*.min.js` e `static/css/rel/style.min.css` non si modificano.
- La CSP blocca gli stili scritti dentro la pagina (`style="..."`): usare sempre il foglio di stile.
- Dopo ogni modifica a `theme.css`, `theme.js` o `i18n.js` aumentare il numero `?v=N` in `_base.html`, altrimenti il browser usa la copia vecchia.
- `wsgi.py` risulta modificato solo per i fine riga di Windows: non va committato.
- Per un nuovo paese o una nuova bandiera: `cfg/country.json` (campo `ISO` = codice di due lettere di flag-icons).

## Installare / aggiornare sul server

Il portale gira come servizio `spiderweb` (bjoern, porta 8080) dietro Apache. Aggiornamento:

```bash
sudo ~/aggiorna-spiderweb.sh
```

Lo script (`scripts/aggiorna-spiderweb.sh`, da copiare in `~` sul server) fa `git pull`, riavvia il servizio,
controlla che risponda 200 e, se non risponde, torna da solo alla versione precedente. Rifiuta di partire
se sul server ci sono file modificati a mano.

## Issue dell'originale esaminate

Affrontate nel fork: #106 (paese mancante, già risolto meglio), #78 (timeout telnet), #83 (filtri ricordati),
#26 (filtro sul testo), #91 (pulsante WebSDR). Le altre aperte non servono a questo portale.
