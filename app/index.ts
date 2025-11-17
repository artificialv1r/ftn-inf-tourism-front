const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const reviewBtn = document.querySelector('#reviewRestaurant') as HTMLButtonElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        reviewBtn.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        reviewBtn.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setUserLoginState(false);
}

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

reviewBtn.addEventListener("click", function () {
    const role = localStorage.getItem('role');
    if (role !== "vlasnik") {
        window.alert("Morate biti prijavljeni kao vlasnik da biste videli restorane.")
    } else {
        window.location.href = "restaurants/pages/restaurants/restaurant.html";
    }
});


const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();
