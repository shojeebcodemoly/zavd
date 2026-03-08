import type { Product } from "@/types/product";

export const featuredProducts: Product[] = [
	{
		id: "pico",
		brochureUrl:
			"https://www.synos.se/wp-content/uploads/2024/04/Toro-Brochyr-svenska.pdf",
		videoUrl: "https://www.youtube.com/watch?v=example",
		slug: "pico",
		name: "TORO Pico Laser",
		description:
			"TORO laser for professional tattoo removal. Market-leading technology with three wavelengths. Invest in the in-demand treatment of the future.",
		longDescription: `<h1 style="line-height: 1.05"><strong>TORO Advanced Pico Laser – Sweden&apos;s Smartest Investment for Tattoo Removal</strong></h1>

<h2 style="line-height: 1.25"><strong>Why Do Leading Swedish Clinics Choose TORO?</strong></h2>

<div>TORO is the only machine that combines the wavelengths 785nm, 1064nm and 532nm in one system. This means faster results, fewer treatments and significantly higher profitability for your clinic.</div>

<h2 style="line-height: 1.25"><strong>Three Wavelengths – A Complete Solution for All Tattoo Colors</strong></h2>

<div><strong>Advanced triple-wavelength technology:</strong></div>

<ul>
  <li><strong>1064nm</strong> &nbsp;– Optimal for black and dark blue tattoos</li>
  <li><strong>532nm</strong> &nbsp;– Perfect for red, orange and purple pigments</li>
  <li><strong>785nm</strong> &nbsp;– Groundbreaking technology for difficult colors like green and blue</li>
</ul>

<h2 style="line-height: 1.25"><strong>Documented Business Benefits for Your Clinic</strong></h2>

<h3 style="line-height: 1.25"><strong>Faster ROI and Higher Profitability</strong></h3>

<div><strong>Concrete results:</strong></div>

<ul>
  <li>50% fewer treatments than traditional Q-switch systems</li>
  <li>Shorter processing times = more customers per day</li>
  <li>Average price per session: 2000-4000 SEK</li>
  <li>Fast payback time: Typically 8-12 months</li>
</ul>

<div><strong>Broader target audience:</strong></div>

<ul>
  <li>Safely treats all skin types (Fitzpatrick I-VI)</li>
  <li>Effective on both new and old tattoos</li>
  <li>Minimal pain attracts more customers</li>
</ul>

<h2 style="line-height: 1.25"><strong>Medical Safety and Quality</strong></h2>

<div><strong>MDR certified equipment:</strong></div>

<ul>
  <li>MDR-marked for medical use</li>
  <li>Intelligent cooling system minimizes discomfort</li>
  <li>Ultra-short pulses (6-8 ns) reduce scarring</li>
  <li>Documented safe for all skin types</li>
</ul>

<div><strong>User-friendly design:</strong></div>

<ul>
  <li>Preset treatment protocols for different tattoo types</li>
  <li>Intuitive navigation that reduces training time</li>
</ul>

<h2 style="line-height: 1.25"><strong>Complete Support from Sweden&apos;s Most Experienced Partner</strong></h2>

<h3 style="line-height: 1.25"><strong>18 Years of Expertise Included</strong></h3>

<div><strong>Comprehensive support package:</strong></div>

<ul>
  <li>Thorough training and certification</li>
  <li>Swedish technical support and 1 year warranty</li>
  <li>Flexible service agreements for continuous operation</li>
  <li>Business development support for optimal profitability</li>
</ul>

<div><strong>Safe investment:</strong></div>

<ul>
  <li>Established distributor since 2008</li>
  <li>Several hundred installed machines in the Nordic region</li>
  <li>70% customer retention shows our reliability</li>
</ul>

<h2 style="line-height: 1.25"><strong>Flexible Financing for All Clinics</strong></h2>

<div><strong>Customized payment solutions:</strong></div>

<ul>
  <li>Operational and financial leasing</li>
  <li>Seasonal payments</li>
  <li>3 payment-free months at start</li>
</ul>

<h2 style="line-height: 1.25"><strong>Start Your Profitable Tattoo Removal Business Today</strong></h2>

<div>TORO is more than a machine – it&apos;s your partner for long-term growth in the rapidly growing tattoo removal market.</div>

<div>Book a free demonstration and discover why TORO is Sweden&apos;s most complete tattoo removal solution.</div>
`,
		categories: ["tattoo-removal", "skin-rejuvenation", "pigmentation"],
		treatments: ["Tatueringsborttagning", "Hudföryngring", "Pigmentfläckar"],
		features: [
			{
				title: "Picosekund-teknologi",
				description: "Ultrakort pulsenergi för optimal fragmentering",
			},
			{
				title: "Alla färger",
				description: "Effektiv på alla tatueringsfärger",
			},
			{
				title: "Minimal skada",
				description: "Skonsam mot omgivande vävnad",
			},
			{
				title: "Snabb läkning",
				description: "Kortare återhämtningstid",
			},
		],
		specifications: [
			{ label: "Våglängder", value: "532 nm, 1064 nm" },
			{ label: "Pulslängd", value: "450-750 ps" },
			{ label: "Energi", value: "Upp till 800 mJ" },
			{ label: "Repetitionsfrekvens", value: "1-10 Hz" },
		],
		images: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Toro-1.png",
				alt: "TORO Pico Laser",
				width: 800,
				height: 600,
				isPrimary: true,
			},
		],
		gallery: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Toro-1.png",
				alt: "MOTUS PRO Laser - Huvudbild",
				width: 1200,
				height: 900,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Toro-2.png",
				alt: "MOTUS PRO Laser - Huvudbild",
				width: 1200,
				height: 900,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Toro-3.png",
				alt: "MOTUS PRO Laser - Huvudbild",
				width: 1200,
				height: 900,
				isPrimary: true,
			},
		],
		seo: {
			title: "TORO Pico Laser - Tatueringsborttagning | Synos Medical",
			description:
				"TORO Pico Laser med picosekund-teknologi för effektiv tatueringsborttagning och hudföryngring. Minimal vävnadsskada.",
			keywords: ["TORO", "picolaser", "tatueringsborttagning", "picosekund"],
		},
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "motus-pro",
		slug: "motus-pro",
		name: "MOTUS PRO",
		description:
			"MOTUS PRO kombinerar alexandrit- och Nd:YAG kristallteknologi för effektiv hårborttagning och hudbehandling. Med 24 mm spot och avancerat kylsystem får du marknadens bästa resultat.",
		longDescription: `<p><span style="font-size: 2em; font-weight: 700;">MOTUS PRO Laser Machine – Alexandrite and Nd:YAG Laser for Professional Hair Removal</span></p>

<h2 style="line-height: 1.25">Revolutionize your clinic with Sweden&apos;s most advanced hair removal laser machine</h2>

<div>The MOTUS PRO laser machine represents the next generation in professional hair removal. This advanced laser machine combines crystal-based alexandrite and Nd:YAG technology for superior results.</div>

<h2 style="line-height: 1.25">Why MOTUS PRO laser machine is the right choice for your clinic</h2>

<div>As a clinic owner, you need a laser machine that delivers results. The MOTUS PRO laser machine combines two powerful technologies in one system, making it the most versatile hair removal laser machine on the market.</div>

<div>Plus, you get a laser machine that your patients love – painless and effective treatment every time.</div>

<h3 style="line-height: 1.25">Dual Wavelength Technology in One Laser Machine</h3>

<div>MOTUS PRO is the only laser machine that combines:</div>

<div>• <strong>Alexandrite 755nm</strong> – perfect for light hair on all skin types<br>
• <strong>Nd:YAG 1064nm</strong> – safe for dark skin types and deep hair follicles<br>
• <strong>Genuine crystal technology</strong> – not cheap diode lasers like other laser machines</div>

<h3 style="line-height: 1.25">MOVEO Technology Gives Your Laser Machine Advantages</h3>

<div>Above all, your treatments with this laser machine will:</div>

<div>• 50% faster than standard hair removal lasers<br>
• Completely painless for patients – no anesthesia needed<br>
• More profitable per treatment hour</div>

<div>Consequently, you can treat more patients every day with your MOTUS PRO laser machine.</div>

<h2 style="line-height: 1.25">Fast Return on Investment with MOTUS PRO Laser Machine</h2>

<div>Many clinics see ROI within 12-18 months with this professional laser machine, making the MOTUS PRO laser machine a smart business investment.</div>

<h3 style="line-height: 1.25">Concrete advantages of this laser machine:</h3>

<div>• Higher patient volume – faster treatments<br>
• Premium prices motivated by advanced laser machine technology<br>
• Year-round treatments – works on sunburned skin<br>
• Multifunctional – more than just a hair removal laser machine</div>

<h2 style="line-height: 1.25">Safety and Quality – MDR-certified Laser Machine</h2>

<div>MOTUS PRO laser machine is certified according to:</div>

<div>✅ MDR (Medical Device Regulation) – first laser machine with full certification<br>
✅ CE marking for European market<br>
✅ FDA approved for American market</div>

<h3 style="line-height: 1.25">Clinically proven results from this laser machine:</h3>

<div>• Permanent hair reduction<br>
• Visible results after 1 treatment<br>
• Minimal side effects compared to other laser machines</div>

<h2 style="line-height: 1.25">Technical Specifications – MOTUS PRO Laser Machine</h2>

<div>
  <table>
    <thead>
      <tr>
        <th>
          <div>Specification</div>
        </th>
        <th>
          <div>Value</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>Laser type</div>
        </td>
        <td>
          <div>Alexandrite + Nd:YAG crystal laser machine</div>
        </td>
      </tr>
      <tr>
        <td>
          <div>Wavelengths</div>
        </td>
        <td>
          <div>755nm + 1064nm</div>
        </td>
      </tr>
      <tr>
        <td>
          <div>Spot size</div>
        </td>
        <td>
          <div>2.5-24mm</div>
        </td>
      </tr>
      <tr>
        <td>
          <div>Repetition frequency</div>
        </td>
        <td>
          <div>Up to 10Hz</div>
        </td>
      </tr>
      <tr>
        <td>
          <div>Cooling system</div>
        </td>
        <td>
          <div>Integrated sapphire crystal</div>
        </td>
      </tr>
      <tr>
        <td>
          <div>Technology</div>
        </td>
        <td>
          <div>MOVEO + crystal-based laser machine</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div>Copy table</div>

<h2 style="line-height: 1.25">Complete Support Package for Your Laser Machine</h2>

<div>When you buy a MOTUS PRO laser machine, you get:</div>

<div>✅ Comprehensive training in Swedish for laser machine use<br>
✅ Technical support with fast response for your laser machine<br>
✅ Treatment protocols optimized for this laser machine<br>
✅ Marketing materials to promote your laser machine<br>
✅ Warranty on the entire laser machine system</div>

<h2 style="line-height: 1.25">Flexible Financing for Your Laser Machine Investment</h2>



<div>Choose the financing option that suits your clinic:</div>

<div>• Lease 36-60 months – spread the cost of the laser machine<br>
• Seasonal payments – adjust to the clinic&apos;s revenue<br>
• 3 payment-free months at the start of the laser machine lease</div>

<h2 style="line-height: 1.25">Multifunctional Laser Machine – More than Hair Removal</h2>

<div>The MOTUS PRO laser machine can be used for:</div>

<div>• Hair removal – your main source of income with a laser machine<br>
• Vascular treatments – expand your service offering with the same laser machine<br>
• Pigment reduction – more treatment options<br>
• Skin rejuvenation – premium services with a laser machine</div>

<div>Therefore, you get more value for your money with this versatile laser machine.</div>

<h2 style="line-height: 1.25">Start Your Success with MOTUS PRO Laser Machine Today</h2>

<div>The next step to getting your laser machine is simple:</div>

<ol>
  <li>📞 Call for free laser machine demo</li>
  <li>📊 Get a personalized ROI calculation for your laser machine investment</li>
  <li>💬 Discuss financing your new laser machine</li>
</ol>

<div>The MOTUS PRO laser machine is waiting to transform your clinic!</div>
`,
		categories: ["hair-removal", "pigmentation", "vascular"],
		treatments: ["Hårborttagning", "Pigmentfläckar", "Ytliga blodkärl"],
		features: [
			{
				title: "Moveo-teknologi",
				description:
					"Unik teknologi för kontinuerlig rörelse och jämn energifördelning",
			},
			{
				title: "Alla hudtyper",
				description: "Säker behandling på alla hudtyper, även mörk hud",
			},
			{
				title: "Snabb behandling",
				description: "Stora behandlingsytor på kort tid",
			},
			{
				title: "Smärtfri",
				description: "Minimal obehag tack vare avancerad kylning",
			},
		],
		specifications: [
			{ label: "Våglängd", value: "755 nm (Alexandrit)" },
			{ label: "Energi", value: "Upp till 20 J/cm²" },
			{ label: "Repetitionsfrekvens", value: "Upp till 10 Hz" },
			{ label: "Spotsize", value: "9-15 mm" },
		],
		images: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/03/Namnlos-design-6.png",
				alt: "MOTUS PRO Laser",
				width: 800,
				height: 600,
				isPrimary: true,
			},
		],
		gallery: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/03/Namnlos-design-6.png",
				alt: "MOTUS PRO Laser - Huvudbild",
				width: 1200,
				height: 900,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/03/bild-3.png",
				alt: "MOTUS PRO - Behandlingshandstycke",
				width: 1200,
				height: 900,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/03/bild-4.png",
				alt: "MOTUS PRO - Kontrollpanel",
				width: 1200,
				height: 900,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/03/behandlingsbild-2.png",
				alt: "MOTUS PRO - Behandling pågår",
				width: 1200,
				height: 900,
				isPrimary: false,
			},
			// {
			// 	url: "/images/products/motus-pro-5.jpg",
			// 	alt: "MOTUS PRO - Kylsystem",
			// 	width: 1200,
			// 	height: 900,
			// 	isPrimary: false,
			// },
			// {
			// 	url: "/images/products/motus-pro-6.jpg",
			// 	alt: "MOTUS PRO - Komplett system",
			// 	width: 1200,
			// 	height: 900,
			// 	isPrimary: false,
			// },
		],
		brochureUrl:
			"https://www.synos.se/wp-content/uploads/2024/03/Motus-PRO-Broschyr-svenska.pdf",
		videoUrl: "https://www.youtube.com/watch?v=example",
		benefits: [
			"Smärtfri behandling tack vare MOVEO-teknologi",
			"Fungerar på alla hudtyper (Fitzpatrick I-VI)",
			"50% snabbare behandlingstid än traditionella lasrar",
			"Permanent hårminskning med kliniskt bevisade resultat",
			"Multifunktionell - hårborttagning, kärl och pigment",
			"MDR-certifierad och FDA-godkänd",
			"Integrerat safirkristall-kylsystem",
			"Hög ROI inom 12-18 månader",
		],
		certifications: [
			{
				name: "MDR",
				description: "Medical Device Regulation - EU certifiering",
			},
			{
				name: "CE",
				description: "CE-märkning för europeisk marknad",
			},
			{
				name: "FDA",
				description: "FDA-godkänd för amerikansk marknad",
			},
			{
				name: "ISO 13485",
				description:
					"Kvalitetsledningssystem för medicintekniska produkter",
			},
		],
		faqs: [
			{
				id: "faq-1",
				question:
					"Hur många behandlingar krävs för permanent hårborttagning?",
				answer:
					"Antalet behandlingar varierar beroende på hårtyp, hudtyp och behandlingsområde. I genomsnitt krävs 6-8 behandlingar för optimal resultat. MOTUS PRO:s avancerade teknologi kan dock ge synliga resultat redan efter första behandlingen.",
				order: 1,
			},
			{
				id: "faq-2",
				question: "Är MOTUS PRO säker för mörk hud?",
				answer:
					"Ja, MOTUS PRO är säker för alla hudtyper (Fitzpatrick I-VI). Kombinationen av alexandrit (755nm) och Nd:YAG (1064nm) våglängder gör det möjligt att behandla både ljusa och mörka hudtyper säkert och effektivt.",
				order: 2,
			},
			{
				id: "faq-3",
				question: "Vad är MOVEO-teknologi?",
				answer:
					"MOVEO är en unik teknologi som möjliggör kontinuerlig rörelse av handstycket under behandlingen. Detta ger jämn energifördelning, snabbare behandlingstid och en nästan smärtfri upplevelse för patienten.",
				order: 3,
			},
			{
				id: "faq-4",
				question: "Hur lång tid tar en behandling?",
				answer:
					"Tack vare MOVEO-teknologi och stora spotsize (upp till 24mm) är behandlingarna 50% snabbare än med traditionella lasrar. En helkroppsbehandling kan genomföras på 30-45 minuter.",
				order: 4,
			},
			{
				id: "faq-5",
				question: "Vilken utbildning ingår vid köp?",
				answer:
					"Vi erbjuder omfattande utbildning på svenska som inkluderar teoretisk genomgång, praktisk träning, behandlingsprotokoll och säkerhetsrutiner. Utbildningen anpassas efter er kliniks behov och erfarenhetsnivå.",
				order: 5,
			},
			{
				id: "faq-6",
				question: "Finns det finansieringsmöjligheter?",
				answer:
					"Ja, vi erbjuder flexibla finansieringslösningar inklusive leasing 36-60 månader, säsongsanpassade betalningar och 3 betalningsfria månader vid start. Kontakta oss för en skräddarsydd finansieringsplan.",
				order: 6,
			},
			{
				id: "faq-7",
				question: "Vilka andra behandlingar kan MOTUS PRO utföra?",
				answer:
					"Förutom hårborttagning kan MOTUS PRO användas för kärlbehandlingar, pigmentreducering och hudföryngring. Detta gör maskinen till en multifunktionell investering som ökar er kliniks tjänsteutbud.",
				order: 7,
			},
			{
				id: "faq-8",
				question: "Vad ingår i garantin och supporten?",
				answer:
					"MOTUS PRO levereras med fullständig garanti på hela systemet. Vi erbjuder teknisk support med snabb respons, regelbundna servicebesök och tillgång till reservdelar. Support finns tillgänglig på svenska.",
				order: 8,
			},
		],
		reviews: [
			{
				id: "review-1",
				author: "Dr. Anna Bergström",
				role: "Hudläkare",
				location: "Stockholm",
				rating: 5,
				title: "Bästa investeringen för vår klinik",
				content:
					"MOTUS PRO har revolutionerat vår hårborttagningsverksamhet. Patienterna älskar den smärtfria behandlingen och vi ser fantastiska resultat. ROI uppnåddes inom 14 månader. Kan varmt rekommendera!",
				date: "2024-09-15",
				verified: true,
				helpful: 24,
			},
			{
				id: "review-2",
				author: "Maria Lindqvist",
				role: "Klinikägare",
				location: "Göteborg",
				rating: 5,
				title: "Överlägsen teknologi",
				content:
					"Efter att ha testat flera lasermaskiner är MOTUS PRO klart överlägsen. MOVEO-teknologin gör verkligen skillnad - snabbare behandlingar och nöjdare kunder. Supporten från Synos Medical är också förstklassig.",
				date: "2024-08-22",
				verified: true,
				helpful: 18,
			},
			{
				id: "review-3",
				author: "Erik Johansson",
				role: "Estetisk Terapeut",
				location: "Malmö",
				rating: 5,
				title: "Fungerar på alla hudtyper",
				content:
					"Som terapeut med många kunder med mörk hud var jag skeptisk först. Men MOTUS PRO levererar säkra och effektiva resultat på alla hudtyper. Inga komplikationer och mycket nöjda kunder.",
				date: "2024-07-10",
				verified: true,
				helpful: 15,
			},
			{
				id: "review-4",
				author: "Sofia Andersson",
				role: "Dermatolog",
				location: "Uppsala",
				rating: 4,
				title: "Professionell utrustning med bra support",
				content:
					"Mycket nöjd med MOTUS PRO. Maskinen är pålitlig och resultaten är konsekventa. Utbildningen var grundlig och supporten svarar snabbt. Enda minuset är priset, men kvaliteten motiverar investeringen.",
				date: "2024-06-05",
				verified: true,
				helpful: 12,
			},
		],
		qna: [
			{
				id: "qna-1",
				question: "Kan man behandla solbränd hud med MOTUS PRO?",
				answer:
					"Ja, tack vare Nd:YAG våglängden (1064nm) kan MOTUS PRO säkert behandla solbränd hud. Detta gör det möjligt att erbjuda året-runt-behandlingar, vilket ökar klinikens intäkter även under sommarmånaderna.",
				askedBy: "Karin S.",
				answeredBy: "Synos Medical Expert",
				date: "2024-10-15",
				helpful: 8,
			},
			{
				id: "qna-2",
				question: "Hur ofta behöver maskinen servas?",
				answer:
					"Vi rekommenderar årlig service för att säkerställa optimal prestanda. Däremellan är underhållet minimalt - grundläggande rengöring och kalibreringskontroller som kan göras av klinikpersonalen. Alla servicebesök ingår i vårt supportpaket.",
				askedBy: "Peter L.",
				answeredBy: "Synos Medical Expert",
				date: "2024-10-10",
				helpful: 6,
			},
			{
				id: "qna-3",
				question: "Vilken spotsize rekommenderas för ansiktsbehandling?",
				answer:
					"För ansiktsbehandling rekommenderar vi 9-15mm spotsize för precision kring känsliga områden som överläpp och haka. För större områden som ben och rygg använder vi 24mm spotsize för maximal effektivitet.",
				askedBy: "Linda M.",
				answeredBy: "Synos Medical Expert",
				date: "2024-09-28",
				helpful: 10,
			},
			{
				id: "qna-4",
				question: "Hur lång är leveranstiden?",
				answer:
					"Normal leveranstid är 4-6 veckor från beställning. Vi inkluderar installation, kalibrering och utbildning i leveransen. För brådskande behov kan vi ibland erbjuda snabbare leverans - kontakta oss för mer information.",
				askedBy: "Johan K.",
				answeredBy: "Synos Medical Expert",
				date: "2024-09-20",
				helpful: 5,
			},
			{
				id: "qna-5",
				question: "Kan man uppgradera från äldre MOTUS-modeller?",
				answer:
					"Ja, vi erbjuder uppgraderingsprogram för kliniker som har äldre MOTUS-modeller. Kontakta oss för en värdering av din nuvarande utrustning och ett skräddarsytt uppgraderingsförslag med inbytesvärde.",
				askedBy: "Emma W.",
				answeredBy: "Synos Medical Expert",
				date: "2024-09-05",
				helpful: 7,
			},
		],
		seo: {
			title: "MOTUS PRO - Alexandritlaser för hårborttagning | Synos Medical",
			description:
				"MOTUS PRO med Moveo-teknologi - Smärtfri hårborttagning på alla hudtyper. Snabb, säker och effektiv behandling.",
			keywords: ["MOTUS PRO", "alexandritlaser", "hårborttagning", "Moveo"],
		},
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "tetra-pro-co2",
		slug: "tetra-pro-co2-laser",
		name: "Tetra PRO CO₂ Laser",
		description:
			"TETRA PRO är DEKAs mest avancerade CO2-laser med exklusiv CoolPeel®-teknologi. Systemet erbjuder effektiva behandlingar för hudföryngring, ärrbehandling och intimbehandlingar med minimal återhämtningstid.",
		longDescription: `<p><strong>Tetra Pro CO2 Fraktionerad Laser – Nästa Generations Hudföryngring</strong></p>

<p>Tetra Pro representerar toppmodern teknologi inom estetisk hudvård, där kraftfull CO2-laserbehandling möter innovativ CoolPeel™-teknologi. Med 40W effekt och banbrytande PSD™-teknologi (Pulse Shape Design) erbjuder systemet oöverträffad precision och mångsidighet för moderna kliniker och salonger.</p>

<p><strong>Revolutionerande Tekniska Fördelar</strong><br>
• Avancerad 40W CO2-laser för optimal behandlingseffekt<br>
• Innovativ PSD™-teknologi för fullständig kontroll över pulsform<br>
• 20×20 mm spot size för 30% snabbare behandlingar<br>
• Tre fraktionerade pulslägen för skräddarsydda behandlingar<br>
• Integrerad CoolPeel™-teknologi för minimal återhämtningstid</p>

<p><strong>Omfattande Behandlingsmöjligheter</strong><br>
• Effektiv hudföryngring och huduppstramning<br>
• Behandling av fina linjer och rynkor<br>
• Förbättring av hudton och struktur<br>
• Reducering av ärr och acneärr<br>
• Behandling av förstorade porer<br>
• Förbättring av solskadad hud<br>
• Möjlighet till både ytliga och djupa behandlingar</p>

<p><strong>Fördelar för Din Klinik</strong><br>
• Marknadsledande teknologi för konkurrenskraftig positionering<br>
• Mångsidigt behandlingsutbud för ökad lönsamhet<br>
• Snabbare behandlingstider ökar effektiviteten<br>
• Minimal återhämtningstid ger nöjdare kunder<br>
• Omfattande utbildning och support ingår<br>
• CE-certifierad medicinsk utrustning</p>

<p><strong>CoolPeel™ – Den Revolutionerande Teknologin</strong><br>
CoolPeel™-teknologin möjliggör effektiva CO2-behandlingar utan traditionell återhämtningstid. Detta innovativa system levererar kontrollerad energi som endast påverkar hudens ytliga lager, vilket resulterar i:<br>
• Minimal återhämtningstid<br>
• Reducerad rodnad och svullnad<br>
• Förbättrad patientkomfort<br>
• Möjlighet till regelbundna behandlingar</p>

<p><strong>Uppgradera Din Klinik</strong><br>
Uppgradera din klinik med marknadens mest avancerade CO2-laser. Kontakta oss idag för en personlig demonstration av Tetra Pro och upptäck hur den kan transformera ditt behandlingsutbud.</p>

<p><strong>Tekniska Specifikationer</strong><br>
• Lasertyp: CO2 fraktionerad laser<br>
• Våglängd: 10,600 nm<br>
• Maxeffekt: 40W<br>
• Spot size: upp till 20×20 mm<br>
• Pulsteknologi: PSD™ (Pulse Shape Design)<br>
• Behandlingslägen: Standard, CoolPeel™, Fraktionerad<br>
• Certifieringar: MDR – Medical Device Regulation</p>
`,
		categories: [
			"skin-rejuvenation",
			"co2-fractional",
			"facial-treatments",
			"acne-scars",
			"surgery",
			"pigmentation",
		],
		brochureUrl:
			"https://www.synos.se/wp-content/uploads/2024/04/Tetra-PRO-Broschyr-SWE.pdf",
		treatments: [
			"Hudföryngring",
			"Hudåtstramning",
			"Ärrbehandling",
			"Kirurgi",
			"Pigmentfläckar",
		],
		features: [
			{
				title: "Fraktionerad teknologi",
				description: "Precision och kontroll för optimala resultat",
			},
			{
				title: "Multifunktionell",
				description: "Hudföryngring, ärr och kirurgi i ett system",
			},
			{
				title: "Snabb läkning",
				description: "Minimal downtime tack vare fraktionerad behandling",
			},
			{
				title: "Anpassningsbar",
				description: "Flexibla inställningar för olika behandlingar",
			},
		],
		specifications: [
			{ label: "Våglängd", value: "10600 nm (CO₂)" },
			{ label: "Effekt", value: "Upp till 60W" },
			{ label: "Pulsläge", value: "Kontinuerlig, pulsad, fraktionerad" },
			{ label: "Spotsize", value: "0.12-2.0 mm" },
		],
		images: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Tetra-Pro-Shooting_100124_9591_D.png",
				alt: "Tetra PRO CO₂ Laser",
				width: 800,
				height: 600,
				isPrimary: true,
			},
		],
		gallery: [
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/Tetra-Pro-Shooting_100124_9591_D.png",
				alt: "Tetra PRO CO₂ Laser",
				width: 800,
				height: 600,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/tetra-pro-2.png",
				alt: "Tetra PRO CO₂ Laser",
				width: 800,
				height: 600,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2024/04/tetra-pro-handdtag.png",
				alt: "Tetra PRO CO₂ Laser",
				width: 800,
				height: 600,
				isPrimary: false,
			},
		],
		seo: {
			title: "Tetra PRO CO₂ Laser - Hudföryngring & Kirurgi | Synos Medical",
			description:
				"Tetra PRO fraktionerad CO₂ laser för hudföryngring, ärrbehandling och kirurgi. Precision och effektivitet i ett system.",
			keywords: ["Tetra PRO", "CO2 laser", "fraktionerad", "hudföryngring"],
		},
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	// 	{
	// 		id: "jovena",
	// 		slug: "jovena",
	// 		name: "Jovena",
	// 		description:
	// 			"Jovena är all around-maskinen för dig som vill kunna erbjuda dina kunder effektiv hudföryngring eller muskeltoning med minimal återhämtningstid",
	// 		longDescription: `<p><strong>JOVENA – Komplett System för Hudföryngring och Muskeltoning</strong></p>

	// <p><strong>Revolutionerande Dual-Energy Teknologi</strong>&nbsp;JOVENA kombinerar Fractional Plasma och FACESTIM-teknologi i ett komplett behandlingssystem. Med fyra specialiserade handtag erbjuder systemet maximal flexibilitet för moderna kliniker.</p>

	// <p><strong>Fyra Innovativa Handtag:</strong></p>

	// <ol>
	//   <li>
	// <p><strong>FACESTIM:</strong>&nbsp;• Kombinerar RF-diatermi och muskelstimulering • Effektiv ansiktslyft utan injektioner • Naturliga resultat • Minimal återhämtningstid • Perfekt komplement till fillers</p>
	//   </li>
	//   <li>
	// <p><strong>plasmaROLL:</strong>&nbsp;• Skonsam hudföryngring • Behandlar ansikte, hals och dekolletage • Främjar naturlig celltillväxt • Effektiv uppstramning • Jämna resultat</p>
	//   </li>
	//   <li>
	// <p><strong>plasmaTIP:</strong>&nbsp;• Precis behandling av ärr och bristningar • Kontrollerad energileverans • Behandling av fina linjer • Säker rynkreducering • Engångsspets för optimal hygien</p>
	//   </li>
	//   <li>
	// <p><strong>plasmaPRO:</strong>&nbsp;• Avancerad plasmapenna • Fraktionerad plasmabehandling • Precis kontroll • Mångsidiga användningsområden • Ledande Plasmage®-teknologi</p>
	//   </li>
	// </ol>

	// <p><strong>Fördelar för Din Klinik:</strong></p>

	// <ul>
	//   <li>Ett system för alla behandlingar</li>
	//   <li>Minimala förbrukningskostnader</li>
	//   <li>Snabb avkastning på investering</li>
	//   <li>Utökat behandlingsutbud</li>
	//   <li>Nöjdare kunder</li>
	// </ul>
	// `,
	// 		categories: [
	// 			"skin-rejuvenation",
	// 			"body-sculpting",
	// 			"facial-treatments",
	// 			"pigmentation",
	// 		],
	// 		treatments: [
	// 			"Hudföryngring",
	// 			"Kroppsskulptering",
	// 			"Ansiktsbehandlingar",
	// 			"Pigmentfläckar",
	// 		],
	// 		features: [
	// 			{
	// 				title: "Multifunktionell",
	// 				description: "Flera behandlingar i ett system",
	// 			},
	// 			{
	// 				title: "Icke-invasiv",
	// 				description: "Säkra behandlingar utan kirurgi",
	// 			},
	// 			{
	// 				title: "Synliga resultat",
	// 				description: "Dokumenterade resultat efter behandling",
	// 			},
	// 			{
	// 				title: "Flexibel",
	// 				description: "Anpassningsbar för olika behandlingsområden",
	// 			},
	// 		],
	// 		specifications: [
	// 			{ label: "Teknologier", value: "RF, LED, Ultraljud" },
	// 			{ label: "Behandlingsområden", value: "Ansikte och kropp" },
	// 			{ label: "Handstycken", value: "Flera specialiserade handstycken" },
	// 		],
	// 		images: [
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Jovena-pic-small7-scaled-e1704880128119.jpg",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: true,
	// 			},
	// 		],
	// 		gallery: [
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Jovena-pic-small7-scaled-e1704880128119.jpg",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: true,
	// 			},
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Jovena-pic-2-scaled-e1704880512279.jpg",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: false,
	// 			},
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Manipolo_PlasmaRoll_Scontornato-e1704880576644.png",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: false,
	// 			},
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Manipolo_BQUAD_small-e1704880628565.png",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: false,
	// 			},
	// 			{
	// 				url: "https://www.synos.se/wp-content/uploads/2024/01/Manipolo_PlasmaPro_2_bianco_ok-e1704880756822.png",
	// 				alt: "Jovena",
	// 				width: 800,
	// 				height: 600,
	// 				isPrimary: false,
	// 			},
	// 		],
	// 		seo: {
	// 			title: "Jovena - Multifunktionell hudföryngring | Synos Medical",
	// 			description:
	// 				"Jovena multifunktionell plattform för hudföryngring, kroppsskulptering och ansiktsbehandlingar. Flera teknologier i ett system.",
	// 			keywords: ["Jovena", "hudföryngring", "kroppsskulptering", "RF"],
	// 		},
	// 		createdAt: "2024-01-01",
	// 		updatedAt: "2024-01-01",
	// 	},
	{
		id: "onda-coolwaves-pro",
		slug: "onda-coolwaves-pro",
		name: "Onda Coolwaves PRO",
		description:
			"Fettreducering i ansiktet, på magen, låren och höfterna. Behaglig hudåtstramning över hela kroppen. Ansiktslyft och cellulitborttagning, helt utan kirurgi. Onda Coolwaves PRO klarar allt.",
		longDescription: `<ol>
  <li><strong>ONDA COOLWAVES PRO – Revolutionerande System för Fettreducering och Kroppskonturering</strong></li>
  <li><strong>Maximera Din Kliniks Behandlingsutbud</strong>&nbsp;ONDA COOLWAVES PRO representerar nästa generations teknologi för icke-invasiv fettreducering och kroppskonturering. Med unik Precision-GigaWave-teknologi och tre specialiserade handtag erbjuder systemet marknadens mest kompletta lösning för moderna kliniker.</li>
  <li><strong>Tre Specialiserade Handtag:</strong><br>
• DEEP: Målriktad djup fettreducering<br>
• SHALLOW: Ansiktsbehandling och dubbelhakor<br>
• POCKET: Precisa behandlingar för mindre områden</li>
  <li><strong>Precision-GigaWave Teknologi:</strong></li>
  <li>Kontrollerad energileverans för säkra behandlingar</li>
  <li>Effektiv fettreducering utan kirurgi</li>
  <li>Dokumenterad hudåtstramningseffekt</li>
  <li>Behandlar alla hudtyper</li>
  <li>Kliniskt beprövade resultat</li>
  <li><strong>Omfattande Behandlingsmöjligheter:</strong><br>
• Kroppsskulptering och fettreducering<br>
• Dubbelhakabehandling<br>
• Icke-invasivt ansiktslyft<br>
• Cellulitbehandling<br>
• Hudåtstramning hela kroppen<br>
• Målriktad fettreducering</li>
  <li><strong>100% Säkra Behandlingar:</strong></li>
  <li>Helt icke-invasiv metod</li>
  <li>Smärtfria sessioner</li>
  <li>Inga blåmärken eller svullnad</li>
  <li>Ingen ärrbildning</li>
  <li>Minimal återhämtningstid</li>
  <li>Dokumenterad säkerhetsprofil</li>
  <li><strong>Fördelar för Din Verksamhet:</strong><br>
• Möt växande efterfrågan på kroppsbehandlingar<br>
• Erbjud mångsidiga behandlingsalternativ<br>
• Snabb avkastning på investering<br>
• Behandla fler kunder per dag<br>
• Dokumenterade resultat för nöjda kunder</li>
  <li><strong>Optimera Din Kliniks Potential:</strong></li>
  <li>Utöka ditt behandlingsutbud</li>
  <li>Erbjud efterfrågade premiumbehandlingar</li>
  <li>Konkurrera med unik teknologi</li>
  <li>Maximera din ROI</li>
  <li>Bygg långsiktig kundlojalitet</li>
</ol>
`,
		brochureUrl:
			"https://www.synos.se/wp-content/uploads/2023/08/Onda-PRO-Broschyr-SWE.pdf",
		categories: ["body-sculpting"],
		treatments: ["Fettreducering", "Cellulitbehandling", "Kroppsskulptering"],
		features: [
			{
				title: "Coolwaves-teknologi",
				description: "Unik mikrovågsteknologi för fettceller",
			},
			{
				title: "Icke-invasiv",
				description: "Ingen kirurgi eller downtime",
			},
			{
				title: "Effektiv",
				description: "Dokumenterade resultat på fett och cellulit",
			},
			{
				title: "Säker",
				description: "Skonsam behandling med minimal obehag",
			},
		],
		specifications: [
			{ label: "Frekvens", value: "2.45 GHz" },
			{ label: "Effekt", value: "Upp till 100W" },
			{ label: "Behandlingsområden", value: "Kropp" },
		],
		images: [
			{
				url: "https://www.synos.se/wp-content/uploads/2023/08/Shooting-250523_Onda-PRO_Device_1626_D-scaled.jpg",
				alt: "Onda Coolwaves PRO",
				width: 800,
				height: 600,
				isPrimary: true,
			},
		],
		gallery: [
			{
				url: "https://www.synos.se/wp-content/uploads/2023/08/Shooting-250523_Onda-PRO_Device_1626_D-scaled.jpg",
				alt: "Onda Coolwaves PRO",
				width: 800,
				height: 600,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2023/08/Shooting-250523_Onda-PRO_0492_D-scaled.jpg",
				alt: "Onda Coolwaves PRO",
				width: 800,
				height: 600,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2023/08/Shooting-250523_Onda-PRO_3handpiece1665_D-scaled.jpg",
				alt: "Onda Coolwaves PRO",
				width: 800,
				height: 600,
				isPrimary: false,
			},
		],
		seo: {
			title: "Onda Coolwaves PRO - Fettreducering | Synos Medical",
			description:
				"Onda Coolwaves PRO med mikrovågsteknologi för effektiv fettreducering och cellulitbehandling. Icke-invasiv kroppsskulptering.",
			keywords: ["Onda", "Coolwaves", "fettreducering", "cellulit"],
		},
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "vivace-rf",
		slug: "vivace-rf",
		name: "Vivace RF",
		description:
			"Den är hyllad till skyarna och har vunnit flera prestigefulla priser, om och om igen. Den är älskad i Hollywood och gör just nu succé över hela världen. Nu finns Vivace RF i Sverige – hudåtstramningsmaskinen olik alla andra",
		longDescription: `<ol>
  <li><strong>VIVACE – Världsledande RF Microneedling med LED Ljusterapi</strong></li>
  <li><strong>Revolutionerande Teknologi</strong>&nbsp;VIVACE kombinerar marknadens kraftfullaste RF-motor (70W) med avancerad microneedling och LED-ljusterapi för överlägsna behandlingsresultat.</li>
  <li><strong>Omfattande Behandlingsmöjligheter:</strong>&nbsp;• Effektiv rynkreducering • Huduppstramning • Ärrbehandling • Behandling av bristningar • Förminskning av porer • Aktiv aknebehandling • Hudföryngring</li>
  <li><strong>Unik Trippelteknologi:</strong></li>
  <li>Kraftfull radiofrekvens (70W)</li>
  <li>Precis microneedling</li>
  <li>LED-ljusterapi</li>
  <li>Djup kollagenstimulering</li>
  <li>Naturlig elastinproduktion</li>
  <li><strong>Dokumenterade Fördelar:</strong>&nbsp;• Snabba, synliga resultat • Minimal återhämtningstid • Säker för alla hudtyper • Smärtfri behandling • Allergivänlig metod</li>
  <li><strong>Prisbelönt Excellence:</strong></li>
  <li>Harper’s Bazaar Anti-Aging Award</li>
  <li>Dermascope Award: Bästa RF Microneedling</li>
  <li>Shape Beauty Award</li>
  <li>Internationellt erkänd</li>
  <li>Hollywood-standard behandling</li>
</ol>
`,
		brochureUrl:
			"https://www.synos.se/wp-content/uploads/2021/04/Vivace-broschyr-swe3.pdf",
		categories: ["skin-rejuvenation", "facial-treatments", "acne-scars"],
		treatments: ["Hudföryngring", "Hudåtstramning", "Ärrbehandling"],
		features: [
			{
				title: "RF Microneedling",
				description: "Kombinerad teknologi för optimala resultat",
			},
			{
				title: "Djupgående",
				description: "Når djupare hudlager för bättre resultat",
			},
			{
				title: "Minimal downtime",
				description: "Snabb återhämtning efter behandling",
			},
			{
				title: "Synliga resultat",
				description: "Förbättrad hudkvalitet och fasthet",
			},
		],
		specifications: [
			{ label: "Teknologi", value: "Microneedling + RF" },
			{ label: "Nåldjup", value: "0.5-3.5 mm" },
			{ label: "RF-frekvens", value: "1 MHz" },
		],
		images: [
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Vivace-med-dermascope-logo-e1677683732267.png",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: true,
			},
		],
		gallery: [
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Vivace-med-dermascope-logo-e1677683732267.png",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: true,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Namnlost-1.jpg",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Namnlost-2.jpg",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Namnlost-3.jpg",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: false,
			},
			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/Namnlost-4.jpg",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: false,
			},

			{
				url: "https://www.synos.se/wp-content/uploads/2021/04/IMG_4017.jpg",
				alt: "Vivace RF",
				width: 800,
				height: 600,
				isPrimary: false,
			},
		],
		seo: {
			title: "Vivace RF - Microneedling med RF | Synos Medical",
			description:
				"Den är hyllad till skyarna och har vunnit flera prestigefulla priser, om och om igen. Den är älskad i Hollywood och gör just nu succé över hela världen. Nu finns Vivace RF i Sverige – hudåtstramningsmaskinen olik alla andra.",
			keywords: [
				"Vivace",
				"RF microneedling",
				"hudföryngring",
				"åtstramning",
			],
		},
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
];

export function getProductBySlug(slug: string): Product | undefined {
	return featuredProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
	return featuredProducts.filter((product) =>
		product.categories.includes(categoryId)
	);
}

export function getFeaturedProducts(limit?: number): Product[] {
	const products = featuredProducts.slice(0, limit);
	return products;
}
