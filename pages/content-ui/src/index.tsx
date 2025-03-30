import '@extension/ui/lib/global.css';
import { createRoot } from 'react-dom/client';
import App from '@src/App';
// @ts-expect-error Because file doesn't exist before build
import tailwindcssOutput from '../dist/tailwind-output.css?inline';
import { Toaster } from '@extension/ui';
import { timelineStorage } from '@extension/storage';

const root = document.createElement('div');
root.id = 'pr-commit-noti-content-view-root';

root.dataset.vaulDrawerWrapper = 'true';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(tailwindcssOutput);
  shadowRoot.adoptedStyleSheets = [globalStyleSheet];
}
timelineStorage.deleteExpired();
shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(
  <>
    <App container={rootIntoShadow} />
    <Toaster
      swipeDirections={[]}
      expand
      visibleToasts={7}
      style={{ pointerEvents: 'auto' }}
      toastOptions={{ style: { width: '300px' } }}
      offset={{ bottom: 82 }}
    />
  </>,
);
