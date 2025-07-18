// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de', 'nl', 'ru'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${lang ? lang + '/' : ''}${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
		en: 'Detail Product',
		ko: '제품 상세보기',
		ja: '商品詳細',
		de: 'Produktdetails',
		pl: 'Szczegóły produktu',
		th: 'ดูรายละเอียดสินค้า',
		es: 'Detalles del producto',
		pt: 'Detalhes do produto',
		ar: 'تفاصيل المنتج',
		it: 'Dettagli del prodotto',
		fr: 'Détails du produit',
		nl: 'Productdetails',
		ru: 'Детали продукта'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrls[0]}">
<meta property="og:url" content="${url.href}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="exclusive.gooleg.pl">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb" id="breadcrumbBox"></div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>

<script>
const _0x52ef99=_0x385f;function _0x4d09(){const _0x1b5b4a=['Populair','หน้าหลัก','Inicio','4387614wTpqBb','60faATML','ยอดนิยม','11810151DenYrm','1057372AqQjfZ','8264311ECdcOU','Popular','Populares','ホーム','HOME','Popularne','49RjVKIs','Home','3112200lDGfjb','Accueil','الأكثر\x20شهرة','Популярное','33918ZRGLAJ','Startseite','Beliebt','112ZqmNNC','10MLoefs','Главная','25vHBNxD','الرئيسية','Início','815255gxOfDq','Strona\x20główna'];_0x4d09=function(){return _0x1b5b4a;};return _0x4d09();}(function(_0x5bc528,_0x4e5428){const _0x5a00fe=_0x385f,_0x2a43b0=_0x5bc528();while(!![]){try{const _0x3520a2=-parseInt(_0x5a00fe(0x15d))/0x1*(parseInt(_0x5a00fe(0x163))/0x2)+-parseInt(_0x5a00fe(0x15f))/0x3+-parseInt(_0x5a00fe(0x156))/0x4*(parseInt(_0x5a00fe(0x14a))/0x5)+parseInt(_0x5a00fe(0x152))/0x6+-parseInt(_0x5a00fe(0x14d))/0x7*(parseInt(_0x5a00fe(0x166))/0x8)+-parseInt(_0x5a00fe(0x155))/0x9*(-parseInt(_0x5a00fe(0x167))/0xa)+-parseInt(_0x5a00fe(0x157))/0xb*(-parseInt(_0x5a00fe(0x153))/0xc);if(_0x3520a2===_0x4e5428)break;else _0x2a43b0['push'](_0x2a43b0['shift']());}catch(_0x28efd7){_0x2a43b0['push'](_0x2a43b0['shift']());}}}(_0x4d09,0xef1c5));function _0x385f(_0x3ffb54,_0x5ec1d2){const _0x4d09ae=_0x4d09();return _0x385f=function(_0x385f49,_0x176be1){_0x385f49=_0x385f49-0x14a;let _0x34251f=_0x4d09ae[_0x385f49];return _0x34251f;},_0x385f(_0x3ffb54,_0x5ec1d2);}const lang='${lang}',homeLabels={'ko':'홈','fr':_0x52ef99(0x160),'es':_0x52ef99(0x151),'pt':_0x52ef99(0x14c),'it':_0x52ef99(0x15e),'ja':_0x52ef99(0x15a),'en':_0x52ef99(0x15b),'pl':_0x52ef99(0x14e),'de':_0x52ef99(0x164),'th':_0x52ef99(0x150),'ar':_0x52ef99(0x14b),'nl':'Startpagina','ru':_0x52ef99(0x168)},popularLabels={'ko':'인기','fr':'Populaires','es':_0x52ef99(0x159),'pt':_0x52ef99(0x159),'it':'Popolari','ja':'人気','en':_0x52ef99(0x158),'pl':_0x52ef99(0x15c),'de':_0x52ef99(0x165),'th':_0x52ef99(0x154),'ar':_0x52ef99(0x161),'nl':_0x52ef99(0x14f),'ru':_0x52ef99(0x162)},labelHome=homeLabels[lang]||homeLabels['en'],labelPopulars=popularLabels[lang]||popularLabels['en'];
const data = {
first_level_category_name: "${data.first_level_category_name || ''}",
second_level_category_name: "${data.second_level_category_name || ''}"
};
</script>
<script>
document.addEventListener("DOMContentLoaded", function () {
const breadcrumbBox = document.getElementById("breadcrumbBox");

const first = data.first_level_category_name?.trim();
const second = data.second_level_category_name?.trim();
const safeFirst = first || labelPopulars;
const safeSecond = second || labelPopulars;

const searchQuery = encodeURIComponent(safeSecond);
const targetUrl = "https://www.aliexpress.com/wholesale?SearchText=" + searchQuery;
const affUrl = "https://s.click.aliexpress.com/deep_link.htm?aff_short_key=_DkhJKeT&dl_target_url=" + encodeURIComponent(targetUrl);

if (first && second) {
  breadcrumbBox.innerHTML =
    '<a href="/">🏠 ' + labelHome + '</a>' +
    '<span> › </span>' +
    '<a href="/nav?cat=' + encodeURIComponent(first) + '" data-aff="' + affUrl + '" class="breadcrumb-aff" rel="nofollow">' + safeFirst + '</a>' +
    '<span> › </span>' +
    '<a href="/nav?cat=' + searchQuery + '" data-aff="' + affUrl + '" class="breadcrumb-aff" rel="nofollow">' + safeSecond + '</a>';
} else if (first) {
  breadcrumbBox.innerHTML =
    '<a href="/">🏠 ' + labelHome + '</a>' +
    '<span> › </span>' +
    '<a href="/nav?cat=' + encodeURIComponent(first) + '" data-aff="' + affUrl + '" class="breadcrumb-aff" rel="nofollow">' + safeFirst + '</a>';
} else if (second) {
  breadcrumbBox.innerHTML =
    '<a href="/">🏠 ' + labelHome + '</a>' +
    '<span> › </span>' +
    '<a href="/nav?cat=' + searchQuery + '" data-aff="' + affUrl + '" class="breadcrumb-aff" rel="nofollow">' + safeSecond + '</a>';
} else {
  breadcrumbBox.innerHTML =
    '<a href="/">🏠 ' + labelHome + '</a>' +
    '<span> › </span>' +
    '<a href="/nav?cat=' + encodeURIComponent(labelPopulars) + '" data-aff="' + affUrl + '" class="breadcrumb-aff" rel="nofollow">' + labelPopulars + '</a>';
}

// Setup redirect saat klik
document.querySelectorAll("a.breadcrumb-aff").forEach(function (el) {
el.addEventListener("click", function (e) {
const aff = el.getAttribute("data-aff");
if (aff) {
e.preventDefault();
window.open(aff, "_blank");
}
});
});
});
</script>

