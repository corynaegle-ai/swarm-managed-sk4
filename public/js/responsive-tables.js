/**
 * Responsive Tables JavaScript
 * Handles horizontal scrolling indicators and accessibility features
 */

(function() {
  'use strict';

  /**
   * Initialize responsive table functionality
   */
  function initResponsiveTables() {
    const wrappers = document.querySelectorAll('.responsive-table-wrapper');
    
    wrappers.forEach(wrapper => {
      setupScrollIndicators(wrapper);
      makeAccessible(wrapper);
    });
  }

  /**
   * Set up scroll indicators for a table wrapper
   * @param {HTMLElement} wrapper - The table wrapper element
   */
  function setupScrollIndicators(wrapper) {
    if (!wrapper) return;

    function updateScrollIndicators() {
      const scrollLeft = wrapper.scrollLeft;
      const scrollWidth = wrapper.scrollWidth;
      const clientWidth = wrapper.clientWidth;
      const scrollRight = scrollWidth - clientWidth - scrollLeft;

      // Show left indicator if scrolled right
      if (scrollLeft > 5) {
        wrapper.classList.add('has-scroll-left');
      } else {
        wrapper.classList.remove('has-scroll-left');
      }

      // Show right indicator if can scroll right
      if (scrollRight > 5) {
        wrapper.classList.add('has-scroll-right');
      } else {
        wrapper.classList.remove('has-scroll-right');
      }
    }

    // Initial check
    updateScrollIndicators();

    // Update on scroll
    wrapper.addEventListener('scroll', updateScrollIndicators);

    // Update on resize
    window.addEventListener('resize', updateScrollIndicators);

    // Update when content changes (using MutationObserver)
    const observer = new MutationObserver(updateScrollIndicators);
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Store observer reference for cleanup
    wrapper._scrollObserver = observer;
  }

  /**
   * Make table wrapper accessible
   * @param {HTMLElement} wrapper - The table wrapper element
   */
  function makeAccessible(wrapper) {
    if (!wrapper) return;

    // Add ARIA attributes
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Scrollable table');
    wrapper.setAttribute('tabindex', '0');

    // Add keyboard navigation
    wrapper.addEventListener('keydown', function(e) {
      const scrollAmount = 50;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          wrapper.scrollLeft = Math.max(0, wrapper.scrollLeft - scrollAmount);
          break;
        case 'ArrowRight':
          e.preventDefault();
          wrapper.scrollLeft = Math.min(
            wrapper.scrollWidth - wrapper.clientWidth,
            wrapper.scrollLeft + scrollAmount
          );
          break;
        case 'Home':
          if (e.ctrlKey) {
            e.preventDefault();
            wrapper.scrollLeft = 0;
          }
          break;
        case 'End':
          if (e.ctrlKey) {
            e.preventDefault();
            wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
          }
          break;
      }
    });
  }

  /**
   * Convert existing tables to responsive tables
   * @param {string} selector - CSS selector for tables to convert
   * @param {Object} options - Configuration options
   */
  function makeTableResponsive(selector, options = {}) {
    const tables = document.querySelectorAll(selector);
    
    const config = {
      wrapperClass: 'responsive-table-wrapper',
      tableClass: 'responsive-table',
      stickyFirstColumn: false,
      ...options
    };

    tables.forEach(table => {
      // Skip if already wrapped
      if (table.closest('.responsive-table-wrapper')) return;

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = config.wrapperClass;

      // Add table class
      table.classList.add(config.tableClass);
      
      if (config.stickyFirstColumn) {
        table.classList.add('sticky-first-col');
      }

      // Wrap the table
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);

      // Initialize functionality
      setupScrollIndicators(wrapper);
      makeAccessible(wrapper);
    });
  }

  /**
   * Remove responsive table functionality
   * @param {HTMLElement} wrapper - The table wrapper element
   */
  function destroyResponsiveTable(wrapper) {
    if (!wrapper) return;

    // Clean up observer
    if (wrapper._scrollObserver) {
      wrapper._scrollObserver.disconnect();
      delete wrapper._scrollObserver;
    }

    // Remove event listeners (they'll be garbage collected with the element)
    const table = wrapper.querySelector('table');
    if (table) {
      // Move table back to original position
      wrapper.parentNode.insertBefore(table, wrapper);
      
      // Remove responsive classes
      table.classList.remove('responsive-table', 'sticky-first-col');
    }

    // Remove wrapper
    wrapper.remove();
  }

  /**
   * Refresh all responsive tables (useful after dynamic content changes)
   */
  function refreshResponsiveTables() {
    const wrappers = document.querySelectorAll('.responsive-table-wrapper');
    wrappers.forEach(wrapper => {
      const event = new Event('scroll');
      wrapper.dispatchEvent(event);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResponsiveTables);
  } else {
    initResponsiveTables();
  }

  // Export functions for global use
  window.ResponsiveTables = {
    init: initResponsiveTables,
    makeResponsive: makeTableResponsive,
    destroy: destroyResponsiveTable,
    refresh: refreshResponsiveTables
  };

  // Auto-initialize tables with .make-responsive class
  document.addEventListener('DOMContentLoaded', function() {
    makeTableResponsive('table.make-responsive');
  });

})();

/**
 * Usage Examples:
 * 
 * 1. Basic HTML structure:
 * <div class="responsive-table-wrapper">
 *   <table class="responsive-table">
 *     <!-- table content -->
 *   </table>
 * </div>
 * 
 * 2. Auto-convert existing tables:
 * <table class="make-responsive">
 *   <!-- table content -->
 * </table>
 * 
 * 3. Programmatically make tables responsive:
 * ResponsiveTables.makeResponsive('.my-table', {
 *   stickyFirstColumn: true
 * });
 * 
 * 4. Refresh after dynamic content changes:
 * ResponsiveTables.refresh();
 */