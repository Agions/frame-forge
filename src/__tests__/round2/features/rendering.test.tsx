import { render } from '@testing-library/react';

import { RenderCenter } from '@/features/rendering';

describe('RenderCenter feature', () => {
  it('mounts without crashing', () => {
    render(<RenderCenter frames={[]} projectId="t" />);
  });
});
