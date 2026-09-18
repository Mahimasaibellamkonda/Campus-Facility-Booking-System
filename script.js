const bookingForm = document.getElementById("bookingForm");

const bookingTable = document.getElementById("bookingTable");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const filterFacility =
document.getElementById("filterFacility");

const totalCount =
document.getElementById("totalCount");

const todayCount =
document.getElementById("todayCount");

const bookingDate =
document.getElementById("bookingDate");

// =========================
// LOAD SAVED BOOKINGS
// =========================

let bookings =
JSON.parse(localStorage.getItem("campusBookings")) || [];

// =========================
// SET MINIMUM DATE
// =========================

const today =
new Date().toISOString().split("T")[0];

bookingDate.min = today;

// =========================
// SAVE BOOKINGS
// =========================

function saveBookings() {

localStorage.setItem(
    "campusBookings",
    JSON.stringify(bookings)
);

}

// =========================
// CREATE BOOKING ID
// =========================

function generateBookingId() {

const number =
    Math.floor(1000 + Math.random() * 9000);

return "CF-" + number;

}

// =========================
// ADD BOOKING
// =========================

bookingForm.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const name =
        document.getElementById("studentName")
            .value.trim();

    const facility =
        document.getElementById("facility")
            .value;

    const date =
        document.getElementById("bookingDate")
            .value;

    const time =
        document.getElementById("timeSlot")
            .value;

    const participants =
        Number(
            document.getElementById("participants")
                .value
        );

    const purpose =
        document.getElementById("purpose")
            .value;

    const notes =
        document.getElementById("notes")
            .value.trim();


    // Basic validation

    if (participants < 1) {

        alert(
            "Number of participants must be at least 1."
        );

        return;

    }


    // Check duplicate booking

    const duplicate =
        bookings.some(function(booking) {

            return (
                booking.facility === facility &&
                booking.date === date &&
                booking.time === time
            );

        });


    if (duplicate) {

        alert(
            "This facility is already booked for the selected date and time."
        );

        return;

    }


    const newBooking = {

        id: generateBookingId(),

        name: name,

        facility: facility,

        date: date,

        time: time,

        participants: participants,

        purpose: purpose,

        notes: notes

    };


    bookings.push(newBooking);

    saveBookings();

    bookingForm.reset();

    bookingDate.min = today;

    displayBookings();

    alert(
        "Booking confirmed successfully!"
    );

}

);

// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings() {

const searchText =
    searchInput.value
        .toLowerCase()
        .trim();

const selectedFacility =
    filterFacility.value;


bookingTable.innerHTML = "";


const filteredBookings =
    bookings.filter(function(booking) {

        const searchMatch =
            booking.id
                .toLowerCase()
                .includes(searchText) ||

            booking.name
                .toLowerCase()
                .includes(searchText) ||

            booking.facility
                .toLowerCase()
                .includes(searchText) ||

            booking.purpose
                .toLowerCase()
                .includes(searchText);


        const facilityMatch =
            selectedFacility === "All" ||
            booking.facility === selectedFacility;


        return searchMatch && facilityMatch;

    });


if (filteredBookings.length === 0) {

    document.querySelector(".table-wrapper")
        .style.display = "none";

    emptyState.style.display = "block";

}

else {

    document.querySelector(".table-wrapper")
        .style.display = "block";

    emptyState.style.display = "none";

}


filteredBookings.forEach(function(booking) {

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>
            <span class="booking-id">
                ${booking.id}
            </span>
        </td>

        <td>
            <span class="facility-name">
                ${booking.facility}
            </span>
        </td>

        <td>
            ${booking.name}
        </td>

        <td>
            ${formatDate(booking.date)}
        </td>

        <td>
            ${booking.time}
        </td>

        <td>
            ${booking.participants}
        </td>

        <td>
            ${booking.purpose}
        </td>

        <td>
            <button
                class="cancel-btn"
                onclick="cancelBooking('${booking.id}')"
            >
                Cancel
            </button>
        </td>

    `;


    bookingTable.appendChild(row);

});


updateStats();

}

// =========================
// FORMAT DATE
// =========================

function formatDate(dateString) {

const date =
    new Date(dateString + "T00:00:00");


return date.toLocaleDateString(
    "en-IN",
    {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }
);

}

// =========================
// CANCEL BOOKING
// =========================

function cancelBooking(id) {

const confirmation =
    confirm(
        "Are you sure you want to cancel this booking?"
    );


if (!confirmation) {

    return;

}


bookings =
    bookings.filter(function(booking) {

        return booking.id !== id;

    });


saveBookings();

displayBookings();

}

// =========================
// UPDATE STATISTICS
// =========================

function updateStats() {

totalCount.textContent =
    bookings.length;


const todayBookings =
    bookings.filter(function(booking) {

        return booking.date === today;

    });


todayCount.textContent =
    todayBookings.length;

}

// =========================
// SEARCH
// =========================

searchInput.addEventListener(
"input",
displayBookings
);

// =========================
// FILTER
// =========================

filterFacility.addEventListener(
"change",
displayBookings
);

// =========================
// INITIAL DISPLAY
// =========================

displayBookings();
