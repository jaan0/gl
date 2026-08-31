import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

// Admin-managed product catalog
export const catalog = pgTable('catalog', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameUr: text('name_ur'),
  nameSd: text('name_sd'),
  category: text('category').notNull().default('Other'),
  imageUrl: text('image_url'),
  defaultQuantity: text('default_quantity').default('1'),
  defaultUnit: text('default_unit').default('pcs'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Current shopping list (the "bucket")
export const shoppingList = pgTable('shopping_list', {
  id: serial('id').primaryKey(),
  catalogId: integer('catalog_id')
    .references(() => catalog.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: text('quantity').default('1'),
  unit: text('unit').default('pcs'),
  isBought: boolean('is_bought').default(false),
  addedAt: timestamp('added_at').defaultNow(),
});
