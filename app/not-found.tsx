import Link from "next/link";

/**
 * 404 Not Found Page
 *
 * Minimal server component to avoid SSG issues.
 */
export default function NotFound() {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "48px 16px",
				background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ccfbf1 100%)",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div style={{ maxWidth: "600px", textAlign: "center" }}>
				<h1
					style={{
						fontSize: "144px",
						fontWeight: 900,
						background: "linear-gradient(135deg, rgba(12, 44, 70, 0.15) 0%, rgba(0, 148, 158, 0.15) 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						margin: "0 0 16px 0",
						lineHeight: 1,
					}}
				>
					404
				</h1>

				<div
					style={{
						background: "rgba(255, 255, 255, 0.8)",
						borderRadius: "24px",
						padding: "48px",
						boxShadow: "0 20px 60px rgba(0, 148, 158, 0.1)",
					}}
				>
					<h2
						style={{
							fontSize: "32px",
							fontWeight: 800,
							color: "#0C2C46",
							margin: "0 0 16px 0",
						}}
					>
						Sidan kunde inte hittas
					</h2>

					<p
						style={{
							fontSize: "18px",
							color: "rgba(12, 44, 70, 0.75)",
							margin: "0 0 32px 0",
							lineHeight: 1.6,
						}}
					>
						Tyvärr kunde vi inte hitta sidan du letar efter.
					</p>

					<div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
						<Link
							href="/"
							style={{
								padding: "16px 32px",
								background: "linear-gradient(135deg, #00949E 0%, #007A82 100%)",
								color: "white",
								borderRadius: "9999px",
								fontWeight: 700,
								fontSize: "16px",
								textDecoration: "none",
							}}
						>
							Tillbaka till startsidan
						</Link>
						<Link
							href="/kontakt"
							style={{
								padding: "16px 32px",
								background: "white",
								color: "#0C2C46",
								border: "2px solid rgba(12, 44, 70, 0.2)",
								borderRadius: "9999px",
								fontWeight: 700,
								fontSize: "16px",
								textDecoration: "none",
							}}
						>
							Kontakta oss
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
