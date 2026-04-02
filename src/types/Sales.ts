export interface ProductItem {
  id: string;
  productType: string;
  periodicidade: 'anual' | 'mensal';
  valor: string;
  stage: string;
  pgrLtcat?: string;
}

export interface Sale {
  id: string;
  date: string;
  companyName: string;
  type: string;
  contactName: string;
  contactMethod: 'presencial' | 'telefone' | 'email' | 'whatsapp';
  stage: 'Primeira Visita' |'prospecção' | 'apresentada proposta' | 'negociar' | 'fechar proposta' | 'finalizado' | 'fechado' |  'visita manutenção' | 'renegociar contrato' | 'perdida';
  productType: string;
  products?: ProductItem[]; 
  comments: string;
  salesPerson: string;
  createdAt?: string;
  pgrLtcat?: string;
  updatedAt?: string;
  cnpj?: string;
  lifes: number;
  result: string;
  statusFechado: boolean;
  vendedor: string;
  contatoTelefone?: string;
  contatoEmail?: string;
  contatoWhatsapp?: string;
  contatoPresencial?: string;
  periodicidade: 'anual' | 'mensal';
  valor: string;
  
  sellerInfo?: {
    name: string;
    lastName: string;
    email: string;
    fullName: string;
  };
  
  vendedorInfo?: {
    name: string;
    lastName: string;
    email: string;
    fullName: string;
  };
}

export interface SalesFilters {
  stage?: string;
  salesPerson?: string;
  productType?: string;
  type?: string;
  contactMethod?: string;
  startDate?: string;
  endDate?: string;
  statusFechado?: boolean;
  vendedor?: string;
}