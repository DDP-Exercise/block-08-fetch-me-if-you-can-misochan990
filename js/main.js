"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    Alexandra - 2026-06-09
 *  *******************************************************/


async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch(error) {
        console.error("Fehler:", error);
    }
}


async function initApp() {
    const appContainer = document.getElementById("app");
    let usersData = await fetchData("https://jsonplaceholder.typicode.com/users");
    let postsData = await fetchData("https://jsonplaceholder.typicode.com/posts");


    let userInstances = [];
    for (let user of usersData) {
        userInstances.push(new User(user.id, user.name, user.username, user.email, user.website));
    }


    for (let post of postsData) {
        let postObjekt = new Post(post.id, post.title, post.body);
        let postOwner = userInstances.find(user => user.id === post.userId);
        if (postOwner) {
            postOwner.posts.push(postObjekt);
        }
    }


    let htmlContent = "";

    for (let user of userInstances) {
        let postsHtml = "";
        for (let post of user.posts) {
            postsHtml += `
                <div class="post" data-post-id="${post.id}">
                    <h4>${post.title}</h4>
                    <p>${post.body}</p>
                    <button class="load-comments-btn">Load Comments</button>
                    <div class="comments-container" style="display: none;"></div>
                </div>
            `;
        }


        htmlContent += `
            <div class="user-card">
                <h2>${user.name} (@${user.username})</h2>
                <p>Email: <a href="mailto:${user.email}">${user.email}</a></p>
                <p>Website: <a href="http://${user.website}" target="_blank">${user.website}</a></p>
                
                <button class="toggle-posts-btn">Show / Hide Posts</button>
                
                <div class="posts-container" style="display: none;">
                    ${postsHtml}
                </div>
            </div>
        `;
    }


    appContainer.innerHTML = htmlContent;



    appContainer.addEventListener("click", async function(event) {
        if (event.target.classList.contains("toggle-posts-btn")) {
            let postsContainer = event.target.nextElementSibling;

            if (postsContainer.style.display === "none") {
                postsContainer.style.display = "block";
            } else {
                postsContainer.style.display = "none";
            }
        }


        if (event.target.classList.contains("load-comments-btn")) {
            let button = event.target;
            let postElement = button.closest('.post');
            let postId = postElement.getAttribute("data-post-id");
            let commentsContainer = postElement.querySelector('.comments-container');

            if (commentsContainer.innerHTML === "") {
                button.textContent = "Loading...";


                let commentsData = await fetchData(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
                let commentsHtml = "";
                for (let comment of commentsData) {
                    commentsHtml += `
                        <div class="comment">
                            <strong>${comment.email}</strong> sagt:
                            <p>${comment.body}</p>
                        </div>
                    `;
                }


                commentsContainer.innerHTML = commentsHtml;
                button.style.display = "none";
            }

            commentsContainer.style.display = "block";
        }
    });
}


initApp();