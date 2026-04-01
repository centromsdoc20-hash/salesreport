import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './styles.module.scss';

interface SalesChartProps {
  meses: string[];
  fechado: number[];
  pendente: number[];
  perdido: number[];
  darkMode: boolean;
}

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

const SalesChart: React.FC<SalesChartProps> = ({ meses, fechado, pendente, perdido, darkMode }) => {
  const data = meses.map((mes, index) => ({
    mes,
    recebido: fechado[index] || 0,
    emAberto: pendente[index] || 0,
    perdido: perdido[index] || 0
  }));

  const hasData = data.some(item => item.recebido > 0 || item.emAberto > 0 || item.perdido > 0);

  if (!hasData) {
    return (
      <div className={`${styles.graficoContainer} ${darkMode ? styles.dark : ''}`}>
        <div className={`${styles.graficoTitulo} ${darkMode ? styles.dark : ''}`}>
          Análise Financeira (Últimos 6 meses)
        </div>
        <div className={styles.graficoSubTitulo}>
          Valores em reais - Recebido, Em Aberto e Perdido
        </div>
        <div className={styles.graficoVazio}>
          <p>Nenhum dado financeiro disponível para o gráfico</p>
          <p className={styles.graficoAjuda}>
            Dica: Adicione valores às vendas e altere o estágio para "finalizado", "em negociação" ou "perdida" para ver os dados
          </p>
        </div>
      </div>
    );
  }

  const colors = {
    recebido: darkMode ? '#10b981' : '#059669',
    emAberto: darkMode ? '#f59e0b' : '#d97706',
    perdido: darkMode ? '#ef4444' : '#dc2626',
    text: darkMode ? '#e5e7eb' : '#374151',
    grid: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.6)'
  };

  return (
    <div className={`${styles.graficoContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={`${styles.graficoTitulo} ${darkMode ? styles.dark : ''}`}>
        Análise Financeira (Últimos 6 meses)
      </div>
      <div className={styles.graficoSubTitulo}>
        Valores em reais - Recebido, Em Aberto e Perdido
      </div>
      <div className={styles.graficoWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="mes" stroke={colors.text} />
            <YAxis 
              stroke={colors.text}
              tickFormatter={(value) => formatarMoeda(value)}
            />
            <Tooltip 
              formatter={(value) => {
                if (typeof value === 'number') {
                  return formatarMoeda(value);
                }
                return value;
              }}
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                color: colors.text
              }}
            />
            <Legend />
            <Bar dataKey="recebido" name="Recebido (Fechado)" fill={colors.recebido} radius={[4, 4, 0, 0]} />
            <Bar dataKey="emAberto" name="Em Aberto (Pendente)" fill={colors.emAberto} radius={[4, 4, 0, 0]} />
            <Bar dataKey="perdido" name="Perdido" fill={colors.perdido} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;