import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * O template do adaptador vem com `r2IncrementalCache`, que exige criar um
 * bucket R2. Na Fase 1 as páginas de cartão são pré-geradas no build, então
 * não há o que cachear incrementalmente. Quando o ISR entrar (revalidar ao
 * salvar um cartão, Fase 4), voltar aqui e ligar o cache R2.
 */
export default defineCloudflareConfig();
