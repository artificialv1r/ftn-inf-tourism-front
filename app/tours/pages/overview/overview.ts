import { Tour } from "../../model/tour.model";
import { TourService } from "../../service/tour.service";
const tourService = new TourService();

let pageSize: number = 5;
let orderBy: string = "Name";
let orderDirection: string = "ASC";
let currentPage = 1;
let allPublishedTours: Tour[] = []; // Čuvamo sve objavljene ture

function initialization(): void {
    setupEventListeners()
    fetchPublishedTours()
}

function setupEventListeners(): void {
    const pageSizeSelect = document.querySelector('#pageSize') as HTMLSelectElement;
    const orderBySelect = document.querySelector('#orderBy') as HTMLSelectElement;
    const orderDirectionSelect = document.querySelector('#orderDirection') as HTMLSelectElement;
    const prevPageBtn = document.querySelector('#prevPage') as HTMLButtonElement;
    const nextPageBtn = document.querySelector('#nextPage') as HTMLButtonElement;

    pageSizeSelect.addEventListener('change', () => {
        pageSize = Number(pageSizeSelect.value);
        currentPage = 1;
        displayCurrentPage();
    })

    orderBySelect.addEventListener('change', () => {
        orderBy = orderBySelect.value;
        currentPage = 1;
        sortAndDisplayTours()
    })

    orderDirectionSelect.addEventListener('change', () => {
        orderDirection = orderDirectionSelect.value;
        currentPage = 1;
        sortAndDisplayTours()
    })

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentPage();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(allPublishedTours.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            displayCurrentPage();
        }
    });
}

function fetchPublishedTours(): void {
    tourService.getAll(1, 100, "Name", "ASC")
        .then(response => {
            if (!response || !response.data) {
                console.error("API returned no Data");
                return;
            }

            allPublishedTours = response.data.filter(t => t.status === "objavljeno");

            sortAndDisplayTours();
        }).catch(err => console.error(err));
}

function sortAndDisplayTours(): void {
    // Sortiraj ture prema izabranim kriterijumima
    allPublishedTours.sort((a, b) => {
        let comparison = 0;

        if (orderBy === "Name") {
            comparison = a.name.localeCompare(b.name);
        } else if (orderBy === "DateTime") {
            comparison = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        } else if (orderBy === "MaxGuests") {
            comparison = a.maxGuests - b.maxGuests;
        }

        // Ako je DESC, obrni poredak
        return orderDirection === "DESC" ? -comparison : comparison;
    });

    displayCurrentPage();
}

function displayCurrentPage(): void {
    // Koja tura ide na trenutnoj stranici
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const toursToDisplay = allPublishedTours.slice(startIndex, endIndex);

    const currentPageSpan = document.querySelector('#currentPage') as HTMLElement;
    currentPageSpan.textContent = currentPage.toString();

    // Disable/enable dugmad
    const prevPageBtn = document.querySelector('#prevPage') as HTMLButtonElement;
    const nextPageBtn = document.querySelector('#nextPage') as HTMLButtonElement;
    const totalPages = Math.ceil(allPublishedTours.length / pageSize);

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages || allPublishedTours.length === 0;

    renderTours(toursToDisplay);
}

async function renderTours(tours: Tour[]): Promise<void> {
    const tourSection = document.querySelector('#tours') as HTMLElement;
    tourSection.innerHTML = "";

    if (tours.length === 0) {
        tourSection.innerHTML = "<p>Published tours not found.</p>";
        return;
    }

    const detailedTours = await Promise.all(
        tours.map(t => tourService.getById(t.id.toString()))
    );

    detailedTours.forEach(tour => {
        const tourItem = document.createElement('div');
        tourItem.className = "tour-item";

        const imageSection = document.createElement('div')
        imageSection.className = "image-section"

        const detailSection = document.createElement('div')
        detailSection.className = "detail-section"

        const image = document.createElement('img')
        image.src = tour.keyPoints[0].imageUrl;
        image.alt = tour.name;
        imageSection.appendChild(image);

        const title = document.createElement('h3');
        title.textContent = tour.name;

        const description = document.createElement('p');
        if (tour.description.length > 250) {
            description.textContent = tour.description.substring(0, 250) + "..."
        } else {
            description.textContent = tour.description
        }

        const dateObj = new Date(tour.dateTime);

        const formattedDate = dateObj.toLocaleDateString("sr-RS", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const formattedTime = dateObj.toLocaleTimeString("sr-RS", {
            hour: "2-digit",
            minute: "2-digit"
        });
        const dateElement = document.createElement('p');
        dateElement.textContent = `📅 ${formattedDate}`;

        const timeElement = document.createElement('p');
        timeElement.textContent = `⏱️ ${formattedTime}`;

        const guests = document.createElement('p')
        guests.textContent = `Max Guests: ${tour.maxGuests}`;

        const btn = document.createElement('button');
        btn.textContent = "View Details";
        btn.disabled = true;

        detailSection.appendChild(title);
        detailSection.appendChild(description);
        detailSection.appendChild(dateElement);
        detailSection.appendChild(timeElement);
        detailSection.appendChild(guests);
        detailSection.appendChild(btn);

        tourItem.appendChild(imageSection);
        tourItem.appendChild(detailSection);

        tourSection.appendChild(tourItem);
    })
}

document.addEventListener("DOMContentLoaded", initialization)