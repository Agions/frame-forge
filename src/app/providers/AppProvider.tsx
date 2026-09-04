/**
 * App-level Provider — composes all root providers.
 */
import React, { ReactNode } from 'react'

import { SettingsProvider } from './SettingsContext'
import { ThemeProvider } from './ThemeContext'

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  )
}

export default AppProvider
