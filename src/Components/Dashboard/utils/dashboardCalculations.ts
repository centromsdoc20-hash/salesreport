import type { Sale } from '../../../types/Sales';

export interface Metricas {
  totalFechado: number;        // Total de vendas fechadas (valor)
  totalPendente: number;       // Total de vendas pendentes (valor)
  totalEstimado: number;       // Total estimado (fechado + pendente)
  vendasFechadasMes: number;   // Valor fechado no mês atual
  vendasPendentesMes: number;  // Valor pendente no mês atual
  crescimentoFechado: number;  // Crescimento em relação ao mês anterior
}

export interface DadosGrafico {
  meses: string[];
  fechado: number[];    // Valores fechados por mês
  pendente: number[];   // Valores pendentes por mês
  estimado: number[];   // Valores estimados por mês (fechado + pendente)
}

// Função para converter string de valor para número
const parseValor = (valorStr: string): number => {
  if (!valorStr) return 0;
  // Remove pontos de milhar e substitui vírgula por ponto
  const valorNumerico = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
  return isNaN(valorNumerico) ? 0 : valorNumerico;
};

// Função para verificar se a venda está fechada
const isVendaFechada = (sale: Sale): boolean => {
  return sale.stage === 'finalizado' || sale.statusFechado === true;
};

// Função para verificar se a venda está pendente (em negociação)
const isVendaPendente = (sale: Sale): boolean => {
  return !isVendaFechada(sale) && sale.stage !== 'perdida';
};

export const calcularMetricas = (sales: Sale[]): Metricas => {
  console.log('🔍 Calculando métricas de valores para', sales.length, 'vendas');
  
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  
  // Mês anterior para cálculo de crescimento
  let mesAnterior = mesAtual - 1;
  let anoAnterior = anoAtual;
  if (mesAnterior === 0) {
    mesAnterior = 12;
    anoAnterior = anoAtual - 1;
  }

  let totalFechado = 0;
  let totalPendente = 0;
  let valorFechadoMes = 0;
  let valorPendenteMes = 0;
  let valorFechadoMesAnterior = 0;

  sales.forEach(sale => {
    const valor = parseValor(sale.valor);
    
    // Extrair mês e ano da data
    try {
      const [_, mes, ano] = sale.date.split('/').map(Number);
      
      if (isVendaFechada(sale)) {
        totalFechado += valor;
        
        // Soma para o mês atual
        if (mes === mesAtual && ano === anoAtual) {
          valorFechadoMes += valor;
        }
        
        // Soma para o mês anterior
        if (mes === mesAnterior && ano === anoAnterior) {
          valorFechadoMesAnterior += valor;
        }
      } else if (isVendaPendente(sale)) {
        totalPendente += valor;
        
        // Soma para o mês atual
        if (mes === mesAtual && ano === anoAtual) {
          valorPendenteMes += valor;
        }
      }
    } catch (error) {
      console.error('Erro ao processar data:', sale.date, error);
    }
  });

  const totalEstimado = totalFechado + totalPendente;
  
  // Calcular crescimento de vendas fechadas
  let crescimentoFechado = 0;
  if (valorFechadoMesAnterior > 0) {
    crescimentoFechado = ((valorFechadoMes - valorFechadoMesAnterior) / valorFechadoMesAnterior) * 100;
  } else if (valorFechadoMes > 0) {
    crescimentoFechado = 100; // Se não tinha vendas no mês anterior e agora tem
  }

  console.log('📊 Métricas calculadas:', {
    totalFechado,
    totalPendente,
    totalEstimado,
    vendasFechadasMes: valorFechadoMes,
    vendasPendentesMes: valorPendenteMes,
    crescimentoFechado: Math.round(crescimentoFechado * 100) / 100
  });

  return {
    totalFechado,
    totalPendente,
    totalEstimado,
    vendasFechadasMes: valorFechadoMes,
    vendasPendentesMes: valorPendenteMes,
    crescimentoFechado: Math.round(crescimentoFechado * 100) / 100
  };
};

export const calcularDadosGrafico = (sales: Sale[]): DadosGrafico => {
  const meses: string[] = [];
  const fechado: number[] = [];
  const pendente: number[] = [];
  const estimado: number[] = [];
  
  // Últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const mes = date.toLocaleDateString('pt-BR', { month: 'short' });
    const ano = date.getFullYear();
    const mesNumero = date.getMonth() + 1;
    const anoCurto = ano.toString().slice(2);
    
    meses.push(`${mes}/${anoCurto}`);
    
    let valorFechadoMes = 0;
    let valorPendenteMes = 0;
    
    // Somar valores das vendas deste mês
    sales.forEach(sale => {
      try {
        const [_, saleMes, saleAno] = sale.date.split('/').map(Number);
        
        if (saleMes === mesNumero && saleAno === ano) {
          const valor = parseValor(sale.valor);
          
          if (isVendaFechada(sale)) {
            valorFechadoMes += valor;
          } else if (isVendaPendente(sale)) {
            valorPendenteMes += valor;
          }
        }
      } catch (error) {
        console.error('Erro ao processar data para gráfico:', sale.date, error);
      }
    });
    
    fechado.push(valorFechadoMes);
    pendente.push(valorPendenteMes);
    estimado.push(valorFechadoMes + valorPendenteMes);
  }
  
  console.log('📊 Dados do gráfico calculados:', { meses, fechado, pendente, estimado });
  
  return {
    meses,
    fechado,
    pendente,
    estimado
  };
};

export const formatarMoeda = (valor: number): string => {
  try {
    const valorNumero = typeof valor === 'number' && !isNaN(valor) ? valor : 0;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valorNumero);
  } catch (error) {
    // Fallback caso o Intl falhe
    console.error('Erro ao formatar moeda, usando fallback:', error);
    const valorFormatado = (valor || 0).toFixed(2).replace('.', ',');
    return `R$ ${valorFormatado}`;
  }
};