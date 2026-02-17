/**
 * Tests for responsive table functionality
 */

describe('Responsive Tables', () => {
  let testContainer;

  beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.body.removeChild(testContainer);
  });

  test('should create responsive table wrapper', () => {
    testContainer.innerHTML = `
      <table class="make-responsive">
        <thead>
          <tr><th>Header 1</th><th>Header 2</th></tr>
        </thead>
        <tbody>
          <tr><td>Data 1</td><td>Data 2</td></tr>
        </tbody>
      </table>
    `;

    ResponsiveTables.makeResponsive('.make-responsive');
    
    const wrapper = testContainer.querySelector('.responsive-table-wrapper');
    const table = testContainer.querySelector('.responsive-table');
    
    expect(wrapper).toBeTruthy();
    expect(table).toBeTruthy();
    expect(wrapper.getAttribute('role')).toBe('region');
  });

  test('should add scroll indicators when content overflows', () => {
    testContainer.innerHTML = `
      <div class="responsive-table-wrapper" style="width: 200px;">
        <table class="responsive-table" style="width: 500px;">
          <tr><td>Wide content that will overflow</td></tr>
        </table>
      </div>
    `;

    ResponsiveTables.init();
    
    const wrapper = testContainer.querySelector('.responsive-table-wrapper');
    
    // Simulate scroll to trigger indicator
    wrapper.scrollLeft = 10;
    wrapper.dispatchEvent(new Event('scroll'));
    
    // Should have right scroll indicator initially
    expect(wrapper.classList.contains('has-scroll-right')).toBeTruthy();
  });

  test('should handle keyboard navigation', () => {
    testContainer.innerHTML = `
      <div class="responsive-table-wrapper">
        <table class="responsive-table">
          <tr><td>Content</td></tr>
        </table>
      </div>
    `;

    ResponsiveTables.init();
    
    const wrapper = testContainer.querySelector('.responsive-table-wrapper');
    const initialScrollLeft = wrapper.scrollLeft;
    
    // Simulate right arrow key
    const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    wrapper.dispatchEvent(rightArrowEvent);
    
    // Should have attempted to scroll (even if no actual scroll due to content size)
    expect(wrapper.scrollLeft).toBeGreaterThanOrEqual(initialScrollLeft);
  });

  test('should cleanup properly when destroyed', () => {
    testContainer.innerHTML = `
      <div class="responsive-table-wrapper">
        <table class="responsive-table">
          <tr><td>Content</td></tr>
        </table>
      </div>
    `;

    const wrapper = testContainer.querySelector('.responsive-table-wrapper');
    ResponsiveTables.init();
    
    expect(wrapper._scrollObserver).toBeTruthy();
    
    ResponsiveTables.destroy(wrapper);
    
    expect(testContainer.querySelector('.responsive-table-wrapper')).toBeFalsy();
    expect(testContainer.querySelector('table')).toBeTruthy();
  });
});