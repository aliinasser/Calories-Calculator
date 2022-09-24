var caloriesTBody = document.querySelector(".calories-container table tbody");

function dropdown() {
    var dropdownParent = event.target.parentElement;
    var dropdown = dropdownParent.querySelector(".dropdown")
    document.querySelectorAll(".dropdown").forEach((e) => {
        if (e !== dropdown) {
            e.classList.remove("active")
        }
    })
    dropdown.classList.toggle("active")
}

document.querySelectorAll("input[number]").forEach((e) => {
    e.addEventListener("beforeinput", (val) => {
        if (isNaN(val.data) || val.data == " ") {
            val.preventDefault()
        }
    })
})

if (caloriesTBody) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            ref.child(`users/${uid}/calories`).get().then((snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    Object.values(data).forEach(data => {
                        var dateNumber = data.id;
                        var date = new Date(dateNumber).toLocaleDateString();
                        const tr = `
                            <tr id="${data.id}">
                                <td>${data.name}</td>
                                <td>${data.age}</td>
                                <td>${data.gender}</td>
                                <td>${data.height}</td>
                                <td>${data.weight}</td>
                                <td>${data.activity}</td>
                                <td>${data.calories} cal</td>
                                <td>${date}</td>
                                <td><button onclick="deleteCaloriesData()">Delete</button></td>
                            </tr>
                        `;
                        caloriesTBody.insertAdjacentHTML("afterbegin", tr);
                    })
                }
            })
        }
    });
}


window.onscroll = function (e) {
    try {
        var header = document.querySelector(".header");
        var landing = document.querySelector(".landing");
        if (window.scrollY >= (landing.offsetHeight - 200)) {
            header.classList.add("active")
        } else {
            header.classList.remove("active")
        }
    } catch {}
};

function circleRange(value) {
    if (!counter) {
        if (!isNaN(value)) {
            var startValue = 0;
            var interval = 1000;
            var duration = Math.floor(interval / value)
            var rangeEle = document.querySelector('.range');
            var calResult = rangeEle.querySelector('.result');
            var buttons = document.querySelectorAll("form input[type='button']");

            buttons.forEach((e) => {
                e.disabled = true;
            })

            var counter = setInterval(() => {
                startValue += 3;
                calResult.innerText = startValue;
                if (startValue >= Math.floor(value)) {
                    calResult.innerText = Math.floor(value);
                    clearInterval(counter);
                    buttons.forEach((e) => {
                        e.disabled = false;
                    })
                }
            }, duration)

            rangeEle.classList.add("active");
        }
    }
}

function caloriesCalculator(weight, height, age, gender, activity) {
    return ((weight * 10) + (height * 6.25) - (age * 5) + gender) * activity
}

function deleteCaloriesData() {
    var parent = event.target.parentElement.parentElement;
    const user = auth.currentUser;

    parent.remove()
    db.ref().child("users").child(user.uid).child(`calories/${parent.id}`).remove()
}

function calories() {
    // if (!document.querySelector("form").checkValidity()) { return; }
    var parent = event.target.parentElement;
    var name = parent.querySelector(".name").value;
    var age = parent.querySelector(".age").value;
    var gender = parent.querySelector(".gender");
    var height = parent.querySelector(".height").value;
    var weight = parent.querySelector(".weight").value;
    var activity = parent.querySelector(".activity");
    var calResult = document.querySelector('.range .result');

    var activityCase;
    var genderCase;

    switch (activity.value) {
        case "0":
            activityCase = 1.25;
            break;
        case "1-3":
            activityCase = 1.375;
            break;
        case "3-5":
            activityCase = 1.550;
            break;
        case "6-7":
            activityCase = 1.725;
            break;
        case "max":
            activityCase = 1.9;
            break;
    }

    if (gender.value == "male") {
        genderCase = +5;
    } else if (gender.value == "female") {
        genderCase = -161;
    }

    var calories = caloriesCalculator(weight, height, age, genderCase, activityCase);

    if (Math.floor(calories) !== +calResult.innerText) {
        circleRange(calories)
        if (event.target.value == "Calc And Save") {
            var tBody = caloriesTBody;
            var dateNumber = Date.now();
            var date = new Date(dateNumber).toLocaleDateString();

            const tr = `
                <tr class="${dateNumber}">
                    <td>${name}</td>
                    <td>${age}</td>
                    <td>${gender[gender.selectedIndex].text}</td>
                    <td>${height}</td>
                    <td>${weight}</td>
                    <td>${activity[activity.selectedIndex].text}</td>
                    <td>${Math.floor(calories)} cal</td>
                    <td>${date}</td>
                    <td><button onclick="deleteCaloriesData()">Delete</button></td>
                </tr>
            `;

            realtimeAddDataForUser({
                path: `calories/${dateNumber}`,
                values: {
                    id: dateNumber,
                    name: name,
                    age: age,
                    gender: gender[gender.selectedIndex].text,
                    height: height,
                    weight: weight,
                    activity: activity[activity.selectedIndex].text,
                    calories: Math.floor(calories)
                }
            })

            tBody.insertAdjacentHTML("afterbegin", tr)
        }
    }
}