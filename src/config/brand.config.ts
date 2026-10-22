/**
 * Configuração Central de Marca / Identidade do Sistema
 * 
 * 💡 DICA: Para mudar o nome fantasia da aplicação, você pode:
 * 1. Alterar a variável VITE_APP_BRAND_NAME no arquivo .env
 * 2. OU alterar os valores padrão diretamente abaixo neste arquivo.
 * 
 * Toda a aplicação consome essas propriedades de forma unificada!
 */

export interface BrandConfig {
  /** Nome fantasia principal do sistema */
  name: string;
  /** Nome completo / institucional */
  fullName: string;
  /** Sigla / monograma para avatares e mini-badges */
  shortCode: string;
  /** Slogan / subtítulo descritivo */
  tagline: string;
  /** Descrição resumida */
  description: string;
  /** Versão atual do frontend */
  version: string;
  /** Mensagem de rodapé / copyright */
  copyright: string;
  /** Retorna o título da aba do navegador formatado */
  formatPageTitle: (pageName?: string) => string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: import.meta.env.VITE_APP_BRAND_NAME || 'ALEF',
  fullName: `${import.meta.env.VITE_APP_BRAND_NAME || 'ALEF'} Task & Asset Manager`,
  shortCode: 'ALF',
  tagline: import.meta.env.VITE_APP_BRAND_TAGLINE || 'Gestão Operacional, Ativos & Matriz GUT',
  description: 'Interface web industrial para controle de ordens de serviço, ativos e priorização de tarefas.',
  version: '1.0.0',
  copyright: `© ${new Date().getFullYear()} ${import.meta.env.VITE_APP_BRAND_NAME || 'ALEF'}. Todos os direitos reservados.`,
  formatPageTitle: (pageName?: string) => {
    const baseName = import.meta.env.VITE_APP_BRAND_NAME || 'ALEF';
    return pageName ? `${pageName} · ${baseName}` : `${baseName} | Gestão de Ativos & Tarefas`;
  },
};
