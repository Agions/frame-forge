/**
 * github-issues-resolution.test.tsx — GitHub Issue #47 & #48 漏洞修复单元测试套件
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ThemeProvider } from '@/app/providers/ThemeContext';
import SettingsPage from '@/pages/settings/SettingsPage';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('GitHub Issues #47 & #48 Resolution Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should successfully persist local project working directory to localStorage in SettingsPage (Issue #48)', async () => {
    renderWithProviders(<SettingsPage />);

    const inputs = screen.getAllByRole('textbox');
    const workDirInput = inputs[inputs.length - 1] as HTMLInputElement;

    fireEvent.change(workDirInput, { target: { value: '/Custom/Novella/Path' } });

    await waitFor(() => {
      expect(localStorage.getItem('novella_working_dir')).toBe('/Custom/Novella/Path');
    });
  });

  it('Should restore custom working directory from localStorage on mount (Issue #48)', () => {
    localStorage.setItem('novella_working_dir', '/Saved/Novella/Workspace');

    renderWithProviders(<SettingsPage />);

    const inputs = screen.getAllByRole('textbox');
    const workDirInput = inputs[inputs.length - 1] as HTMLInputElement;

    expect(workDirInput.value).toBe('/Saved/Novella/Workspace');
  });
});
