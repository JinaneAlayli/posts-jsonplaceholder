 
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
            const postsContainer = document.getElementById("posts-container");
            if (posts.length === 0) {
                postsContainer.innerHTML = "<p>No posts available</p>";
            } else {
                posts.forEach(post => {
                    const postElement = document.createElement("div");
                    postElement.classList.add("post");
                    postElement.innerHTML = `
                        <img src="post.png" alt="Post Image">
                        <div class="post-title">
                            <input type="text" value="${post.title}" disabled />
                            <div class="post-actions">
                                <button class="edit">✎</button>
                                <button class="delete">🗑</button>
                            </div>
                        </div>
                        <div class="post-slug">${post.slug || "No Slug"}</div>
                    `;

                    // Preserve the listener to go to post details
                    postElement.addEventListener("click", () => {
                        localStorage.setItem("postId", post.id);
                        window.location.href = "post.html";
                    });

                    // Show or hide the action buttons on hover
                    postElement.addEventListener("mouseover", () => {
                        postElement.querySelector(".post-actions").style.display = "block";
                    });

                    postElement.addEventListener("mouseout", () => {
                        postElement.querySelector(".post-actions").style.display = "none";
                    });

                    // Handle Edit button click
                    postElement.querySelector(".edit").addEventListener("click", (e) => {
                        e.stopPropagation(); // Prevent triggering the post click
                        const inputField = postElement.querySelector("input");
                        const saveButton = document.createElement("button");
                        saveButton.classList.add("save-btn");
                        saveButton.textContent = "Save";
                        postElement.querySelector(".post-title").appendChild(saveButton);

                        inputField.disabled = false;
                        saveButton.addEventListener("click", () => {
                            const newTitle = inputField.value;
                            alert(`Title saved: ${newTitle}`);
                            inputField.disabled = true;
                            saveButton.remove(); // Remove save button
                        });
                    });

                    // Handle Delete button click
                    postElement.querySelector(".delete").addEventListener("click", (e) => {
                        e.stopPropagation(); // Prevent triggering the post click
                        const confirmation = confirm(`Are you sure you want to delete "${post.title}"?`);
                        if (confirmation) {
                            postElement.remove(); // Remove the post from the UI
                            alert(`Post with title "${post.title}" deleted`);
                        }
                    });

                    postsContainer.appendChild(postElement);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
        });
}

// Fetch a single post's details and comments
function fetchPostDetails(postid) {
    //const urlParams = new URLSearchParams(window.location.search);
   // const postId = urlParams.get("postId");
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

// Fetch comments for a specific post
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
/*.post-title input {
    border: none;
    background: transparent;
    font-size: 1.4rem;
    font-weight: bold;
    color: #005f8c;
    text-align: center;
    width: 100%;
    outline: none;
}

.post-title input:focus {
    border: 1px solid #005f8c;
}

.post-actions {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
}

.post-actions button {
    background-color: transparent;
    border: none;
    color: #005f8c;
    font-size: 1.2rem;
    cursor: pointer;
}

.post-actions button:hover {
    color: #ff4040;
}

.save-btn {
    background-color: #005f8c;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
}

.save-btn:hover {
    background-color: #004080;
} */