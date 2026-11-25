import { registerMaterial } from "../MaterialRegistry";

registerMaterial({
  id: "mat-001",
  title: "First-Principles Systems & Python Field Guide",
  author: "Shema",
  type: "ebook",
  initials: "FP",
  description:
    "A downloadable handbook distilling core programming mental models, CLI workflows, and debugging checklists.",
  actionUrl: "https://your-cloudflare-or-store-link.com",
  actionLabel: "Open / Download",
  tags: ["#Python", "#Engineering"],
  access: {
    isOpen: true,
    accessTier: "free",
    externalProductId: "prod_field_guide_01",
  },
});
