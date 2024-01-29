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
    const faq_num = document
      .getElementsByClassName("faq")[0]
      .getAttribute("data-item");

    if (Array.isArray(arr) && arr.length > 0) {
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
    } else {
      return p({ class: "no-item" }, faq_num);
    }
  }

  return [
    () =>
      Await(
        {
          value: data.val,
          container: div,
          Loading: () => div({ class: "la-ball-clip-rotate la" }, div()),
          Error: () => div({ class: "danger" }, "🙀 Request failed."),
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

/**
 * Отправка формы
 */

async function sendData(data) {
  return await fetch(API.FAQ, {
    method: "POST",
    headers: {
      dataType: "json",
      contentType: "application/json; charset=utf-8",
    },
    body: data,
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();

  buttonQuestionDisabled();
  const userName = document.getElementById("userName").value;
  const question = document.getElementById("question").value;
  const application_id = document.getElementById("applicationId").value;

  const data = JSON.stringify({
    user_name: userName,
    question: question,
    application_id: application_id,
  });

  const { status, error } = await sendData(data);

  console.log(status, error.message);

  if (status === 200) {
    upSendQuestion();
  } else {
    upSendQuestionError();
    buttonQuestionEnabled();
  }
}

const faqForm = document.getElementById("feedbackForm");
faqForm.addEventListener("submit", handleFormSubmit);

function buttonQuestionDisabled() {
  document.getElementById("submit_question").disabled = true;
}

function buttonQuestionEnabled() {
  document.getElementById("submit_question").disabled = false;
}

function upSendQuestion() {
  document.getElementById("displayFormQuestion").hide();
  document.getElementById("displayFormQuestionDanger").hide();
  document.getElementById("displayFormQuestionSuccess").show();
}

function upSendQuestionError() {
  document.getElementById("displayFormQuestionDanger").show();
}
