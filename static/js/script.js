// Asteroid Form Submission Handler
document.addEventListener("DOMContentLoaded", () => {
  const asteroidForm = document.getElementById("asteroidForm");

  if (asteroidForm) {
    asteroidForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values (mass and velocity components)
      const asteroidData = {
        mass: Number.parseFloat(document.getElementById("mass").value),
        velocity: {
          x: Number.parseFloat(document.getElementById("vx").value),
          y: Number.parseFloat(document.getElementById("vy").value),
          z: Number.parseFloat(document.getElementById("vz").value),
        },
        latitude: Number.parseFloat(document.getElementById("latitude").value),
        longitude: Number.parseFloat(document.getElementById("longitude").value),
      };

      console.log("Asteroid data submitted:", asteroidData);

      // Add asteroid marker to Earth (if function exists)
      if (window.addAsteroidToEarth) {
        window.addAsteroidToEarth(
          asteroidData.latitude,
          asteroidData.longitude,
          asteroidData
        );
        alert(
          `Asteroid with mass ${asteroidData.mass} kg has been added to the 3D Earth visualization!`
        );
      } else {
        alert(
          `Asteroid data received. 3D Earth is loading...`
        );
      }

      // Optional: Reset form
      // asteroidForm.reset();
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Debug navigation links ending with .html
  const pageLinks = document.querySelectorAll('a[href$=".html"]');
  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      console.log("Navigating to:", href);
    });
  });
});