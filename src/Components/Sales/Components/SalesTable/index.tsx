import React from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Sale } from '../../../../types/Sales';
import type { Product } from '../../../../types/Products';
import { getStageLabel, getProductTypeLabel, getResultClass, getResultLabel } from '../../utils/salesUtils';
import styles from '../../styles.module.scss';

interface SalesTableProps {
  darkMode: boolean;
  currentSales: Sale[];
  products: Product[];
  totalPages: number;
  currentPage: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  filteredSalesLength: number;
  getUserName: (userId: string, sale?: Sale) => string;
  onEdit: (saleId: string) => void;
  onDelete: (saleId: string) => void;
  onMouseEnter: (sale: Sale, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onRowClick: (sale: Sale, event: React.MouseEvent) => void;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  darkMode,
  currentSales,
  products,
  totalPages,
  currentPage,
  indexOfFirstItem,
  indexOfLastItem,
  filteredSalesLength,
  getUserName,
  onEdit,
  onDelete,
  onMouseEnter,
  onMouseLeave,
  onRowClick,
  onPageChange,
  onPrevPage,
  onNextPage
}) => {
  return (
    <>
      <div className={styles.tableHeader}>
        <div className={`${styles.tableTitle} ${darkMode ? styles.dark : ''}`}>
          Registro ({filteredSalesLength} resultados)
        </div>
        
        {filteredSalesLength > 0 && (
          <div className={`${styles.paginationInfo} ${darkMode ? styles.dark : ''}`}>
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSalesLength)} de {filteredSalesLength}
          </div>
        )}
      </div>

      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Nome da Empresa</th>
            <th>Estágio</th>
            <th>Tipo de Produto</th>
            <th>Resultado</th>
            <th>Vendedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr 
              key={sale.id}
              onMouseEnter={(e) => onMouseEnter(sale, e)}
              onMouseLeave={onMouseLeave}
              onClick={(e) => onRowClick(sale, e)}
              className={`${styles.saleRow} ${styles.clickable}`}
            >
              <td>{sale.date}</td>
              <td><strong>{sale.companyName}</strong></td>
              <td>
                <span className={`${styles.stage} ${styles[sale.stage]}`}>
                  {getStageLabel(sale.stage)}
                </span>
              </td>
              <td>{getProductTypeLabel(sale.productType, products)}</td>
              <td className={`${styles.resultado} ${styles[getResultClass(sale.stage)]} ${darkMode ? styles.dark : ''}`}>
                {getResultLabel(sale.stage)}
              </td>
              <td>{getUserName(sale.salesPerson, sale)}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton} ${darkMode ? styles.dark : ''}`}
                    onClick={() => onEdit(sale.id)}
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton} ${darkMode ? styles.dark : ''}`}
                    onClick={() => onDelete(sale.id)}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={`${styles.pagination} ${darkMode ? styles.dark : ''}`}>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            <FiChevronLeft size={16} />
            Anterior
          </button>

          <div className={styles.paginationNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
};