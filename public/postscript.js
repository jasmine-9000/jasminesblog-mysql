console.log("hello world");

const SERVER_PORT = 5500;
const SERVER_HOST = "localhost";
const SERVER_PROTOCOL = "http";


window.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('newcomment_form').addEventListener('submit', newcommentformhandler);
})

function newcommentformhandler(e) {
    e.preventDefault();
    const OriginPostId = document.getElementById('newcomment_form')?.dataset.postid;
    const InnerText = document.querySelector('#newcomment_form input[type=text].newcomment')?.value;
    if(InnerText === '' || InnerText === null) {
        alert('Comment cannot be empty');
        return;
    }
    const Author = "jasmine";
    const Likes = 0;
    const Dislikes = 0;
    const RepliesCount = 0;
    const data = {
        OriginPostId: OriginPostId,
        InnerText: InnerText,
        Author: Author,
        Likes: Likes,
        Dislikes: Dislikes,
        RepliesCount: RepliesCount
    }
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
   /*
   non-ejs way of doing it...
    let commentDiv = document.createElement('div')
    let commentInnertext = document.createElement('p');
    let commentAuthor = document.createElement('p');
    let commentAuthorID = document.createElement('span');
    let commentLikesandDislikes = document.createElement('div');
    let commentLikeButton = document.createElement('div');
    let commentDislikeButton = document.createElement('div');
    let commentLikes =  document.createElement('p');
    let commentDislikes = document.createElement('p');
    let commentLikeID = document.createElement('span');
    let commentDislikeID = document.createElement('span');

    commentDiv.classList.add('comment');
    commentDiv.dataset.commentid = CommentID;
    
    commentInnertext.classList.add('comment__innertext');
    commentInnertext.textContent = comment.InnerText;
    // let commentInnertextnode = document.createTextNode(comment.InnerText);
    // commentInnertext.append();

    commentAuthorID.innerText = comment.Author;
    commentAuthorID.id = "author_id" + CommentID;

    commentAuthor.classList.add('comment__author');
    commentAuthor.innerText = "Left By ";
    commentAuthor.appendChild(commentAuthorID);

    commentLikesandDislikes.classList.add('likes__and__dislikes');
    commentLikes.classList.add('likebutton');
    commentDislikes.classList.add('dislikebutton');
    */
}

