// React to user input
  var userInput = (function(){
    var sunsMassElement = document.querySelector(".EarthOrbitSimulation-sunsMass");
    var eccentricityElement = document.querySelector(".EarthOrbitSimulation-eccentricity");
    var restartButton = document.querySelector(".EarthOrbitSimulation-reload");
    var massSlider, eccentricitySlider;

    function didUpdateMassSlider(sliderValue) {
      if (sliderValue === 0) { sliderValue = 0.005; }
      var oldEccentricity = physics.state.eccentricity;
      physics.resetStateToInitialConditions();
      graphics.clearScene();
      physics.updateMassRatioFromUserInput(sliderValue);
      physics.updateEccentricityFromUserInput(oldEccentricity);
      graphics.updateObjectSizes(physics.state.masses.q, physics.separationBetweenObjects());
      showMassRatio(sliderValue);
    }

    function showMassRatio(ratio) {
      var formattedRatio = parseFloat(Math.round(ratio * 100) / 100).toFixed(2);
      sunsMassElement.innerHTML = formattedRatio;
    }

    function didUpdateEccentricitySlider(sliderValue) {
      var oldMassRatio = physics.state.masses.q;
      physics.resetStateToInitialConditions();
      graphics.clearScene();
      physics.updateMassRatioFromUserInput(oldMassRatio);
      physics.updateEccentricityFromUserInput(sliderValue);
      showEccentricity(sliderValue);
      graphics.updateObjectSizes(physics.state.masses.q, physics.separationBetweenObjects());
    }

    function showEccentricity(ratio) {
      var formattedRatio = parseFloat(Math.round(ratio * 100) / 100).toFixed(2);
      eccentricityElement.innerHTML = formattedRatio;
    }

    function didClickRestart() {
      physics.resetStateToInitialConditions();
      graphics.clearScene();
      showMassRatio(physics.initialConditions.q);
      showEccentricity(physics.initialConditions.eccentricity);
      massSlider.changePosition(physics.initialConditions.q);
      eccentricitySlider.changePosition(physics.initialConditions.eccentricity);
      graphics.updateObjectSizes(physics.initialConditions.q, physics.separationBetweenObjects());
      return false; // Prevent default
    }

    function init() {
      // Mass slider
      massSlider = SickSlider(".EarthOrbitSimulation-massSlider");
      massSlider.onSliderChange = didUpdateMassSlider;
      showMassRatio(physics.initialConditions.q);
      massSlider.changePosition(physics.initialConditions.q);

      // Eccentricity slider
      eccentricitySlider = SickSlider(".EarthOrbitSimulation-eccentricitySlider");
      eccentricitySlider.onSliderChange = didUpdateEccentricitySlider;
      showEccentricity(physics.initialConditions.eccentricity);
      eccentricitySlider.changePosition(physics.initialConditions.eccentricity);

      restartButton.onclick = didClickRestart;
    }

    return {
      init: init
    };
  })();
