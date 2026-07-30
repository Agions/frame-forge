import { render } from '@testing-library/react';

import { CompositionStudio } from '@/features/composition';

describe('CompositionStudio feature', () => {
  it('mounts without crashing', () => {
    render(<CompositionStudio frames={[]} projectId="t" />);
  });
});
