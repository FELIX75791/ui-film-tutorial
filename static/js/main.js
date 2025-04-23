// /* main.js */
// // static/js/main.js
// console.log("[main.js] loaded");

// $(function () {
//   $(".dropbtn").on("click", function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     $(this).closest(".dropdown").toggleClass("open");
//     $(".dropdown").not($(this).closest(".dropdown")).removeClass("open");
//   });
//   $(document).on("click", () => $(".dropdown").removeClass("open"));
// });




/* linlinzhang */
/**
 * Main JavaScript file for the Cinematography Techniques Tutorial
 * Handles global functionality across all pages
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dropdown menus
  initializeDropdowns();
  
  // Handle roadmap icon interactions
  initializeRoadmapIcon();
  
  // Track page views for analytics
  trackPageView();
  
  /**
   * Initialize dropdown menu functionality
   */
  function initializeDropdowns() {
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
          const button = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          
          if (!button || !menu) return;
          
          // Toggle dropdown on button click
          button.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              // Close other open dropdowns
              dropdowns.forEach(otherDropdown => {
                  if (otherDropdown !== dropdown) {
                      otherDropdown.querySelector('.dropdown-menu')?.classList.remove('show');
                  }
              });
              
              // Toggle this dropdown
              menu.classList.toggle('show');
          });
      });
      
      // Close all dropdowns when clicking outside
      document.addEventListener('click', function() {
          dropdowns.forEach(dropdown => {
              dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
          });
      });
  }
  
  /**
   * Initialize roadmap icon functionality
   */
  function initializeRoadmapIcon() {
      const roadmapIcon = document.querySelector('.roadmap-icon');
      
      if (!roadmapIcon) return;
      
      roadmapIcon.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Check if the roadmap is currently open
          const isRoadmapOpen = sessionStorage.getItem('roadmapOpen') === 'true';
          
          if (isRoadmapOpen) {
              // If open, go back to the previous page
              window.history.back();
              sessionStorage.setItem('roadmapOpen', 'false');
          } else {
              // If closed, save current URL and open roadmap
              sessionStorage.setItem('previousUrl', window.location.href);
              sessionStorage.setItem('roadmapOpen', 'true');
              window.location.href = '/roadmap';
          }
      });
  }
  
  /**
   * Track page views for analytics
   */
  function trackPageView() {
      // Get current page information
      const pageInfo = {
          url: window.location.pathname,
          title: document.title,
          timestamp: new Date().toISOString()
      };
      
      // Save page view to server
      fetch('/save_progress', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              action: 'page_view',
              data: pageInfo
          })
      })
      .catch(error => console.error('Error tracking page view:', error));
  }
});