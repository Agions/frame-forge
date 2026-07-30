import { render } from '@testing-library/react';

import { CostDashboard } from '@/features/cost';

describe('CostDashboard feature', () => {
  it('mounts without crashing', () => {
    render(<CostDashboard projectId="t" />);
  });
});