<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
if (!isBot && !navigator.webdriver) {
setTimeout(() => {
location.href = "${affUrl}";
}, 3000);
}
})();
</script>

<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
let lang = "${lang}";
const redirectUrlHuman = "${affUrl}";
if (lang === "en") lang = "www";
const redirectUrlBot = "https://" + lang + ".aliexpress.com/item/${data.productId}.html";
if (isBot) {
setTimeout(() => {
location.href = redirectUrlBot;
}, 3000);
} else {
setTimeout(() => {
location.href = redirectUrlHuman;
}, 3000);
}
})();
</script>

</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;

		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		if (!self.verificationLists) {
			self.verificationLists = [];

			const sources = [
				{ url: "https://exclusive.gooleg.pl/url-.txt", base: "https://.github.io/" },
				{ url: "https://exclusive.gooleg.pl/url-.txt", base: "https://.github.io/" },
				{ url: "https://exclusive.gooleg.pl/url-.txt", base: "https://.github.io/" },
				{ url: "https://exclusive.gooleg.pl/url-.txt", base: "https://.github.io/" },
				{ url: "https://exclusive.gooleg.pl/url-.txt", base: "https://.github.io/" },
			];

			// Ambil semua daftar verifikasi sekaligus
			self.verificationLists = await Promise.all(
				sources.map(async ({ url, base }) => {
					const res = await fetch(url);
					const text = await res.text();
					const paths = new Set(
						text.split("\n").map(line => line.trim()).filter(Boolean)
					);
					return { base, paths };
				})
			);
		}

		// Cek apakah `cleanPath` ada di salah satu verification list
		for (const { base, paths } of self.verificationLists) {
			if (paths.has(cleanPath)) {
				const filenameOnly = cleanPath.split('/').pop();
				const fileRes = await fetch(`${base}${filenameOnly}`);

				if (!fileRes.ok) {
					return new Response("Failed to load verification file", { status: 502 });
				}

				const buffer = await fileRes.arrayBuffer();

				const getContentType = (filename) => {
					const ext = filename.split('.').pop().toLowerCase();
					const map = {
						gz: 'application/gzip',
						zip: 'application/zip',
						xml: 'application/xml',
						json: 'application/json',
						txt: 'text/plain; charset=UTF-8',
						html: 'text/html; charset=UTF-8',
						csv: 'text/csv; charset=UTF-8',
						pdf: 'application/pdf',
					};
					return map[ext] || 'application/octet-stream';
				};

				const contentType = getContentType(filenameOnly);

				return new Response(buffer, {
					status: 200,
					headers: {
						"Content-Type": contentType,
						"Cache-Control": "public, max-age=3600",
						...(filenameOnly.endsWith(".gz") || filenameOnly.endsWith(".zip") ? {
							"Content-Disposition": `attachment; filename="${filenameOnly}"`
						} : {}),
					},
				});
			}
		}

		if (pathname === "/google7036b105887f4263.html") {
			const fileRes = await fetch("https://nde.buytostore.com/google7036b105887f4263.html");

			if (!fileRes.ok) {
				return new Response("Failed to load verification file", { status: 502 });
			}

			const html = await fileRes.text();

			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=UTF-8",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>exclusive.gooleg.pl</title>
<meta name="robots" content="noindex, follow" />
<meta name="description" content="Find your dream product from thousands of deals. Shop smarter, live better with exclusive.gooleg.pl." />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<style>
body {
margin: 0;
padding: 0;
font-family: Arial, sans-serif;
background: linear-gradient(to bottom right, #f4f6ff, #ffffff);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
padding: 20px;
text-align: center;
}
.logo {
font-family: 'Poppins', sans-serif;
font-size: 48px;
font-weight: 700;
color: #673ab7;
text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
}
.tagline {
font-size: 16px;
color: #666;
margin-top: 5px;
margin-bottom: 25px;
font-style: italic;
}
.search-form {
display: flex;
border: 1px solid #ccc;
border-radius: 4px;
overflow: hidden;
max-width: 500px;
width: 100%;
background: #fff;
}
input[type="text"] {
flex: 1;
font-size: 16px;
padding: 10px 14px;
border: none;
outline: none;
}
button {
background-color: #4285f4;
border: none;
padding: 0 16px;
cursor: pointer;
}
button svg {
fill: white;
width: 18px;
height: 18px;
}
.popular-links {
list-style: none;
padding: 0;
margin-top: 40px;
}
.popular-links li {
margin: 6px 0;
}
.popular-links a {
color: #333;
text-decoration: none;
font-size: 15px;
}
.popular-links a:hover {
text-decoration: underline;
}
@media (max-width: 600px) {
.logo { font-size: 36px; }
.tagline { font-size: 14px; }
}
</style>
</head>
<body>
<div class="logo" id="logo">exclusive.gooleg.pl</div>
<p class="tagline" id="tagline">Find your dream product here</p>

<form id="searchForm" class="search-form">
<input type="text" id="searchInput" placeholder="Find your dream product..." autofocus />
<button type="submit" aria-label="Search">
<svg viewBox="0 0 24 24">
<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 
6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 
4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 
6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 
10.5 14z"/>
</svg>
</button>
</form>
<ul class="popular-links" id="popularLinks"></ul>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
window.addEventListener("DOMContentLoaded", () => {
const logoText = "exclusive.gooleg.pl";
const logoColors = ["#4285f4", "#ea4335", "#fbbc05", "#34a853", "#ff6f00", "#9c27b0"];
const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];
const logoEl = document.getElementById("logo");
logoEl.textContent = logoText;
logoEl.style.color = randomColor;

const taglines = [
"Smart shopping, better living.",
"Find the best deals for you.",
"Buy smarter, live happier.",
"Start your discovery here.",
"Products you'll love, prices you'll smile at."
];
document.getElementById("tagline").textContent =
taglines[Math.floor(Math.random() * taglines.length)];

const _0x422142=_0x4b76;function _0x30e3(){const _0x14a2cd=['4MfbxkV','_Dl1kcBD','535749GRfudU','117nwKhMW','154520NCLpul','13322485ocHVnU','1013059UglWrT','3653672yHyqQW','16WPumWk','12etncKy','2377585kVdbHN','656290oTUbZJ'];_0x30e3=function(){return _0x14a2cd;};return _0x30e3();}function _0x4b76(_0x5cfe7c,_0x3fa128){const _0x30e309=_0x30e3();return _0x4b76=function(_0x4b7678,_0x98761f){_0x4b7678=_0x4b7678-0x94;let _0x14bcaf=_0x30e309[_0x4b7678];return _0x14bcaf;},_0x4b76(_0x5cfe7c,_0x3fa128);}(function(_0x5567f9,_0xdd895b){const _0x288075=_0x4b76,_0x320f2e=_0x5567f9();while(!![]){try{const _0x32cef5=parseInt(_0x288075(0x98))/0x1+parseInt(_0x288075(0x9e))/0x2*(-parseInt(_0x288075(0x94))/0x3)+parseInt(_0x288075(0x99))/0x4+-parseInt(_0x288075(0x9d))/0x5*(parseInt(_0x288075(0x9b))/0x6)+parseInt(_0x288075(0x9c))/0x7*(parseInt(_0x288075(0x9a))/0x8)+parseInt(_0x288075(0x95))/0x9*(-parseInt(_0x288075(0x96))/0xa)+-parseInt(_0x288075(0x97))/0xb;if(_0x32cef5===_0xdd895b)break;else _0x320f2e['push'](_0x320f2e['shift']());}catch(_0x2d064b){_0x320f2e['push'](_0x320f2e['shift']());}}}(_0x30e3,0x8c28e));const affKey=_0x422142(0x9f);
const popularProducts = [
{ name: "Smart Home Devices", keyword: "smart home gadgets" },
{ name: "Wearable Tech (Smartwatches & Fitness)", keyword: "fitness tracker" },
{ name: "AI‑Powered Home Appliances", keyword: "AI-infused appliances" },
{ name: "Eco‑Friendly & Solar Tech", keyword: "solar charger" },
{ name: "AR/VR Headsets", keyword: "AR glasses" },
{ name: "Foldable Phones", keyword: "foldable phone" },
{ name: "Drones (Camera Drones)", keyword: "drone" },
{ name: "Portable/Wireless Chargers", keyword: "portable charger" },
{ name: "Earable Devices", keyword: "earable technology" },
{ name: "Smart Sleep Gadgets", keyword: "Bluetooth sleep mask" },
{ name: "Robot Cleaners & Outdoor Tech", keyword: "smart vacuum" },
{ name: "Gaming Handheld Consoles", keyword: "handheld gaming PC" },
{ name: "Smart Speakers & Mirrors", keyword: "smart mirror" },
{ name: "Tablet/Laptop Stands with Hubs", keyword: "tablet stand with USB-C hub" }
];
const _0x59bbf6=_0x513b;function _0x513b(_0x5d5af0,_0x5331ab){const _0x15e507=_0x15e5();return _0x513b=function(_0x513b92,_0x2fd33b){_0x513b92=_0x513b92-0x125;let _0x25a6ed=_0x15e507[_0x513b92];return _0x25a6ed;},_0x513b(_0x5d5af0,_0x5331ab);}(function(_0x15c65f,_0x20af4f){const _0x2f71d3=_0x513b,_0x270ed3=_0x15c65f();while(!![]){try{const _0xec6239=parseInt(_0x2f71d3(0x12d))/0x1*(-parseInt(_0x2f71d3(0x137))/0x2)+parseInt(_0x2f71d3(0x131))/0x3+parseInt(_0x2f71d3(0x134))/0x4+-parseInt(_0x2f71d3(0x125))/0x5+-parseInt(_0x2f71d3(0x12e))/0x6*(-parseInt(_0x2f71d3(0x135))/0x7)+-parseInt(_0x2f71d3(0x12a))/0x8+parseInt(_0x2f71d3(0x12c))/0x9*(parseInt(_0x2f71d3(0x138))/0xa);if(_0xec6239===_0x20af4f)break;else _0x270ed3['push'](_0x270ed3['shift']());}catch(_0x296226){_0x270ed3['push'](_0x270ed3['shift']());}}}(_0x15e5,0xace0c),document[_0x59bbf6(0x136)](_0x59bbf6(0x132))['addEventListener']('submit',function(_0x336f2){const _0x35a57d=_0x59bbf6;_0x336f2['preventDefault']();const _0x20979b=document[_0x35a57d(0x136)](_0x35a57d(0x12f))[_0x35a57d(0x12b)][_0x35a57d(0x130)]();if(!_0x20979b)return;const _0x491771=encodeURIComponent(_0x20979b[_0x35a57d(0x127)](/\s+/g,'+')),_0x4b197f=_0x35a57d(0x126)+_0x491771,_0x479c21=_0x35a57d(0x129)+affKey+_0x35a57d(0x128)+encodeURIComponent(_0x4b197f);window['location'][_0x35a57d(0x133)]=_0x479c21;}));function _0x15e5(){const _0x2264c6=['value','690003iBmVwE','1DeDIoa','318Zkcpdp','searchInput','trim','3732699ZoaPyD','searchForm','href','1659648ZmmTXI','72107MVdBwD','getElementById','1154958EVreQp','10WutcHH','88245InVdBV','https://www.aliexpress.com/wholesale?SearchText=','replace','&dl_target_url=','https://s.click.aliexpress.com/deep_link.htm?aff_short_key=','7828232zNpyhw'];_0x15e5=function(){return _0x2264c6;};return _0x15e5();}
const _0x4d7862=_0x1715;function _0x34f4(){const _0x1029e3=['https://www.aliexpress.com/wholesale?SearchText=','152wbGizn','innerHTML','random','getElementById','178822xtmqrR','popularLinks','&dl_target_url=','name','https://s.click.aliexpress.com/deep_link.htm?aff_short_key=','1971432uEufeM','</a>','1371034RaeqWb','appendChild','sort','30368oDVsne','<a\x20href=\x22','createElement','613798hzRMRP','1872753ByXCZW','forEach','17245XeoTVY','\x22\x20target=\x22_blank\x22>','slice'];_0x34f4=function(){return _0x1029e3;};return _0x34f4();}(function(_0x4fc3b4,_0x594173){const _0x35600e=_0x1715,_0xfcc0b1=_0x4fc3b4();while(!![]){try{const _0x1a4ff2=-parseInt(_0x35600e(0x15f))/0x1+parseInt(_0x35600e(0x16a))/0x2+parseInt(_0x35600e(0x160))/0x3+-parseInt(_0x35600e(0x166))/0x4*(-parseInt(_0x35600e(0x162))/0x5)+parseInt(_0x35600e(0x16f))/0x6+-parseInt(_0x35600e(0x171))/0x7+-parseInt(_0x35600e(0x174))/0x8;if(_0x1a4ff2===_0x594173)break;else _0xfcc0b1['push'](_0xfcc0b1['shift']());}catch(_0x380d1c){_0xfcc0b1['push'](_0xfcc0b1['shift']());}}}(_0x34f4,0x57da0));const ul=document[_0x4d7862(0x169)](_0x4d7862(0x16b));function _0x1715(_0x89b2fe,_0x2e6f2d){const _0x34f4d7=_0x34f4();return _0x1715=function(_0x1715fa,_0x5799ac){_0x1715fa=_0x1715fa-0x15d;let _0x429dd2=_0x34f4d7[_0x1715fa];return _0x429dd2;},_0x1715(_0x89b2fe,_0x2e6f2d);}popularProducts[_0x4d7862(0x173)](()=>0.5-Math[_0x4d7862(0x168)]()),popularProducts[_0x4d7862(0x164)](0x0,0x4)[_0x4d7862(0x161)](_0x565bbf=>{const _0x24b66f=_0x4d7862,_0x54480d=_0x24b66f(0x165)+encodeURIComponent(_0x565bbf['keyword']),_0xfab9fb=_0x24b66f(0x16e)+affKey+_0x24b66f(0x16c)+encodeURIComponent(_0x54480d),_0x2f56c0=document[_0x24b66f(0x15e)]('li');_0x2f56c0[_0x24b66f(0x167)]=_0x24b66f(0x15d)+_0xfab9fb+_0x24b66f(0x163)+_0x565bbf[_0x24b66f(0x16d)]+_0x24b66f(0x170),ul[_0x24b66f(0x172)](_0x2f56c0);});
document.getElementById("searchInput").focus();
});
</script>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.cometopl'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const supportedLangs = ['ko', 'en', 'ja', 'fr', 'pt', 'it', 'es', 'de', 'pl', 'th', 'ar', 'nl', 'ru']; // bisa ditambah

		let slugPath = decodeURIComponent(pathname.slice(1));
		let langFromPath = null;

		// Cek apakah slug mengandung prefix bahasa
		for (const langPrefix of supportedLangs) {
			if (slugPath.startsWith(`${langPrefix}/`)) {
				langFromPath = langPrefix;
				slugPath = slugPath.slice(langPrefix.length + 1);
				break;
			}
		}

		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);
		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		// Gunakan lang dari path jika ada, kalau tidak pakai deteksi
		const lang = langFromPath || detectLang(effectiveDomain, slug, suffix);

		const realang = lang === "en" ? "www" : lang;
		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://kempot.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};

