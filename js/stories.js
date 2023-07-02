"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const heart = story.isFavorite ? '&#x2665;' : '&#x2661;';

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <button class="fav_button">${heart}</button>
        <button class="delete_button">&#x1F5D1;</button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);

}


function generateFavStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <button class="fav_button">&#x2665;</button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  if (!currentUser) {
    $('.fav_button').hide();
    $('.delete_button').hide();
  }

}
$allStoriesList.on("click", ".fav_button", favStory);

$storyForm.on("click", ".submit_story_btn", submitStory);
$allStoriesList.on("click", ".delete_button", deleteAndRefreshStoryPage);

async function submitStory(evt) {
  evt.preventDefault();

  const author = $('#add-author').val();
  const title = $('#story-title').val();
  const url = $('#add-url').val();
  const username = currentUser.username;
  const storyData = {
    title,
    author,
    url,
    username
  };

  const story = await storyList.addStory(currentUser, storyData);

  const newStory = generateStoryMarkup(story);

  $allStoriesList.prepend(newStory);

  $storiesLoadingMsg.remove();

  $storyForm.hide();
  $allStoriesList.show();
}

async function deleteAndRefreshStoryPage(evt) {
  evt.preventDefault();
  console.debug("deleteAndRefreshStoryPage", evt);

  const target = $(evt.target);
  const closestLI = target.closest("li");
  const storyId = closestLI.attr("id");
  await storyList.deleteStory(currentUser, storyId);

  await putStoriesOnPage();
}





async function favStory(evt) {
  evt.preventDefault();
  console.debug("favStory", evt);


  const target = $(evt.target);
  const closestLI = target.closest("li");
  const storyId = closestLI.attr("id");
  const story = storyList.stories.find(eachStory => eachStory.storyId === storyId);

  if (currentUser.favorites.some((favorite) => favorite.storyId === storyId)) {
    await currentUser.removeFavoriteStory(story);
    target.html("&#x2661;");
  } else {
    await currentUser.addFavoriteStory(story);
    target.html("&#x2665;");
  }
}
/* when clicking on Favorite stories, it lists the currentUser's favorite stories */
function listFavStories() {
  console.debug("listFavStories");

  $allStoriesList.hide();
  $favStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateFavStoryMarkup(story);
    $favStoriesList.append($story);

  }

  $favStoriesList.show();

}

async function removeFav(evt) {
  evt.preventDefault();
  const target = $(evt.target)
  target.closest('li').remove();

}

$favStoriesList.on("click", ".fav_button", favStory);
$favStoriesList.on("click", ".fav_button", removeFav);


async function removeStory(evt) {
  evt.preventDefault();
  $(evt.target).closest('li').remove()

}

$allStoriesList.on("click", ".delete_button", removeStory);