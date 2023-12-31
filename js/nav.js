"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  location.reload();
  hidePageComponents();
  putStoriesOnPage();
  $favStoriesList.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/* Showing the story form when clicking on Submit Story */

function showStoryForm(evt) {
  if (!currentUser) {
    alert('You must be logged in to submit a new story!')
    return
  } else {
    console.log("showStoryForm", evt);
    hidePageComponents();
    $("#story-form").show();
  }
}

$("#nav-story").on("click", showStoryForm);

// Shows all currentUser's favorite stories upon click

function showFavStories(evt) {
  if (!currentUser) {
    alert('You must be logged in to see your favorites!')
    return
  } else {
    console.debug("showFavStories", evt);
    hidePageComponents();
    listFavStories();
  }
}

$body.on("click", "#nav-fav", showFavStories);