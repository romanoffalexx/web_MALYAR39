import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "processing",
  "completed",
  "cancelled",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "in_progress",
  "resolved",
  "closed",
]);

export const reviewTypeEnum = pgEnum("review_type", ["video", "photo"]);

export const caseImageTypeEnum = pgEnum("case_image_type", [
  "before",
  "after",
  "process",
  "result",
]);

export const messengerEnum = pgEnum("messenger", [
  "whatsapp",
  "telegram",
  "viber",
  "email",
]);

// ─── Categories ──────────────────────────────────────────
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: integer("parent_id"),
    description: text("description"),
    image: text("image"),
    order: integer("order").default(0),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("categories_parent_idx").on(t.parentId)]
);

// ─── Brands ──────────────────────────────────────────────
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Products ────────────────────────────────────────────
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 500 }).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    brandId: integer("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    shortDescription: text("short_description"),
    article: varchar("article", { length: 100 }),
    applicationInstructions: text("application_instructions"),
    compatibility: text("compatibility"),
    videoUrl: text("video_url"),
    documents: jsonb("documents").$type<
      { name: string; url: string; size?: string }[]
    >(),
    coverageRate: real("coverage_rate"),
    defaultLayers: integer("default_layers").default(2),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    inStock: boolean("in_stock").default(true),
    isPopular: boolean("is_popular").default(false),
    rating: real("rating").default(0),
    reviewsCount: integer("reviews_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.categoryId),
    index("products_brand_idx").on(t.brandId),
    index("products_slug_idx").on(t.slug),
  ]
);

// ─── Product Variants (packaging) ────────────────────────
export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    packagingVolume: real("packaging_volume").notNull(),
    packagingUnit: varchar("packaging_unit", { length: 20 })
      .notNull()
      .default("л"),
    price: integer("price").notNull(),
    oldPrice: integer("old_price"),
    sku: varchar("sku", { length: 100 }),
    stock: integer("stock").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("variants_product_idx").on(t.productId)]
);

// ─── Product Images ──────────────────────────────────────
export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 255 }),
    order: integer("order").default(0),
    isMain: boolean("is_main").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)]
);

// ─── Product Characteristics ─────────────────────────────
export const productCharacteristics = pgTable(
  "product_characteristics",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 255 }).notNull(),
    value: text("value").notNull(),
    order: integer("order").default(0),
  },
  (t) => [index("characteristics_product_idx").on(t.productId)]
);

// ─── Category Filters ────────────────────────────────────
export const categoryFilters = pgTable(
  "category_filters",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    filterName: varchar("filter_name", { length: 255 }).notNull(),
    filterKey: varchar("filter_key", { length: 255 }).notNull(),
    filterType: varchar("filter_type", { length: 50 })
      .notNull()
      .default("checkbox"),
    filterValues: jsonb("filter_values").$type<string[]>(),
    order: integer("order").default(0),
  },
  (t) => [index("category_filters_category_idx").on(t.categoryId)]
);

// ─── Cases ───────────────────────────────────────────────
export const cases = pgTable(
  "cases",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }).notNull(),
    subtitle: varchar("subtitle", { length: 500 }),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    task: text("task"),
    result: text("result"),
    results: jsonb("results").$type<string[]>(),
    area: varchar("area", { length: 100 }),
    duration: varchar("duration", { length: 100 }),
    year: integer("year"),
    workType: varchar("work_type", { length: 255 }),
    tag: varchar("tag", { length: 100 }),
    savings: varchar("savings", { length: 255 }),
    savingsNote: text("savings_note"),
    serviceLife: varchar("service_life", { length: 255 }),
    serviceLifeNote: text("service_life_note"),
    mainImage: text("main_image"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    published: boolean("published").default(true),
    featured: boolean("featured").default(false),
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("cases_category_idx").on(t.category)]
);

// ─── Case Images ─────────────────────────────────────────
export const caseImages = pgTable(
  "case_images",
  {
    id: serial("id").primaryKey(),
    caseId: integer("case_id")
      .notNull()
      .references(() => cases.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: caseImageTypeEnum("type").default("process"),
    caption: varchar("caption", { length: 255 }),
    order: integer("order").default(0),
  },
  (t) => [index("case_images_case_idx").on(t.caseId)]
);

// ─── Case Materials ──────────────────────────────────────
export const caseMaterials = pgTable(
  "case_materials",
  {
    id: serial("id").primaryKey(),
    caseId: integer("case_id")
      .notNull()
      .references(() => cases.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 500 }),
    description: text("description"),
    volume: varchar("volume", { length: 50 }),
    image: text("image"),
  },
  (t) => [index("case_materials_case_idx").on(t.caseId)]
);

