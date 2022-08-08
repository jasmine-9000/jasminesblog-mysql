document.getElementById("hamburgerbutton")?.addEventListener("click", (e) => {
    console.log("Hamburger button clicked.");
    document.querySelector('.links').classList.toggle('hidden');
});
