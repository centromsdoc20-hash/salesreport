import React from 'react';
import styles from './styles.module.scss';

interface MetricCardProps {
  title: string;
  value: number;
  info: string;
  trend: 'positive' | 'negative' | 'total' | 'neutral';
  darkMode: boolean;
  icon?: string;
}

// Função de formatação local para evitar problemas de import
const formatarMoeda = (valor: number): string => {
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

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  info,
  trend,
  darkMode,
  icon
}) => {
  const valorFormatado = formatarMoeda(value);

  return (
    <div className={`${styles.metricaCard} ${styles[`trend-${trend}`]} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.cardHeader}>
        <div className={`${styles.metricaTitulo} ${darkMode ? styles.dark : ''}`}>
          {title}
        </div>
        {icon && <div className={styles.cardIcon}>{icon}</div>}
      </div>
      <div className={`${styles.metricaValor} ${darkMode ? styles.dark : ''}`}>
        {valorFormatado}
      </div>
      <div className={`${styles.metricaInfo} ${trend === 'positive' ? styles.positivo : trend === 'negative' ? styles.negativo : ''}`}>
        {info}
      </div>
    </div>
  );
};

export default MetricCard;