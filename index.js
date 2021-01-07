// Import stylesheets
import "./style.css";
import { gsap } from "gsap";

// Pobranie referencji

const searchInput = document.querySelector("input");

const list = document.querySelector(".list");

// Klasa ListItem

class ListItem {
  static instanceCounter = 0;

  static domListItems = [];

  static set incrementId(id) {
    ListItem.instanceCounter += id;
  }

  static get getUniqueId() {
    ListItem.incrementId = 1;
    return ListItem.instanceCounter;
  }

  constructor(fullname) {
    (this.id = `${ListItem.getUniqueId}`),
      (this.fullName = fullname),
      (this.firstName = fullname.split(" ")[0]),
      (this.lastName = fullname.split(" ")[1]);
  }

  addToList(targetList) {
    const listItemElement = document.createElement("div");

    addTailwindClasses(
      listItemElement,
      "flex cursor-pointer my-1 hover:bg-blue-lightest rounded list__item"
    );

    listItemElement.setAttribute("id", `list__item--${this.id}`);

    listItemElement.innerHTML = `
    
									<div class="w-8 h-10 text-center py-1">
										<p class="text-3xl p-0 text-green-dark">&bull;</p>
									</div>
									<div class="w-4/5 h-10 py-3 px-1">
										<p class="hover:text-blue-dark list__name">${this.fullName}</p>
									</div>

								
    `;

    targetList.appendChild(listItemElement);

    this.domLocation = document.querySelector(`#list__item--${this.id}`);

    this.visibilityTimeLine = gsap.timeline({ paused: true });
    this.visibilityTimeLine
      .to(this.domLocation, {
        opacity: 0.2,
        duration: 0.4
      })
      .to(this.domLocation, {
        scaleY: 0,
        duration: 0.2
      });

    ListItem.domListItems.push(this);
  }

  hide() {
    this.visibilityTimeLine.play();
  }

  show() {
    this.visibilityTimeLine.reverse();
  }
}

function addTailwindClasses(element, classesString) {
  const classes = classesString.split(" ");

  classes.forEach(singleClass => element.classList.add(`${singleClass}`));
}

// Funkcje obsługujące logikę

function getUnwantedUsers(registeredUsers) {
  const allUsers = [...registeredUsers];
  const regexp = new RegExp(`^${searchInput.value}`, "i");

  return allUsers.reduce((total, current) => {
    if (
      current.fullName
        .split(" ")
        .find(firstOrLast => firstOrLast.match(regexp)) ||
      current.fullName.match(regexp)
    )
      return total;

    total.push(current);
    return total;
  }, []);
}

// Funkcje obsługujące animacje

function shiftWantedToTop(wantedUser, numberOfPositions) {
  gsap.to(wantedUser.domLocation, {
    translateY: -40 * numberOfPositions,
    duration: 0.5
  });
}

// Inicjalizacja obiektów

const adam = new ListItem("Adam Gospodarczyk");
const przemek = new ListItem("Przemek Smyrdek");
const klawiter = new ListItem("Kuba Klawiter");
const marcin = new ListItem("Marcin Czarkowski");
const kuba = new ListItem("Kuba Jarmołowicz");
const anna = new ListItem("Anna Dorawa");

adam.addToList(list);
przemek.addToList(list);
klawiter.addToList(list);
marcin.addToList(list);
kuba.addToList(list);
anna.addToList(list);

// Entry Point

searchInput.addEventListener("input", () => {
  const unwantedUsers = getUnwantedUsers(ListItem.domListItems);

  const wantedUsers = ListItem.domListItems.filter(user =>
    unwantedUsers.includes(user) ? false : user
  );

  const unwantedUsersIDs = unwantedUsers.map(({ id }) => id);

  wantedUsers.forEach(user => {
    const unwantedUsersAboveCurrentUser = unwantedUsersIDs.filter(
      id => id < user.id
    ).length;

    user.show();

    shiftWantedToTop(user, unwantedUsersAboveCurrentUser);
  });

  unwantedUsers.forEach(user => {
    user.hide();
  });
});
