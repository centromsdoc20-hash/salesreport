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
    totalFechadoUltimos6Meses: 0,
    totalPendenteUltimos6Meses: 0,
    totalPerdidoUltimos6Meses: 0,
    vendasFechadasUltimos30Dias: 0,
    vendasPendentesUltimos30Dias: 0,
    vendasPerdidasUltimos30Dias: 0,
    crescimentoFechado: 0
  });
  const [vendas, setVendas] = useState<Sale[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico>({ 
    meses: [], 
    fechado: [], 
    pendente: [], 
    perdido: [] 
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
      console.log('Vendas carregadas:', salesData?.length);
      
      if (!salesData || !Array.isArray(salesData)) {
        throw new Error('Dados de vendas inválidos');
      }
      
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
          title="Total Recebido (últimos 6 meses)"
          value={metricas.totalFechadoUltimos6Meses}
          info="Vendas finalizadas nos últimos 6 meses"
          trend="total"
          darkMode={darkMode}
          icon="💰"
        />

        <MetricCard
          title="Valores em Negociação (últimos 6 meses)"
          value={metricas.totalPendenteUltimos6Meses}
          info="Vendas em andamento nos últimos 6 meses"
          trend="neutral"
          darkMode={darkMode}
          icon="⏳"
        />

        <MetricCard
          title="Valores Perdidos (últimos 6 meses)"
          value={metricas.totalPerdidoUltimos6Meses}
          info="Vendas perdidas nos últimos 6 meses"
          trend="negative"
          darkMode={darkMode}
          icon="❌"
        />
      </div>

      <div className={styles.metricasContainer}>
        <MetricCard
          title="Fechado (Últimos 30 dias)"
          value={metricas.vendasFechadasUltimos30Dias}
          info={`${metricas.crescimentoFechado >= 0 ? '↗' : '↘'} ${Math.abs(metricas.crescimentoFechado)}% vs período anterior`}
          trend={metricas.crescimentoFechado >= 0 ? "positive" : "negative"}
          darkMode={darkMode}
          icon={metricas.crescimentoFechado >= 0 ? "📈" : "📉"}
        />

        <MetricCard
          title="Em Aberto (Últimos 30 dias)"
          value={metricas.vendasPendentesUltimos30Dias}
          info="Valor pendente nos últimos 30 dias"
          trend="neutral"
          darkMode={darkMode}
          icon="🔄"
        />

        <MetricCard
          title="Perdido (Últimos 30 dias)"
          value={metricas.vendasPerdidasUltimos30Dias}
          info="Valor perdido nos últimos 30 dias"
          trend="negative"
          darkMode={darkMode}
          icon="📉"
        />
      </div>

      <SalesChart
        meses={dadosGrafico.meses}
        fechado={dadosGrafico.fechado}
        pendente={dadosGrafico.pendente}
        perdido={dadosGrafico.perdido}
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