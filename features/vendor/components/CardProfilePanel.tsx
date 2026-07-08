import IntelligenceConsole from "@/components/intelligence/IntelligenceConsole";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type CardProfilePanelProps = {
  cardProfile: CardProfile;
};

export default function CardProfilePanel({
  cardProfile,
}: CardProfilePanelProps) {
  return <IntelligenceConsole cardProfile={cardProfile} />;
}
