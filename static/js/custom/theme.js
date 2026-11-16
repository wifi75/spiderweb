/*
 * Personalizzazione IU3CYV (nessuna modifica ai file originali di Spiderweb):
 *  - tema chiaro/scuro (Bootstrap data-bs-theme), ricordato nel browser
 *  - barra dei filtri rapidi (banda e modo) che pilota il filtro esistente
 *  - nomi dei paesi in italiano e frequenza colorata per banda nella tabella spot
 */
(function () {
	'use strict';

	/* ---------- tema chiaro / scuro ---------- */
	var KEY = 'wc-theme';

	function savedTheme() {
		try {
			var t = localStorage.getItem(KEY);
			if (t === 'light' || t === 'dark') {
				return t;
			}
		} catch (e) { /* storage non disponibile */ }
		return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
	}

	function applyTheme(t) {
		document.documentElement.setAttribute('data-bs-theme', t);
		var b = document.getElementById('wc-theme-toggle');
		if (b) {
			b.firstChild.className = t === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill';
			b.setAttribute('aria-label', t === 'dark' ? 'Tema chiaro' : 'Tema scuro');
		}
	}

	applyTheme(savedTheme());

	function addThemeButton() {
		var clock = document.getElementById('MyClockDisplay');
		if (!clock || document.getElementById('wc-theme-toggle')) {
			return;
		}
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.id = 'wc-theme-toggle';
		btn.className = 'btn btn-sm btn-outline-secondary';
		btn.appendChild(document.createElement('i'));
		btn.addEventListener('click', function () {
			var next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
			try { localStorage.setItem(KEY, next); } catch (e) { /* ignora */ }
			applyTheme(next);
		});
		clock.parentNode.insertBefore(btn, clock);
		applyTheme(savedTheme());
		addSoundButton(clock);
	}

	/* ---------- suono per i nuovi spot ---------- */
	var SOUND_KEY = 'wc-sound';
	var audioCtx = null;
	var quietUntil = 0;
	var lastBeep = 0;

	function soundOn() {
		try {
			return localStorage.getItem(SOUND_KEY) !== 'off';
		} catch (e) {
			return true;
		}
	}

	function getAudio() {
		var AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) {
			return null;
		}
		if (!audioCtx) {
			try { audioCtx = new AC(); } catch (e) { return null; }
		}
		if (audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
		return audioCtx;
	}

	/* il browser permette l'audio solo dopo un'interazione: lo "sblocchiamo" al primo clic o tocco */
	function unlockAudio() {
		getAudio();
		document.removeEventListener('pointerdown', unlockAudio);
		document.removeEventListener('keydown', unlockAudio);
	}
	document.addEventListener('pointerdown', unlockAudio);
	document.addEventListener('keydown', unlockAudio);

	/* bip breve e leggero (due note vicine), generato qui: nessun file audio */
	function playBeep(force) {
		var now = Date.now();
		if (!force && (!soundOn() || now < quietUntil || now - lastBeep < 2000)) {
			return;
		}
		var ctx = getAudio();
		if (!ctx || ctx.state !== 'running') {
			return;
		}
		lastBeep = now;
		[[880, 0], [1320, 0.09]].forEach(function (n) {
			var osc = ctx.createOscillator();
			var gain = ctx.createGain();
			var t0 = ctx.currentTime + n[1];
			osc.type = 'sine';
			osc.frequency.value = n[0];
			gain.gain.setValueAtTime(0.0001, t0);
			gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(t0);
			osc.stop(t0 + 0.18);
		});
	}

	function setSoundIcon() {
		var b = document.getElementById('wc-sound-toggle');
		if (!b) {
			return;
		}
		var on = soundOn();
		b.firstChild.className = on ? 'bi-volume-up-fill' : 'bi-volume-mute-fill';
		b.setAttribute('aria-label', on ? 'Disattiva il suono dei nuovi spot' : 'Attiva il suono dei nuovi spot');
		b.title = on ? 'Suono nuovi spot: acceso' : 'Suono nuovi spot: spento';
	}

	function addSoundButton(clock) {
		if (document.getElementById('wc-sound-toggle')) {
			return;
		}
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.id = 'wc-sound-toggle';
		btn.className = 'btn btn-sm btn-outline-secondary';
		btn.appendChild(document.createElement('i'));
		btn.addEventListener('click', function () {
			var next = soundOn() ? 'off' : 'on';
			try { localStorage.setItem(SOUND_KEY, next); } catch (e) { /* ignora */ }
			setSoundIcon();
			if (next === 'on') {
				playBeep(true);
			}
		});
		clock.parentNode.insertBefore(btn, document.getElementById('wc-theme-toggle'));
		setSoundIcon();
	}

	/* ---------- annuncio Aurora (si puo chiudere, riappare dopo 7 giorni) ---------- */
	function setupPromo() {
		var promo = document.getElementById('wc-promo');
		if (!promo) {
			return;
		}
		var KEY = 'wc-promo-hidden-until';
		try {
			var until = Number(localStorage.getItem(KEY) || 0);
			if (until > Date.now()) {
				promo.hidden = true;
				return;
			}
		} catch (e) { /* mostra comunque */ }
		var close = promo.querySelector('.wc-promo-close');
		if (close) {
			close.addEventListener('click', function () {
				promo.hidden = true;
				try { localStorage.setItem(KEY, String(Date.now() + 7 * 24 * 3600 * 1000)); } catch (e) { /* ignora */ }
			});
		}
	}

	/* ---------- nomi dei paesi in italiano ---------- */
	var IT = {
		'African Italy': 'Italia africana', 'Agalega & St. Brandon': 'Agalega e St. Brandon', 'Aland Islands': 'Isole Åland',
		'American Samoa': 'Samoa Americane', 'Amsterdam & St. Paul Is.': 'Isole Amsterdam e St. Paul',
		'Andaman & Nicobar Is.': 'Isole Andamane e Nicobare', 'Annobon Island': 'Isola di Annobón', 'Antarctica': 'Antartide',
		'Antigua & Barbuda': 'Antigua e Barbuda', 'Ascension Island': 'Isola dell\'Ascensione', 'Asiatic Russia': 'Russia asiatica',
		'Asiatic Turkey': 'Turchia asiatica', 'Austral Islands': 'Isole Australi', 'Aves Island': 'Isola Aves', 'Azerbaijan': 'Azerbaigian',
		'Azores': 'Azzorre', 'Bahrain': 'Bahrein', 'Baker & Howland Islands': 'Isole Baker e Howland', 'Balearic Islands': 'Isole Baleari',
		'Banaba Island': 'Isola di Banaba', 'Bear Island': 'Isola degli Orsi', 'Belarus': 'Bielorussia', 'Belgium': 'Belgio',
		'Bosnia-Herzegovina': 'Bosnia-Erzegovina', 'Bouvet': 'Isola Bouvet', 'Brazil': 'Brasile',
		'British Virgin Islands': 'Isole Vergini Britanniche', 'Brunei Darussalam': 'Brunei', 'Cabo Verde': 'Capo Verde',
		'Cambodia': 'Cambogia', 'Cameroon': 'Camerun', 'Canary Islands': 'Isole Canarie', 'Cayman Islands': 'Isole Cayman',
		'Central African Republic': 'Repubblica Centrafricana', 'Central Kiribati': 'Kiribati centrale', 'Ceuta & Melilla': 'Ceuta e Melilla',
		'Chad': 'Ciad', 'Chagos Islands': 'Isole Chagos', 'Chatham Islands': 'Isole Chatham', 'Chesterfield Islands': 'Isole Chesterfield',
		'Chile': 'Cile', 'China': 'Cina', 'Christmas Island': 'Isola di Natale', 'Clipperton Island': 'Isola di Clipperton',
		'Cocos Island': 'Isola di Cocos', 'Cocos (Keeling) Islands': 'Isole Cocos (Keeling)', 'Comoros': 'Comore',
		'Conway Reef': 'Scogliera Conway', 'Cote d\'Ivoire': 'Costa d\'Avorio', 'Crete': 'Creta', 'Croatia': 'Croazia',
		'Crozet Island': 'Isole Crozet', 'Curacao': 'Curaçao', 'Cyprus': 'Cipro', 'Czech Republic': 'Repubblica Ceca',
		'Dem. Rep. of the Congo': 'Rep. Dem. del Congo', 'Denmark': 'Danimarca', 'Desecheo Island': 'Isola Desecheo', 'Djibouti': 'Gibuti',
		'Dodecanese': 'Dodecaneso', 'Dominican Republic': 'Rep. Dominicana', 'DPR of Korea': 'Corea del Nord', 'Ducie Island': 'Isola Ducie',
		'Easter Island': 'Isola di Pasqua', 'Eastern Kiribati': 'Kiribati orientale', 'East Malaysia': 'Malesia orientale', 'Egypt': 'Egitto',
		'England': 'Inghilterra', 'Equatorial Guinea': 'Guinea Equatoriale', 'Ethiopia': 'Etiopia', 'European Russia': 'Russia europea',
		'European Turkey': 'Turchia europea', 'Falkland Islands': 'Isole Falkland', 'Faroe Islands': 'Isole Fær Øer',
		'Fed. Rep. of Germany': 'Germania', 'Fiji': 'Figi', 'Finland': 'Finlandia', 'France': 'Francia',
		'Franz Josef Land': 'Terra di Francesco Giuseppe', 'French Guiana': 'Guyana francese', 'French Polynesia': 'Polinesia francese',
		'Galapagos Islands': 'Isole Galápagos', 'Glorioso Islands': 'Isole Gloriose', 'Greece': 'Grecia', 'Greenland': 'Groenlandia',
		'Guadeloupe': 'Guadalupa', 'Guantanamo Bay': 'Baia di Guantánamo', 'Heard Island': 'Isola Heard', 'Hungary': 'Ungheria',
		'Iceland': 'Islanda', 'Ireland': 'Irlanda', 'Isle of Man': 'Isola di Man', 'Israel': 'Israele', 'Italy': 'Italia',
		'ITU HQ': 'Sede ITU', 'Jamaica': 'Giamaica', 'Japan': 'Giappone', 'Johnston Island': 'Isola Johnston', 'Jordan': 'Giordania',
		'Juan de Nova, Europa': 'Juan de Nova ed Europa', 'Juan Fernandez Islands': 'Isole Juan Fernández', 'Kazakhstan': 'Kazakistan',
		'Kerguelen Islands': 'Isole Kerguelen', 'Kermadec Islands': 'Isole Kermadec', 'Kingdom of Eswatini': 'Eswatini',
		'Kure Island': 'Isola Kure', 'Kyrgyzstan': 'Kirghizistan', 'Lakshadweep Islands': 'Isole Laccadive', 'Latvia': 'Lettonia',
		'Lebanon': 'Libano', 'Libya': 'Libia', 'Lithuania': 'Lituania', 'Lord Howe Island': 'Isola di Lord Howe', 'Luxembourg': 'Lussemburgo',
		'Macquarie Island': 'Isola Macquarie', 'Madeira Islands': 'Madeira', 'Maldives': 'Maldive', 'Malpelo Island': 'Isola Malpelo',
		'Mariana Islands': 'Isole Marianne', 'Marquesas Islands': 'Isole Marchesi', 'Marshall Islands': 'Isole Marshall',
		'Martinique': 'Martinica', 'Mexico': 'Messico', 'Midway Island': 'Isole Midway', 'Moldova': 'Moldavia', 'Morocco': 'Marocco',
		'Mount Athos': 'Monte Athos', 'Mozambique': 'Mozambico', 'Navassa Island': 'Isola Navassa', 'Netherlands': 'Paesi Bassi',
		'New Caledonia': 'Nuova Caledonia', 'New Zealand': 'Nuova Zelanda', 'Norfolk Island': 'Isola Norfolk',
		'North Cook Islands': 'Isole Cook settentrionali', 'Northern Ireland': 'Irlanda del Nord', 'North Macedonia': 'Macedonia del Nord',
		'Norway': 'Norvegia', 'N.Z. Subantarctic Is.': 'Isole subantartiche NZ', 'Palestine': 'Palestina',
		'Palmyra & Jarvis Islands': 'Isole Palmyra e Jarvis', 'Papua New Guinea': 'Papua Nuova Guinea', 'Peru': 'Perù',
		'Peter 1 Island': 'Isola Pietro I', 'Philippines': 'Filippine', 'Pitcairn Island': 'Isole Pitcairn', 'Poland': 'Polonia',
		'Portugal': 'Portogallo', 'Pratas Island': 'Isole Pratas', 'Pr. Edward & Marion Is.': 'Isole Principe Edoardo e Marion',
		'Republic of Korea': 'Corea del Sud', 'Republic of Kosovo': 'Kosovo', 'Republic of South Sudan': 'Sud Sudan',
		'Republic of the Congo': 'Rep. del Congo', 'Reunion Island': 'Riunione', 'Rodriguez Island': 'Isola Rodrigues',
		'Rotuma Island': 'Isola Rotuma', 'Saba & St. Eustatius': 'Saba e Sint Eustatius', 'Sable Island': 'Isola Sable',
		'San Andres & Providencia': 'San Andrés e Providencia', 'San Felix & San Ambrosio': 'San Félix e San Ambrosio',
		'Sao Tome & Principe': 'São Tomé e Príncipe', 'Sardinia': 'Sardegna', 'Saudi Arabia': 'Arabia Saudita',
		'Scarborough Reef': 'Scarborough Shoal', 'Scotland': 'Scozia', 'Shetland Islands': 'Isole Shetland', 'Sicily': 'Sicilia',
		'Slovak Republic': 'Slovacchia', 'Solomon Islands': 'Isole Salomone', 'South Africa': 'Sudafrica',
		'South Cook Islands': 'Isole Cook meridionali', 'South Georgia Island': 'Georgia del Sud', 'South Orkney Islands': 'Orcadi Meridionali',
		'South Sandwich Islands': 'Isole Sandwich Australi', 'South Shetland Islands': 'Shetland Australi',
		'Sov Mil Order of Malta': 'Sovrano Ordine di Malta', 'Spain': 'Spagna', 'Spratly Islands': 'Isole Spratly',
		'St. Barthelemy': 'Saint-Barthélemy', 'St. Helena': 'Sant\'Elena', 'St. Kitts & Nevis': 'Saint Kitts e Nevis',
		'St. Lucia': 'Santa Lucia', 'St. Martin': 'Saint-Martin', 'St. Paul Island': 'Isola St. Paul',
		'St. Peter & St. Paul': 'Scogli di San Pietro e San Paolo', 'St. Pierre & Miquelon': 'Saint-Pierre e Miquelon',
		'St. Vincent': 'Saint Vincent', 'Sweden': 'Svezia', 'Switzerland': 'Svizzera', 'Syria': 'Siria', 'Tajikistan': 'Tagikistan',
		'Temotu Province': 'Provincia di Temotu', 'Thailand': 'Thailandia', 'The Gambia': 'Gambia', 'Timor - Leste': 'Timor Est',
		'Tokelau Islands': 'Tokelau', 'Trindade & Martim Vaz': 'Trindade e Martim Vaz', 'Trinidad & Tobago': 'Trinidad e Tobago',
		'Tristan da Cunha & Gough': 'Tristan da Cunha e Gough', 'Tromelin Island': 'Isola Tromelin', 'Turks & Caicos Islands': 'Isole Turks e Caicos',
		'UK Base Areas on Cyprus': 'Basi britanniche a Cipro', 'Ukraine': 'Ucraina', 'United Arab Emirates': 'Emirati Arabi Uniti',
		'United Nations HQ': 'Sede ONU', 'United States': 'Stati Uniti', 'US Virgin Islands': 'Isole Vergini USA',
		'Vatican City': 'Città del Vaticano', 'Vienna Intl Ctr': 'Centro internaz. di Vienna', 'Wake Island': 'Isola Wake',
		'Wales': 'Galles', 'Wallis & Futuna Islands': 'Wallis e Futuna', 'Western Kiribati': 'Kiribati occidentale',
		'Western Sahara': 'Sahara Occidentale', 'West Malaysia': 'Malesia occidentale', 'Willis Island': 'Isola Willis',
		'unknown country': 'Paese sconosciuto'
	};

	/* ---------- banda dalla frequenza (kHz) ---------- */
	function bandClass(khz) {
		if (khz >= 1800 && khz < 2000) { return 'wc-b160'; }
		if (khz >= 3500 && khz < 4000) { return 'wc-b80'; }
		if (khz >= 5000 && khz < 5500) { return 'wc-b60'; }
		if (khz >= 7000 && khz < 7300) { return 'wc-b40'; }
		if (khz >= 10100 && khz < 10150) { return 'wc-b30'; }
		if (khz >= 14000 && khz < 14350) { return 'wc-b20'; }
		if (khz >= 18068 && khz < 18168) { return 'wc-b17'; }
		if (khz >= 21000 && khz < 21450) { return 'wc-b15'; }
		if (khz >= 24890 && khz < 24990) { return 'wc-b12'; }
		if (khz >= 28000 && khz < 29700) { return 'wc-b10'; }
		if (khz >= 50000 && khz < 54000) { return 'wc-b6'; }
		if (khz >= 144000) { return 'wc-bvhf'; }
		return '';
	}

	/* la tabella formatta la frequenza in it-IT: "14.074,5" */
	function parseFreq(txt) {
		var n = parseFloat(String(txt).replace(/\./g, '').replace(',', '.'));
		return isNaN(n) ? 0 : n;
	}

	function decorateRow(tr) {
		if (tr.dataset.wc === '1') {
			return;
		}
		tr.dataset.wc = '1';

		var badge = tr.querySelector('span.badge');
		if (badge) {
			var cls = bandClass(parseFreq(badge.textContent));
			badge.className = 'wc-band ' + cls;
		}

		/* la colonna UTC e un <div> messo direttamente nella riga (non una cella): lo mettiamo in una vera <td>,
		   cosi riceve lo stesso sfondo e le stesse righe alternate delle altre colonne */
		for (var k = 0; k < tr.children.length; k++) {
			var child = tr.children[k];
			if (child.tagName === 'DIV') {
				var cell = document.createElement('td');
				cell.className = 'wc-utc';
				tr.replaceChild(cell, child);
				cell.appendChild(child);
				break;
			}
		}

		var cells = tr.children;
		var tdCountry = cells[4];
		if (tdCountry && tdCountry.tagName === 'TD') {
			var en = tdCountry.textContent.trim();
			var it = IT[en];
			if (it) {
				tdCountry.textContent = it;
				tdCountry.title = en;
				var flag = tr.querySelector('.img-flag');
				if (flag) {
					flag.setAttribute('data-bs-content', it);
					try {
						var pop = window.bootstrap && window.bootstrap.Popover.getInstance(flag);
						if (pop) {
							pop.setContent({ '.popover-body': it });
						}
					} catch (e) { /* il pop-up resta in inglese */ }
				}
			}
		}
	}

	function watchTable() {
		var body = document.getElementById('bodyspot');
		if (!body) {
			return;
		}
		var busy = false;
		var obs = new MutationObserver(function () {
			if (busy) {
				return;
			}
			busy = true;
			var rows = body.querySelectorAll('tr');
			for (var i = 0; i < rows.length; i++) {
				decorateRow(rows[i]);
			}
			/* le righe nuove portano la classe table-info: un solo bip per blocco di spot */
			if (body.querySelector('tr.table-info')) {
				playBeep(false);
			}
			busy = false;
		});
		obs.observe(body, { childList: true });
	}

	/* ---------- filtri rapidi ---------- */
	function selectOnly(selectEl, wanted) {
		var all = wanted.length === 0;
		for (var i = 0; i < selectEl.options.length; i++) {
			selectEl.options[i].selected = all || wanted.indexOf(selectEl.options[i].value) !== -1;
		}
	}

	function buildQuickBar() {
		var bar = document.getElementById('quickbar');
		var bandSel = document.getElementById('band');
		var modeSel = document.getElementById('mode');
		if (!bar || !bandSel || !modeSel) {
			return;
		}

		var state = { bands: [], modes: [], noft8: false };
		var pills = [];

		function mk(label, onclick, extra) {
			var p = document.createElement('button');
			p.type = 'button';
			p.className = 'wc-pill' + (extra ? ' ' + extra : '');
			p.textContent = label;
			p.addEventListener('click', onclick);
			bar.appendChild(p);
			pills.push(p);
			return p;
		}

		function apply() {
			quietUntil = Date.now() + 4000; /* cambiando filtro la tabella si ricarica: niente bip */
			selectOnly(bandSel, state.bands);
			selectOnly(modeSel, state.modes);
			var ft8 = document.getElementById('exclft8');
			if (ft8) {
				ft8.checked = state.noft8;
			}
			if (typeof window.refresh_timer === 'function') {
				window.refresh_timer();
			}
		}

		/* values: elenco di valori (una banda, oppure il gruppo VHF+) */
		function toggle(list, values, pill) {
			var turnOn = !pill.classList.contains('on');
			values.forEach(function (value) {
				var i = list.indexOf(value);
				if (turnOn && i === -1) {
					list.push(value);
				} else if (!turnOn && i !== -1) {
					list.splice(i, 1);
				}
			});
			pill.classList.toggle('on', turnOn);
			allPill.classList.toggle('on', !state.bands.length && !state.modes.length && !state.noft8);
			apply();
		}

		var allPill = mk('Tutti', function () {
			state.bands = []; state.modes = []; state.noft8 = false;
			pills.forEach(function (p) { p.classList.remove('on'); });
			allPill.classList.add('on');
			apply();
		}, 'on');

		var opts = [].map.call(bandSel.options, function (o) { return o.value; });
		var hf = opts.filter(function (v) { return /^\d+$/.test(v) && v !== '60'; })
			.sort(function (a, b) { return Number(b) - Number(a); });
		var vhf = opts.filter(function (v) { return !/^\d+$/.test(v); });

		hf.forEach(function (v) {
			var p = mk(v + 'm', function () { toggle(state.bands, [v], p); });
		});
		if (vhf.length) {
			var pv = mk('VHF+', function () { toggle(state.bands, vhf, pv); });
		}

		var sep = document.createElement('span');
		sep.className = 'wc-sep';
		bar.appendChild(sep);

		[['CW', 'cw'], ['SSB', 'phone'], ['Digi', 'digi']].forEach(function (m) {
			var p = mk(m[0], function () { toggle(state.modes, [m[1]], p); });
		});
		var pf = mk('Senza FT8', function () {
			state.noft8 = !state.noft8;
			pf.classList.toggle('on', state.noft8);
			allPill.classList.toggle('on', !state.bands.length && !state.modes.length && !state.noft8);
			apply();
		});

		/* il pulsante imbuto (apre il pannello filtri) va nella stessa riga, dopo "Senza FT8" */
		var funnel = document.querySelector('button[data-bs-target="#collapseFilters"]');
		if (funnel) {
			var oldRow = funnel.closest('.row');
			funnel.classList.add('wc-funnel');
			bar.appendChild(funnel);
			if (oldRow && !oldRow.querySelector('button')) {
				oldRow.style.display = 'none';
			}
		}

		var form = document.getElementById('form-filters');
		if (form) {
			form.addEventListener('submit', function () { quietUntil = Date.now() + 4000; });
			form.addEventListener('reset', function () {
				quietUntil = Date.now() + 4000;
				state.bands = []; state.modes = []; state.noft8 = false;
				pills.forEach(function (p) { p.classList.remove('on'); });
				allPill.classList.add('on');
			});
		}
	}

	function init() {
		addThemeButton();
		buildQuickBar();
		watchTable();
		setupPromo();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
