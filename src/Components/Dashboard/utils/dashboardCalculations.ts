import type { Sale } from '../../../types/Sales';

export interface Metricas {
  totalFechadoUltimos6Meses: number;     // Total fechado últimos 6 meses
  totalPendenteUltimos6Meses: number;    // Total pendente últimos 6 meses
  totalPerdidoUltimos6Meses: number;     // Total perdido últimos 6 meses
  vendasFechadasUltimos30Dias: number;   // Fechado últimos 30 dias
  vendasPendentesUltimos30Dias: number;  // Pendente últimos 30 dias
  vendasPerdidasUltimos30Dias: number;   // Perdido últimos 30 dias
  crescimentoFechado: number;
}

export interface DadosGrafico {
  meses: string[];
  fechado: number[];
  pendente: number[];
  perdido: number[];
}

const parseValor = (valorStr: string): number => {
  if (!valorStr || valorStr === '') return 0;
  try {
    let valorLimpo = valorStr.toString().trim();
    
    // Se já é um número puro (ex: 250)
    if (!isNaN(parseFloat(valorLimpo)) && !valorLimpo.includes(',') && !valorLimpo.includes('.')) {
      return parseFloat(valorLimpo);
    }
    
    // Conta quantos pontos tem
    const pontos = (valorLimpo.match(/\./g) || []).length;
    const temVirgula = valorLimpo.includes(',');
    
    // Caso 1: "218.85" - ponto como decimal (2 casas) - tem 1 ponto e 2 dígitos depois
    if (pontos === 1 && !temVirgula) {
      const partes = valorLimpo.split('.');
      if (partes[1] && partes[1].length === 2) {
        // É decimal, não milhar
        valorLimpo = valorLimpo.replace('.', ',');
        valorLimpo = valorLimpo.replace(',', '.');
        return parseFloat(valorLimpo);
      }
    }
    
    // Caso 2: "1.234,56" - ponto milhar e vírgula decimal
    if (pontos > 0 && temVirgula) {
      valorLimpo = valorLimpo.replace(/\./g, ''); // Remove pontos de milhar
      valorLimpo = valorLimpo.replace(',', '.');  // Troca vírgula por ponto
      return parseFloat(valorLimpo);
    }
    
    // Caso 3: "1234,56" - só vírgula
    if (temVirgula) {
      valorLimpo = valorLimpo.replace(',', '.');
      return parseFloat(valorLimpo);
    }
    
    // Caso 4: "1234.56" - só ponto (pode ser milhar ou decimal)
    if (pontos === 1 && !temVirgula) {
      // Verifica se parece milhar (ex: 1.234)
      const partes = valorLimpo.split('.');
      if (partes[0].length >= 2 && partes[1].length === 3) {
        // Provavelmente é milhar, remover ponto
        valorLimpo = valorLimpo.replace(/\./g, '');
        return parseFloat(valorLimpo);
      } else {
        // Provavelmente é decimal
        valorLimpo = valorLimpo.replace('.', ',');
        valorLimpo = valorLimpo.replace(',', '.');
        return parseFloat(valorLimpo);
      }
    }
    
    // Fallback: remove tudo que não é número e vírgula
    valorLimpo = valorLimpo.replace(/[^\d,]/g, '');
    valorLimpo = valorLimpo.replace(',', '.');
    
    const numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  } catch (error) {
    console.error('Erro ao parsear valor:', valorStr, error);
    return 0;
  }
};

const isVendaFechada = (sale: Sale): boolean => {
  return sale.stage === 'finalizado' || sale.statusFechado === true;
};

const isVendaPendente = (sale: Sale): boolean => {
  return !isVendaFechada(sale) && sale.stage !== 'perdida';
};

const isVendaPerdida = (sale: Sale): boolean => {
  return sale.stage === 'perdida';
};

// Verifica se a data está nos últimos 6 meses
const isUltimos6Meses = (dataStr: string): boolean => {
  try {
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const dataVenda = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setMonth(hoje.getMonth() - 6);
    
    return dataVenda >= dataLimite && dataVenda <= hoje;
  } catch {
    return false;
  }
};

// Verifica se a data está nos últimos 30 dias
const isUltimos30Dias = (dataStr: string): boolean => {
  try {
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const dataVenda = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const diferencaDias = Math.floor((hoje.getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24));
    return diferencaDias <= 30 && diferencaDias >= 0;
  } catch {
    return false;
  }
};