// ─── Case Steps ──────────────────────────────────────────
export const caseSteps = pgTable(
  "case_steps",
  {
    id: serial("id").primaryKey(),
    caseId: integer("case_id")
      .notNull()
      .references(() => cases.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
  },
  (t) => [index("case_steps_case_idx").on(t.caseId)]
);

// ─── Reviews ─────────────────────────────────────────────
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }).notNull(),
    type: reviewTypeEnum("type").notNull().default("video"),
    embedUrl: text("embed_url"),
    thumbnail: text("thumbnail"),
    description: text("description"),
    duration: varchar("duration", { length: 20 }),
    views: integer("views").default(0),
    date: timestamp("date").defaultNow(),
    category: varchar("category", { length: 100 }),
    published: boolean("published").default(true),
    featured: boolean("featured").default(false),
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("reviews_type_idx").on(t.type)]
);

// ─── Solutions ───────────────────────────────────────────
export const solutions = pgTable(
  "solutions",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }).notNull(),
    segment: varchar("segment", { length: 255 }).notNull(),
    description: text("description"),
    features: jsonb("features").$type<string[]>(),
    task: text("task"),
    taskPoints: jsonb("task_points").$type<string[]>(),
    advantages: jsonb("advantages").$type<string[]>(),
    image: text("image"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    published: boolean("published").default(true),
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("solutions_segment_idx").on(t.segment)]
);

// ─── Solution Materials ──────────────────────────────────
export const solutionMaterials = pgTable(
  "solution_materials",
  {
    id: serial("id").primaryKey(),
    solutionId: integer("solution_id")
      .notNull()
      .references(() => solutions.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 500 }),
    image: text("image"),
    description: text("description"),
    price: varchar("price", { length: 100 }),
  },
  (t) => [index("solution_materials_solution_idx").on(t.solutionId)]
);

// ─── Solution Steps ──────────────────────────────────────
export const solutionSteps = pgTable(
  "solution_steps",
  {
    id: serial("id").primaryKey(),
    solutionId: integer("solution_id")
      .notNull()
      .references(() => solutions.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
  },
  (t) => [index("solution_steps_solution_idx").on(t.solutionId)]
);

// ─── Solution Audiences (segments) ───────────────────────
export const solutionAudiences = pgTable("solution_audiences", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  icon: varchar("icon", { length: 50 }).notNull().default("building"),
  order: integer("order").default(0),
});

// ─── Orders ──────────────────────────────────────────────
export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    organization: varchar("organization", { length: 255 }),
    phone: varchar("phone", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    comment: text("comment"),
    totalAmount: integer("total_amount").notNull().default(0),
    status: orderStatusEnum("status").default("new"),
    notified: boolean("notified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [index("orders_status_idx").on(t.status)]
);

// ─── Order Items ─────────────────────────────────────────
export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: integer("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    productName: varchar("product_name", { length: 500 }).notNull(),
    variantName: varchar("variant_name", { length: 100 }),
    quantity: integer("quantity").notNull().default(1),
    price: integer("price").notNull(),
    sum: integer("sum").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);

// ─── Leads (consultation requests) ───────────────────────
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    paintObject: varchar("paint_object", { length: 255 }),
    surfaceType: varchar("surface_type", { length: 255 }),
    comment: text("comment"),
    name: varchar("name", { length: 255 }).notNull(),
    contact: varchar("contact", { length: 255 }).notNull(),
    messenger: messengerEnum("messenger").default("telegram"),
    status: leadStatusEnum("status").default("new"),
    notified: boolean("notified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("leads_status_idx").on(t.status)]
);

// ─── Content Blocks ──────────────────────────────────────
export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }),
    text: text("text"),
    image: text("image"),
    order: integer("order").default(0),
    published: boolean("published").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

// ─── Site Settings ───────────────────────────────────────
export const siteSettings = pgTable(
  "site_settings",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: text("value"),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

// ─── Admin Users ─────────────────────────────────────────
export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: varchar("role", { length: 50 }).default("admin"),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

// ─── Chat Messages ───────────────────────────────────────
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("chat_messages_session_idx").on(t.sessionId)]
);
