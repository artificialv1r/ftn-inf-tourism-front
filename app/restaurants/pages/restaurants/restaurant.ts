import { RestaurantService } from "../../services/restaurant.service";

const restaurantService = new RestaurantService()

function renderData(): void {
    const guideId = localStorage.getItem("id")
    console.log(guideId);
    restaurantService.getPaged(guideId)
        .then(restaurants => {
            const table = document.querySelector('table tbody');

            if (!table) {
                console.error('Table body not found');
                return;
            }

            for (let i = 0; i < restaurants.length; i++) {
                const newRow = document.createElement("tr");

                const restaurantId = String(restaurants[i].id);
                const cell2 = document.createElement("td");
                cell2.textContent = restaurants[i].name;
                newRow.appendChild(cell2);

                const cell3 = document.createElement("td");
                cell3.textContent = restaurants[i].description;
                newRow.appendChild(cell3);

                const cell4 = document.createElement("td");
                cell4.textContent = restaurants[i].capacity.toString();
                newRow.appendChild(cell4);

                const cell5 = document.createElement("td");
                cell5.textContent = restaurants[i].imageUrl;
                newRow.appendChild(cell5);

                const cell6 = document.createElement("td");
                cell6.textContent = restaurants[i].latitude.toString();
                newRow.appendChild(cell6);

                const cell7 = document.createElement("td");
                cell7.textContent = restaurants[i].longitude.toString();
                newRow.appendChild(cell7);

                const cell8 = document.createElement('td')
                const editButton = document.createElement('button')
                editButton.textContent = 'Izmeni'
                editButton.addEventListener('click', function () {
                    window.location.href = `../restaurantsForm/restaurants.html?id=${restaurantId}`
                });
                cell8.appendChild(editButton)
                newRow.appendChild(cell8)

                const cell9 = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Obrisi';
                deleteButton.onclick = function () {
                    restaurantService.deleteRestaurant(restaurantId.toString())
                        .then(() => {
                            window.location.reload();
                        })
                        .catch(error => {
                            console.error(error.status, error.text);
                        });
                };
                cell9.appendChild(deleteButton);
                newRow.appendChild(cell9);
                table.appendChild(newRow);
            }
        })
        .catch(error => {
            console.error(error.status, error.message);
        });
}

renderData();
