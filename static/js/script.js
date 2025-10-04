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
        latitude: Number.parseFloat(document.getElementById("latitude").value),
        longitude: Number.parseFloat(document.getElementById("longitude").value),
      }

      console.log("Asteroid data submitted:", asteroidData)

      if (window.addAsteroidToEarth) {
        window.addAsteroidToEarth(asteroidData.latitude, asteroidData.longitude, asteroidData)
        alert(`Asteroid "${asteroidData.name}" has been added to the 3D Earth visualization!`)
      } else {
        alert(`Asteroid "${asteroidData.name}" data received. 3D Earth is loading...`)
      }

      // Optional: Reset form
      // asteroidForm.reset();
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
