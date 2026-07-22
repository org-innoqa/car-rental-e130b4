/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POSTGREST_URL: string;
  readonly VITE_DB_SCHEMA: string;
  readonly VITE_DB_ANON_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
