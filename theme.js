const useLocalStorage = true;

let root;

let pageTheme = localStorage.theme == undefined ? 'default' : localStorage.theme;


setInterval(checkIsLoaded, 1);

let isLoaded = false;
function checkIsLoaded() {
    if(isLoaded) return;
    if(document.body == null) return;
	root = document.querySelector(':root');
	updateTheme();
	// document.body.style.transition = 'background 5.3s ease-in-out';
    isLoaded = true;
}

window.matchMedia('(prefers-color-scheme: dark)').onchange = function() {
	updateTheme();
}

/*

	--color-bg: #151515;
	--color-bg-light: #333;
	--color-bg-lighter: #444;
	--color-bg-extralight: #555;

	--color-fg-dark: #CCC;
	--color-fg: #EEE;
	--color-fg-light: #FFF;
*/

let styleColorsNames = [
	'bg',
	'bg-light',
	'bg-lighter',
	// 'bg-extralight',

	'fg-dark',
	'fg',
	'fg-light',

	'border',
	'border-action',

	'scrollbar',
	'scrollbar-thumb'
];

let styleColors = [
	// bg		bg-light	bg-lighter	fg-dark		fg			fg-light	border 		border-act	scrollbar	sbar-thumb
	['#151515', '#333333', 	'#444444', 	'#CCCCCC',	'#EEEEEE',	'#FFFFFF',	'#333333',	'#555555',	'#111111',	'#555555'],
	['#FFFFFF', '#EEEEEE', 	'#DDDDDD', 	'#222222',	'#151515',	'#000000',	'#AAAAAA',	'#999999',	'#DDDDDD',	'#777777'],
	['#0096ff', '#33abff', 	'#5fbdff', 	'#CCCCCC',	'#FFFFFF',	'#FFFFFF',	'#5fbdff',	'#82cbfe',	'#111111',	'#555555']
];

let themeNames = ['dark', 'light', 'sky'];


function theme(theme) {
	pageTheme = theme;
	if(useLocalStorage) localStorage.theme = theme;
	updateTheme();
}

function updateTheme() {
	let theme = pageTheme;
	if(pageTheme == 'default') theme = getDefaultTheme();

	let themeID = themeNames.indexOf(theme);
	if(themeID == -1) return;

	for (var colorNameID = 0; colorNameID < styleColorsNames.length; colorNameID++) {
		let styleColorsName = styleColorsNames[colorNameID];
		console.log('--color-' + styleColorsName, styleColors[themeID][colorNameID]);
		root.style.setProperty('--color-' + styleColorsName, styleColors[themeID][colorNameID]);
	}
}

function getDefaultTheme(argument) {
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}