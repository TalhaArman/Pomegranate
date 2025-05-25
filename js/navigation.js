// Add smooth scrolling functionality to the navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links that point to section IDs
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  // Add click event listener to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Get the target section ID from the href attribute
      const targetId = this.getAttribute('href');
      
      // Make sure the target exists
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Set active class on clicked link and remove from others
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll smoothly to the target section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL hash without jumping (optional)
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Handle initial active state based on scroll position
  function setActiveNavOnScroll() {
    const scrollPosition = window.scrollY;
    
    // Get all sections
    const sections = [
      document.querySelector('#overview-section'),
      document.querySelector('#market-pulse-section'),
      document.querySelector('#trade-data-section'),
      document.querySelector('#market-price-section'),
      document.querySelector('#seasonality-section'),
    ];
    
    // Find the current section based on scroll position
    let currentSectionIndex = 0;
    sections.forEach((section, index) => {
      if (section && scrollPosition >= section.offsetTop - 100) {
        currentSectionIndex = index;
      }
    });
    
    // Update active class on navigation
    navLinks.forEach((link, index) => {
      if (index === currentSectionIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Listen for scroll events to update active navigation
  window.addEventListener('scroll', setActiveNavOnScroll);
  
  // Set initial active state
  setActiveNavOnScroll();
});
