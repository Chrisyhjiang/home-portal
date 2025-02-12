
var projects = [
    {
        title: "Sliding Cards",
        details:  "This project involves creating a sliding card effect using HTML, CSS, and JavaScript. " +
                  "The layout is designed using CSS flexbox. " + 
                  "When a user clicks on a card, it expands due to a CSS transition. " +
                  "JavaScript is utilized to add an 'active' class to the currently selected card.",
        gitRepo:  "https://github.com/Chrisyhjiang/JsProject/tree/main/slidingCards"
    },
    {
        title: "Movie Finder",
        details:  "This project uses HTML, CSS and JavaScript to create a movie application that leverages a third-party API (https://www.themoviedb.org/) " +
                  "to retrieve movie data, including titles, ratings, and images." +
                  "It employs the Fetch API and Promises for making HTTP requests to the third-party API. Additional features of the application include a search function, pagination, " +
                  "and CSS animations to display an overview of the movies.",
        gitRepo: "https://github.com/Chrisyhjiang/JsProject/tree/main/movieApp"
    },
    {
        title: "Digital Clock",
        details:  "This project uses HTML, CSS and JavaScript to create a digital clock that can be toggled between dark and light mode." +
                  "It uses CSS to style the hand clocks as well as javascript to simulate the a clock real time by updating the rotate transformation based on the time of day",
        gitRepo: "https://github.com/Chrisyhjiang/JsProject/tree/main/clock"
    },
    // Add more projects as needed...
];

// Get the div with class name 'row'
var div = document.querySelector('.row');
// Get all link elements under the div
var navLinks = div.querySelectorAll('a');

// Loop through all the links
for (var i = 0; i < navLinks.length; i++) {
    // Add an event listener to each link
    navLinks[i].addEventListener('click', function(event) {

        // Remove the 'active' class from all links
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
        }

        // Add the 'active' class to the clicked link
        this.classList.add('active');
    });
}


function openModal(projectId) {
    var modal = document.getElementById('modal');
    modal.style.display = 'block';
    document.getElementById('project-title').innerText = projects[projectId].title;
    document.getElementById('project-details').innerText = projects[projectId].details;
    var gitLink = document.getElementById('project-git-url');
    gitLink.href = projects[projectId].gitRepo; // Set the href attribute to the git URL
    gitLink.innerText = 'View on GitHub';
    setTimeout(function() {
        modal.classList.add('open');
    }, 1); // Wait for the next render cycle to add the open class
}

function closeModal() {
    var modal = document.getElementById('modal');
    modal.classList.remove('open');
    modal.style.display = 'none';
}