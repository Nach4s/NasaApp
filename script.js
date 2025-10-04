// Asteroid Form Submission Handler
document.addEventListener("DOMContentLoaded", () => {
  const asteroidForm = document.getElementById("asteroidForm")

  if (asteroidForm) {
    asteroidForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const asteroidData = {
        name: document.getElementById("asteroidName").value,
        diameter: document.getElementById("diameter").value,
        velocity: document.getElementById("velocity").value,
        distance: document.getElementById("distance").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
      }

      console.log("Asteroid data submitted:", asteroidData)

      // Here you would integrate with your 3D Earth model
      // Example: updateEarthVisualization(asteroidData);

      // Show success message (you can customize this)
      alert(`Asteroid "${asteroidData.name}" has been added to the visualization!`)

      // Optional: Send data to your backend
      // fetch('/data', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(asteroidData)
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('Success:', data);
      // });
    })
  }

  // Smooth scrolling for anchor links (only for # links, not page navigation)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // This ensures navigation works even if there are any conflicts
  const pageLinks = document.querySelectorAll('a[href$=".html"]')
  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      console.log("Navigating to:", href)
      // Let the default behavior happen (navigate to the page)
      // This is just for debugging - the link should work normally
    })
  })
})

// Function to integrate with your 3D Earth model
// You'll implement this based on your Three.js setup
function updateEarthVisualization(asteroidData) {
  // Your 3D visualization code here
  // This is where you'll add the asteroid to your Three.js scene
  console.log("Updating 3D visualization with:", asteroidData)
}
