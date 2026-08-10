import { Blot } from 'quill';

declare module 'quill' {
  interface Quill {
    import(path: string): any;
    register(blot: typeof Blot | any): void;
  }

  interface Scope {
    INLINE: string;
  }

  interface QuillStatic {
    Scope: Scope;
  }
} 