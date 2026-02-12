async function testFetch(data) {
    return {
        ok: true,
        async json() {
            return data;
        }
    };
}


let contacts = [];

function getContacts() {
    return contacts;
}

function setContacts(data) {
    contacts = data;
}

async function fetchContacts() {
    try {
        const res = await testFetch(getContacts());
        const data = await res.json();
        displayContacts(data);
    } catch {
        alert("Failed to fetch contacts");
    }
}


function displayContacts(contacts) {
    const list = document.getElementById("contactList");
    list.innerHTML = "";

    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.innerHTML = `
            <b>${contact.name}</b> - ${contact.phone}<br>
            <button onclick="editContact(${contact.id})">Edit</button>
            <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}


async function saveContact() {
    const idField = document.getElementById("contactId");
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
        alert("Enter all fields");
        return;
    }

    let contacts = getContacts();

    if (idField.value) {
        
        contacts = contacts.map(c =>
            c.id == idField.value ? { ...c, name, phone } : c
        );
    } else {
        
        contacts.push({ id: Date.now(), name, phone });
    }

    setContacts(contacts);
    idField.value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";

    fetchContacts();
}


function editContact(id) {
    const contact = getContacts().find(c => c.id == id);
    document.getElementById("contactId").value = contact.id;
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
}


async function deleteContact(id) {
    if (!confirm("Delete this contact?")) return;

    const contacts = getContacts().filter(c => c.id != id);
    setContacts(contacts);
    fetchContacts();
}


async function searchContact() {
    const query = document.getElementById("search").value.trim().toLowerCase();

    if (!query) {
        alert("Enter name or phone to search");
        return;
    }

    try {
        const res = await testFetch(getContacts());
        const contacts = await res.json();

        const filtered = contacts.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query)
        );

        if (filtered.length === 0) {
            alert("No contact found");
        }

        displayContacts(filtered);
    } catch {
        alert("Search failed");
    }
}