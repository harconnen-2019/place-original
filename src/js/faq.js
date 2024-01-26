import van from "vanjs-core";
import { Await } from "vanjs-ui";
import { API } from "./lib";

const { div, button, p } = van.tags;

/**
 * Закрывает все блоки, кроме текущего
 * @param {*} currentAcc
 */
function allClose(currentAcc) {
  const accAll = document.getElementsByClassName("faq__accordion");

  for (const el of accAll) {
    if (currentAcc !== el) {
      el.classList.remove("active");
      const pnl = el.nextElementSibling;
      pnl.style.maxHeight = null;
    }
  }
}

/**
 * Открывает или закрывает панель блока с текстом
 * @param {*} parentAcc
 */
function panelToggle(parentAcc) {
  const panel = parentAcc.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}

/**
 * Выводит список вопросов и ответов
 * При нажатии определяет стили для эффекта аккордеона
 * Добавляются два лишних DIV, но без них код не заработает
 * @returns NODE
 */
function ListFaq() {
  const fetchFaq = (str) =>
    fetch(API.FAQ + str, {
      method: API.METHOD_LIST,
    })
      .then((r) => r.json())
      .then((data) => data.data.faq_elements);

  /**
   * Получает строку запроса по API
   */
  const url = document
    .getElementsByClassName("faq")[0]
    .getAttribute("data-url");

  /**
   * Данные с сервера добавляет в состояние
   */
  const data = van.state(fetchFaq(url));

  /**
   * При нажатии на кнопку переключает стили
   * Проходит все блоки для удаления активного стиля (закрыть остальные)
   * @param {*} id
   */
  function handleChange(id) {
    const acc = document.getElementById(`acc-${id}`);
    acc.classList.toggle("active");

    allClose(acc);
    panelToggle(acc);
  }

  /**
   * Формирует Элементы из массива для вывода на экран
   * @param {*} arr Массив вопросов
   * @returns
   */
  function listFaq(arr) {
    return div(
      arr.map((el) =>
        div(
          button(
            {
              onclick: () => handleChange(el.id),
              class: "faq__accordion",
              id: `acc-${el.id}`,
            },
            el.question
          ),
          div({ class: "faq__panel" }, p(el.answer))
        )
      )
    );
  }

  return [
    () =>
      Await(
        {
          value: data.val,
          container: div,
          Loading: () => div({ class: "la-ball-clip-rotate la" }, div()),
          Error: () => "🙀 Request failed.",
        },
        (faqs) => listFaq(faqs)
      ),
  ];
}

van.add(document.querySelector(".faq"), ListFaq());

/**
 * Элемент аккордеона с формой
 */
const accForm = document.getElementById("acc-form");
accForm.addEventListener("click", function () {
  allClose(this);
  this.classList.toggle("active");
  panelToggle(this);
});
