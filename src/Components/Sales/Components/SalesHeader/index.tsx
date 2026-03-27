import React from 'react';
import { FiPlus } from 'react-icons/fi';
import ExportButton from '../../../ExportButton';
import type { Sale } from '../../../../types/Sales';
import type { Product } from '../../../../types/Products';
import styles from '../../styles.module.scss';

interface SalesHeaderProps {
  darkMode: boolean;
  filteredSales: Sale[];
  users: any[];
  products: Product[];
  onAddSale: () => void;
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  darkMode,
  filteredSales,
  users,
  products,
  onAddSale
}) => {
  return (
    <div className={styles.salesHeader}>
      <h1 className={`${styles.salesTitle} ${darkMode ? styles.dark : ''}`}>
        Gerenciamento
      </h1>
      <div className={styles.headerActions}>
        <ExportButton
          sales={filteredSales}
          users={users}
          products={products}
          darkMode={darkMode}
          disabled={filteredSales.length === 0}
        />
        <button
          className={`${styles.addButton} ${darkMode ? styles.dark : ''}`}
          onClick={onAddSale}
        >
          <FiPlus size={16} />
          Nova Visita
        </button>
      </div>
    </div>
  );
};