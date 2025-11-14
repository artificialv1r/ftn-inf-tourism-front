import { TourService } from "../../service/tour.service";

const tourService = new TourService()

function renderData(): void {
    const guideId = localStorage.getItem("id")
    tourService.getPaged(guideId)
        .then(tours => {
            const table = document.querySelector('table tbody');
            const info = document.querySelector('#info');

            if (!table) {
                console.error('Table body not found');
                return;
            }

            const h3 = document.createElement('h3')
            h3.textContent = `My tours:`;
            info.appendChild(h3)

            // za svaku turu dodajemo po red u tabeli
            for (let i = 0; i < tours.length; i++) {

                // kreiramo novi red
                const newRow = document.createElement('tr');

                // kreiramo ćeliju za naziv ture
                const cell1 = document.createElement('td');
                cell1.textContent = tours[i].name;
                newRow.appendChild(cell1);

                // kreiramo ćeliju za opis ture
                const cell2 = document.createElement('td');
                cell2.textContent = shortenDescription(tours[i].description, 120);
                newRow.appendChild(cell2);

                // kreiramo ćeliju za datum i vreme ture
                const cell3 = document.createElement("td");
                const date = new Date(tours[i].dateTime);

                // Formatiramo u dd.mm.yyyy
                const formattedDate = date.toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
                const formattedTime = date.toLocaleTimeString("sr-RS", {
                    hour: "2-digit",
                    minute: "2-digit"
                })

                const dateElement = document.createElement('div');
                dateElement.textContent = formattedDate;

                const timeElement = document.createElement('div');
                timeElement.textContent = formattedTime;
                cell3.appendChild(dateElement)
                cell3.appendChild(timeElement)
                newRow.appendChild(cell3);

                // kreiramo ćeliju za maksimalan broj gostiju
                const cell4 = document.createElement('td');
                cell4.textContent = tours[i].maxGuests.toString();
                newRow.appendChild(cell4);

                // kreiramo ćeliju za trenutni status ture
                const cell5 = document.createElement('td');
                cell5.textContent = tours[i].status;
                newRow.appendChild(cell5);

                // dodajemo dugme za ažuriranje u svaki red
                const cell6 = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.style.backgroundColor = '#c09287'

                const tourId = tours[i].id;
                editButton.onclick = function () {
                    window.location.href = `../tourForm/tourForm.html?id=${tourId}`;
                };
                cell6.appendChild(editButton);
                newRow.appendChild(cell6);

                const cell7 = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Remove';
                deleteButton.style.backgroundColor = '#eb7257'

                // stavljamo da se klikom na dugme pošalje DELETE zahtev za brisanje korisnika
                deleteButton.onclick = function () {
                    tourService.deleteTour(tourId.toString())
                        .then(() => {
                            window.location.reload();
                        })
                        .catch(error => {
                            console.error(error.status, error.text);
                        });
                };
                cell7.appendChild(deleteButton);
                newRow.appendChild(cell7);

                // dodajemo red u tabelu
                table.appendChild(newRow);
            }
        })
        .catch(error => {
            console.error(error.status, error.message);
        });
}

function shortenDescription(text: string, maxLength = 120): string {
    if (!text) return "";

    // prvo pokušaj uhvatiti prvu rečenicu (do tačke)
    const match = text.match(/[^.!?]*[.!?]/);
    if (match) {
        const firstSentence = match[0].trim();
        if (firstSentence.length <= maxLength) {
            return firstSentence + "...";
        }
    }

    // fallback – skrati po broju karaktera
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
}

renderData();