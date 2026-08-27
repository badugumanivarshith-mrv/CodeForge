import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';
import { Button } from '../components/common';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f43f5e',
          marginBottom: '20px',
        }}
      >
        <Terminal size={32} />
      </div>
      <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '24px', fontSize: '14px' }}>
        The requested URL was not found in the CodeForge matrix.
      </p>
      <Button variant="primary" size="md" leftIcon={<Home size={16} />} onClick={() => navigate('/')}>
        Return Home
      </Button>
    </div>
  );
};
