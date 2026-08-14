// src/utils/dateUtils.ts

/**
 * Tipos de data aceitos pelo sistema
 */
export type DateInput = string | Date | null | undefined;

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * Aceita datas em formato ISO (YYYY-MM-DD) ou brasileiro (DD/MM/YYYY)
 * 
 * @param date - Data em formato string ou Date
 * @returns Data formatada no padrão brasileiro (DD/MM/YYYY)
 */
export const formatDateToBR = (date: DateInput): string => {
  if (!date) return '';
  
  // Converter Date para string ISO primeiro
  const dateString = date instanceof Date 
    ? date.toISOString().split('T')[0]
    : String(date);
  
  // Se for formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Se for formato BR (DD/MM/YYYY)
  if (/^\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
    return dateString;
  }
  
  // Se for uma data válida em outro formato
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Retorna o valor original se não conseguir formatar
  return dateString;
};

/**
 * Converte uma data do formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 * Útil para inputs type="date" que exigem formato ISO
 * 
 * @param date - Data em formato brasileiro (DD/MM/YYYY)
 * @returns Data no formato ISO (YYYY-MM-DD)
 */
export const formatDateToISO = (date: string): string => {
  if (!date) return '';
  
  // Se for formato BR (DD/MM/YYYY)
  if (/^\d{2}\/\d{2}\/\d{4}/.test(date)) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
  
  // Se já for formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date;
  }
  
  // Se for uma data válida em outro formato
  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  
  return date;
};

/**
 * Verifica se a string está no formato brasileiro (DD/MM/YYYY)
 */
export const isBRDateFormat = (date: string): boolean => {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
};

/**
 * Verifica se a string está no formato ISO (YYYY-MM-DD)
 */
export const isISODateFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}/.test(date);
};

/**
 * Normaliza qualquer data para o formato brasileiro (DD/MM/YYYY)
 * Esta é a função que deve ser usada antes de salvar no backend
 */
export const normalizeDateToBR = (date: DateInput): string => {
  return formatDateToBR(date);
};

/**
 * Normaliza qualquer data para o formato ISO (YYYY-MM-DD)
 * Esta é a função que deve ser usada para inputs type="date"
 */
export const normalizeDateToISO = (date: DateInput): string => {
  if (!date) return '';
  
  const dateString = date instanceof Date 
    ? date.toISOString().split('T')[0]
    : String(date);
  
  return formatDateToISO(dateString);
};