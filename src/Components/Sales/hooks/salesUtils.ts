import type { Product } from '../../../types/Products';

export const getContactMethodLabel = (method: string) => {
  const labels = {
    'presencial': 'Presencial',
    'telefone': 'Ligação',
    'email': 'Email',
    'whatsapp': 'WhatsApp'
  };
  return labels[method as keyof typeof labels] || method;
};

export const getStageLabel = (stage: string) => {
  const labels: Record<string, string> = {
    'apresentada proposta': 'Apresentada proposta',
    'negociar': 'Negociar',
    'sondagem': 'Sondagem',
    'fechar proposta': 'Fechar proposta',
    'finalizado': 'Finalizado',
    'Primeira Visita': 'Primeira Visita',
    'visita manutenção': 'Visita manutenção',
    'renegociar contrato': 'Renegociar contrato',
    'perdida': 'Perdida'
  };
  return labels[stage] || stage;
};

export const getProductTypeLabel = (productName: string, products: Product[]) => {
  const product = products.find(p => p.name === productName);
  if (product) {
    return product.name;
  }

  const fallbackLabels: Record<string, string> = {
    'medicina do trabalho': 'Medicina do Trabalho',
    'assistencia medica': 'Assistência Médica',
  };

  return fallbackLabels[productName] || productName;
};

export const getResultClass = (stage: string) => {
  if (stage === 'finalizado') return 'fechado';
  if (stage === 'perdida') return 'perdida';
  return 'em-andamento';
};

export const getResultLabel = (stage: string) => {
  if (stage === 'finalizado') return 'Fechado';
  if (stage === 'perdida') return 'Perdida';
  return 'Negociação em andamento';
};

export const formatDateForInput = (date: string) => {
  return date.split('/').reverse().join('-');
};

export const formatDateForDisplay = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};