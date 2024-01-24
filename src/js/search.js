import van from "vanjs-core";
import { Await } from "vanjs-ui";
import { API, throttle } from "./lib";

const { span, div, li, ul, a } = van.tags;

function ListApp() {
  const text = van.state(" ");
  const valueSearch = document.querySelector('input[type="search"]');
  valueSearch.addEventListener(
    "keyup",
    throttle(() => (text.val = valueSearch.value), 1000)
  );

  const fetchSearch = (str) =>
    text.val.length > 4 &&
    fetch(API.SEARCH + str, {
      method: API.METHOD_LIST,
    })
      .then((r) => r.json())
      .then((data) => data.applications_item_list);

  const data = van.state(fetchSearch(text.val));

  van.derive(() => text.val.length > 4 && (data.val = fetchSearch(text.val)));

  function appList(list) {
    return ul(
      list.map((el) =>
        li(
          a(
            { href: `http://${el.slug}.${el.build_list[0].place.domain} ` },
            el.name
          )
        )
      )
    );
  }

  return [
    () =>
      text.val.length > 4
        ? div(
            { class: "search__container" },
            Await(
              {
                value: data.val,
                container: span,
                Loading: () =>
                  div({ class: "la-ball-clip-rotate la-2x" }, div()),
                Error: () => "🙀 Request failed.",
              },
              (apps) => appList(apps)
            )
          )
        : "",
  ];
}

van.add(document.querySelector(".search__form"), ListApp());
