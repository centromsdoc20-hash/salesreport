import React, { useState, useRef } from 'react';
import type { Sale } from '../../types/Sales';
import styles from './styles.module.scss';
import { useSales } from './hooks/useSales';
import { useSalesForm } from './hooks/useSalesForm';
import { SalesHeader } from './Components/SalesHeader/index';
import { SalesFilters } from './Components/SalesFilters';
import { SalesTable } from './Components/SalesTable';
import { SalesModal } from './Components/SalesModal';
import { EmptyState } from './Components/EmptyState';
import SaleDetailsModal from '../SaleDetailsModal';
import { getContactMethodLabel, getStageLabel, getProductTypeLabel } from './utils/salesUtils';

interface SalesProps {
  darkMode: boolean;
  className?: string;
  currentUser: any;
  users: any[];
}

const Sales: React.FC<SalesProps> = ({ darkMode, className = "", currentUser, users }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [hoveredSale, setHoveredSale] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [clickedSale, setClickedSale] = useState<Sale | null>(null);
  const [showClickedModal, setShowClickedModal] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const {
    products,
    loading,
    filters,
    currentPage,
    searchTerm,
    filteredSales,
    currentSales,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    setCurrentPage,
    handleFilterChange,
    clearFilters,
    handleSearchChange,
    handleDeleteSale,
    loadSales,
    getUserName,
  } = useSales(currentUser);

  const {
    formData,
    submitting,
    handleFormChange,
    handleProspectionSelect,
    handleSubmit,
    resetForm,
    setEditingData,
      addProduct,       
  removeProduct,     
  updateProduct 
  } = useSalesForm(currentUser, editingSale, loadSales, () => setShowModal(false));

  const handleAddSale = () => {
    setEditingSale(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditSale = (saleId: string) => {
    const sale = filteredSales.find(s => s.id === saleId);
    if (sale) {
      setEditingSale(sale);
      setEditingData(sale);
      setShowModal(true);
    }
  };

  const handleMouseEnter = (sale: Sale, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });

    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredSale(sale);
      setShowDetailsModal(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowDetailsModal(false);
    setHoveredSale(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setHoveredSale(null);
  };

  const handleRowClick = (sale: Sale, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    
    setClickedSale(sale);
    setShowClickedModal(true);
  };

  const handleCloseClickedModal = () => {
    setShowClickedModal(false);
    setClickedSale(null);
  };

  const handleClearSearch = () => {
    handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={`${styles.sales} ${darkMode ? styles.dark : ''} ${className}`}>
      <SalesHeader
        darkMode={darkMode}
        filteredSales={filteredSales}
        users={users}
        products={products}
        onAddSale={handleAddSale}
      />

      <SalesFilters
        darkMode={darkMode}
        filters={filters}
        products={products}
        users={users}
        searchTerm={searchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      <div className={`${styles.salesTableContainer} ${darkMode ? styles.dark : ''}`}>
        {loading ? (
          <div className={styles.loadingState}>
            <div>Carregando Negociações...</div>
          </div>
        ) : filteredSales.length === 0 ? (
          <EmptyState
            darkMode={darkMode}
            hasFilters={Object.keys(filters).length > 0}
            onClearFilters={clearFilters}
          />
        ) : (
          <SalesTable
            darkMode={darkMode}
            currentSales={currentSales}
            products={products}
            totalPages={totalPages}
            currentPage={currentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredSalesLength={filteredSales.length}
            getUserName={getUserName}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onRowClick={handleRowClick}
            onPageChange={setCurrentPage}
            onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          />
        )}
      </div>

      {/* Modais de Detalhes */}
      {showDetailsModal && hoveredSale && (
        <div 
          className={styles.detailsModalWrapper}
          style={{
            position: 'fixed',
            top: hoverPosition.y,
            left: hoverPosition.x,
            zIndex: 1000
          }}
        >
          <SaleDetailsModal
            sale={hoveredSale}
            darkMode={darkMode}
            onClose={handleCloseDetailsModal}
            getUserName={getUserName}
            getContactMethodLabel={getContactMethodLabel}
            getProductTypeLabel={(productName) => getProductTypeLabel(productName, products)}
            getStageLabel={getStageLabel}
          />
        </div>
      )}

      {showClickedModal && clickedSale && (
        <div 
          className={styles.detailsModalWrapper}
          style={{
            position: 'fixed',
            top: hoverPosition.y,
            left: hoverPosition.x,
            zIndex: 1000
          }}
        >
          <SaleDetailsModal
            sale={clickedSale}
            darkMode={darkMode}
            onClose={handleCloseClickedModal}
            getUserName={getUserName}
            getContactMethodLabel={getContactMethodLabel}
            getProductTypeLabel={(productName) => getProductTypeLabel(productName, products)}
            getStageLabel={getStageLabel}
          />
        </div>
      )}

      {/* Modal de Formulário */}
      <SalesModal
        darkMode={darkMode}
        isOpen={showModal}
        editingSale={editingSale}
        submitting={submitting}
        formData={formData}
        products={products}
        users={users}
        currentUser={currentUser}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        onProspectionSelect={handleProspectionSelect}
        addProduct={addProduct}           
  removeProduct={removeProduct}     
  updateProduct={updateProduct} 
      />
    </div>
  );
};

export default Sales;