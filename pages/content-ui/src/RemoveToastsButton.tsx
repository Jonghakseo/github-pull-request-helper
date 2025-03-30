import { Button, toast } from '@extension/ui';
import { t } from '@extension/i18n';
import { useEffect, useState } from 'react';

export default function RemoveToastsButton() {
  const [hasMultipleToast, setHasMultipleToast] = useState(false);

  useEffect(() => {
    function detectMultipleToast() {
      setHasMultipleToast(toast.getToasts().length > 1);
    }

    const interval = setInterval(detectMultipleToast, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!hasMultipleToast) {
    return null;
  }

  return (
    <Button
      onClick={() => toast.dismiss()}
      className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white pointer-events-auto"
      size="sm">
      {t('remove_all_toasts') || 'Remove All Toasts'}
    </Button>
  );
}
