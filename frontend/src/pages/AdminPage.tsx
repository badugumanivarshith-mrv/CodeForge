import React from 'react';
import { ShieldAlert, Plus, BookOpen, Code2, Layers, CheckSquare } from 'lucide-react';
import { Card, Button } from '../components/common';

export const AdminPage: React.FC = () => {
  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldAlert size={20} color="#f43f5e" />
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Admin Curriculum Studio</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Zero-code curriculum management for Languages, Topics, Lessons, Quizzes, Problems, and Assignments.
          </p>
        </div>

        <Button variant="primary" size="md" leftIcon={<Plus size={16} />}>
          New Curriculum Item
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Layers size={20} color="#818cf8" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Languages & Topics</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Manage the 6 Tier-1 languages and sequence 10 core topics per language.
          </p>
          <Button variant="secondary" size="sm">Manage Tree</Button>
        </Card>

        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <BookOpen size={20} color="#34d399" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Lessons & Examples</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            MDX rich content authoring with interactive code blocks and visual aids.
          </p>
          <Button variant="secondary" size="sm">Open Editor</Button>
        </Card>

        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Code2 size={20} color="#c084fc" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Problems & Test Cases</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Configure starter code, public samples, and hidden test suites.
          </p>
          <Button variant="secondary" size="sm">Manage Problems</Button>
        </Card>

        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <CheckSquare size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Assignments & Rubrics</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Multi-file project templates and automated evaluation rubrics.
          </p>
          <Button variant="secondary" size="sm">Manage Rubrics</Button>
        </Card>
      </div>
    </div>
  );
};
