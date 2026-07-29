import { writeFileSync } from 'fs';
import { join } from 'path';

const content = `// Generated at build time — do not edit manually
export const environment = {
  production: true,
  supabaseUrl: '${process.env['SUPABASE_URL'] ?? ''}',
  supabaseAnonKey: '${process.env['SUPABASE_ANON_KEY'] ?? ''}',
  lsStoreSlug: '${process.env['LS_STORE_SLUG'] ?? ''}',
  lsProductId: '${process.env['LS_PRODUCT_ID'] ?? ''}',
  lsVariantId: '${process.env['LS_VARIANT_ID'] ?? ''}',
};
`;

const dest = join(import.meta.dirname, '..', 'src', 'environments', 'environment.prod.ts');
writeFileSync(dest, content, 'utf8');
console.log('Generated environment.prod.ts');
