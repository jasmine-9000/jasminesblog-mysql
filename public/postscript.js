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
    const InnerText = document.querySelector('#newcomment_form input[type=text].newcomment').value;
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
        return response.json();
    }).then(data => {
        console.log(data)
    })
}