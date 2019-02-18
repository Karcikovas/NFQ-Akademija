const feList = document.querySelector('#name-list');
const form = document.querySelector('#add-name-form');

// create element & render fe
function renderBooking(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let second = document.createElement('span');
    let date = document.createElement('span');
    let number = document.createElement('span');
    let text = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    second.textContent = doc.data().second;
    date.textContent = doc.data().date;
    number.textContent = doc.data().number;
    text.textContent = doc.data().text;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(second);
    li.appendChild(date);
    li.appendChild(number);
    li.appendChild(text);
    li.appendChild(cross);

    feList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('booking').doc(id).delete();
    });
}


// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('booking').add({
        name: form.name.value,
        second: form.second.value,
        date: form.date.value,
        number: form.number.value,
        text: form.text.value,
    });
    form.name.value = '';
    form.second.value = '';
    form.date.value = '';
    form.number.value = '';
    form.text.value = '';
});

// real-time listener
db.collection('booking').orderBy('date').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderBooking(change.doc);
        } else if (change.type == 'removed'){
            let li = feList.querySelector('[data-id=' + change.doc.id + ']');
            feList.removeChild(li);
        }
    });
});