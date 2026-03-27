import React from 'react';
import styles from './styles.module.scss';

interface SalesChartProps {
  meses: string[];
  fechado: number[];
  pendente: number[];
  estimado: number[];
  darkMode: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ meses, fechado, pendente, estimado, darkMode }) => {
  console.log('📊 SalesChart renderizando com:', { meses, fechado, pendente, estimado });

  const formatarMoeda = (valor: number): string => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor || 0);
    } catch {
      return `R$ ${(valor || 0).toFixed(2).replace('.', ',')}`;
    }
  };

  return (
    <div className={`${styles.graficoContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={`${styles.graficoTitulo} ${darkMode ? styles.dark : ''}`}>
        Análise Financeira (Últimos 6 meses)
      </div>
      <div className={styles.graficoSubTitulo}>
        Valores em reais - Compare Recebido, Em Aberto e Total Estimado
      </div>
      
      {/* Versão simples em tabela */}
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: darkMode ? '#374151' : '#f3f4f6' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Mês</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Recebido</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Em Aberto</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Total Estimado</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((mes, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` }}>
                <td style={{ padding: '12px' }}>{mes}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#10b981' }}>
                  {formatarMoeda(fechado[index] || 0)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#f59e0b' }}>
                  {formatarMoeda(pendente[index] || 0)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#8b5cf6', fontWeight: 'bold' }}>
                  {formatarMoeda(estimado[index] || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!meses.length && (
        <div className={styles.graficoVazio}>
          <p>Nenhum dado financeiro disponível para o gráfico</p>
          <p className={styles.graficoAjuda}>
            Dica: Adicione valores às vendas e altere o estágio para "finalizado" ou mantenha em negociação para ver os dados
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesChart;