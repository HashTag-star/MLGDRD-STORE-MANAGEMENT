/*document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true';

    if (!loggedIn) {
        alert('Please log in first.');
        window.location.href = 'login.html';
    } else {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(event) {
                // Your button functionality here
            });
        });
    }
});
*/


const form = document.getElementById('Myform');
const submitBtn = document.getElementById('submit');
const roomNumber = document.getElementById('rnumber');
var textFieldValue = document.getElementById('rnumber');
const userDiv = document.getElementById('selector');


// Add event listner to trigger button
document.getElementById("trigger").addEventListener("click", function(){
    // Show pop-up dialogue box
    document.getElementById("popup").style.display= "block";
});

// Add event listener to close button
document.getElementById("close").addEventListener("click", function(){
    // Hide pop-up dialogue box
    document.getElementById("popup").style.display = "none";
});


window.onload = function (){
    submitBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        if (roomNumber.value != ''){ 
            if (confirm("You've selected room " + textFieldValue.value) === true){
                window.location.href = 'requestforms.html';
            }else{
                document.getElementById("popup").style.display= "block";
            }
        }else{
            alert('Please Enter room number') 
        };
    });
};
