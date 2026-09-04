import { render } from '@testing-library/react';

import { ModelSelector } from '@/features/model-selector';
import { TooltipProvider } from '@/common/components/ui/tooltip';

describe('ModelSelector feature', () => {
  it('mounts without crashing', () => {
    render(
      <TooltipProvider>
        <ModelSelector />
      </TooltipProvider>
    );
  });
});
