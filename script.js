window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("posts-container")) {
        fetchPosts();
    }

    if (document.getElementById("post-title")) {
        const postId = localStorage.getItem("postId");
        fetchPostDetails(postId);
    }
});

// Fetch all posts and display them
function fetchPosts() {
    fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => response.json())
        .then(posts => {
            console.log("Fetched posts:", posts);  // Check if posts are fetched successfully
            const postsContainer = document.getElementById("posts-container");
            if (posts.length === 0) {
                postsContainer.innerHTML = "<p>No posts available</p>";
            } else {
                posts.forEach(post => {
                    fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
                        .then(response => response.json())
                        .then(user => {
                            const postElement = document.createElement("div");
                            postElement.classList.add("post");
                            postElement.innerHTML = `
                                <img src="post.png" alt="Post Image">
                                <div class="post-title">${post.title}</div>
                                <div class="post-username">By: ${user.username}</div>
                            `;

                            postElement.addEventListener("click", () => {
                                const urlParams = new URLSearchParams({ postId: post.id });
                                // localStorage.setItem("postId", post.id);
                                window.location.href = `post.html?${urlParams}`;
                            });

                            postsContainer.appendChild(postElement);
                        });
                });
            }
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
        });
}


//  post's details and comments
function fetchPostDetails(postid) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");
    if (postid) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postid}`)
            .then(response => response.json())
            .then(post => {
                document.getElementById("post-title").textContent = post.title;
                document.getElementById("post-content").textContent = post.body;
                document.getElementById("post-date").textContent = new Date().toLocaleString();
                document.getElementById("post-image").src = "https://via.placeholder.com/800x400";

                fetchComments(postid);
            })
            .catch(error => console.error("Error fetching post details:", error));
    }
}

function fetchComments(postid) {
    
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postid}`)
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.getElementById("comments-list");
            if (comments.length === 0) {
                commentsList.innerHTML = "<li>No comments yet</li>";
            } else {
            comments.forEach(comment => {
                const commentElement = document.createElement("li");
                commentElement.classList.add("comment");
                commentElement.innerHTML = `
                    <strong>Name: ${comment.name}</strong>
                    <p>${comment.body}</p>
                    <p class="cmnt-email"><i>By: ${comment.email}</i></p>
                `;
                commentsList.appendChild(commentElement);
            });
        }
        })
        .catch(error => console.error("Error fetching comments:", error));
}
