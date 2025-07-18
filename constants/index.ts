import { tokenIcons } from "@/components/create-gateway";

// Update the mainSteps to include 'gateways'
export const mainSteps = ["dashboard", "pay", "create", "gateways"] as const;
export const paymentSteps = ["method", "details", "processing", "success"] as const;
export const createSteps = ["form", "preview", "generated"] as const;

export type MainStep = (typeof mainSteps)[number];
export type PaymentStep = (typeof paymentSteps)[number];
export type CreateStep = (typeof createSteps)[number];

// Update the PaymentGateway interface to include createdAt
export interface PaymentGateway {
  id: string;
  title: string;
  description: string;
  recipientAddress: string;
  currency: keyof typeof tokenIcons;
  qrCode: string;
  link: string;
  createdAt: string;
}