


let searchResults = []


let formOptions = {
    success: addPantryItem,
    url: "/pantry",
    type: "POST",
    resetForm: true,
    dataType: 'json'
}

// Function that will allow a user to search recipes
$(".search").keypress(function(event){
 
    if($(this).val() != ""){
        
        let foodItem = $(this).val();
        if(event.which == 13){
            
            // Reset the current contents on the page
            $(".search-results").empty();
            searchResults = [];
            $.ajax({
                type: "POST",
                url: "/search",
                data : {foodItem}
            }).done(function(recipes){
                searchResults = [...recipes]
                recipes.forEach(function(recipe){
                     $(".search-results")
                     .append(
                        `<div onclick="viewIndividualSearchItem(this)" id="${recipe.id}" >
                            <p>${recipe.label}</p>
                            <img src = "${recipe.image}">
                        </div>`
                        );
                });
            });
            
        }
    }
    
});

// function to make new item in pantry
$("#pantryItem-form").ajaxForm(formOptions);



function viewIndividualSearchItem(individualRecipe){
   
    let foundRecipe = searchResults.find(result => individualRecipe.id === result.id);
    let ingredients = "";
    
    foundRecipe.ingredients.forEach(ingredient => {
        ingredients +=`<li>${ingredient}</li>`;
    });

    $("body").append(
                `<div class='backdrop'>
                  <div class = 'modal'>
                        <div class = "modal-contents">
                            <span onclick="removeModal()">x</span>
                            <h3>${foundRecipe.label}</h3>
                            <div>
                                <image src ="${foundRecipe.image}">
                                <button class="${foundRecipe.id}" onclick = "addItemToFavorites(this)">Add to Favorites</button>
                                <button class="${foundRecipe.id}" onclick = "addItemToGroceries(this)">Add to Groceries</button>
                                <button type="button" onclick="window.open('${foundRecipe.url}', '_blank')">View Instructions</button>
                            </div>
                            <ul>
                                ${ingredients}
                            </ul>
                        </div>
                  </div>
                 </div>`);
   
}

function removeModal(){
    $(".modal").remove();
    $(".backdrop").remove();
    
}

function addItemToFavorites(recipe){
     let foundRecipe = searchResults.find(result => recipe.className === result.id);
     
     $.ajax({
         type: "POST",
         url: "/favorites",
         data : foundRecipe
     })
}



function addPantryItem(responseText){
    
    let newItem = 
        `<tr>
            <td>${responseText.item}</td>
            <td>${responseText.amount}</td> 
            <td>${responseText.unit}</td>
            
        </tr>
        <tr>
            <td> 
               <button class= ${responseText.id} onclick ="deleteItemFromPantry(this)">UPDATE</button>
            </td>
        </tr>`;
            
        
    
    $(".pantry-container tbody").append(newItem);
    
}



function deleteItemFromPantry(pantryItem){
    
    let itemId = pantryItem.className;
    $("."+itemId).fadeOut(10, function(){ $(this).remove();});
    $.ajax({
            type: "DELETE",
            url: "/pantry/"+itemId
            });
    
    

    
}


$(".cartItem").click(function(){
    
    $(this).toggleClass("strikeThrough")
});

$(".cartItem-pantry").click(function(){
    
    $(this).toggleClass("strikeThrough")
});



function deleteRecipeFromCart(recipe){
    let recipeId = recipe.parentElement.id;
    $(`#${recipeId}`).fadeOut(10, function(){$(this).remove()});
    $.ajax({
            type: "DELETE",
            url: "/cart/"+recipeId
            });
}


function addFavoriteToCart(recipeItem){
    
    let recipeLabel = $(`.favorite-item.${recipeItem.className}`).find("h3").text();
    let recipeIngredients = $(`.favorite-item.${recipeItem.className}`).find("li");
    let parsedIngredients = []
    
    for(let i = 0; i < recipeIngredients.length; i++){
        parsedIngredients.unshift(recipeIngredients[i].innerText);
    }
    $.ajax({
        type: "POST",
        url: "/cart",
        data: { recipeLabel, parsedIngredients}
    }).done(function(){
        
    });
}


function removeItemFromFavorites(recipeItem){
    let itemId = recipeItem.className;
    $.ajax({
        type: "DELETE",
        url: "/favorites/" + itemId
    }).done(function(){
        $(`.${itemId}`).remove();
    })
}
