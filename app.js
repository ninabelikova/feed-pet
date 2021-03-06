

// todo: story progresses as the affection increases

// todo: add about section on website



var app = angular.module('app', []);

app.controller("Game", function($scope){


  // game content (stories, texts)

  $scope.intro = ["It's snowing tonight.", "I'm quickly heading home, almost running, because my neck and my ears hurt from the cold.", "I didn't think to bring my scarf because it was just a quick trip to the grocery store.", "Now I wish I'd brought it with me.",
              "I can see my house just around the corner on the far end of this street.", "I can't wait to get home and curl up in a blanket by the electric fire.",
              "Even in this usually very pretty and colorful neigherhood, everything is just a blur of grey and white in winter.", "However, I think I'm seeing something bright red there near the snow-covered bushes on the left side of the street.",
              "As I get closer, I hear the faint sound of a cat meowing.", "A grey, round cat face is poking out of the small red box!",
              "The cat is watching me with its big blue eyes and meowing loudly like it's been starving for weeks.",
              "It has fluffy grey fur and a squashed round face with some snow on it. Maybe it has a habit of running into walls.",
              "Watching the little cat meowing and playing around in this box, I feel the famous cat therapy begin to work. My typical young adult nihilism melts into general optimism towards life as long as a cat is in my field of view.",
              "It doesn't seem to have a name tag on him. But surely it's not abandoned? I've never seen anybody actually dump an animal in a box on the streets before.",
              "\"Either way I can't keep you, cat.\" I say, \"I'm really sorry. I'm a full time student and don't have time to take care of a cat.\"",
              "The cat looks up, stops meowing and stares at me. It looks slightly...offended.",
              "It's not like I could do anything else! I try to ignore the guilt I feel in my stomach as I leave the grey cat in the snow alone and walk away.",
              "The rest of the journey to home, which lasts for 5 minutes, is spent brooding about the papers I have to write tonight and the weirdly expressive expression on the cat's face.",
              "However, as it turns out, I'll have to go to the grocery store again.",
              "Because when I open the door and turn on the lights, the cat is there on the table. Sitting tall and elegantly, as if it already owns the place. It meows when it sees me. I can't help but think this meow sounds vaguely triumphant",
              "That's why I have to go to the grocery store again. To get cat food.",
              " "];
  $scope.home = ["Your cat is blocking the view of your laptop, preventing you from working on your papers.", "Your cat is sleeping on your bed."];

  $scope.cat_love_statements = {4:"Your cat seems to like you.", 8:"Your cat seems to be quite fond of you.", 15: "Your cat loves you."};

  $scope.cat_descriptions = ["is sitting on your keyboard, preventing you from playing video games.", "is sleeping like a dog on your desk.", "is staring at the window, as if its own existence puzzles it.", "is blocking the door, preventing you from going out at all.", "meows at you and wants to cuddle.", "is sitting on your keyboard, preventing you from doing work.", "is meowing all day like it has composed an epic symphony.", "meows at you with affection.", "is sleeping.", "face-bumps you 10 times."]


  // game variables

  $scope.scene = [$scope.intro, $scope.home];

  $scope.story_text = "";

  $scope.current_scene = $scope.scene[0];
  $scope.current_scene_num = 0;
  $scope.current_line = 0;
  $scope.current_button = 'none';

  $scope.story_noti = "";
  $scope.notify_class = "";
  $scope.show_noti = false;
  $scope.next_hide = false;

  $scope.cat_description = "";

  $scope.cat_love_requirements = Object.keys($scope.cat_love_statements).map(Number);


  // game engine

  $scope.load_scene = function(scene_num) {
    $scope.current_scene_num = scene_num;
    $scope.current_scene = $scope.scene[scene_num];
    $scope.story_text = $scope.current_scene[0];
    $scope.current_line = 0;
    $scope.story_noti = "";
    $scope.show_noti = false;
    localStorage.current_scene_num = scene_num;

    $scope.check_intro();
    $scope.check_home();

    if ($scope.first_level_achieved()) {
      $scope.load_advanced_cat_status();
    }

  }

  $scope.progress_scene = function() {
    $scope.current_line += 1;
    $scope.story_text = $scope.current_scene[$scope.current_line];
    $scope.check_intro();
  }

  $scope.is_last_line = function() {
    if (($scope.current_line + 1) === $scope.current_scene.length) {
      return true;
    }
  }

  $scope.push_notification = function(message) {
    $scope.story_noti = message;
    $scope.show_noti = true;
    $scope.notify_class = "animated bounceIn";
  }

  $scope.is_current_button = function(button_name) {
    return $scope.current_button === button_name;
  }

  $scope.get_date = function() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();

    if (day < 10) {
      day = "0" + day;
    }

    if (month < 10) {
      month = "0" + month;
    }

    today = year + '/' + month + '/' + day;
    return today;
  }

  $scope.restart = function() {
    localStorage.removeItem($scope.get_date());
    localStorage.removeItem("started");
    localStorage.removeItem("current_scene_num");
    localStorage.removeItem("days");
    localStorage.removeItem("cat_status");
    $scope.load_scene(0);
  }

  $scope.has_started = function() {
    if (localStorage.started === "yes") {
      return true;
    }
  }

  $scope.get_random_int = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  // plot functions

  $scope.check_intro = function() {
    if ($scope.current_scene === $scope.intro && $scope.is_last_line()) {
      $scope.push_notification("Congratulations! You have gained [5 exp] and [a magical cat]!");
      $scope.current_button = "fine";
    } else if ($scope.current_scene === $scope.intro) {
      $scope.current_button = "next";
    }
  }

  $scope.load_home = function() {
    $scope.load_scene(1);
    $scope.current_button = 'feed';
    localStorage.started = "yes";
  }

  $scope.check_home = function () {
    if ($scope.current_scene === $scope.scene[1] && !$scope.is_fed()) {
      $scope.current_button = 'feed';
    }
  }

  $scope.feed = function() {
    $scope.push_notification("You have fed your cat today.");
    localStorage.setItem($scope.get_date(), "yes");
    $scope.current_button = 'none';

    if (localStorage.getItem("days") === null) {
      localStorage.setItem("days", "1");
    } else {
      var new_days = parseInt(localStorage.days) + 1;
      localStorage.setItem("days", new_days);
    }
    if ($scope.first_level_achieved()) {
      $scope.show_advanced_cat_status();
    }
  }

  $scope.is_fed = function() {
    if ( localStorage.getItem($scope.get_date()) === "yes" ) {
      return true;
    }
  }

  $scope.pet_status = function() {
    if ($scope.is_fed()) {
      return "Your cat is full.";
    } else {
      return "Your cat wants to eat.";
    }
  }

  $scope.current_days = function() {
    if (localStorage.getItem("days") != null) {
      return localStorage.getItem("days");
    } else {
      return 0;
    }
  }

  $scope.current_days_int = function() {
    if (localStorage.getItem("days") != null) {
      return parseInt(localStorage.getItem("days"));
    } else {
      return 0;
    }
  }

  $scope.cat_love_statement = function() {
    var days = $scope.current_days_int();
    var required_days = $scope.cat_love_requirements;
    var achieved_level = 0;
    var statement;


    for(var i = 0; i < required_days.length-1; i++) {
      if (days >= required_days[i]) {
        achieved_level = required_days[i];
      } else {
        achieved_level = achieved_level > 0 ? achieved_level : 0;
      }
    }

    if (achieved_level > 0) {
      statement = $scope.cat_love_statements[achieved_level.toString()];
      return statement;
    }

    return null;
  }

  $scope.show_advanced_cat_status = function() {
    var random_num;
  //  if ($scope.current_scene_num >= 1 && $scope.current_days_int >= $scope.cat_love_requirements[0]) {
      random_num = $scope.get_random_int(0, $scope.cat_descriptions.length-1);
      $scope.story_text = "";
      $scope.cat_description = "Your cat " + $scope.cat_descriptions[random_num];

      localStorage.setItem('cat_status', $scope.cat_description);
  //  }
  }

  $scope.load_advanced_cat_status = function() {
    if (localStorage.getItem('cat_status') != null) {
      $scope.story_text = "";
      $scope.cat_description = localStorage.getItem('cat_status');
    }
  }

  $scope.first_level_achieved = function() {
    return $scope.current_scene_num >= 1 && $scope.current_days_int >= $scope.cat_love_requirements[0];
  }


  // ------ website variables (not game related) ------

  $scope.visible_credits = false;


  // --------- website functions (not game related) -----

  $scope.toggle_credits = function() {
    $scope.visible_credits = !$scope.visible_credits;
  }


  // ---------- dev functions ----------------

  $scope.skip_scene = function() {
    $scope.current_line = $scope.current_scene.length -2;
  }


  // ----------initialise game ----------------

  if (localStorage.getItem("current_scene_num") != null) {
    $scope.load_scene(localStorage.getItem("current_scene_num"));
  } else {
    $scope.load_scene(0);
  }





});
