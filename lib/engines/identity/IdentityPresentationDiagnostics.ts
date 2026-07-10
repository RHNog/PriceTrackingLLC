import type { IdentityPresentationModel } from "@/lib/engines/identity/IdentityPresentationModel";

export type IdentityPresentationDiagnostic = {
  canonicalConcept: string;
  canonicalValue: string;
  presentationLabel: string;
  presentationValue: string;
  resolution: string;
  visible: boolean;
  visibilityReason: string;
};

export function createIdentityPresentationDiagnostics(
  presentation: IdentityPresentationModel,
): IdentityPresentationDiagnostic[] {
  return [
    presentation.cardName,
    presentation.printing,
    presentation.treatment,
    presentation.finish,
    presentation.market,
    presentation.condition,
    presentation.language,
    presentation.collectorNumber,
  ].map((field) => ({
    canonicalConcept: field.canonicalConcept,
    canonicalValue: field.canonicalValue,
    presentationLabel: field.label,
    presentationValue: field.presentationValue,
    resolution: field.resolutionState ?? "Direct Translation",
    visible: field.visible,
    visibilityReason: field.visibilityReason,
  }));
}
