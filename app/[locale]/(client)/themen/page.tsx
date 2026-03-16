import { ThemenPage } from "./_components/themen-page";
import { getHomePage } from "@/lib/services/home-page.service";

export default async function ThemenPageRoute() {
	const homePage = await getHomePage();
	const logos = homePage?.partnersCarouselSection?.logos || [];

	return <ThemenPage partnerLogos={logos} />;
}
