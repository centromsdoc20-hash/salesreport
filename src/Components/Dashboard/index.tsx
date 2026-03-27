// Dashboard.tsx - VERSÃO ATUALIZADA COM VALORES
import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/SalesService/SalesService';
import type { Sale } from '../../types/Sales';
import type { DadosGrafico } from './utils/dashboardCalculations';
import { calcularMetricas, calcularDadosGrafico } from './utils/dashboardCalculations';

import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

import styles from './styles.module.scss';

interface DashboardProps {
  darkMode: boolean;
  className?: string;
  users?: any[]; 
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode, className = "", users = [] }) => {
  const [metricas, setMetricas] = useState({
    totalFechado: 0,
    totalPendente: 0,
    totalEstimado: 0,
    vendasFechadasMes: 0,
    vendasPendentesMes: 0,
    crescimentoFechado: 0
  });
  const [vendas, setVendas] = useState<Sale[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico>({ 
    meses: [], 
    fechado: [], 
    pendente: [], 
    estimado: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const salesData = await salesService.getSales();
      setVendas(salesData);
      
      const metricasData = calcularMetricas(salesData);
      setMetricas(metricasData);
      
      const graficoData = calcularDadosGrafico(salesData);
      setDadosGrafico(graficoData);
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setError('Erro ao carregar dados do dashboard. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setError(null);
    loadDashboardData();
  };

  if (loading) {
    return <LoadingState darkMode={darkMode} />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={loadDashboardData}
        loading={loading}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : ''} ${className}`}>
      <div className={styles.dashboardHeader}>
        <h2 className={`${styles.dashboardTitle} ${darkMode ? styles.dark : ''}`}>
          Resumo Financeiro
        </h2>
        <button 
          className={`${styles.refreshButton} ${darkMode ? styles.dark : ''}`}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>
      
      <div className={styles.metricasContainer}>
        <MetricCard
          title="Total Recebido (Fechado)"
          value={metricas.totalFechado}
          info="Total de vendas já finalizadas"
          trend="total"
          darkMode={darkMode}
          icon="💰"
        />

        <MetricCard
          title="Valor em Aberto"
          value={metricas.totalPendente}
          info="Vendas em negociação"
          trend="neutral"
          darkMode={darkMode}
          icon="⏳"
        />

        <MetricCard
          title="Valor Total Estimado"
          value={metricas.totalEstimado}
          info="Recebido + Em aberto"
          trend="total"
          darkMode={darkMode}
          icon="📊"
        />
      </div>

      <div className={styles.metricasContainer}>
        <MetricCard
          title="Fechado neste Mês"
          value={metricas.vendasFechadasMes}
          info={`${metricas.crescimentoFechado >= 0 ? '↗' : '↘'} ${Math.abs(metricas.crescimentoFechado)}% vs mês anterior`}
          trend={metricas.crescimentoFechado >= 0 ? "positive" : "negative"}
          darkMode={darkMode}
          icon={metricas.crescimentoFechado >= 0 ? "📈" : "📉"}
        />

        <MetricCard
          title="Em Aberto neste Mês"
          value={metricas.vendasPendentesMes}
          info="Valor pendente do mês atual"
          trend="neutral"
          darkMode={darkMode}
          icon="🔄"
        />
      </div>

      <SalesChart
        meses={dadosGrafico.meses}
        fechado={dadosGrafico.fechado}
        pendente={dadosGrafico.pendente}
        estimado={dadosGrafico.estimado}
        darkMode={darkMode}
      />

      <SalesTable
        vendas={vendas}
        users={users}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Dashboard;