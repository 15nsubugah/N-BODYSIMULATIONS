// Start the simulation
  var simulation = (function() {
    // The method is called 60 times per second
    function animate() {
      physics.updatePosition();
      graphics.drawScene(physics.state.positions);
      window.requestAnimationFrame(animate);
    }

    function start() {
      graphics.init(function() {
        // Use the initial conditions for the simulation
        physics.resetStateToInitialConditions();
        graphics.updateObjectSizes(physics.initialConditions.q, physics.separationBetweenObjects());

        

        animate();
      });
    }

    return {
      start: start
    };
  })();