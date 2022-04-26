window.addEventListener("load", () => {
  $(".js-dtTable").DataTable({
    bPaginate: false,
    bLengthChange: false,
    bFilter: true,
    ordering: false,
    bInfo: false,
    bAutoWidth: false,
    oLanguage: {
      sSearch: "Znajdź lowo / Знайди слово"
    }
  });
});
