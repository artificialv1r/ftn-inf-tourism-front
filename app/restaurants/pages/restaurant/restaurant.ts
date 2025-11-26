import { Restaurant } from "../../models/restaurant.model";
import { RestaurantService } from "../../services/restaurant.service";

const restaurantService = new RestaurantService()
renderData();

function renderData(): void {
    const ownerId = localStorage.getItem("id");
    if (!ownerId) return;

    restaurantService.getByOwner(ownerId)
        .then(restaurants => {
            const table = document.querySelector('table tbody');
            if (!table) {
                console.error('Table body not found');
                return;
            }

            table.innerHTML = "";
            restaurants.forEach(restaurant => {
                const row = createTableRow(restaurant);
                table.appendChild(row);
            });
        }).catch(error => {
            console.error(error.status, error.message);
        });
}
function createTableRow(restaurant: Restaurant): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.appendChild(createCell(restaurant.name));
    row.appendChild(createCell(restaurant.description));
    row.appendChild(createCell(restaurant.capacity.toString()));
    row.appendChild(createCell(restaurant.latitude.toString()));
    row.appendChild(createCell(restaurant.longitude.toString()));
    row.appendChild(createCell(restaurant.status.toString()));

    row.appendChild(createEditCell(restaurant.id));
    row.appendChild(createDeleteCell(restaurant.id));

    return row;
}
function createCell(text: string): HTMLTableCellElement {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}
function createEditCell(restaurantId: number): HTMLTableCellElement {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    button.style.background = '#c09287';
    button.textContent = "Edit";
    button.addEventListener("click", () => {
        window.location.href = `../restaurantsForm/restaurantsForm.html?id=${restaurantId}`;
    });
    cell.appendChild(button);
    return cell;
}
function createDeleteCell(restaurantId: number): HTMLTableCellElement {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    button.style.backgroundColor = '#eb7257';
    button.textContent = "Delete";
    button.addEventListener("click", () => {
        restaurantService.deleteRestaurant(restaurantId.toString())
            .then(() => window.location.reload())
            .catch(error => console.error(error.status, error.text));
    });
    cell.appendChild(button);
    return cell;
}