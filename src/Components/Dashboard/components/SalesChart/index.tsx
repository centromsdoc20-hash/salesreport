import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import styles from './styles.module.scss';
import { formatarMoeda } from '../../utils/dashboardCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  meses: string[];
  fechado: number[];
  pendente: number[];
  estimado: number[];
  darkMode: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ meses, fechado, pendente, estimado, darkMode }) => {
  // Cores baseadas no tema
  const fechadoColor = darkMode ? '#10b981' : '#059669';
  const pendenteColor = darkMode ? '#f59e0b' : '#d97706';
  const estimadoColor = darkMode ? '#8b5cf6' : '#7c3aed';
  
  // Cores de texto baseadas no tema
  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.6)';
  const axisTextColor = darkMode ? '#9ca3af' : '#6b7280';
  const tooltipBgColor = darkMode ? '#1f2937' : '#ffffff';
  const tooltipBorderColor = darkMode ? '#4b5563' : '#d1d5db';

  const chartData = {
    labels: meses,
    datasets: [
      {
        label: 'Recebido (Fechado)',
        data: fechado,
        backgroundColor: fechadoColor,
        borderColor: fechadoColor,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Em Aberto (Pendente)',
        data: pendente,
        backgroundColor: pendenteColor,
        borderColor: pendenteColor,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Total Estimado',
        data: estimado,
        backgroundColor: estimadoColor,
        borderColor: estimadoColor,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        type: 'line' as const,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: estimadoColor,
        pointBorderColor: darkMode ? '#1f2937' : '#ffffff',
        pointBorderWidth: 2,
      }
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: 600
          },
          usePointStyle: true,
          boxWidth: 10,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorderColor,
        borderWidth: 1,
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const value = context.raw as number;
            label += formatarMoeda(value);
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          display: false,
        },
        ticks: {
          color: axisTextColor,
          font: {
            size: 11,
            weight: 500
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: axisTextColor,
          font: {
            size: 11,
            weight: 500
          },
          callback: function(value) {
            return formatarMoeda(value as number);
          }
        }
      },
    },
  };

  const hasData = fechado.some(v => v > 0) || pendente.some(v => v > 0);

  return (
    <div className={`${styles.graficoContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={`${styles.graficoTitulo} ${darkMode ? styles.dark : ''}`}>
        Análise Financeira (Últimos 6 meses)
      </div>
      <div className={styles.graficoSubTitulo}>
        Valores em reais - Compare Recebido, Em Aberto e Total Estimado
      </div>
      <div className={styles.graficoWrapper}>
        {hasData ? (
          <Chart type="bar" data={chartData} options={chartOptions} />
        ) : (
          <div className={styles.graficoVazio}>
            <p>Nenhum dado financeiro disponível para o gráfico</p>
            <p className={styles.graficoAjuda}>
              Dica: Adicione valores às vendas e altere o estágio para "finalizado" ou mantenha em negociação para ver os dados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;