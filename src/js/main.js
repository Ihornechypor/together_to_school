window.addEventListener("load", () => {
  $("#dtTable").DataTable({
    bPaginate: false,
    bLengthChange: false,
    bFilter: true,
    bInfo: false,
    bAutoWidth: false,
    oLanguage: {
      sSearch: "Znajdź lowo / Знайди слово"
    }
  });
});