export const calcularMetricas = (sales: Sale[]): Metricas => {
  console.log('🔍 Calculando métricas de valores para', sales.length, 'vendas');
  
  const hoje = new Date();
  
  let totalFechadoUltimos6Meses = 0;
  let totalPendenteUltimos6Meses = 0;
  let totalPerdidoUltimos6Meses = 0;
  let valorFechadoUltimos30Dias = 0;
  let valorPendenteUltimos30Dias = 0;
  let valorPerdidoUltimos30Dias = 0;
  
  // Calcular valores do período anterior (30-60 dias atrás) para crescimento
  let valorFechadoPeriodoAnterior = 0;

  sales.forEach(sale => {
    const valor = parseValor(sale.valor);
    
    try {
      const [dia, mes, ano] = sale.date.split('/').map(Number);
      const dataVenda = new Date(ano, mes - 1, dia);
      const diferencaDias = Math.floor((hoje.getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24));
      
      // Verifica se está nos últimos 6 meses
      if (isUltimos6Meses(sale.date)) {
        if (isVendaFechada(sale)) {
          totalFechadoUltimos6Meses += valor;
        } else if (isVendaPendente(sale)) {
          totalPendenteUltimos6Meses += valor;
        } else if (isVendaPerdida(sale)) {
          totalPerdidoUltimos6Meses += valor;
        }
      }
      
      // Verifica se está nos últimos 30 dias
      if (isUltimos30Dias(sale.date)) {
        if (isVendaFechada(sale)) {
          valorFechadoUltimos30Dias += valor;
        } else if (isVendaPendente(sale)) {
          valorPendenteUltimos30Dias += valor;
        } else if (isVendaPerdida(sale)) {
          valorPerdidoUltimos30Dias += valor;
        }
      }
      
      // Período anterior (30-60 dias atrás) para crescimento
      if (diferencaDias > 30 && diferencaDias <= 60 && isVendaFechada(sale)) {
        valorFechadoPeriodoAnterior += valor;
      }
      
    } catch (error) {
      console.error('Erro ao processar data:', sale.date, error);
    }
  });

  let crescimentoFechado = 0;
  if (valorFechadoPeriodoAnterior > 0) {
    crescimentoFechado = ((valorFechadoUltimos30Dias - valorFechadoPeriodoAnterior) / valorFechadoPeriodoAnterior) * 100;
  } else if (valorFechadoUltimos30Dias > 0) {
    crescimentoFechado = 100;
  }

  console.log('📊 Métricas calculadas:', {
    totalFechadoUltimos6Meses,
    totalPendenteUltimos6Meses,
    totalPerdidoUltimos6Meses,
    vendasFechadasUltimos30Dias: valorFechadoUltimos30Dias,
    vendasPendentesUltimos30Dias: valorPendenteUltimos30Dias,
    vendasPerdidasUltimos30Dias: valorPerdidoUltimos30Dias,
    crescimentoFechado
  });

  return {
    totalFechadoUltimos6Meses,
    totalPendenteUltimos6Meses,
    totalPerdidoUltimos6Meses,
    vendasFechadasUltimos30Dias: valorFechadoUltimos30Dias,
    vendasPendentesUltimos30Dias: valorPendenteUltimos30Dias,
    vendasPerdidasUltimos30Dias: valorPerdidoUltimos30Dias,
    crescimentoFechado: Math.round(crescimentoFechado * 100) / 100
  };
};

export const calcularDadosGrafico = (sales: Sale[]): DadosGrafico => {
  console.log('🔍 Iniciando cálculo do gráfico com', sales.length, 'vendas');
  
  const meses: string[] = [];
  const fechado: number[] = [];
  const pendente: number[] = [];
  const perdido: number[] = [];
  
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  
  console.log('📅 Data atual:', hoje, 'Mês:', mesAtual + 1, 'Ano:', anoAtual);
  
  // Gerar últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(anoAtual, mesAtual - i, 1);
    const mes = date.toLocaleDateString('pt-BR', { month: 'short' });
    const ano = date.getFullYear();
    const mesNumero = date.getMonth() + 1;
    const anoCurto = ano.toString().slice(2);
    
    const mesLabel = `${mes}/${anoCurto}`;
    meses.push(mesLabel);
    
    console.log(`📅 Processando mês: ${mesLabel} (${mesNumero}/${ano})`);
    
    let valorFechadoMes = 0;
    let valorPendenteMes = 0;
    let valorPerdidoMes = 0;
    
    sales.forEach(sale => {
      try {
        if (!sale.date) {
          console.warn('Venda sem data:', sale);
          return;
        }
        
        const partes = sale.date.split('/');
        if (partes.length !== 3) {
          console.warn('Data inválida:', sale.date);
          return;
        }
        
        const dia = parseInt(partes[0]);
        const saleMes = parseInt(partes[1]);
        const saleAno = parseInt(partes[2]);
        
        if (isNaN(saleMes) || isNaN(saleAno)) {
          console.warn('Data com valores inválidos:', sale.date);
          return;
        }
        
        if (saleMes === mesNumero && saleAno === ano) {
          const valor = parseValor(sale.valor);
          console.log(`  - Venda do dia ${dia}: valor ${valor}, stage: ${sale.stage}`);
          
          if (isVendaFechada(sale)) {
            valorFechadoMes += valor;
            console.log(`    Adicionado ao fechado: +${valor} = ${valorFechadoMes}`);
          } else if (isVendaPendente(sale)) {
            valorPendenteMes += valor;
            console.log(`    Adicionado ao pendente: +${valor} = ${valorPendenteMes}`);
          } else if (isVendaPerdida(sale)) {
            valorPerdidoMes += valor;
            console.log(`    Adicionado ao perdido: +${valor} = ${valorPerdidoMes}`);
          }
        }
      } catch (error) {
        console.error('Erro ao processar venda:', sale, error);
      }
    });
    
    fechado.push(valorFechadoMes);
    pendente.push(valorPendenteMes);
    perdido.push(valorPerdidoMes);
    
    console.log(`📊 Resultado mês ${mesLabel}: fechado=${valorFechadoMes}, pendente=${valorPendenteMes}, perdido=${valorPerdidoMes}`);
  }
  
  console.log('📊 Dados finais do gráfico:', { meses, fechado, pendente, perdido });
  
  return {
    meses,
    fechado,
    pendente,
    perdido
  };
};

export const formatarMoeda = (valor: number): string => {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor || 0);
  } catch (error) {
    return `R$ ${(valor || 0).toFixed(2).replace('.', ',')}`;
  }
};