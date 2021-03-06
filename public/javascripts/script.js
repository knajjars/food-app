document.addEventListener("DOMContentLoaded", () => {}, false);


// Or with jQuery

$(document).ready(function() {
  $(".sidenav").sidenav();
});
$(document).ready(function() {
  $(".sidenav.side2").sidenav({edge:'right'});
});

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems);
});

// Or with jQuery

$(document).ready(function() {
  $("#revealCuisine").click(() => {
    $(".small-cuisine").toggle();
  });
  $("#revealAllergy").click(() => {
    $(".small-allergy").toggle();
  });
  $("#revealDiet").click(() => {
    $(".small-diet").toggle();
  });

  $(".collapsible").collapsible();
  $(".collapsible-header:not(:first)").hide();

  $("#cuisine .switch input").change(function() {
    if ($(this).is(":checked")) {
      $("#cuisine input:checkbox").attr("checked", "checked");

      console.log("Hello");
    }
    if (!$(this).is(":checked")) {
      $("#cuisine input:checkbox").attr("checked", false);
      console.log("goodbye");
    }
  });
  $("#allergy .switch input").change(function() {
    if ($(this).is(":checked")) {
      $("#allergy input:checkbox").attr("checked", "checked");
    }
    if (!$(this).is(":checked")) {
      $("#allergy input:checkbox").attr("checked", false);
    }
  });
  $("#diet .switch input").change(function() {
    if ($(this).is(":checked")) {
      $("#diet input:checkbox").attr("checked", "checked");
    }
    if (!$(this).is(":checked")) {
      $("#diet input:checkbox").attr("checked", false);
    }
  });

  $(".collapsible-header button[name='decide']").click(() => {
    $("#lp-form").attr("action", "/yummly-api/decide/1");
    setTimeout(() => {
      $(".collapsible-header button[name='decide']").attr("type", "submit");
    }, 0);
    $(".collapsible-header button[name='decide']")[0].innerText = "GO!";

    $(".collapsible-header button[name='decide']").css(
      "background-color",
      "#26a69a"
    );
    $(".collapsible-header:not(:first)").show("slow");
  });

  $(".collapsible-header button[name='discover']").click(() => {
    $("#cuisine input:checkbox").attr("checked", "checked");
    $("#lp-form").attr("action", "/yummly-api/discover");
  });

  $(".btn-small#allergy-btn").click(function() {
    $("#allergy input:checkbox").attr("checked", "checked");
    // $(this).val('uncheck all');
  });
  $(".btn-small#diet-btn").click(function() {
    $("#diet input:checkbox").attr("checked", "checked");
    // $(this).val('uncheck all');
  });

  $(".decide-recipes-container a:not(#go)").click(function(e) {
    e.stopPropagation();
    let recipeName = $(this)
      .closest("div")
      .children("div.card-content")
      .children("h5")
      .text();
    let thumbnail = $(this)
      .closest("div")
      .children("div.decide-card-image")
      .children("img")
      .attr("src");
    let apiURL = $(this)
      .closest("div")
      .children("div.card-content")
      .children("a")
      .attr("href");

    if ($("i", this).text() == "favorite") {
      axios({
        url: "/favorites/userFavoriteDelete",
        method: "DELETE",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        data: {
          apiURL: apiURL
        }
      });

      $("i", this).text("favorite_border");
    } else {
      $("i", this).text("favorite");
      axios({
        method: "POST",
        url: "/favorites/userfavorite",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        data: {
          recipeName: recipeName,
          thumbnail: thumbnail,
          apiURL: apiURL
        }
      })
        .then(() => {})
        .catch(err => console.log("err"));
    }
  });
  const $favoriteDetailRecipe = $(".favorite-details");

  $favoriteDetailRecipe.click(function() {
    const apiURL = $("#recipe-id").attr("href");
    const recipeName = $("#recipe-name").text();
    const thumbnail = $("#recipe-image").attr("src");
    if ($("i", this).text() == "favorite") {
      axios({
        url: "/favorites/userFavoriteDelete",
        method: "DELETE",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        data: {
          apiURL: apiURL
        }
      });

      $("i", this).text("favorite_border");
    } else {
      $("i", this).text("favorite");
      axios({
        method: "POST",
        url: "/favorites/userfavorite",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        data: {
          recipeName,
          thumbnail,
          apiURL
        }
      })
        .then(() => {})
        .catch(err => console.log("err"));
    }
  });


  // recipeName: req.body.recipeName,
  // thumbnail: req.body.thumbnail,
  // apiURL: req.body.apiURL

  $(document).on('click','#slide-out li i', (e)=>{
    console.log('CLICK');
    $(e.target).parent().next('li').hide()
      $(e.target).parent().hide()

  })

  let ingredientLines = []
  $('#slide-out li').toArray().forEach(el=>{
    if (typeof el.text() === "string" ) {
      ingredientLines.push(el.text)
      
    } else {
      console.log('Hi');
      
    }
  })
  console.log(ingredientLines);
  

  // axios(
  //   {
  //     method:"GET",
  //     url: "/account/shopping-cart/",
  //     headers: { "X-Requested-With": "XMLHttpRequest" },
  //     data: 
  //     {
  //       ingredients: [...new Set(recipe[0].ingredientLines)],
  //       recipeName: recipe[0].name,
  //       recipeId: recipe[0].id,
  //     }

  //   }
  // )

  
  $('#undo').click(()=>{
    $('#slide-out li').show()

  })
});
