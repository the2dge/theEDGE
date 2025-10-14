var svg = document.querySelector("svg");
var cursor = svg.createSVGPoint();
var arrows = document.querySelector(".arrows");
var randomAngle = 0;

// Game stats
var score = 0;
var arrowsLeft = 10;
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// center of target
var target = {
  x: 900,
  y: 249.5
};

// target intersection line segment
var lineSegment = {
  x1: 875,
  y1: 280,
  x2: 925,
  y2: 220
};

// bow rotation point
var pivot = {
  x: 100,
  y: 250
};

// Create responsive viewport setup
function setupViewport() {
  // Set viewBox for better scaling on mobile
  if (isMobile) {
    svg.setAttribute("viewBox", "0 0 1000 500");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
}

// Create scoreboard
function createScoreboard() {
  var scoreboardGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  scoreboardGroup.setAttribute("id", "scoreboard");
  
  var scoreboardBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  scoreboardBg.setAttribute("x", "20");
  scoreboardBg.setAttribute("y", "20");
  scoreboardBg.setAttribute("width", "150");
  scoreboardBg.setAttribute("height", "70");
  scoreboardBg.setAttribute("rx", "5");
  scoreboardBg.setAttribute("fill", "#333");
  scoreboardBg.setAttribute("opacity", "0.7");
  
  var scoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  scoreText.setAttribute("id", "score-text");
  scoreText.setAttribute("x", "35");
  scoreText.setAttribute("y", "50");
  scoreText.setAttribute("fill", "#fff");
  scoreText.setAttribute("font-size", "20");
  scoreText.textContent = "Score: 0";
  
  var arrowsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  arrowsText.setAttribute("id", "arrows-text");
  arrowsText.setAttribute("x", "35");
  arrowsText.setAttribute("y", "75");
  arrowsText.setAttribute("fill", "#fff");
  arrowsText.setAttribute("font-size", "20");
  arrowsText.textContent = "Arrows: 10";
  
  scoreboardGroup.appendChild(scoreboardBg);
  scoreboardGroup.appendChild(scoreText);
  scoreboardGroup.appendChild(arrowsText);
  
  svg.appendChild(scoreboardGroup);
}

// Update scoreboard
function updateScoreboard() {
  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("arrows-text").textContent = "Arrows: " + arrowsLeft;
  updateSaveButton(); // Add this line
}

// Create reset button
function createResetButton() {
  var resetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  resetGroup.setAttribute("id", "reset-button");
  resetGroup.style.cursor = "pointer";
  
  var resetBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  resetBg.setAttribute("x", "20");
  resetBg.setAttribute("y", "100");
  resetBg.setAttribute("width", "150");
  resetBg.setAttribute("height", "40");
  resetBg.setAttribute("rx", "5");
  resetBg.setAttribute("fill", "#88ce02");
  
  var resetText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  resetText.setAttribute("x", "40");
  resetText.setAttribute("y", "125");
  resetText.setAttribute("fill", "#fff");
  resetText.setAttribute("font-size", "18");
  resetText.textContent = "Reset Game";
  
  resetGroup.appendChild(resetBg);
  resetGroup.appendChild(resetText);
  
  // Add touch events for mobile
  if (isMobile) {
    resetGroup.addEventListener("touchstart", resetGame);
  } else {
    resetGroup.addEventListener("click", resetGame);
  }
  
  svg.appendChild(resetGroup);
}

// Create instruction overlay for mobile
function createInstructions() {
  if (!isMobile) return;
  
  var instructionsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  instructionsGroup.setAttribute("id", "instructions");
  
  var instructionsBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  instructionsBg.setAttribute("x", "250");
  instructionsBg.setAttribute("y", "150");
  instructionsBg.setAttribute("width", "500");
  instructionsBg.setAttribute("height", "200");
  instructionsBg.setAttribute("rx", "10");
  instructionsBg.setAttribute("fill", "#333");
  instructionsBg.setAttribute("opacity", "0.9");
  
  var instructionsTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
  instructionsTitle.setAttribute("x", "500");
  instructionsTitle.setAttribute("y", "190");
  instructionsTitle.setAttribute("text-anchor", "middle");
  instructionsTitle.setAttribute("fill", "#fff");
  instructionsTitle.setAttribute("font-size", "24");
  instructionsTitle.textContent = "Mobile Archery Game";
  
  var instructionsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  instructionsText.setAttribute("x", "500");
  instructionsText.setAttribute("y", "230");
  instructionsText.setAttribute("text-anchor", "middle");
  instructionsText.setAttribute("fill", "#fff");
  instructionsText.setAttribute("font-size", "18");
  instructionsText.textContent = "1. Touch and drag to aim";
  
  var instructionsText2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
  instructionsText2.setAttribute("x", "500");
  instructionsText2.setAttribute("y", "260");
  instructionsText2.setAttribute("text-anchor", "middle");
  instructionsText2.setAttribute("fill", "#fff");
  instructionsText2.setAttribute("font-size", "18");
  instructionsText2.textContent = "2. Release to shoot";
  
  var startButton = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  startButton.setAttribute("x", "400");
  startButton.setAttribute("y", "290");
  startButton.setAttribute("width", "200");
  startButton.setAttribute("height", "40");
  startButton.setAttribute("rx", "5");
  startButton.setAttribute("fill", "#88ce02");
  
  var startText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  startText.setAttribute("x", "500");
  startText.setAttribute("y", "315");
  startText.setAttribute("text-anchor", "middle");
  startText.setAttribute("fill", "#fff");
  startText.setAttribute("font-size", "18");
  startText.textContent = "Start Game";
  
  instructionsGroup.appendChild(instructionsBg);
  instructionsGroup.appendChild(instructionsTitle);
  instructionsGroup.appendChild(instructionsText);
  instructionsGroup.appendChild(instructionsText2);
  instructionsGroup.appendChild(startButton);
  instructionsGroup.appendChild(startText);
  
  instructionsGroup.addEventListener("touchstart", function(e) {
    if (e.target === startButton || e.target === startText) {
      svg.removeChild(instructionsGroup);
    }
  });
  
  svg.appendChild(instructionsGroup);
}

// Reset game
function resetGame(e) {
  // Prevent default for touch events
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  score = 0;
  arrowsLeft = 10;
  updateScoreboard();
  
  // Remove all arrows
  while (arrows.firstChild) {
    arrows.removeChild(arrows.firstChild);
  }
  
  // Hide any messages
  TweenMax.set(".miss", { autoAlpha: 0 });
  TweenMax.set(".hit", { autoAlpha: 0 });
  TweenMax.set(".bullseye", { autoAlpha: 0 });
  
  // Hide save button and re-enable it
  var saveButton = document.getElementById("save-button");
  if (saveButton) {
    TweenMax.to(saveButton, 0.5, { opacity: 0 });
    saveButton.style.pointerEvents = "auto";
    var saveText = saveButton.querySelector("text");
    if (saveText) {
      saveText.textContent = "Save Score";
    }
  }
  
  // Remove game over message if present
  var gameOver = document.getElementById("game-over");
  if (gameOver && gameOver.parentNode) {
    svg.removeChild(gameOver);
  }
  
  // Enable drawing
  if (isMobile) {
    svg.addEventListener("touchstart", draw);
  } else {
    window.addEventListener("mousedown", draw);
  }
}

// Initialize game
function initGame() {
  setupViewport();
  createScoreboard();
  createResetButton();
  createInstructions();
  createSaveButton(); 
  
  // Initial aim position
  aim({
    clientX: 320,
    clientY: 300
  });
  
  // Set up event listeners based on device
  if (isMobile) {
    svg.addEventListener("touchstart", draw);
    
    // Prevent scrolling while playing
    svg.addEventListener("touchmove", function(e) {
      e.preventDefault();
    }, { passive: false });
    
    // Disable long-press context menu
    svg.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
  } else {
    window.addEventListener("mousedown", draw);
  }
}

// Call init function
initGame();

function draw(e) {
  // Prevent default for touch events
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  // Check if there are arrows left
  if (arrowsLeft <= 0) {
    return;
  }
  
  // pull back arrow
  randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
  TweenMax.to(".arrow-angle use", 0.3, {
    opacity: 1
  });
  
  // Set up event listeners based on device
  if (isMobile) {
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", loose);
  } else {
    window.addEventListener("mousemove", aim);
    window.addEventListener("mouseup", loose);
  }
  
  // Initial aim
  if (isMobile) {
    handleTouchMove(e);
  } else {
    aim(e);
  }
}

// Handle touch move events
function handleTouchMove(e) {
  if (e.touches && e.touches[0]) {
    aim({
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    });
  }
}

function aim(e) {
  // get mouse position in relation to svg position and scale
  var point = getMouseSVG(e);
  point.x = Math.min(point.x, pivot.x - 7);
  point.y = Math.max(point.y, pivot.y + 27);
  var dx = point.x - pivot.x;
  var dy = point.y - pivot.y;
  // Make it more difficult by adding random angle each time
  var angle = Math.atan2(dy, dx) + randomAngle;
  var bowAngle = angle - Math.PI;
  var distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
  var scale = Math.min(Math.max(distance / 30, 1), 2);
  TweenMax.to("#bow", 0.3, {
    scaleX: scale,
    rotation: bowAngle + "rad",
    transformOrigin: "right center"
  });
  var arrowX = Math.min(pivot.x - ((1 / scale) * distance), 88);
  TweenMax.to(".arrow-angle", 0.3, {
    rotation: bowAngle + "rad",
    svgOrigin: "100 250"
  });
  TweenMax.to(".arrow-angle use", 0.3, {
    x: -distance
  });
  TweenMax.to("#bow polyline", 0.3, {
    attr: {
      points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300"
    }
  });

  var radius = distance * 9;
  var offset = {
    x: (Math.cos(bowAngle) * radius),
    y: (Math.sin(bowAngle) * radius)
  };
  var arcWidth = offset.x * 3;

  TweenMax.to("#arc", 0.3, {
    attr: {
      d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50"
    },
    autoAlpha: distance/60
  });
}

function loose(e) {
  // Prevent default for touch events
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  // Decrement arrows left
  arrowsLeft--;
  updateScoreboard();
  
  // release arrow
  if (isMobile) {
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", loose);
  } else {
    window.removeEventListener("mousemove", aim);
    window.removeEventListener("mouseup", loose);
  }

  TweenMax.to("#bow", 0.4, {
    scaleX: 1,
    transformOrigin: "right center",
    ease: Elastic.easeOut
  });
  TweenMax.to("#bow polyline", 0.4, {
    attr: {
      points: "88,200 88,250 88,300"
    },
    ease: Elastic.easeOut
  });
  // duplicate arrow
  var newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
  newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#arrow");
  arrows.appendChild(newArrow);

  // animate arrow along path
  var path = MorphSVGPlugin.pathDataToBezier("#arc");
  TweenMax.to([newArrow], 0.5, {
    force3D: true,
    bezier: {
      type: "cubic",
      values: path,
      autoRotate: ["x", "y", "rotation"]
    },
    onUpdate: hitTest,
    onUpdateParams: ["{self}"],
    onComplete: onMiss,
    ease: Linear.easeNone
  });
  TweenMax.to("#arc", 0.3, {
    opacity: 0
  });
  //hide previous arrow
  TweenMax.set(".arrow-angle use", {
    opacity: 0
  });
  
  // Check if game over
  if (arrowsLeft <= 0) {
    setTimeout(showGameOver, 1500);
  }
}

function hitTest(tween) {
  // check for collisions with arrow and target
  var arrow = tween.target[0];
  var transform = arrow._gsTransform;
  var radians = transform.rotation * Math.PI / 180;
  var arrowSegment = {
    x1: transform.x,
    y1: transform.y,
    x2: (Math.cos(radians) * 60) + transform.x,
    y2: (Math.sin(radians) * 60) + transform.y
  }

  var intersection = getIntersection(arrowSegment, lineSegment);
  if (intersection.segment1 && intersection.segment2) {
    tween.pause();
    var dx = intersection.x - target.x;
    var dy = intersection.y - target.y;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    var selector = ".hit";
    var points = 5;
    
    if (distance < 7) {
      selector = ".bullseye";
      points = 10;
    }
    
    // Add haptic feedback for mobile
    if (isMobile && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
    
    // Add points to score
    score += points;
    updateScoreboard();
    
    showMessage(selector);
  }
}

function onMiss() {
  // Damn!
  showMessage(".miss");
}

function showMessage(selector) {
  // handle all text animations by providing selector
  TweenMax.killTweensOf(selector);
  TweenMax.killChildTweensOf(selector);
  TweenMax.set(selector, {
    autoAlpha: 1
  });
  TweenMax.staggerFromTo(selector + " path", .5, {
    rotation: -5,
    scale: 0,
    transformOrigin: "center"
  }, {
    scale: 1,
    ease: Back.easeOut
  }, .05);
  TweenMax.staggerTo(selector + " path", .3, {
    delay: 2,
    rotation: 20,
    scale: 0,
    ease: Back.easeIn
  }, .03);
}

function showGameOver() {
  // Create game over message
  var gameOverGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gameOverGroup.setAttribute("id", "game-over");
  
  var gameOverBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  gameOverBg.setAttribute("x", "300");
  gameOverBg.setAttribute("y", "150");
  gameOverBg.setAttribute("width", "400");
  gameOverBg.setAttribute("height", "140");  // Increased height for mobile
  gameOverBg.setAttribute("rx", "10");
  gameOverBg.setAttribute("fill", "#333");
  gameOverBg.setAttribute("opacity", "0.9");
  
  var gameOverText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  gameOverText.setAttribute("x", "500");
  gameOverText.setAttribute("y", "190");
  gameOverText.setAttribute("text-anchor", "middle");
  gameOverText.setAttribute("fill", "#fff");
  gameOverText.setAttribute("font-size", "30");
  gameOverText.textContent = "Game Over!";
  
  var finalScoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  finalScoreText.setAttribute("x", "500");
  finalScoreText.setAttribute("y", "230");
  finalScoreText.setAttribute("text-anchor", "middle");
  finalScoreText.setAttribute("fill", "#fff");
  finalScoreText.setAttribute("font-size", "24");
  finalScoreText.textContent = "Final Score: " + score;
  
  // Add Play Again button
  var playAgainBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  playAgainBg.setAttribute("x", "400");
  playAgainBg.setAttribute("y", "250");
  playAgainBg.setAttribute("width", "200");
  playAgainBg.setAttribute("height", "40");
  playAgainBg.setAttribute("rx", "5");
  playAgainBg.setAttribute("fill", "#88ce02");
  
  var playAgainText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  playAgainText.setAttribute("x", "500");
  playAgainText.setAttribute("y", "275");
  playAgainText.setAttribute("text-anchor", "middle");
  playAgainText.setAttribute("fill", "#fff");
  playAgainText.setAttribute("font-size", "18");
  playAgainText.textContent = "Play Again";
  
  gameOverGroup.appendChild(gameOverBg);
  gameOverGroup.appendChild(gameOverText);
  gameOverGroup.appendChild(finalScoreText);
  gameOverGroup.appendChild(playAgainBg);
  gameOverGroup.appendChild(playAgainText);
  
  // Add event listeners for play again button
  gameOverGroup.addEventListener(isMobile ? "touchstart" : "click", function(e) {
    if (e.target === playAgainBg || e.target === playAgainText) {
      resetGame(e);
    }
  });
  
  svg.appendChild(gameOverGroup);
  
  // Animate in
  TweenMax.from(gameOverGroup, 0.5, {
    opacity: 0,
    y: -50,
    ease: Back.easeOut
  });
}

function getMouseSVG(e) {
  // normalize mouse position within svg coordinates
  if (isMobile && e.touches && e.touches[0]) {
    cursor.x = e.touches[0].clientX;
    cursor.y = e.touches[0].clientY;
  } else {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  }
  return cursor.matrixTransform(svg.getScreenCTM().inverse());
}

function getIntersection(segment1, segment2) {
  // find intersection point of two line segments and whether or not the point is on either line segment
  var dx1 = segment1.x2 - segment1.x1;
  var dy1 = segment1.y2 - segment1.y1;
  var dx2 = segment2.x2 - segment2.x1;
  var dy2 = segment2.y2 - segment2.y1;
  var cx = segment1.x1 - segment2.x1;
  var cy = segment1.y1 - segment2.y1;
  var denominator = dy2 * dx1 - dx2 * dy1;
  if (denominator == 0) {
    return null;
  }
  var ua = (dx2 * cy - dy2 * cx) / denominator;
  var ub = (dx1 * cy - dy1 * cx) / denominator;
  return {
    x: segment1.x1 + ua * dx1,
    y: segment1.y1 + ua * dy1,
    segment1: ua >= 0 && ua <= 1,
    segment2: ub >= 0 && ub <= 1
  };
}
// Add this function to create the save button
function createSaveButton() {
  var saveGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  saveGroup.setAttribute("id", "save-button");
  saveGroup.style.cursor = "pointer";
  saveGroup.style.opacity = "0"; // Initially hidden
  
  var saveBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  saveBg.setAttribute("x", "20");
  saveBg.setAttribute("y", "150");
  saveBg.setAttribute("width", "150");
  saveBg.setAttribute("height", "40");
  saveBg.setAttribute("rx", "5");
  saveBg.setAttribute("fill", "#4CAF50");
  
  var saveText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  saveText.setAttribute("x", "40");
  saveText.setAttribute("y", "175");
  saveText.setAttribute("fill", "#fff");
  saveText.setAttribute("font-size", "18");
  saveText.textContent = "Save Score";
  
  saveGroup.appendChild(saveBg);
  saveGroup.appendChild(saveText);
  
  // Add event listeners for the save button
  if (isMobile) {
    saveGroup.addEventListener("touchstart", saveScore);
  } else {
    saveGroup.addEventListener("click", saveScore);
  }
  
  svg.appendChild(saveGroup);
}

// Add this function to show/hide the save button based on score
function updateSaveButton() {
  var saveButton = document.getElementById("save-button");
  if (saveButton) {
    if (score > 50) {
      TweenMax.to(saveButton, 0.5, { opacity: 1 });
    } else {
      TweenMax.to(saveButton, 0.5, { opacity: 0 });
    }
  }
}

// Modify the saveScore function to use the working JSONP pattern
function saveScore(e) {
  // Prevent default for touch events
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  // Check if user profile is available
  if (!window.userProfile) {
    alert("Please wait while we load your profile...");
    return;
  }

  // Disable the save button to prevent multiple clicks
  var saveButton = document.getElementById("save-button");
  saveButton.style.pointerEvents = "none";
  
  // Show loading state
  var saveText = saveButton.querySelector("text");
  var originalText = saveText.textContent;
  saveText.textContent = "Saving...";

  // Create the global callback function
  window.handleSaveScore = function(response) {
    // Clean up
    delete window.handleSaveScore;
    
    // Re-enable button and restore text
    saveButton.style.pointerEvents = "auto";
    saveText.textContent = originalText;
    
    if (response.success) {
      // Show success message
      alert(response.message);
      
      // Hide save button after saving
      TweenMax.to(saveButton, 0.5, { opacity: 0 });
    } else {
      alert('Error saving score: ' + (response.message || 'Unknown error'));
    }
  };

  // Build URL with parameters
  const url = window.API_URL + 
    '?action=playScore' +
    '&userId=' + encodeURIComponent(window.userProfile.userId) +
    '&userName=' + encodeURIComponent(window.userProfile.displayName) +
    '&score=' + encodeURIComponent(score) +
    '&game=Archery' +
    '&timestamp=' + encodeURIComponent(new Date().toISOString()) +
    '&callback=handleSaveScore';
  
  // Create and append script tag
  const script = document.createElement('script');
  script.src = url;
  
  // Set error handler
  script.onerror = function() {
    // Clean up
    delete window.handleSaveScore;
    
    // Re-enable button and restore text
    saveButton.style.pointerEvents = "auto";
    saveText.textContent = originalText;
    
    alert('Failed to save score. Please try again.');
  };
  
  document.body.appendChild(script);
}

// Add JSONP function for saving scores
function saveScoreJsonp(data, successCallback, errorCallback) {
  // Create a unique callback name
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  
  // Add the callback to window object
  window[callbackName] = function(response) {
    // Clean up
    delete window[callbackName];
    document.body.removeChild(script);
    
    // Call success callback
    if (successCallback) {
      successCallback(response);
    }
  };
  
  // Build URL with parameters
  var url = window.API_URL + '?callback=' + callbackName;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }
  }
  
  // Create and append script tag
  var script = document.createElement('script');
  script.src = url;
  
  // Set error handler
  script.onerror = function() {
    // Clean up
    delete window[callbackName];
    document.body.removeChild(script);
    
    // Call error callback
    if (errorCallback) {
      errorCallback('Network error');
    }
  };
  
  // Add timeout
  setTimeout(function() {
    if (window[callbackName]) {
      delete window[callbackName];
      document.body.removeChild(script);
      if (errorCallback) {
        errorCallback('Timeout');
      }
    }
  }, 10000); // 10 second timeout
  
  document.body.appendChild(script);
}
