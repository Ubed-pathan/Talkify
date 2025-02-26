/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_API: string;
    // add more custom env variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }