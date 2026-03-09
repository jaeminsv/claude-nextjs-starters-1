import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // Notion API credentials for invoice data access (optional at startup, validated at runtime)
  NOTION_API_KEY: z.string().optional(),
  // Notion database ID where invoice records are stored
  NOTION_INVOICES_DATABASE_ID: z.string().optional(),
  // Notion database ID where invoice line items are stored
  NOTION_ITEMS_DATABASE_ID: z.string().optional(),
  // Admin password for simple auth (optional for backward compatibility)
  ADMIN_PASSWORD: z.string().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  // Notion environment variables loaded from .env.local
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_INVOICES_DATABASE_ID: process.env.NOTION_INVOICES_DATABASE_ID,
  NOTION_ITEMS_DATABASE_ID: process.env.NOTION_ITEMS_DATABASE_ID,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
})

export type Env = z.infer<typeof envSchema>
