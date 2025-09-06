import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentProcessor from './PaymentProcessor';

const PaymentPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/:gateway/checkout" element={<PaymentProcessor />} />
    </Routes>
  );
};

export default PaymentPage;