// Dashboard.tsx - Adicionando MetricCard
import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/SalesService/SalesService';
import MetricCard from './components/MetricCard';
import styles from './styles.module.scss';

interface DashboardProps {
  darkMode: boolean;
  className?: string;
  users?: any[]; 
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode, className = "", users = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendas, setVendas] = useState<any[]>([]);
  const [totalFechado, setTotalFechado] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await salesService.getSales();
        setVendas(data);
        
        // Calcular total fechado
        const fechado = data
          .filter((v: any) => v.stage === 'finalizado')
          .reduce((acc: number, v: any) => {
            const valor = parseFloat(v.valor?.replace(/\./g, '').replace(',', '.') || '0');
            return acc + (isNaN(valor) ? 0 : valor);
          }, 0);
        setTotalFechado(fechado);
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '20px', background: darkMode ? '#1a1a1a' : '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: darkMode ? '#fff' : '#000' }}>Dashboard</h1>
      
      <MetricCard
        title="Total Recebido"
        value={totalFechado}
        info="Vendas finalizadas"
        trend="total"
        darkMode={darkMode}
        icon="💰"
      />
    </div>
  );
};

export default Dashboard;