export function getOpportunityScoreDetails(score: number) {
  let activeStars = 1;
  let label = "Weak";

  if (score >= 95) {
    activeStars = 5;
    label = "Elite";
  } else if (score >= 85) {
    activeStars = 4;
    label = "Excellent";
  } else if (score >= 70) {
    activeStars = 3;
    label = "Good";
  } else if (score >= 50) {
    activeStars = 2;
    label = "Average";
  }

  const stars = Array.from({ length: 5 }, (_, index) =>
    index < activeStars ? "★" : "☆",
  ).join("");

  return { label, stars };
}
