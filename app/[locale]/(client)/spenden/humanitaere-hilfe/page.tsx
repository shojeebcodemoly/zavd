import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { NavbarSetter } from "../_components/NavbarSetter";
import { HeroBanner } from "../_components/HeroBanner";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function HumanitaereHilfePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	return (
		<div className="min-h-screen bg-white">
			<NavbarSetter />

			{/* ── Banner / Hero ── */}
			<HeroBanner
				image="/images/donate/Spenden-Syrien.jpg"
				tag="Humanitäre Hilfe"
				title="Humanitäre Hilfe"
				subtitle="Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern."
				breadcrumbs={[
					{ label: "ZAVD", href: "/" },
					{ label: "Spenden", href: "/spenden" },
					{ label: "Humanitäre Hilfe" },
				]}
			/>

			{/* ── Main Content ── */}
			<section className="py-16">
				<div className="_container">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 pb-3 border-b-2 border-primary inline-block">
						Spendenkonto - Humanitäre Hilfe
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">

						{/* ── Left Column ── */}
						<div className="space-y-6">
							<div>
								<h3 className="text-primary font-bold text-base mb-3 underline underline-offset-2">
									Ihre Spende kommt an!
								</h3>
								<div className="relative h-44 rounded overflow-hidden mb-4">
									<Image
										src="/images/donate/Spenden-Syrien.jpg"
										alt="Spende kommt an"
										fill
										className="object-cover"
									/>
								</div>
							</div>

							<div>
								<h3 className="text-primary font-bold text-base mb-2 underline underline-offset-2">
									Spendentransparenz
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									ZAVD e.V. ist als eingetragene gemeinnützige Organisation von Körperschaft- und
									Gewerbesteuer befreit. Ihre Spende ist steuerlich absetzbar.
									Steuernummer: 103/111/70053
								</p>
							</div>

							<div>
								<h3 className="text-primary font-bold text-base mb-2 underline underline-offset-2">
									Spendenbescheinigung
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									Ihre Spende ist steuerlich abzugsfähig. Für Beträge unter 200 € genügt eine Kopie
									Ihres Kontoauszuges mit dem Ausdruck des Spendenauftrags.
								</p>
								<p className="text-gray-600 text-sm leading-relaxed mt-2">
									Um Spenden von mehr als 200 € steuerlich absetzen zu können, stellen wir Ihnen für
									das Finanzamt eine Spendenbescheinigung (Steuerbescheinigung) aus.{" "}
									<span className="text-primary font-semibold">Sie auf Wunsch</span> per E-Mail oder Post.
								</p>
								<p className="text-gray-600 text-sm leading-relaxed mt-2">
									20 % des Jahreseinkommens darf als Sonderausgabe für eine Spende geltend gemacht
									werden.
								</p>
							</div>
						</div>

						{/* ── Middle Column ── */}
						<div>
							<h3 className="text-gray-900 font-bold text-base mb-4">Warum uns spenden?</h3>
							<p className="text-gray-600 text-sm leading-relaxed mb-4">
								Der Zentralverband der Assyrischen Vereinigungen in Deutschland e.V. (ZAVD) leistet
								soziale und humanitäre Hilfeleistung für Flüchtlinge und Notleidende Assyrier aus den
								Herkunftsländern (Syrien, Irak, Türkei, Libanon und Iran). Bitte eine Spende
								unterstützen sie uns bei Notfallsituationen in den Kriegsgebieten.
							</p>

							<p className="text-gray-900 font-semibold text-sm mb-3">Unsere Besonderheit:</p>
							<ul className="space-y-3">
								{[
									"Die Kriegsopfer sind aus den Herkunftsgebieten der Assyrer, welche wir in Deutschland vertreten",
									"Wir haben direkten Kontakt zu allen Heimat- und können so die passenden bekannten Organisation vor Ort weiterleiten",
									"Bei Katastrophen, wie Anschlägen auf die Zivilbevölkerung, werden wir als eine der ersten Organisationen in Deutschland von betroffenen Organisationen und Personen in der Heimat verständigt",
									"Viele Assyrer aus Deutschland haben weitere Verwandte und Bekannte in der Heimat. Im Auftrag der Assyrer in Deutschland ist es uns deswegen wichtig, dass die Spenden bei den richtigen Organisationen ankommen",
								].map((item, i) => (
									<li key={i} className="flex gap-2 text-sm text-gray-600">
										<span className="text-primary font-bold mt-0.5 flex-shrink-0">•</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						{/* ── Right Column ── */}
						<div className="space-y-6">
							<div>
								<h3 className="text-primary font-bold text-base mb-4 underline underline-offset-2">
									Überweisung
								</h3>
								<div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
									<div className="flex gap-2">
										<span className="text-gray-500 w-28 flex-shrink-0">Empfänger</span>
										<span className="text-gray-900 font-semibold">ZAVD e.V.</span>
									</div>
									<div className="flex gap-2">
										<span className="text-gray-500 w-28 flex-shrink-0">IBAN</span>
										<span className="text-gray-900 font-mono font-semibold">DE49 4785 0065 0000 8361 66</span>
									</div>
									<div className="flex gap-2">
										<span className="text-gray-500 w-28 flex-shrink-0">BIC</span>
										<span className="text-gray-900 font-semibold">WELADED1GTL</span>
									</div>
									<div className="flex gap-2">
										<span className="text-gray-500 w-28 flex-shrink-0">Bank</span>
										<span className="text-gray-900">Sparkasse Gütersloh</span>
									</div>
									<div className="flex gap-2">
										<span className="text-gray-500 w-28 flex-shrink-0">Verwendungszweck</span>
										<span className="text-gray-900 font-semibold">Spende Assyrien</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-primary font-bold text-base mb-3 underline underline-offset-2">
									PayPal
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed mb-4">
									Mit PayPal besteht die Möglichkeit einer schnellen, unkomplizierten und sicheren
									Spende über PayPal, Kreditkarte oder EC-Karte. Klicken Sie einfach auf den unteren
									Button und befolgen Sie die nächsten Schritte.
								</p>
								<a
									href="https://www.paypal.com/donate"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#002570] text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 text-sm"
								>
									<svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
										<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z" />
									</svg>
									Jetzt Spenden!
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
