$(document).on("click", "#scrape-button", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
    window.location.replace("/scrape");
  });