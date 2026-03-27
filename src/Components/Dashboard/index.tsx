import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/SalesService/SalesService';

interface DashboardProps {
  darkMode: boolean;
  className?: string;
  users?: any[]; 
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendas, setVendas] = useState<any[]>([]);

  useEffect(() => {
    console.log('🟢 Dashboard MOUNTOU - Iniciando');
    
    const loadData = async () => {
      try {
        console.log('🟡 Tentando carregar vendas...');
        const data = await salesService.getSales();
        console.log('🟢 Vendas carregadas:', data);
        setVendas(data);
        setLoading(false);
      } catch (err) {
        console.error('🔴 ERRO AO CARREGAR:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Renderização mínima
  return (
    <div style={{ padding: '20px', background: darkMode ? '#1a1a1a' : '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: darkMode ? '#fff' : '#000' }}>Dashboard Teste</h1>
      
      {loading && (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', marginTop: '20px' }}>
          <h3>⏳ Carregando dados...</h3>
          <p>Aguardando resposta do servidor...</p>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '20px', background: '#ffebee', borderRadius: '8px', marginTop: '20px', color: '#c62828' }}>
          <h3>❌ Erro ao carregar</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', marginTop: '20px' }}>
          <h3>✅ Dados carregados com sucesso!</h3>
          <p>Total de vendas: {vendas.length}</p>
          <details>
            <summary>Ver primeiras 5 vendas</summary>
            <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(vendas.slice(0, 5), null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Dashboard;