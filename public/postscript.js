console.log("hello world");

const SERVER_PORT = 5500;
const SERVER_HOST = "localhost";
const SERVER_PROTOCOL = "http";


window.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('newcomment_form').addEventListener('submit', newcommentformhandler);
    const LikeButtons = Array.from(document.querySelectorAll('.likebutton'))
    // add like button handler to every comment rendered.
    LikeButtons.forEach((likebutton) => {
        likebutton.addEventListener('click', addlikehandler);
    })
    const DislikeButtons = Array.from(document.querySelectorAll('.dislikebutton'));
    // add dislike button handler to every comment rendered.
    DislikeButtons.forEach((dislikebutton) => {
        dislikebutton.addEventListener('click', adddislikehandler);
    })
})

// on form submit, do stuff.
function newcommentformhandler(e) {
    // prevent page from reloading.
    e.preventDefault();
    // grab post ID that's attached to post you're commenting on
    const OriginPostId = document.getElementById('newcomment_form')?.dataset.postid;
    // grab comment contents. Validate it. 
    const InnerText = document.querySelector('#newcomment_form textarea.newcomment')?.value;
    if(!inputvalidator(InnerText)) {
        alert('Comment cannot be empty');
        return;    
    }
    // grab author.
    const Author = document.querySelector('#newcomment_form input[type=text].newcomment_nameinput')?.value;
    if(!inputvalidator(Author)) {
        alert('Name cannot be empty');
        return;
    }
    // grab email.
    const Email = document.querySelector('#newcomment_form input[type=text].newcomment_emailinput')?.value;
    if(!inputvalidator(Author)) {
        alert('Email cannot be empty');
        return;
    }
    // grab website. this is optional. 
    const Website = document.querySelector('#newcomment_form input[type=text].newcomment_websiteinput').value;
    if(!optionalinputvalidator(Website)) {
        alert('Invalid website.')
        return;
    }
    // all new comments start with zero likes, dislikes, and replies.
    const Likes = 0;
    const Dislikes = 0;
    const RepliesCount = 0;
    // wrap it all up in an object.
    const data = {
        OriginPostId: OriginPostId,
        InnerText: InnerText,
        Author: Author,
        Email: Email,
        Website: Website,
        Likes: Likes,
        Dislikes: Dislikes,
        RepliesCount: RepliesCount
    }
    console.log("Data input: ");
    console.log(data);
    fetch(`${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)    
    }).then(response => {
        console.log(response);
        if(!response.ok)
        {
            if(response.status === 500) {
                throw "Internal Server error";
            }
        }
        return response.text();
    }).then(returndata => {
        console.log(returndata);
        addnewcommenttoDOM(data, Number.parseInt(returndata));
    }).catch((err) => {
        alert(`Error: ${err}`);
    })
}

function addnewcommenttoDOM(comment, CommentID) {
    let newdata = comment;
    newdata.CommentID = CommentID;
    // render comment HTML from comment.js.
    fetch(`${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/ejs/partials/comment.ejs`)
        .then(res => res.text())
        .then(template => {
            let HTML = ejs.render(template, newdata);
            let newCommentDiv = document.createElement('div');
            newCommentDiv.innerHTML = HTML;
            document.querySelector('.comment__grid').appendChild(newCommentDiv);
            // add like button handler to new comment
            newCommentDiv.querySelector('.likebutton').addEventListener('click', addlikehandler)
        })
        .catch((err) => {
            alert(`Error: ${err}`)
            console.log(newdata);
            console.error(err);
        });
    /*
    SAMPLE COMMENT: 
    <div class="comment" data-commentid=<%= CommentID %>>
    <p class="comment__innertext">
        <%= InnerText %>
    </p>
    <p class="comment__author">Left by <span id="author_id<%= CommentID %>"> <%=  Author %></span></p>
    
    <div class="likes__and__dislikes">
        <div class="likebutton">&#128077;<p class="comment__likes"><span id="likes_id0001"><%= Likes %></span></p></div>
        <div class="dislikebutton">	&#128078;<p class="comment__dislikes"><span id="dislikes_id0001"><%= Dislikes %></span></p></div>
    </div>
    
    </div>
    */
}
function inputvalidator(input) {
    if(input === '' || input === null ) {
        return false
    }
    return true;
}
function optionalinputvalidator(input) {
    return true;
}

function addlikehandler(e) {
    const ldiv = e.target;
    console.log("Target: ");
    console.log(ldiv);
    const commentid = ldiv.children[0].dataset.commentid;
    // increase like count in DOM
    const lcountspan = document.getElementById("likes_id" + commentid);
    let likes = Number(lcountspan.innerText);
    likes+= 1;
    lcountspan.innerText = String(likes);
    fetch(`${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/comments/addlike/${commentid}`,
    {
        method: 'PUT',
        headers: {
            'Content-Type': 'text'
        }
    }).then(response => {
        if(!response.ok)
        {
            console.log('');
        }
        return response.json()
    })
    .then(data => {
        if(data.status === 'good') {
            console.log(`Successfully liked comment #${commentid}`);
        }
    }).catch(err => {
        alert("Error handling like. Check the console for details.")
        console.error("Error: " + err);
    })
}

function adddislikehandler(e)
{
    alert('Dislike not implemented yet.');
    return;
}
