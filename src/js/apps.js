import van from "vanjs-core";
import { Await } from "vanjs-ui";
import { API } from "./lib";

const { div, figure, picture, img, figcaption, a, ul, li } = van.tags;

function ListApps() {
  const fetchApps = (str) =>
    fetch(API.APPS + str, {
      method: API.METHOD_LIST,
    })
      .then((r) => r.json())
      .then((data) => data.applications_item_list);

  /**
   * Получает строку запроса по API
   */
  const url = document
    .getElementsByClassName("apps")[0]
    .getAttribute("data-url");

  /**
   * Данные с сервера добавляет в состояние
   */
  const data = van.state(fetchApps(url));

  /**
   * Формирует Элементы из массива для вывода на экран
   * @param {*} arr Массив вопросов
   * @returns
   */
  function listApp(arr) {
    const app_num = document
      .getElementsByClassName("apps")[0]
      .getAttribute("data-item");

    if (Array.isArray(arr) && arr.length > 0) {
      return ul(
        { class: "scroll-snap-slider -multi" },
        arr.map((el) =>
          li(
            { class: "scroll-snap-slide" },
            a(
              { href: el.slug + "" },
              figure(
                picture(
                  img({
                    src: "https://api.lorem.space/image/game?w=400&h=300",
                    loading: "lazy",
                  })
                ),
                figcaption(el.name)
              )
            )
          )
        )
      );
    } else {
      return p({ class: "no-item" }, app_num);
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
        (apps) => listApp(apps)
      ),
  ];
}

van.add(document.querySelector(".apps"), ListApps());
