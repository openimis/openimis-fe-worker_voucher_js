import messages_en from "./translations/en.json";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
}

export const TemplateModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}