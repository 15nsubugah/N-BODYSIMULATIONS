
  // Runge-Kutta numerical integration
  var rungeKutta = (function() {
    // h: timestep
    // u: variables
    // derivative: function that calculates the derivatives
    function calculate(h, u, derivative) {
      var a = [h/2, h/2, h, 0];
      var b = [h/6, h/3, h/3, h/6];
      var u0 = [];
      var ut = [];
      var dimension = u.length;

      for (var i = 0; i < dimension; i++) {
        u0.push(u[i]);
        ut.push(0);
      }

      for (var j = 0; j < 4; j++) {
        var du = derivative();

        for (i = 0; i < dimension; i++) {
          u[i] = u0[i] + a[j]*du[i];
          ut[i] = ut[i] + b[j]*du[i];
        }
      }

      for (i = 0; i < dimension; i++) {
        u[i] = u0[i] + ut[i];
      }
    }

    return {
      calculate: calculate
    };
  })();

  // Calculates the position of the Earth
  var physics = (function() {
    // Current state of the system
    var state = {
      // Four variables used in the differential equations
      // First two elements are x and y positions, and second two are x and y components of velocity
      u: [0, 0, 0, 0],
      masses: {
        q: 0, // Current mass ratio m2 / m1
        m1: 1,
        m2: 0, // Will be set to q
        m12: 0 // Will be set to m1 + m2
      },
      eccentricity: 0, // Current eccentricity of the orbit
      // Current positions of the two bodies
      positions: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ],
      iteration: 0 
    };

    // Initial condition of the model
    var initialConditions = {
      eccentricity: 0.7, // Eccentricity of the orbit
      q: 0.5, // Mass ratio m2 / m1
      position: {
        x: 1,
        y: 0
      },
      velocity: {
        u: 0
      }
    };


    // Calculate the initial velocity of the seconf body
    // in vertical direction based on mass ratio q and eccentricity
    function initialVelocity(q, eccentricity) {
      return Math.sqrt( (1 + q) * (1 + eccentricity) );
    }

    // Update parameters that depend on mass ratio and eccentricity
    function updateParametersDependentOnUserInput() {
      state.masses.m2 = state.masses.q;
      state.masses.m12 = state.masses.m1 + state.masses.m2;
      state.u[3] = initialVelocity(state.masses.q, state.eccentricity);
    }

    function resetStateToInitialConditions() {
      state.masses.q = initialConditions.q;
      state.eccentricity = initialConditions.eccentricity;

      state.u[0] = initialConditions.position.x;
      state.u[1] = initialConditions.position.y;
      state.u[2] = initialConditions.velocity.u;

      updateParametersDependentOnUserInput();
    }

    // Calculate the derivatives of the system of ODEs that describe equation of motion of two bodies
    function derivative() {
      var du = new Array(state.u.length);

      // x and y coordinates
      var r = state.u.slice(0,2);

      // Distance between bodies
      var rr = Math.sqrt( Math.pow(r[0],2) + Math.pow(r[1],2) );

      for (var i = 0; i < 2; i++) {
        du[i] = state.u[i + 2];
        du[i + 2] = -(1 + state.masses.q) * r[i] / (Math.pow(rr,3));
      }

      return du;
    }

    // The main function that is called on every animation frame.
    // It calculates and updates the current positions of the bodies
    function updatePosition() {
      var timestep = 0.15;
      rungeKutta.calculate(timestep, state.u, derivative);
      calculateNewPosition();
    }

    function calculateNewPosition() {
      r = 1; // Distance between two bodies
      // m12 is the sum of two massses
      var a1 = (state.masses.m2 / state.masses.m12) * r;
      var a2 = (state.masses.m1 / state.masses.m12) * r;

      state.positions[0].x = -a2 * state.u[0];
      state.positions[0].y = -a2 * state.u[1];

      state.positions[1].x = a1 * state.u[0];
      state.positions[1].y = a1 * state.u[1];
    }

    // Returns the separatation between two objects
    // This is a value from 1 and larger
    function separationBetweenObjects() {
      return initialConditions.position.x / (1 - state.eccentricity);
    }

    function updateMassRatioFromUserInput(massRatio) {
      state.masses.q = massRatio;
      updateParametersDependentOnUserInput();
    }

    function updateEccentricityFromUserInput(eccentricity) {
      state.eccentricity = eccentricity;
      updateParametersDependentOnUserInput();
    }

    return {
      resetStateToInitialConditions: resetStateToInitialConditions,
      updatePosition: updatePosition,
      initialConditions: initialConditions,
      updateMassRatioFromUserInput: updateMassRatioFromUserInput,
      updateEccentricityFromUserInput: updateEccentricityFromUserInput,
      state: state,
      separationBetweenObjects: separationBetweenObjects
    };
  })();