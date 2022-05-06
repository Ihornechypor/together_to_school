window.addEventListener("load", () => {
  $(".js-dtTable").DataTable({
    bPaginate: false,
    bLengthChange: false,
    bFilter: true,
    ordering: false,
    bInfo: false,
    bAutoWidth: false,
    oLanguage: {
      sSearch: "Znajdź słowo / Знайди слово"
    }
  });
  $(".js-dtTableAll").DataTable({
    bPaginate: false,
    bLengthChange: false,
    bFilter: true,
    ordering: false,
    bInfo: false,
    bAutoWidth: false,
    oLanguage: {
      sSearch: "Wpisz słowo / Впишіть слово"
    }
  });

  const allWordsTable = document.querySelector(".js-dtTableAll");
  const allWordsInput = document.querySelector(".js-table-all input");

  allWordsInput.addEventListener("input", (e) => {
    e.target.value === ""
      ? allWordsTable.classList.add("table-hidden-empty")
      : allWordsTable.classList.remove("table-hidden-empty");
  });
});
