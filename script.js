async function catRandom(){
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  var catQtd = document.getElementById("catInput").value
  var categorias=[]

  // remover os anteriores
  for(var j=0; j<19; j++){
    const catExistente = document.getElementById("c")
    if(catExistente){
      catExistente.remove();      
    }
  }
  while(categorias.length<catQtd){
    var catRandom = Math.floor(Math.random()*19)//há 19 categorias registradas no json
    var catName = catData.genres[catRandom].name
    console.log(catName)
    if(!categorias.includes(catName)){
      categorias.push(catName)
    }    
  }
  for(var j=0; j<categorias.length; j++){
      document.getElementById("cat").insertAdjacentHTML("afterbegin","<div class='catItem' id='c'><p>"+categorias[j]+"</p></div>")
  }
}

