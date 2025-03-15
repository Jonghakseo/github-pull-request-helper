import { useEffect } from 'react';
import { ToggleButton } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';

export default function App() {
  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return <></>;
}
