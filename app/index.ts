const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const myTours = document.querySelector('#my-tours') as HTMLElement;
const myRestaurants = document.querySelector('#my-restaurants') as HTMLElement;
const myReservations = document.querySelector('#my-reservations') as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
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
    checkRoleStatus();
}

function checkRoleStatus() {
    const role = localStorage.getItem('role'); {

        if (role == "vodic") {
            myTours.style.display = "block"
        } else {
            myTours.style.display = "none"
        }

        if (role == "vlasnik") {
            myRestaurants.style.display = "block"
        } else {
            myRestaurants.style.display = "none"
        }

        if (!role) {
            myReservations.style.display = "none";
            myTours.style.display = "none";
            myRestaurants.style.display = "none"
        }
    }
}


const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();
