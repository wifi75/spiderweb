/*
 * Lingue del portale: it, en, pt, es, ru, fr, de, ja, zh.
 * La lingua si imposta da sola in base al browser di ciascuno; il menu a tendina permette di cambiarla
 * e la scelta viene ricordata. Se la lingua del browser non e tra queste, si usa l'inglese.
 * Espone window.wcI18n = { lang, t(chiave), country(nome, iso, tabellaIT) }.
 */
(function () {
	'use strict';

	var LANGS = [
		['it', 'Italiano'], ['en', 'English'], ['pt', 'Português'], ['es', 'Español'], ['ru', 'Русский'],
		['fr', 'Français'], ['de', 'Deutsch'], ['ja', '日本語'], ['zh', '中文']
	];
	var CODES = LANGS.map(function (l) { return l[0]; });
	var KEY = 'wc-lang';

	function detect() {
		try {
			var saved = localStorage.getItem(KEY);
			if (saved && CODES.indexOf(saved) !== -1) {
				return saved;
			}
		} catch (e) { /* storage non disponibile */ }
		var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
		for (var i = 0; i < list.length; i++) {
			var c = String(list[i]).toLowerCase().split('-')[0];
			if (CODES.indexOf(c) !== -1) {
				return c;
			}
		}
		return 'en';
	}

	var lang = detect();
	var IDX = CODES.indexOf(lang);

	/* ordine: it, en, pt, es, ru, fr, de, ja, zh */
	var STR = {
		all: ['Tutti', 'All', 'Todos', 'Todos', 'Все', 'Tous', 'Alle', 'すべて', '全部'],
		noft8: ['Senza FT8', 'No FT8', 'Sem FT8', 'Sin FT8', 'Без FT8', 'Sans FT8', 'Ohne FT8', 'FT8を除く', '不含 FT8'],
		connect: ['Collega il tuo cluster', 'Connect your cluster', 'Conecte o seu cluster', 'Conecta tu cluster', 'Подключить свой кластер', 'Connectez votre cluster', 'Verbinde deinen Cluster', 'あなたのクラスターを接続', '连接你的集群'],
		telnet_title: ['Accesso telnet', 'Telnet access', 'Acesso telnet', 'Acceso telnet', 'Доступ по telnet', 'Accès telnet', 'Telnet-Zugang', 'Telnetアクセス', 'Telnet 访问'],
		promo_text: [
			'Il software gratuito e open source per radioamatori: FT8, FT4, CW, RTTY, SSTV e molto altro, per Windows, Linux e macOS.',
			'Free, open-source software for radio amateurs: FT8, FT4, CW, RTTY, SSTV and much more, for Windows, Linux and macOS.',
			'O software gratuito e de código aberto para radioamadores: FT8, FT4, CW, RTTY, SSTV e muito mais, para Windows, Linux e macOS.',
			'El software gratuito y de código abierto para radioaficionados: FT8, FT4, CW, RTTY, SSTV y mucho más, para Windows, Linux y macOS.',
			'Бесплатное программное обеспечение с открытым кодом для радиолюбителей: FT8, FT4, CW, RTTY, SSTV и многое другое для Windows, Linux и macOS.',
			'Le logiciel gratuit et open source pour radioamateurs : FT8, FT4, CW, RTTY, SSTV et bien plus, pour Windows, Linux et macOS.',
			'Die kostenlose Open-Source-Software für Funkamateure: FT8, FT4, CW, RTTY, SSTV und vieles mehr, für Windows, Linux und macOS.',
			'アマチュア無線家のための無料のオープンソースソフトウェア。FT8、FT4、CW、RTTY、SSTVなど、Windows・Linux・macOSに対応。',
			'面向业余无线电爱好者的免费开源软件：FT8、FT4、CW、RTTY、SSTV 等，支持 Windows、Linux 和 macOS。'
		],
		promo_btn: ['Scopri Aurora', 'Discover Aurora', 'Conheça o Aurora', 'Descubre Aurora', 'Узнать об Aurora', 'Découvrir Aurora', 'Aurora entdecken', 'Auroraを見る', '了解 Aurora'],
		promo_close: ['Chiudi l\'annuncio', 'Close the ad', 'Fechar o anúncio', 'Cerrar el anuncio', 'Закрыть объявление', 'Fermer l\'annonce', 'Anzeige schließen', '広告を閉じる', '关闭广告'],
		spots_list: ['Elenco spot', 'Spots list', 'Lista de spots', 'Lista de spots', 'Список спотов', 'Liste des spots', 'Spot-Liste', 'スポット一覧', 'Spot 列表'],
		th_country: ['Paese', 'Country', 'País', 'País', 'Страна', 'Pays', 'Land', '国', '国家'],
		th_comments: ['Commenti', 'Comments', 'Comentários', 'Comentarios', 'Комментарии', 'Commentaires', 'Kommentare', 'コメント', '备注'],
		menu_charts: ['Statistiche', 'Charts & stats', 'Estatísticas', 'Estadísticas', 'Статистика', 'Statistiques', 'Statistik', '統計', '统计'],
		menu_prop: ['Propagazione', 'Propagation', 'Propagação', 'Propagación', 'Прохождение', 'Propagation', 'Ausbreitung', '電波伝搬', '电波传播'],
		footer_privacy: ['Privacy', 'Privacy', 'Privacidade', 'Privacidad', 'Конфиденциальность', 'Confidentialité', 'Datenschutz', 'プライバシー', '隐私'],
		footer_cookies: ['Cookies', 'Cookies', 'Cookies', 'Cookies', 'Cookies', 'Cookies', 'Cookies', 'Cookie', 'Cookie'],
		visits: ['Visite uniche al sito:', 'Website unique visits:', 'Visitas únicas ao site:', 'Visitas únicas al sitio:', 'Уникальные посещения сайта:', 'Visites uniques du site :', 'Eindeutige Website-Besuche:', 'サイトの訪問者数:', '网站独立访客：'],
		callsign: ['Nominativo', 'callsign', 'Indicativo', 'Indicativo', 'Позывной', 'Indicatif', 'Rufzeichen', 'コールサイン', '呼号'],
		sound_on: ['Suono nuovi spot: acceso', 'New-spot sound: on', 'Som de novos spots: ligado', 'Sonido de nuevos spots: activado', 'Звук новых спотов: вкл.', 'Son des nouveaux spots : activé', 'Ton bei neuen Spots: an', '新着スポット音：オン', '新 Spot 提示音：开'],
		sound_off: ['Suono nuovi spot: spento', 'New-spot sound: off', 'Som de novos spots: desligado', 'Sonido de nuevos spots: desactivado', 'Звук новых спотов: выкл.', 'Son des nouveaux spots : désactivé', 'Ton bei neuen Spots: aus', '新着スポット音：オフ', '新 Spot 提示音：关'],
		theme_to_dark: ['Tema scuro', 'Dark theme', 'Tema escuro', 'Tema oscuro', 'Тёмная тема', 'Thème sombre', 'Dunkles Design', 'ダークテーマ', '深色主题'],
		theme_to_light: ['Tema chiaro', 'Light theme', 'Tema claro', 'Tema claro', 'Светлая тема', 'Thème clair', 'Helles Design', 'ライトテーマ', '浅色主题'],
		lang_label: ['Lingua', 'Language', 'Idioma', 'Idioma', 'Язык', 'Langue', 'Sprache', '言語', '语言']
	};

	function t(key) {
		var row = STR[key];
		return row ? row[IDX] : key;
	}

	/* ---------- nomi dei paesi ---------- */
	/* codici ISO condivisi da piu entita (isole, territori): li traduciamo solo se l'entita e quella principale */
	var SHARED = {};
	('ag an aq at au ba br ca cc cg ch cl co cy de ec eh es fj fr gb gq gr gs gw ie in it jp ki kn lc mt mu mx my ni nl no nz pf ph pn pr pt ru sb se sh ss st tc tl tr tt tw us vc ve wf za')
		.split(' ').forEach(function (c) { SHARED[c] = true; });

	var MAIN = [
		'Antigua & Barbuda', 'Antarctica', 'Austria', 'Australia', 'Bosnia-Herzegovina', 'Brazil', 'Canada', 'Cocos (Keeling) Islands',
		'Switzerland', 'Chile', 'Colombia', 'Cyprus', 'Fed. Rep. of Germany', 'Ecuador', 'Western Sahara', 'Spain', 'Fiji', 'France',
		'Equatorial Guinea', 'Greece', 'Guinea-Bissau', 'Ireland', 'India', 'Italy', 'Japan', 'Central Kiribati', 'St. Kitts & Nevis',
		'St. Lucia', 'Malta', 'Mauritius', 'Mexico', 'West Malaysia', 'East Malaysia', 'Nicaragua', 'Netherlands', 'Norway', 'New Zealand',
		'French Polynesia', 'Philippines', 'Pitcairn Island', 'Puerto Rico', 'Portugal', 'European Russia', 'Asiatic Russia',
		'Solomon Islands', 'Sweden', 'St. Helena', 'Republic of South Sudan', 'Sao Tome & Principe', 'Turks & Caicos Islands',
		'Timor - Leste', 'European Turkey', 'Asiatic Turkey', 'Trinidad & Tobago', 'Taiwan', 'United States', 'St. Vincent',
		'Venezuela', 'Wallis & Futuna Islands', 'South Africa', 'Republic of the Congo'
	];

	/* isole e regioni che non hanno un nome "di paese": it (gia nella tabella di theme.js) e en restano come sono */
	var SPECIAL = {
		'England': ['Inglaterra', 'Inglaterra', 'Англия', 'Angleterre', 'England', 'イングランド', '英格兰'],
		'Scotland': ['Escócia', 'Escocia', 'Шотландия', 'Écosse', 'Schottland', 'スコットランド', '苏格兰'],
		'Wales': ['País de Gales', 'Gales', 'Уэльс', 'Pays de Galles', 'Wales', 'ウェールズ', '威尔士'],
		'Northern Ireland': ['Irlanda do Norte', 'Irlanda del Norte', 'Северная Ирландия', 'Irlande du Nord', 'Nordirland', '北アイルランド', '北爱尔兰'],
		'Sicily': ['Sicília', 'Sicilia', 'Сицилия', 'Sicile', 'Sizilien', 'シチリア', '西西里'],
		'Sardinia': ['Sardenha', 'Cerdeña', 'Сардиния', 'Sardaigne', 'Sardinien', 'サルデーニャ', '撒丁岛'],
		'Corsica': ['Córsega', 'Córcega', 'Корсика', 'Corse', 'Korsika', 'コルシカ', '科西嘉'],
		'Hawaii': ['Havaí', 'Hawái', 'Гавайи', 'Hawaï', 'Hawaii', 'ハワイ', '夏威夷'],
		'Alaska': ['Alasca', 'Alaska', 'Аляска', 'Alaska', 'Alaska', 'アラスカ', '阿拉斯加'],
		'Canary Islands': ['Ilhas Canárias', 'Islas Canarias', 'Канарские острова', 'Îles Canaries', 'Kanarische Inseln', 'カナリア諸島', '加那利群岛'],
		'Balearic Islands': ['Ilhas Baleares', 'Islas Baleares', 'Балеарские острова', 'Îles Baléares', 'Balearen', 'バレアレス諸島', '巴利阿里群岛'],
		'Azores': ['Açores', 'Azores', 'Азорские острова', 'Açores', 'Azoren', 'アゾレス諸島', '亚速尔群岛'],
		'Madeira Islands': ['Madeira', 'Madeira', 'Мадейра', 'Madère', 'Madeira', 'マデイラ諸島', '马德拉群岛'],
		'Crete': ['Creta', 'Creta', 'Крит', 'Crète', 'Kreta', 'クレタ島', '克里特岛'],
		'Kaliningrad': ['Kaliningrado', 'Kaliningrado', 'Калининград', 'Kaliningrad', 'Kaliningrad', 'カリーニングラード', '加里宁格勒']
	};
	/* SPECIAL parte da pt: indici 0..6 = pt, es, ru, fr, de, ja, zh */
	var SPECIAL_ORDER = ['pt', 'es', 'ru', 'fr', 'de', 'ja', 'zh'];

	var dn = null;
	function displayNames() {
		if (dn === null) {
			try {
				dn = new Intl.DisplayNames([lang === 'zh' ? 'zh-CN' : lang], { type: 'region' });
			} catch (e) {
				dn = false;
			}
		}
		return dn;
	}

	function country(en, iso, itTable) {
		if (!en) {
			return en;
		}
		if (lang === 'it' && itTable && itTable[en]) {
			return itTable[en];
		}
		var sp = SPECIAL[en];
		var spi = SPECIAL_ORDER.indexOf(lang);
		if (sp && spi !== -1) {
			return sp[spi];
		}
		if (iso && iso !== 'xx' && (!SHARED[iso] || MAIN.indexOf(en) !== -1)) {
			var d = displayNames();
			if (d) {
				try {
					var n = d.of(iso.toUpperCase());
					if (n && n !== iso.toUpperCase()) {
						return n;
					}
				} catch (e) { /* codice non valido */ }
			}
		}
		return en;
	}

	/* ---------- testi gia presenti nella pagina ---------- */
	function setText(el, txt) {
		if (el && el.textContent !== txt) {
			el.textContent = txt;
		}
	}

	function applyStatic() {
		document.documentElement.setAttribute('lang', lang);

		[].forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
			setText(el, t(el.getAttribute('data-i18n')));
		});
		[].forEach.call(document.querySelectorAll('[data-i18n-title]'), function (el) {
			el.title = t(el.getAttribute('data-i18n-title'));
		});
		[].forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (el) {
			el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
		});

		/* intestazioni della tabella e menu: testi originali di Spiderweb, in inglese */
		[].forEach.call(document.querySelectorAll('#spotsTable thead th'), function (th) {
			var x = th.textContent.trim();
			if (x === 'Country') { setText(th, t('th_country')); }
			if (x === 'Comments') { setText(th, t('th_comments')); }
		});
		[].forEach.call(document.querySelectorAll('.navbar-nav .nav-link'), function (a) {
			var x = a.firstChild ? String(a.firstChild.textContent).trim() : '';
			if (x === 'Charts & stats' && a.firstChild) { a.firstChild.textContent = t('menu_charts'); }
			if (x === 'Propagation' && a.firstChild) { a.firstChild.textContent = t('menu_prop'); }
		});
		var cs = document.getElementById('callsignInput');
		if (cs) {
			cs.setAttribute('placeholder', t('callsign'));
		}
		var vis = document.querySelector('footer strong');
		if (vis && vis.previousSibling && vis.previousSibling.nodeType === 3) {
			vis.previousSibling.textContent = ' ' + t('visits') + ' ';
		}
	}

	function setLang(code) {
		try { localStorage.setItem(KEY, code); } catch (e) { /* ignora */ }
		window.location.reload();
	}

	window.wcI18n = { lang: lang, langs: LANGS, t: t, country: country, setLang: setLang, applyStatic: applyStatic };

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyStatic);
	} else {
		applyStatic();
	}
})();
