export interface SiteSettings {
  phone: string;
  phoneTel: string;
  email: string;
  address: string;
  workHours: string;
  whatsappUrl: string;
  telegramUrl: string;
  viberUrl: string;
  vkUrl: string;
  rutubeUrl: string;
  youtubeUrl: string;
  copyright: string;
}

/** Ключ в БД → поле интерфейса. Значения по умолчанию = текущий хардкод сайта. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: "+7 (911) 453-12-20",
  phoneTel: "tel:+79114531220",
  email: "info@malyar39.ru",
  address: "Калининград, ул. Дзержинского, 168",
  workHours: "Пн–Пт: с 9:00 до 18:00",
  whatsappUrl: "#",
  telegramUrl: "#",
  viberUrl: "#",
  vkUrl: "#",
  rutubeUrl: "#",
  youtubeUrl: "#",
  copyright: "© 2012–2024 Маляр — Краски и штукатурки",
};

export interface SettingsField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "url";
  placeholder?: string;
}

export interface SettingsGroup {
  title: string;
  fields: SettingsField[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: "Контакты",
    fields: [
      { key: "phone", label: "Телефон (отображаемый)", type: "tel" },
      { key: "phone_tel", label: "Ссылка tel:", type: "text", placeholder: "tel:+79114531220" },
      { key: "email", label: "E-mail", type: "email" },
      { key: "address", label: "Адрес", type: "text" },
      { key: "work_hours", label: "Режим работы", type: "text" },
    ],
  },
  {
    title: "Мессенджеры",
    fields: [
      { key: "whatsapp_url", label: "WhatsApp", type: "url", placeholder: "https://wa.me/..." },
      { key: "telegram_url", label: "Telegram", type: "url", placeholder: "https://t.me/..." },
      { key: "viber_url", label: "Viber", type: "url", placeholder: "viber://chat?number=..." },
    ],
  },
  {
    title: "Соцсети",
    fields: [
      { key: "vk_url", label: "ВКонтакте", type: "url", placeholder: "https://vk.com/..." },
      { key: "rutube_url", label: "RuTube", type: "url", placeholder: "https://rutube.ru/..." },
      { key: "youtube_url", label: "YouTube", type: "url", placeholder: "https://youtube.com/..." },
    ],
  },
  {
    title: "Прочее",
    fields: [
      { key: "copyright", label: "Строка копирайта", type: "text" },
    ],
  },
];

/** Все ключи настроек плоским списком. */
export const SETTINGS_KEYS: string[] = SETTINGS_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key)
);

/** Значение по умолчанию для ключа БД. */
export const DEFAULT_BY_KEY: Record<string, string> = {
  phone: DEFAULT_SITE_SETTINGS.phone,
  phone_tel: DEFAULT_SITE_SETTINGS.phoneTel,
  email: DEFAULT_SITE_SETTINGS.email,
  address: DEFAULT_SITE_SETTINGS.address,
  work_hours: DEFAULT_SITE_SETTINGS.workHours,
  whatsapp_url: DEFAULT_SITE_SETTINGS.whatsappUrl,
  telegram_url: DEFAULT_SITE_SETTINGS.telegramUrl,
  viber_url: DEFAULT_SITE_SETTINGS.viberUrl,
  vk_url: DEFAULT_SITE_SETTINGS.vkUrl,
  rutube_url: DEFAULT_SITE_SETTINGS.rutubeUrl,
  youtube_url: DEFAULT_SITE_SETTINGS.youtubeUrl,
  copyright: DEFAULT_SITE_SETTINGS.copyright,
};
